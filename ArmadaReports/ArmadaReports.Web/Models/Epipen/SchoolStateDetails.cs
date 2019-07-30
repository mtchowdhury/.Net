using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Epipen
{
    public class SchoolStateDetails
    {
        public string SchoolId { get; set; }
        public string SchoolCount { get; set; }
        public string TotalSchoolCount { get; set; }
        public string SchoolDiff { get; set; }
        public string SchoolName { get; set; }
        public string SchoolState { get; set; }
        public string SchoolZip { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string ContactAddress1 { get; set; }
        public string ContactAddress2 { get; set; }
        public string ContactCity { get; set; }
        public string ContactZip { get; set; }
        public string ContactState { get; set; }
        public string ContactEmailAddress { get; set; }
        public string ContactPhone { get; set; }
        public string ReleaseDate { get; set; }
    }
}