using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArmadaReports.ReportRequestHandler.Models;
using Newtonsoft.Json;

namespace ArmadaReports.ReportRequestHandler.Helper
{
    public static class RequestUtility
    {

        public static string ParamToJson(RequestParamSet request)
        {
            return JsonConvert.SerializeObject(request);
        }

        public static RequestParamSet JsonToParam(string json)
        {
            return JsonConvert.DeserializeObject<RequestParamSet>(json);
        }

        public static RequestParamSet ToParam(int programId, string aspnxId, int? fillingPharmacyId, int? regranexTubeQty, int? fillingCompanyId,
            string programStatus = null, string programSubStatus = null, string state = null, string dateRangeType = null, 
            string patientLastNameSrcQry = null, string physicianLastNameSrcQry = null, string dateToUse = null, string reportsTo = null, 
            bool? priorAuth = null, bool excludeNonWorkDays = true, int? daysToFill = null, int measureId = 0, string from = null, string to = null, 
            bool isArmadaEmployee = true, string referralCode = null, string summarySubStatus = null, string patientState = null,
            string patientLastName = null, string physicianLastName = null, string inpTreatment = "All", string userId = null, string avgDays = "", 
            int? insType = null, string statProc = null, string authCode = null, string category = null, string salesReferralUser = null, 
            string insuranceType = null, string pharmacyReferral = null, string registry = null, string onLabel = null, string source = null,
            string timeToProcess = null, string location = null, string dateType = null, string districtManager = null, string refInProcess = null, 
            string strength = null, string consignment = null, string reportName = null,string userType= null,int offset=0, 
            bool isExport=false,string ndc=null, string referralType = null, string prescriberFirstName = null, string prescriberLastName = null,
            string drugName = null, string reason = null)
        {
            return new RequestParamSet
            {
                ProgramId = programId,
                AspnRxId = aspnxId,
                FillingPharmacyId = fillingPharmacyId,
                TubeQty = regranexTubeQty,
                FillingCompanyId = fillingCompanyId,
                ProgramStatus = programStatus,
                ProgramSubstatus = programSubStatus,
                State = state,
                DateRangeType = dateRangeType,
                PatientLastNameSrcQry = patientLastNameSrcQry,
                PhysicianLastNameSrcQry = physicianLastNameSrcQry,
                DateToUse = dateToUse,
                ReportsTo = reportsTo,
                PriorAuth = priorAuth,
                ExcludeNonWorkDays = excludeNonWorkDays,
                DaysToFill = daysToFill,
                MeasureId = measureId,
                From = from,
                To = to,
                IsArmadaEmployee = isArmadaEmployee,
                ReferralCode = referralCode,
                SummarySubStatus = summarySubStatus,
                PatientState = patientState,
                PatientLastName = patientLastName,
                PhysicianLastName = physicianLastName,
                InpTreatment = inpTreatment,
                UserId = userId,
                AvgDays = avgDays,
                InsType = insType,
                StatProc = statProc,
                AuthCode = authCode,
                Category = category,
                SalesReferralUser = salesReferralUser,
                InsuranceType = insuranceType,
                PharmacyReferral = pharmacyReferral,
                Registry = registry,
                OnLabel = onLabel,
                Source = source,
                TimeToProcess = timeToProcess,
                Location = location,
                DateType = dateType,
                DistrictManager = districtManager,
                RefInProcess = refInProcess,
                Strength = strength,
                Consignment = consignment,
                ReportName = reportName,
                UserType=userType,
                Offset=offset,
                IsExport=isExport,
                Ndc=ndc,
                ReferralType = referralType,
                PrescriberFirstName = prescriberFirstName,
                PrescriberLastName = prescriberLastName,
                DrugName = drugName,
                Reason = reason
            };
        }
    }
}
