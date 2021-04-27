using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APKBuilder.IServices
{
   public interface INotificationManager
   {
       Task SendMessage(string hash, string response, string path);
   }
}
