using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.Core.Objects;
using ArmadaReports.Web.Models.ScoreCards;
using ArmadaReports.Web.Models;

namespace ArmadaReports.Web.Repository
{
    public class ScorecardRepository
    {
        public static GetReportLinkbyUserID_Result GetReportLinkByUserId(string UserId)
        {
            var _context = new AnalyticsEntities();
            return _context.GetReportLinkbyUserID(new Guid(UserId)).FirstOrDefault();
        }
        public static List<GetUserPrograms_Result> GetPrograms(string UserId, int? PharmacyId)
        {            
            var _context = new AnalyticsEntities();
            return _context.GetUserPrograms(new Guid(UserId), PharmacyId).ToList();
        }
        public static List<GetUserPharmacies_Result> GetPharmacies(string userId)
        {
            var _context = new AnalyticsEntities();
            return _context.GetUserPharmacies(new Guid(userId)).OrderBy(x => x.Name).ToList();
        }       
        
        public static ReferralsVsTimeToFillViewModel GetReferralsVsTimeToFill(ReferralsVsTimeToFillViewModel model)
        {
            using (var context = new AnalyticsEntities())
            {
                var ProgramsList = model.programs != null ? string.Join(",", model.programs) : "";
                model.ProgramsList = ProgramsList;
                var obj = context.GetScorecardReferralsVsTimeToFill(new Guid(model.UserId), model.PharmacyId, ProgramsList).ToList();
                model.ReferralsVsTimeToFill = obj;
                return model;
            }
        }
        public static ScorecardViewModel GetScoreCardReport(ScorecardViewModel model)
        {
            using (var context = new AnalyticsEntities())
            {
                var ProgramsList = model.programs != null ? string.Join(",", model.programs) : "";
                var objList = new List<PharmacyScorecardPortalViewModel>();

                var obj = context.GetScorecardMonthOverMonth(new Guid(model.UserId), model.PharmacyId, ProgramsList, model.ProgramId).ToList();
                foreach (var item in obj)
                {
                    var data = new PharmacyScorecardPortalViewModel()
                    {
                        Status = item.Status,
                        LastMonthBaseline = item.LastMonthBaseline,
                        LastMonthPharmacy = item.LastMonthPharmacy,
                        CurrentMonthBaseline = item.CurrentMonthBaseline,
                        CurrentMonthPharmacy = item.CurrentMonthPharmacy,
                        Trend = item.Trend,
                        LastMonthPerformance = item.LastMonthPerformance,
                        CurrentMonthPerformance = item.CurrentMonthPerformance
                    };
                    objList.Add(data);
                }
                model.ScoreCardReportMonthOverMonth = objList;
                return model;
            }
        }
        public static ScorecardViewModel GetASPNHUBScoreCardReportPeriod(ScorecardViewModel model)
        {
            using (var context = new AnalyticsEntities())
            {
                var ProgramsList = model.programs != null ? string.Join(",", model.programs) : "";
                var obj = context.GetScorecardPeriod(new Guid(model.UserId), model.PharmacyId, ProgramsList, model.ProgramId, model.FilterType).ToList();
                model.ScoreCardReportPeriod = obj;
                return model;
            }
        }
        public static ScorecardViewModel GetASPNHUBScoreCardReportPeriodLabels(ScorecardViewModel model)
        {
            using (var context = new AnalyticsEntities())
            {
                var DrugsList = model.Drugs != null ? string.Join(",", model.Drugs) : "";
                var obj = context.GetScorecardPeriodLabels(model.FilterType).FirstOrDefault();
                model.PeriodLabels = obj;
                return model;
            }
        }
    }
}