using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models.Madventx;
using ArmadaReports.Web.SurveyMonkey;

namespace ArmadaReports.Web.Repository
{
    public class ChartDataRepository
    {
        private StoredProcedureService _storedProcedureService;

        public ChartDataRepository()
        {
            _storedProcedureService = new StoredProcedureService(
                ConfigurationManager.ConnectionStrings["connString"].ConnectionString);
        }

        public List<MedvantxDeliveryModel> MedvantxDeliveredVsExceptionOrderVolume(string period, string status)
        {
            if (status == "Exceptions")
                status = "Exception";
            return _storedProcedureService.GetData<MedvantxDeliveryModel>("[kaleo].MedvantxDeliveredVsExceptionOrderVolume",
                new SqlParameter[] { new SqlParameter("@Period", period), new SqlParameter("@Status", status) }).ToList();
        }

        public List<MedvantxDeliveryModel> MedvantxUPS48hrDeliveryOrderVolume(string period, string hoursFilter)
        {
            //hoursFilter = hoursFilter == "<= 48 hrs" ? "l48" : "g48";
            return _storedProcedureService.GetData<MedvantxDeliveryModel>("[kaleo].MedvantxUPS48hrDeliveryOrderVolume",
                new SqlParameter[] { new SqlParameter("@Period", period), new SqlParameter("@HoursFilter", hoursFilter) }).ToList();
        }

        internal List<MedvantxPercentageModel> MedvantxUPS48hrDeliverySuccessRate(string period)
        {
            if (period == "Month")
                return _storedProcedureService.GetData<MedvantxPercentageByMonthModel>("[kaleo].MedvantxUPS48hrDeliverySuccessRate",
                    new SqlParameter[] { new SqlParameter("@Period", period) }).ToList().
                    Select(o => new MedvantxPercentageModel()
                    {
                        Percentage = o.Percentage,
                        Date = new DateTime(o.Year, o.Month, 1)
                    }).ToList();
            else
                return _storedProcedureService.GetData<MedvantxPercentageModel>("[kaleo].MedvantxUPS48hrDeliverySuccessRate",
                    new SqlParameter[] { new SqlParameter("@Period", period) }).ToList();
        }

        internal List<KaleoCycleReportModel> CleanPathFromBVDirectlyIntoScheduleDelivery(string period, string cleanBVFilter, bool excludeOnhold, bool excludeCancelled)
        {
            return _storedProcedureService.GetData<KaleoCycleReportModel>("[kaleo].KaleoCycleReport_CleanPathFromBVDirectlyIntoScheduleDelivery",
                    new SqlParameter[] { new SqlParameter("@Period", period), new SqlParameter("@Filter", cleanBVFilter), new SqlParameter("@ExcludeOnhold", excludeOnhold), new SqlParameter("@ExcludeCancelled", excludeCancelled) }).ToList();
        }

        internal List<KaleoCycleReportModel> IndirectPathFromBVDirectlyIntoAnyStatus(string period, string indirectFilter, bool excludeOnhold, bool excludeCancelled)
        {
            switch (indirectFilter)
            {
                case "BV to Call Protocol":
                    indirectFilter = "BVtoCallProtocol";
                    break;
                case "Call Protocol to SD":
                    indirectFilter = "CallProtocoltoSD";
                    break;
            }

            return _storedProcedureService.GetData<KaleoCycleReportModel>("[kaleo].[KaleoCycleReport_IndirectPathFromBVDirectlyIntoAnyStatus]",
                   new SqlParameter[] { new SqlParameter("@Period", period), new SqlParameter("@Filter", indirectFilter), new SqlParameter("@ExcludeOnhold", excludeOnhold), new SqlParameter("@ExcludeCancelled", excludeCancelled) }).ToList();
        }

        internal List<KaleoCycleReportPercentageModel> VolumePercentOfCleanPathVSIndirectPath(string period, bool excludeOnhold, bool excludeCancelled)
        {
            return _storedProcedureService.GetData<KaleoCycleReportPercentageModel>("[kaleo].[KaleoCycleReport_VolumePercentOfCleanPathVSIndirectPath]",
                   new SqlParameter[] { new SqlParameter("@Period", period), new SqlParameter("@ExcludeOnhold", excludeOnhold), new SqlParameter("@ExcludeCancelled", excludeCancelled) }).ToList();
        }
    }
}