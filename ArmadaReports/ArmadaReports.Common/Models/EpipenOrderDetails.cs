using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class EpipenOrderDetails
    {
        public string SchoolId { get; set; }
        public string SchoolCount { get; set; }
        public string SchoolName { get; set; }
        public string SchoolState { get; set; }
        public string SchoolZip { get; set; }
        public string RegFreeQty { get; set; }
        public string RegReplQty { get; set; }
        public string RegDiscQty { get; set; }
        public string JrFreeQty { get; set; }
        public string JrReplQty { get; set; }
        public string JrDiscQty { get; set; }
        public string OtherFreeQty { get; set; }
        public string TotalUnits { get; set; }
        public string BoxQty { get; set; }
        public string VideosQty { get; set; }
        public string OrderID { get; set; }
        public string OrderDate { get; set; }
        public string OrderDateBeg { get; set; }
        public string OrderDateEnd { get; set; }
        public string BatchID { get; set; }
        public string ReleaseDate { get; set; }
        public string PharmacyName { get; set; }
        public string DoctorName { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string ContactAddress1 { get; set; }
        public string ContactAddress2 { get; set; }
        public string ContactCity { get; set; }
        public string ContactZip { get; set; }
        public string ContactState { get; set; }
        public string ContactEmailAddress { get; set; }
        public string ContactPhone { get; set; }
    }
}
