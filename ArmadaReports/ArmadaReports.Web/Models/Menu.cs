using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models
{
    public class Menu
    {
        public int ID { get; set; }
        public int Parent { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public string Action { get; set; }
        public bool IsLink { get; set; }
        public bool IsHome { get; set; }
        public string Role { get; set; }
        public string UserType { get; set; }
        public int Level { get; set; }
        public int Order { get; set; }
        public List<Menu> Children { get; set; }
    }
}