using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AMMS.Web.Models
{
    public class UserHashInfo
    {
      
            public System.Guid LinkHash { get; set; }
            public bool IsUsed { get; set; }
            public System.DateTime CreatedOn { get; set; }
            public int UserId { get; set; }
            public int EmployeeId { get; set; }
        
    }
}