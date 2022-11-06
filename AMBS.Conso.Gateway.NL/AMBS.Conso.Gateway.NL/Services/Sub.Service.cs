using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AMBS.Conso.Gateway.NL.Helper;
using AMBS.Conso.Gateway.NL.IServices;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Serilog;

namespace AMBS.Conso.Gateway.NL.Services
{
    public class Sub:ISub
    {
        public IModel _channel = null;
        private readonly IConfiguration _config;
        private readonly IPub _pub;
        public Sub(IConfiguration config,IPub pub)
        {
            _config = config;
            _pub =  pub;
            Subscribe();
        }

        private void Subscribe()
        {
            try
            {
                LogHelper.Log("initiating subscription..", System.Reflection.MethodBase.GetCurrentMethod().Name,LogHelper.LogLevel.Information);
                var factory = new ConnectionFactory
                {
                    Uri = new Uri(_config.GetSection("BrokerConfiguration").GetSection("SubBrokerAddress").Value)
                };
                var con = factory.CreateConnection();
                LogHelper.Log("connection created", System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Information);
                var channel = con.CreateModel();
                LogHelper.Log("channel initiated", System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Information);
                channel.QueueDeclare(_config.GetSection("BrokerConfiguration").GetSection("SubBrokerQueue").Value, durable: true, exclusive: false, autoDelete: false, arguments: null);
                var consumer = new EventingBasicConsumer(channel);
                LogHelper.Log("subscription initiated", System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Information);
                consumer.Received += (sender, e) =>
                {
                    try
                    {
                        if (e.Redelivered)
                        {
                            channel.BasicAck(deliveryTag: e.DeliveryTag, multiple: false);
                            LogHelper.Log("got message redelivery", System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Warning);
                            return;
                        }
                        var body = e.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);
                        var messaJObject = JObject.Parse(message);
                        LogHelper.Log("received message: "+ message, System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Information);
                        if (messaJObject["FromDate"] == null || messaJObject["ToDate"] == null)
                        {
                            channel.BasicAck(deliveryTag: e.DeliveryTag, multiple: false);
                            LogHelper.Log("either of the received date is null", System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Warning);
                            return;
                        }
                        var isReproduced =  _pub.Produce(messaJObject).GetAwaiter().GetResult();
                        LogHelper.Log("reproduce status: " + isReproduced.Success + "stack message: " + isReproduced.Message, System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Information);
                        channel.BasicAck(deliveryTag: e.DeliveryTag, multiple: false);
                    }
                    catch (Exception ex)
                    {
                        LogHelper.Log(ex.Message, System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Error);
                    }

                };
                channel.BasicConsume(_config.GetSection("BrokerConfiguration").GetSection("SubBrokerQueue").Value, false, consumer);
                LogHelper.Log("listening", System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Information);
            }
            catch (Exception e)
            {
                LogHelper.Log(e.Message, System.Reflection.MethodBase.GetCurrentMethod().Name, LogHelper.LogLevel.Error);
            }
        }
    }
}
