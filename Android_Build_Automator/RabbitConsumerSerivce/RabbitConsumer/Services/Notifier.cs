using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RabbitConsumer.IServices;

namespace RabbitConsumer.Services
{
   public class Notifier:INotifier
    {
        public  string SendMessage(string hash, string response, string path)
        {
            var url = ConfigurationManager.AppSettings["notifyUri"] + hash + "&response=" + response + "&path=" + path;
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var notification = string.Empty;
            var content = JsonConvert.SerializeObject(notification);
            var encodedContent = new StringContent(content, Encoding.UTF8, "application/json");
            HttpResponseMessage res = client.PostAsync(url, encodedContent).GetAwaiter().GetResult();
            string responseBody = res.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            return responseBody;
        }
    }
}
