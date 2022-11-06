using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMBS.Conso.Gateway.NL.IServices;
using AMBS.Conso.Gateway.NL.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace AMBS.Conso.Gateway.NL.Services
{
    public class Pub:IPub
    {
        public IModel _channel = null;
        private readonly IConfiguration _config;
        public Pub(IConfiguration config)
        {
            _config = config;
            var factory = new ConnectionFactory
            {
                Uri = new Uri(_config.GetSection("BrokerConfiguration").GetSection("PubBrokerAddress").Value)
            };
            var con = factory.CreateConnection();
            if (_channel == null)
                _channel = con.CreateModel();
            _channel.QueueDeclare(_config.GetSection("BrokerConfiguration").GetSection("PubBrokerQueue").Value, durable: true, exclusive: false, autoDelete: false, arguments: null);
        }
        public async Task<Response>  Produce(object message)
        {
            try
            {
                if (message == null)
                    return new Response
                    {
                        Success = false,
                        Message = "invalid message request"
                    };
                var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));
                _channel.BasicPublish("", _config.GetSection("BrokerConfiguration").GetSection("PubBrokerQueue").Value, null, body);
                return new Response
                {
                    Success = true,
                    Message = "Request Successful"
                };
            }
            catch (Exception e)
            {
                return new Response
                {
                    Success = false,
                    Message = e.Message
                };
            }
        }
    }
}
