using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class MailTemplateModel
    {
        public int ProgramId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AspnId { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string HcpFirstName { get; set; }
        public string HcpLastName { get; set; }
        public string HcpOfficialContact { get; set; }
        public string HcpPhone { get; set; }
        public string ManagerName { get; set; }
        public string ManagerEmail { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
    }
}