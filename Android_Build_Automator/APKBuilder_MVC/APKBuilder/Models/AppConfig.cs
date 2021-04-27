using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APKBuilder.Models
{
    public class AppConfig
    {
        public string CMDEXE { get; set; }
        public string OutputPath { get; set; }
        public string GitExePath { get; set; }
        public string WorkingDirectory { get; set; }
        public string GitPullCommand { get; set; }
        public string BrokerAddress { get; set; }
        public string BrokerQueue { get; set; }
    }
}
