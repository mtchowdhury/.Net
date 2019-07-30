using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class UserRole
    {
        public string UserType { get; set; }
        public string ReportsTo { get; set; }
    }
}
