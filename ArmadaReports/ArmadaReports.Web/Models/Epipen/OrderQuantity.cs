using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Epipen
{
    public class OrderQuantity
    {
        public string PrimaryColumn { get; set; }
        public string NcesSchoolId { get; set; }
        public int DistinctSchoolCount { get; set; }
        public string SchoolName { get; set; }
        public string SchoolState { get; set; }
        public string SchoolZip { get; set; }
        public string ReleaseDate { get; set; }
        public string OrderDateBeg { get; set; }
        public string OrderDateEnd { get; set; }
        public int RegFreeQty { get; set; }
        public int RegReplQty { get; set; }
        public int RegDiscQty { get; set; }
        public int JrFreeQty { get; set; }
        public int JrReplQty { get; set; }
        public int JrDiscQty { get; set; }
        public int OtherFreeQty { get; set; }
        public int BoxQty { get; set; }
        public int VideosQty { get; set; }
        public int TotalUnits { get; set; }
        public string DdlBegDate { get; set; }
        public string DdlEndDate { get; set; }
    }
}