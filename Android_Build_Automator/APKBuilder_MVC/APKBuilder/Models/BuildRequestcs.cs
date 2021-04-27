using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APKBuilder.Models
{
    public class BuildRequest
    {
        public string env { get; set; }
        public string entity { get; set; }
        public string branch { get; set; }
        public string guid { get; set; }
    }
}
