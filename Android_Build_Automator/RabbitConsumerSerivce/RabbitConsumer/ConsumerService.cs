using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Configuration;
using RabbitConsumer.IServices;
using RabbitConsumer.Services;

namespace RabbitConsumer
{
    public partial class ConsumerService : ServiceBase
    {
       
        public ConsumerService()
        {
            
            InitializeComponent();
           // Consume(); Console.ReadLine();
        }

        protected override void OnStart(string[] args)
        {
            Consume();
           
        }

        protected override void OnStop()
        {
        }
        public static void Consume()
        {
            try
            {
                var factory = new ConnectionFactory
                {
                   
                    Uri = new Uri(ConfigurationManager.AppSettings["rabbitUri"])
                };
                var con = factory.CreateConnection();
                var channel = con.CreateModel();
                channel.QueueDeclare(ConfigurationManager.AppSettings["rabbitQueue"], durable: true, exclusive: false, autoDelete: false, arguments: null);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (sender, e) =>
                {
                    var body = e.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    var messaJObject = JObject.Parse(message);
                    var hash = messaJObject["Hash"].ToString();
                    var entity = messaJObject["Entity"].ToString();
                    var gitBranch = messaJObject["Branch"].ToString();
                    var env = messaJObject["Env"].ToString();
                    var requestHnadler = new RequestHandler();
                    requestHnadler.BuildRequestedAPK(env, entity, gitBranch, hash);
                    if (e.DeliveryTag > 100) requestHnadler.CleanResidual();
                    channel.BasicAck(deliveryTag: e.DeliveryTag, multiple: false);
                };
                channel.BasicConsume(ConfigurationManager.AppSettings["rabbitQueue"], false, consumer);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        //private static string RequestCleanResidual()
        //{
        //    var url = ConfigurationManager.AppSettings["cleanUri"];
        //    HttpClient client = new HttpClient();
        //    client.DefaultRequestHeaders.Accept
        //        .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //    var notification = string.Empty;
        //    var content = JsonConvert.SerializeObject(notification);
        //    var encodedContent = new StringContent(content, Encoding.UTF8, "application/json");
        //    HttpResponseMessage response = client.PostAsync(url, encodedContent).GetAwaiter().GetResult();
        //    string responseBody = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
        //    return responseBody;
        //}

        //private static string RequestApkBuild(string env, string entity, string gitBranch, string hash)
        //{
        //    var url = ConfigurationManager.AppSettings["buildUri"] + env + "&entity=" + entity + "&gitBranch=" + gitBranch + "&hash=" + hash;
        //    HttpClient client = new HttpClient();
        //    client.DefaultRequestHeaders.Accept
        //        .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //    var notification = string.Empty;
        //    var content = JsonConvert.SerializeObject(notification);
        //    var encodedContent = new StringContent(content, Encoding.UTF8, "application/json");
        //    HttpResponseMessage response = client.PostAsync(url, encodedContent).GetAwaiter().GetResult();
        //    string responseBody = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
        //    return responseBody;

        //}
            //private  string RequestApkBuild(string env, string entity, string gitBranch, string hash)
            //{
            //    var outStr = string.Empty;
            //    var errorStr = string.Empty;
            //    var outpath = string.Empty;
            //    var isPulled = _gitCommandManager.Pull(_appConfig.GitPullCommand + gitBranch, out outStr, out errorStr, _logger);
            //}
    }
}
