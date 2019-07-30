using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ReferralTimeToProcessDetails
    {
        public int AspnRxID { get; set; }
        public int DaysToProcess { get; set; }
        public string PriorAuthRequired { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime FillDate { get; set; }
        public DateTime ShipDate { get; set; }
    }
}