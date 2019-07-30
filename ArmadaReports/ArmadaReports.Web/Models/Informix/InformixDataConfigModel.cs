using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class InformixDataConfigModel
    {
        public string Message { get; set; }
        public bool Success { get; set; }
        public List<InformixConfigModel> Config { get; set; }
        public List<CsqActivityModel> Data { get; set; }
    }
}