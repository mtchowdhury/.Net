using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace ArmadaReports.Web.Models.Inventory
{
    [DataContract]
    public class WholesalerInventoryReportDetailTableModel
    {
        [DataMember(Order = 0)]
        public string WholesalerName { get; set; }
        [DataMember(Order = 1)]
        public string ProductName { get; set; }
        [DataMember(Order = 2)]
        public string LOTNumber { get; set; }
        public DateTime? ExpirationDate { get; set; }
        [DataMember(Order = 3)]
        public string ExpirationDateStr
        {
            get
            {
                if (ExpirationDate.HasValue)
                    return ExpirationDate.Value.ToString("MM/dd/yyyy");
                return string.Empty;
            }
            set { }
        }
        //[DataMember(Order = 4)]
        //public string Location { get; set; }
        [DataMember(Order = 4)]
        public int OnHandQty { get; set; }
        [DataMember(Order = 5)]
        public DateTime DateReported { get; set; }
        [DataMember(Order = 6)]
        public string NDC { get; set; }
    }
}