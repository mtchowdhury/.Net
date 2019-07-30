using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.NetworkCapacity
{
    public class NetworkCapacity
    {
        public List<NetworkCapacityChart> Chart { get; set; }
        public NetworkCapacityTable Table { get; set; }
    }
}