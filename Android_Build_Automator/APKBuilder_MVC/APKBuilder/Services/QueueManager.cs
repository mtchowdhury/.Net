using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using APKBuilder.IServices;
using APKBuilder.Models;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace APKBuilder.Services
{
    public class QueueManager:IQueueManager
    {
        public  IModel _channel = null;
        private readonly AppConfig _appConfig;
        public QueueManager(IOptions<AppConfig> Options)
        {
            _appConfig = Options.Value;
               var factory = new ConnectionFactory
            {
                Uri = new Uri(_appConfig.BrokerAddress)
            };
             var con = factory.CreateConnection();
             if(_channel==null) 
                 _channel = con.CreateModel();
            _channel.QueueDeclare(_appConfig.BrokerQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
        }

        public  void Produce(string env,string entity,string branch, string hash)
        {
            try
            {
                var message = new
                {
                    Env = env,
                    Entity = entity,
                    Branch = branch,
                    Hash = hash
                };
                var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));
                _channel.BasicPublish("", _appConfig.BrokerQueue, null, body);
            }
            catch (Exception e)
            {
                throw;
            }
        }

    }
}
