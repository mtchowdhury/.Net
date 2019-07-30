using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class SalesRepActivityModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string LastLoginDate { get; set; }
        public string UserType { get; set; }
        public string ProgramName { get; set; }
        public string AccessedOn { get; set; }
        public int AccessedCount { get; set; }
    }
}
