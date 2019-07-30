using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    [Serializable]
    public class DetailsDataConfig
    {

        public List<Details> Data { get; set; }
        public List<DetailsField> Config { get; set; }
    }
}
