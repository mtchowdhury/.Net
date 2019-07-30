using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class ReportRegistrationModel
    {
        public string CreateDate { get; set; }
        public string Organization { get; set; }
        public string PhoneNumber { get; set; }
        public string ApplicationName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string NPI { get; set; }
        public string Phone { get; set; }
    }
}
