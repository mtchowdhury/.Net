using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models.ScoreCards;

namespace ArmadaReports.Web.Models
{
    public class ScorecardViewModel
    {
        public string UserId { get; set; }
        public int? PharmacyId { get; set; }
        public string Pharmacy { get; set; }
        public int? ProgramId { get; set; }
        public int ProgramCount { get; set; }
        public List<string> Drugs { get; set; }
        public string DateType { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string FilterType { get; set; }
        public List<string> programs { get; set; }
        public GetScorecardPeriodLabels_Result PeriodLabels { get; set; }
        public List<PharmacyScorecardPortalViewModel> ScoreCardReportMonthOverMonth { get; set; }
        public List<GetScorecardPeriod_Result> ScoreCardReportPeriod { get; set; }
    }
    public class PharmacyScorecardPortalViewModel : GetScorecardMonthOverMonth_Result
    {
        public int ProgramId { get; set; }
    }
}