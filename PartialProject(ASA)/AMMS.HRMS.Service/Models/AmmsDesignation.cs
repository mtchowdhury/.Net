using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMMS.HRMS.Service.Models
{
   public class AmmsDesignation
    {
        public int Id { get; set; }
        public int GradeId { get; set; }
        public string Name { get; set; }
        public string BanglaName { get; set; }
        public int SortOrder { get; set; }
        public int? GroupType { get; set; }
        public int Status { get; set; }
        public string ShortName { get; set; }
        public DateTime Startdate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}
