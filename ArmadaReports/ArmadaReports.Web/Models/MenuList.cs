using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class MenuList
    {
        public Menu Home { get; set; }
        public List<Menu> Menus { get; set; } 
    }
}