using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AMBS.Conso.Gateway.NL.Models;

namespace AMBS.Conso.Gateway.NL.IServices
{
   public interface IPub
   {
       Task<Response> Produce(object message);
   }
}
