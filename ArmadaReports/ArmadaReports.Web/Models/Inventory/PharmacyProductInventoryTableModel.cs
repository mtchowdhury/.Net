using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace ArmadaReports.Web.Models.Inventory
{
    [DataContract]
    public class PharmacyProductInventoryTableModel
    {
        [DataMember(Order = 0)]
        public string Pharmacy { get; set; }
        [DataMember(Order = 1)]
        public string InventoryType { get; set; }
        //public DateTime? CountedOnDate { get; set; }
        //[DataMember(Order = 2)]
        //public string CountedOnDateStr
        //{
        //    get
        //    {
        //        if (CountedOnDate.HasValue)
        //            return CountedOnDate.Value.ToString("MM/dd/yyyy");
        //        return string.Empty;
        //    }
        //    set { }
        //}
        [DataMember(Order = 2)]
        public string DrugName { get; set; }
        [DataMember(Order = 3)]
        public string LotNumber { get; set; }
        public DateTime? ExpDate { get; set; }
        [DataMember(Order = 4)]
        public string ExpDateStr
        {
            get
            {
                if (ExpDate.HasValue)
                    return ExpDate.Value.ToString("MM/dd/yyyy");
                return string.Empty;
            }
            set { }
        }
        [DataMember(Order = 5)]
        public int? OnHandCartons { get; set; }
        [DataMember(Order = 6)]
        public DateTime DateLoaded { get; private set; }
    }
}