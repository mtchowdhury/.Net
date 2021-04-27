using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APKBuilder.IServices
{
   public interface IQueueManager
   {
       void Produce(string env, string entity,string branch,string hash);
   }
}
