using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Epipen
{
    public class ProductMix
    {
        public string TotalSelectedState { get; set; }
        public string OrderDateBeg { get; set; }
        public string OrderDateEnd { get; set; }
        public int RegFree { get; set; }
        public int ReqRepl { get; set; }
        public int ReqDisc { get; set; }
        public int OtherFree { get; set; }
        public int JrFree { get; set; }
        public int JrRepl { get; set; }
        public int JrDisc { get; set; }
        public int Box { get; set; }
        public int Videos { get; set; }
        public double RegFreePrcnt { get; set; }
        public double ReqReplPrcnt { get; set; }
        public double ReqDiscPrcnt { get; set; }
        public double OtherFreePrcnt { get; set; }
        public double JrFreePrcnt { get; set; }
        public double JrReplPrcnt { get; set; }
        public double JrDiscPrcnt { get; set; }
        public double BoxPrcnt { get; set; }
        public double VideosPrcnt { get; set; }
        public int TotalUnits { get; set; }
        public string DateString { get; set; }
    }
}