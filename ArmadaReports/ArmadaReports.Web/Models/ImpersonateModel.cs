using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class ImpersonateModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }
    }
}