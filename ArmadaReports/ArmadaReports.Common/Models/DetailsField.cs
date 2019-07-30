using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    [Serializable]
    public class DetailsField
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CustomName { get; set; }
        public int Order { get; set; }
        public bool ForDistrctMgr { get; set; }
        public string HiddenForPrograms { get; set; }
        public string ProgramId { get; set; }
    }
}
