using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models.ScoreCards;

namespace ArmadaReports.Web.Models
{
    public class ReferralsVsTimeToFillViewModel
    {
        public string UserId { get; set; }
        public int? ProgramId { get; set; }
        public int? PharmacyId { get; set; }
        public List<string> programs { get; set; }
        public string ProgramsList { get; set; }
        public List<GetScorecardReferralsVsTimeToFill_Result> ReferralsVsTimeToFill { get; set; }
    }
}