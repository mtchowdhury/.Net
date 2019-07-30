using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Inventory
{
    public class ExpirationReportModel
    {
        public string DrugName { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int TotalPerDrug { get; set; }
        public bool IsLess52WeekDating { get; set; }
        public bool IsGreater52AndLess54WeekDating { get; set; }
        public bool IsGreater54WeekDating { get; set; }
    }
}