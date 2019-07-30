using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class AspnNote
    {
        public string Id { get; set; }
        public string AspnrxId { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string PharmacyId { get; set; }
        public string UserName { get; set; }
        public string Category { get; set; }
    }
}