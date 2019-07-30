using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Models;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class ChartController : Controller
    {
        [HttpGet]
        public JsonResult GetTopLeftColumnChart()
        {
            return Json(FakeRepository.GetTopLeftColumnChart(), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetQtdYears()
        {
            return Json(new
            {
                QTD1 = "QTD1 " + DateUtility.GetDateString("qtd1"),
                QTD2 = "QTD2 " + DateUtility.GetDateString("qtd2"),
                QTD3 = "QTD3 " + DateUtility.GetDateString("qtd3"),
                QTD4 = "QTD4 " + DateUtility.GetDateString("qtd4"),
                QTD5 = DateUtility.GetQtrForQTD5() + DateUtility.GetDateString("qtd5"),
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProgramStatus(int programId, string inpTreatment, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetProgramStatus(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, dateType), 
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProgramDistricts(int programId, string inpTreatment, string dateType, string strength, string reportTo = null)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var aspnRxID = ConfigurationManager.AppSettings["AspnRxID"];
            return Json(new Repository.Repository(connectionString).GetProgramDistricts(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, dateType, aspnRxID, reportTo, strength),
                JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetProgramSalesRep(int programId, string inpTreatment, string dateType, string strength, string reportTo = null)
        {
            //if(reportTo != null && reportTo.Equals("user-id"))
            //    reportTo = User.Identity.Name.Split('|').Length == 4 ? User.Identity.Name.Split('|')[0] : "";
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetProgramSalesRep(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, dateType, reportTo, strength),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProgramDaysToFill(int programId, string inpTreatment, int companyId, int priorAuth)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetDaysToFill(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, companyId, priorAuth),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPharmacyReferrals(int programId, string inpTreatment, string dateType, string referral, string pharmacy)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var includeAllStatuses = ConfigurationManager.AppSettings["IncludeAllStatuses"] == "true";
            return Json(new Repository.Repository(connectionString).GetPharmacyReferrals(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, dateType, includeAllStatuses, referral, pharmacy),
                JsonRequestBehavior.AllowGet);
        }




        public JsonResult GetProgramMaps(int programId, string inpTreatment, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetProgramMaps(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, dateType),
                JsonRequestBehavior.AllowGet);
        }






        [HttpGet]
        public JsonResult GetTubesFilled(int programId, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetProgramTubesFilled(programId, user.UserId, user.UserType, isArmadaEmployee, dateType),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GteUniquePatients(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetUniquePatients(programId, user.UserId, user.UserType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrderAnalysis(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetOrderAnalysis(programId, user.UserId, user.UserType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPAProgramStatus(int programId, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetPAProgramStatus(programId, user.UserId, user.UserType, isArmadaEmployee, dateType),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPAProgramMaps(int programId, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetPAProgramMaps(programId, user.UserId, user.UserType, isArmadaEmployee, dateType),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPROrderAnalysis(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetPROrderAnalysis(programId, user.UserId, user.UserType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCipherPriorAuth(int programId, string datetType, string insType, string statProcess)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new Repository.Repository(connectionString).GetCipherPriorAuth(programId, datetType, insType, statProcess, user.UserId),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetIncomingReferralsByHour(int programId, string dateType, string physicianFName, string physicianLName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Repository(connectionString).GetIncomingReferralByHour(programId, dateType, physicianFName, physicianLName),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult SearchPhysician(int programId, string searchTerm, string sp)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Repository(connectionString).SearchPhysician(programId, searchTerm, sp),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetReferralTimeToProcess(int programId, string location, string pa, string dateType, bool includeWeekends)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetReferralTimeToProcess(programId, location, pa, dateType, includeWeekends,
                isArmadaEmployee, user.UserId, user.UserType), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetBenfitsInvestigations(int programId, string dateType, int insuranceType, string ageRange, string drugName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            //var user = UserInfoCookie.GetUserInfo();
            //var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetBenfitsInvestigations(programId, dateType, insuranceType, 
                int.Parse(ageRange.Split('-').First()), int.Parse(ageRange.Split('-').Last()), drugName), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCashOptions(int programId, string dateType)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            //var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetCashOptions(programId, dateType, user.UserId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSantylData(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new Repository.Repository(connectionString).GetSantylData(programId, user.UserId, user.UserType), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetRegranexData(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new Repository.Repository(connectionString).GetRegranexData(programId, user.UserId, user.UserType), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetReferralsWithCopayGt75(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new Repository.Repository(connectionString).GetReferralsWithCopayGt75(programId, user.UserId, user.UserType), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetHubStatisticsConsignmentReport(int programId, string dateType, bool workingDays)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var rollingData =
                new Repository.Repository(connectionString).GetHubStatisticsConsignmentRollingData(programId, dateType,
                    workingDays);
            var referralData = new Repository.Repository(connectionString).GetHubStatisticsConsignmentData(programId,
                dateType, workingDays);
            return Json(new { rollingData = rollingData, referralData = referralData },
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPaStatusUpdates(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Repository(connectionString).GetPaStatusUpdateChart(programId),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetReferralStatus(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new Repository.Repository(connectionString).GetReferralStatusChart(programId, user.UserType,user.UserId),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPharmacyReferralsByAssignedOn(int programId, string inpTreatment, string dateType, string referral, string pharmacy)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var includeAllStatuses = ConfigurationManager.AppSettings["IncludeAllStatuses"] == "true";
            return Json(new Repository.Repository(connectionString).GetPharmacyReferralsByAssignedOn(programId, user.UserId, user.UserType, inpTreatment, isArmadaEmployee, dateType, includeAllStatuses, referral, pharmacy),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetRxcReasonByPrescriber(int programId, string firstName, string lastName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            return Json(new Repository.Repository(connectionString).GetRxcReasonByPrescriber(programId, user.UserId, user.UserType, firstName, lastName),
                JsonRequestBehavior.AllowGet);
        }
    }
}