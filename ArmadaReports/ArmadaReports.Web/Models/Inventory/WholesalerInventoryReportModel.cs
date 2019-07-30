using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Inventory
{
    public class WholesalerInventoryReportModel
    {
        public string WholesalerName { get; set; }
        public string DrugName { get; set; }
        public int? StockOnHand { get; set; }
        public int? Less52WeekDating { get; set; }
        public int? Greater52AndLess54WeekDating { get; set; }
        public int? Greater54WeekDating { get; set; }
    }
}