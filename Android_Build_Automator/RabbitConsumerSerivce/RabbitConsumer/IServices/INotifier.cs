using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitConsumer.IServices
{
    public interface INotifier
    {
        string SendMessage(string hash, string response, string path);
    }
}
