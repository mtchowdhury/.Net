using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.NetworkCapacity
{
    public class NetworkCapacityTable
    {
        public List<string> Columns { get; set; }
        public List<List<string>> Data { get; set; }
    }
}