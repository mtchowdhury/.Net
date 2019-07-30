using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using ArmadaReports.Web.Repository;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using ArmadaReports.Web.Export;
using ArmadaReports.Web.Models;
using System.Web.UI.WebControls;
using ArmadaReports.Web.Extension;
using ClosedXML.Excel;
using ArmadaReports.Web.Helper;
using ArmadaReports.ReportRequestHandler.Helper;
using ArmadaReports.ReportRequestHandler.Repositories;
using System.Text;
using OfficeOpenXml;
using ArmadaReports.Common.Models;
using System.Web.UI;
using System.Runtime.Serialization.Formatters.Binary;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class DetailsController : BaseController
    {
        private readonly ReportRequestRepository _reportRequestRepository;
        public DetailsController()
        {
            _reportRequestRepository = new ReportRequestRepository(ConfigurationManager.ConnectionStrings["connString"].ConnectionString);
        }
        public ActionResult ReportRequest(int programId, string aspnxId, int? fillingPharmacyId, int? regranexTubeQty, int? fillingCompanyId, string programStatus = null,
            string programSubStatus = null, string state = null, string dateRangeType = null, string patientLastNameSrcQry = null, string physicianLastNameSrcQry = null, string dateToUse = null,
            string reportsTo = null, bool? priorAuth = null, bool excludeNonWorkDays = true, int? daysToFill = null, int measureId = 0, string from = null, string to = null, bool isArmadaEmployee = true,
            string referralCode = null, string summarySubStatus = null, string patientState = null, string patientLastName = null, string physicianLastName = null, string inpTreatment = "All",
            string userId = null, string avgDays = "", int? insType = null, string statProc = null, string authCode = null, string category = null, string salesReferralUser = null, string insuranceType = null,
            string pharmacyReferral = null, string registry = null, string onLabel = null, string source = null, string timeToProcess = null, string location = null, string dateType = null, string districtManager = null,
            string refInProcess = null, string strength = null, string consignment = null, int offset = 0, int rowCount = 0, string reportName = null, bool reload = true, string ndc = null, string referralType = null,
            string prescriberFirstName = null, string prescriberLastName = null, string drugName = null, string reason = null)
        {
            if (!reload)
                return View();
            if (!Request.IsAuthenticated)
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            //var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            reportName = reportName ?? "N/A";
            var param = RequestUtility.ToParam(programId, aspnxId, fillingPharmacyId, regranexTubeQty, fillingCompanyId,
                programStatus, programSubStatus, state, dateRangeType,
                patientLastNameSrcQry ?? "%%", physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", reportsTo,
                priorAuth, excludeNonWorkDays, daysToFill, measureId,
                from, to, isArmadaEmployee, referralCode, summarySubStatus, patientState, patientLastName, physicianLastName,
                inpTreatment, user.UserId, avgDays, insType, statProc,
                authCode, category, salesReferralUser, insuranceType,
                pharmacyReferral, registry, onLabel, source,
                timeToProcess, location, dateType, districtManager,
                refInProcess, strength, consignment, reportName: reportName, userType: user.UserType, offset: 0,
                isExport: true, ndc: ndc, referralType: referralType, prescriberFirstName: prescriberFirstName, prescriberLastName: prescriberLastName,
                drugName:drugName, reason:reason);
            var json = RequestUtility.ParamToJson(param);
            var requestId = _reportRequestRepository.OnRequest(reportName, user.UserId, programId, "xlsx,pdf", json, rowCount);
            return RedirectToAction("ReportRequestState");
        }
        public ActionResult ReportRequestState()
        {
            return View();
        }
        public bool DownloadReportFile(int reportId)
        {
            //var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return _reportRequestRepository.OnDownloaded(reportId);
        }
        public bool DeleteReportFile(int reportId)
        {
            //var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return _reportRequestRepository.OnDeleted(reportId);

        }

        // GET: Details
        public ActionResult Index(int programId, string aspnxId, int? fillingPharmacyId, int? regranexTubeQty, int? fillingCompanyId, string programStatus = null,
            string programSubStatus = null, string state = null, string dateRangeType = null, string patientLastNameSrcQry = null, string physicianLastNameSrcQry = null, string dateToUse = null,
            string reportsTo = null, bool? priorAuth = null, bool excludeNonWorkDays = true, int? daysToFill = null, int measureId = 0, string from = null, string to = null, bool isArmadaEmployee = true,
            string referralCode = null, string summarySubStatus = null, string patientState = null, string patientLastName = null, string physicianLastName = null, string inpTreatment = "All",
            string userId = null, string avgDays = "", int? insType = null, string statProc = null, string authCode = null, string category = null, string salesReferralUser = null, string insuranceType = null,
            string pharmacyReferral = null, string registry = null, string onLabel = null, string source = null, string timeToProcess = null, string location = null, string dateType = null, string districtManager = null,
            string refInProcess = null, string strength = null, string consignment = null, string reportName = null, int offset = 0, int rowCount = 0, string ndc = null, string referralType = null,
            string prescriberFirstName = null, string prescriberLastName = null, string drugName = null, string reason = null)
        {
            //return RedirectToAction("ReportRequestState");
            if (!Request.IsAuthenticated)
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            Extension.Helper.LogPageAccess(connectionString, Request, user);

            var dates = Common.Extension.DateUtility.GetDates(dateRangeType ?? "allreferrals", programId, connectionString);
            if (measureId == 100)
            {
                var dts = Common.Extension.DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-11), DateTime.Now);
                dts.RemoveAt(dates.Count - 1);
                dates = new List<string> { dts.First().ToString("yyyy-MM-dd") + " 00:00:00", dts.Last().ToString("yyyy-MM-dd") + " 23:59:59" };
            }
            var fromDate = dates[0].Split(' ')[0].Split('-')[1] + '/' + dates[0].Split(' ')[0].Split('-')[2] + '/' + dates[0].Split(' ')[0].Split('-')[0];
            var toDate = dates[1].Split(' ')[0].Split('-')[1] + '/' + dates[1].Split(' ')[0].Split('-')[2] + '/' + dates[1].Split(' ')[0].Split('-')[0];
            ViewData["programId"] = programId;
            ViewData["status"] = programStatus;
            ViewData["aspndid"] = aspnxId;
            ViewData["state"] = state;
            ViewData["substatus"] = programSubStatus;
            ViewData["reportsto"] = reportsTo ?? "";
            ViewData["salesreferrals"] = referralCode;
            ViewData["salesreferralsuser"] = salesReferralUser ?? "";
            ViewData["copayfrom"] = "";
            ViewData["copayto"] = "";
            ViewData["fromdate"] = from ?? fromDate;
            ViewData["todate"] = to ?? toDate;
            ViewData["physicianlastname"] = physicianLastName;
            ViewData["physicianlastnameqry"] = string.IsNullOrEmpty(physicianLastNameSrcQry)
                ? "beginswith"
                : physicianLastNameSrcQry.Count(c => c == '%') == 2
                    ? "contains"
                    : physicianLastNameSrcQry.StartsWith("%") ? "beginswith" : "endswith";
            ViewData["fillingcompany"] = fillingCompanyId;
            ViewData["daystofill"] = daysToFill;
            ViewData["piorauth"] = priorAuth == null ? "" : priorAuth == true ? "Yes" : "No";
            ViewData["avgDays"] = avgDays;
            ViewData["treatment"] = inpTreatment;
            ViewData["tubesqty"] = regranexTubeQty;
            ViewData["instype"] = insType == null ? "" : insType.ToString();
            ViewData["registry"] = registry ?? "";
            ViewData["source"] = source ?? "";
            ViewData["onlabel"] = onLabel ?? "";
            ViewData["referraltype"] = referralType ?? "";
            ViewData["ndc"] = ndc ?? "";

            var queryString = "?programId=" + programId + (aspnxId == null ? "" : "&aspnxId=" + aspnxId) + (fillingPharmacyId == null ? "" : "&fillingPharmacyId=" + fillingPharmacyId)
                       + (regranexTubeQty == null ? "" : "&regranexTubeQty=" + regranexTubeQty) + (fillingCompanyId == null ? "" : "&fillingCompanyId=" + fillingCompanyId) + (programStatus == null ? "" : "&programStatus=" + programStatus)
                       + (programSubStatus == null ? "" : "&programSubStatus=" + programSubStatus) + (state == null ? "" : "&state=" + state) + (dateRangeType == null ? "" : "&dateRangeType=" + dateRangeType)
                       + (patientLastNameSrcQry == null ? "" : "&patientLastNameSrcQry=" + patientLastNameSrcQry) + (physicianLastNameSrcQry == null ? "" : "&physicianLastNameSrcQry=" + physicianLastNameSrcQry)
                       + (dateToUse == null ? "" : "&dateToUse=" + dateToUse) + (reportsTo == null ? "" : "&reportsTo=" + reportsTo) + (priorAuth == null ? "" : "&priorAuth=" + priorAuth) + ("&excludeNonWorkDays=" + excludeNonWorkDays)
                       + (daysToFill == null ? "" : "&daysToFill=" + daysToFill) + ("&measureId=" + measureId) + (from == null ? "" : "&from=" + from) + (to == null ? "" : "&to=" + to) + ("&isArmadaEmployee=" + isArmadaEmployee)
                       + (aspnxId == null ? "" : "&aspnxId=" + aspnxId) + (referralCode == null ? "" : "&referralCode=" + referralCode) + (summarySubStatus == null ? "" : "&summarySubStatus=" + summarySubStatus)
                       + (patientState == null ? "" : "&patientState=" + patientState) + (physicianLastName == null ? "" : "&physicianLastName=" + physicianLastName) + (patientLastName == null ? "" : "&patientLastName=" + patientLastName)
                       + ("&inpTreatment=" + inpTreatment + (string.IsNullOrEmpty(avgDays) ? "" : "&avgDays=" + avgDays) + (user.UserId == null ? "" : "&userId=" + user.UserId)
                       + (insType == null ? "" : "&insType=" + insType) + (statProc == null ? "" : "&statProc=" + statProc) + (authCode == null ? "" : "&authCode=" + authCode)
                       + (category == null ? "" : "&category=" + category) + (salesReferralUser == null ? "" : "&salesReferralUser=" + salesReferralUser)
                       + (insuranceType == null ? "" : "&insuranceType=" + insuranceType) + (pharmacyReferral == null ? "" : "&pharmacyReferral=" + pharmacyReferral)
                       + (registry == null ? "" : "&registry=" + registry) + (onLabel == null ? "" : "&onLabel=" + onLabel) + (source == null ? "" : "&source=" + source)
                       + (timeToProcess == null ? "" : "&timeToProcess=" + timeToProcess) + (dateType == null ? "" : "&dateType=" + dateType)
                       + (location == null ? "" : "&location=" + location) + (districtManager == null ? "" : "&districtManager=" + districtManager)
                       + (refInProcess == null ? "" : "&refInProcess=" + refInProcess) + (strength == null ? "" : "&strength=" + strength)
                       + (consignment == null ? "" : "&consignment=" + consignment) + ("&reportName=" + reportName) + ("&offset=" + offset) + ("&rowCount=" + rowCount)
                       + (ndc == null ? "" : "&ndc=" + ndc) + (referralType == null ? "" : "&referralType=" + referralType)
                       + (prescriberLastName == null ? "" : "&prescriberLastName=" + prescriberLastName)
                       + (prescriberFirstName == null ? "" : "&prescriberFirstName=" + prescriberFirstName)
                       + (drugName == null ? "" : "&drugName=" + drugName)
                       + (reason == null ? "" : "&reason=" + reason));
            ViewData["pdfurl"] = "/Details/" + GetPdfExportUrl(user.UserId, rowCount) + queryString;
            ViewData["excelurl"] = "/Details/" + GetExcelExportUrl(user.UserId, rowCount) + queryString;
            var param = RequestUtility.ToParam(programId, aspnxId, fillingPharmacyId, regranexTubeQty, fillingCompanyId,
                programStatus, programSubStatus, state, dateRangeType,
                patientLastNameSrcQry ?? "%%", physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", reportsTo,
                priorAuth, excludeNonWorkDays, daysToFill, measureId,
                from, to, isArmadaEmployee, referralCode, summarySubStatus, patientState, patientLastName, physicianLastName,
                inpTreatment, user.UserId, avgDays, insType, statProc,
                authCode, category, salesReferralUser, insuranceType,
                pharmacyReferral, registry, onLabel, source,
                timeToProcess, location, dateType, districtManager,
                refInProcess, strength, consignment, reportName: null, userType: user.UserType, offset: offset, isExport: false,
                ndc: ndc, referralType: referralType, prescriberFirstName: prescriberFirstName, prescriberLastName: prescriberLastName,
                drugName: drugName, reason:reason);
            //var resultsq = new Repository.Repository(connectionString).GetDetails(programId, aspnxId, programStatus,
            //    programSubStatus, state, dateRangeType, patientLastNameSrcQry ?? "%%",
            //physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", fillingPharmacyId, regranexTubeQty, reportsTo,
            //fillingCompanyId, priorAuth, excludeNonWorkDays, from, to, isArmadaEmployee, user.UserId, user.UserType, referralCode,
            //summarySubStatus, daysToFill, patientState, patientLastName, physicianLastName, measureId, inpTreatment, avgDays,
            //insType, statProc, authCode, category, salesReferralUser, insuranceType, pharmacyReferral, registry, onLabel,
            //source, timeToProcess, location, dateType, districtManager, refInProcess, strength, consignment, offset, false);
            var results = _reportRequestRepository.GetDetails(user.UserType, param);
            ViewData["reportstoddl"] = Common.Extension.Helper.GetReportsTo(results.Data);
            ViewData["salesreferralddl"] = Common.Extension.Helper.GetSalesReferral(results.Data);
            ViewData["programstatusddl"] = Common.Extension.Helper.GetProgramStatus(results.Data);
            ViewData["programsubstatusddl"] = Common.Extension.Helper.GetProgramSubStatus(results.Data);
            ViewData["insurancetypeddl"] = Common.Extension.Helper.GetInsuranceTypes(results.Data);
            ViewData["referraltypeddl"] = Common.Extension.Helper.GetReferralTypes(results.Data);

            ViewData["referrals"] = results.Data.Count.ToString("##,##0");

            //var role = new UserRepository(connectionString).GetRoleByUser(user.UserId);
            var role = _reportRequestRepository.GetRoleByUser(user.UserId);
            ViewData["usertype"] = role.UserType;
            ViewData["userid"] = user.UserId;
            ViewData["userrolename"] = user.HasPrivilege;

            ViewData["rowcount"] = rowCount;
            ViewData["offset"] = offset;
            ViewData["rowcountstr"] = rowCount.ToString("##,###");
            ViewData["prevoffset"] = (offset - 50);
            ViewData["nextoffset"] = rowCount > offset + 50 ? (offset + 50) : -1;

            return View(results);
        }

        public void ExportPdf(int programId, string aspnxId, int? fillingPharmacyId, int? regranexTubeQty, int? fillingCompanyId, string programStatus = null,
            string programSubStatus = null, string state = null, string dateRangeType = null, string patientLastNameSrcQry = null, string physicianLastNameSrcQry = null, string dateToUse = null,
            string reportsTo = null, bool? priorAuth = null, bool excludeNonWorkDays = false, int? daysToFill = null, int measureId = 0, string from = null, string to = null, bool isArmadaEmployee = true,
            string referralCode = null, string summarySubStatus = null, string patientState = null, string patientLastName = null, string physicianLastName = null, string inpTreatment = "All",
            string userId = null, string avgDays = "", int? insType = null, string statProc = null, string authCode = null, string category = null, string salesReferralUser = null, string insuranceType = null,
            string pharmacyReferral = null, string registry = null, string onLabel = null, string source = null, string timeToProcess = null, string location = null, string dateType = null, string districtManager = null,
            string refInProcess = null, string strength = null, string consignment = null, string ndc = null, string referralType = null, string prescriberFirstName = null, string prescriberLastName = null,
            string drugName = null, string reason = null)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateRangeType ?? "allreferrals", programId, connectionString);
            var fromDate = dates[0].Split('-')[1] + '/' + dates[0].Split('-')[2] + '/' + dates[0].Split('-')[0];
            var toDate = dates[1].Split('-')[1] + '/' + dates[1].Split('-')[2] + '/' + dates[1].Split('-')[0];


            //var programName = new Repository.Repository(connectionString).GetProgramName(programId);
            var programName = new ReportRequestRepository(connectionString).GetProgramName(programId);
            var param = RequestUtility.ToParam(programId, aspnxId, fillingPharmacyId, regranexTubeQty, fillingCompanyId,
                programStatus, programSubStatus, state, dateRangeType,
                patientLastNameSrcQry ?? "%%", physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", reportsTo,
                priorAuth, excludeNonWorkDays, daysToFill, measureId,
                from, to, isArmadaEmployee, referralCode, summarySubStatus, patientState, patientLastName, physicianLastName,
                inpTreatment, user.UserId, avgDays, insType, statProc,
                authCode, category, salesReferralUser, insuranceType,
                pharmacyReferral, registry, onLabel, source,
                timeToProcess, location, dateType, districtManager,
                refInProcess, strength, consignment, reportName: null, userType: user.UserType, offset: 0,
                isExport: true, ndc: ndc, referralType: referralType, prescriberFirstName: prescriberFirstName, prescriberLastName: prescriberLastName,
                drugName: drugName, reason:reason);
            //var results = new ReportRequestRepository(connectionString).GetDetails(programId, aspnxId, programStatus, programSubStatus, state, dateRangeType, patientLastNameSrcQry ?? "%%",
            //    physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", fillingPharmacyId, regranexTubeQty, reportsTo, fillingCompanyId, priorAuth, excludeNonWorkDays, from, to, isArmadaEmployee,
            //    user.UserId, user.UserType, referralCode, summarySubStatus, daysToFill, patientState, patientLastName, physicianLastName, measureId, inpTreatment, avgDays, insType, statProc, authCode, category,
            //    salesReferralUser, insuranceType, pharmacyReferral, registry, onLabel, source, timeToProcess, location, dateType, districtManager, refInProcess, strength, consignment, 0, true);
            var results = _reportRequestRepository.GetDetails(user.UserType, param);

            var path = Server.MapPath("~/PDF");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            var fileName = path + "/Details Report For" + programName + "_" + DateTime.Now.Ticks.ToString() + ".pdf";
            //_reportRequestRepository.ExportPdf(param, fileName);
            Document document = new Document(PageSize.A2, 5f, 5f, 5f, 5f);
            try
            {
                PdfWriter.GetInstance(document, new FileStream(fileName, FileMode.Create));
                var colCount = results.Config.Count(c => !c.Name.Contains("_btn_"));
                PdfPTable table = new PdfPTable(colCount);
                table.TotalWidth = 1180f;
                table.LockedWidth = true;
                table.SpacingBefore = 5f;

                // relative col widths in proportions - 1 / 3 and 2 / 3
                float[] widths = new float[colCount];
                for (int i = 0; i < colCount; i++)
                {
                    widths[i] = 1f;
                }
                table.SetWidths(widths);
                table.HorizontalAlignment = 0;

                Common.PdfUtility.AddHeaders(table, results.Config, user.UserType);

                foreach (var data in results.Data)
                {
                    Common.PdfUtility.AddRow(table, data, results.Config, user.UserType);
                }

                document.Open();

                document.Add(new Paragraph("Details Report for " + programName, FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                document.Add(new Paragraph("Number of Referrals: " + results.Data.Count.ToString("##,###"), FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                document.Add(table);
            }
            catch
            {

            }
            finally
            {
                var fileInfo = new FileInfo(fileName);
                document.Close();

                Response.ClearContent();
                Response.ClearHeaders();
                Response.AddHeader("Content-Disposition", "inline;filename=" + fileName);
                Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                Response.ContentType = "application/pdf";
                Response.WriteFile(fileName);
                Response.Flush();
                Response.Clear();
                System.IO.File.Delete(fileName);
            }
        }

        public void ExportExcel(int programId, string aspnxId, int? fillingPharmacyId, int? regranexTubeQty, int? fillingCompanyId, string programStatus = null,
            string programSubStatus = null, string state = null, string dateRangeType = null, string patientLastNameSrcQry = null, string physicianLastNameSrcQry = null, string dateToUse = null,
            string reportsTo = null, bool? priorAuth = null, bool excludeNonWorkDays = false, int? daysToFill = null, int measureId = 0, string from = null, string to = null, bool isArmadaEmployee = true,
            string referralCode = null, string summarySubStatus = null, string patientState = null, string patientLastName = null, string physicianLastName = null, string inpTreatment = "All",
            string userId = null, string avgDays = "", int? insType = null, string statProc = null, string authCode = null, string category = null, string salesReferralUser = null, string insuranceType = null,
            string pharmacyReferral = null, string registry = null, string onLabel = null, string source = null, string timeToProcess = null, string location = null, string dateType = null, string districtManager = null,
            string refInProcess = null, string strength = null, string consignment = null, string ndc = null, string referralType = null, string prescriberFirstName = null, string prescriberLastName = null,
            string drugName = null, string reason = null)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = Common.Extension.DateUtility.GetDates(dateRangeType ?? "allreferrals", programId, connectionString);
            var fromDate = dates[0].Split('-')[1] + '/' + dates[0].Split('-')[2] + '/' + dates[0].Split('-')[0];
            var toDate = dates[1].Split('-')[1] + '/' + dates[1].Split('-')[2] + '/' + dates[1].Split('-')[0];

            var programName = _reportRequestRepository.GetProgramName(programId);
            var param = RequestUtility.ToParam(programId, aspnxId, fillingPharmacyId, regranexTubeQty, fillingCompanyId,
                programStatus, programSubStatus, state, dateRangeType,
                patientLastNameSrcQry ?? "%%", physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", reportsTo,
                priorAuth, excludeNonWorkDays, daysToFill, measureId,
                from, to, isArmadaEmployee, referralCode, summarySubStatus, patientState, patientLastName, physicianLastName,
                inpTreatment, user.UserId, avgDays, insType, statProc,
                authCode, category, salesReferralUser, insuranceType,
                pharmacyReferral, registry, onLabel, source,
                timeToProcess, location, dateType, districtManager,
                refInProcess, strength, consignment, reportName: null, userType: user.UserType, offset: 0, isExport: true
                , ndc: ndc, referralType: referralType, prescriberFirstName: prescriberFirstName, prescriberLastName: prescriberLastName,
                drugName: drugName, reason:reason);
            var results = _reportRequestRepository.GetDetails(user.UserType, param);
            //var results = _reportRequestRepository.GetDetails(programId, aspnxId, programStatus, programSubStatus, state, dateRangeType, patientLastNameSrcQry ?? "%%",
            //    physicianLastNameSrcQry ?? "%%", dateToUse ?? "CreatedOn", fillingPharmacyId, regranexTubeQty, reportsTo, fillingCompanyId, priorAuth, excludeNonWorkDays, from, to, isArmadaEmployee,
            //    user.UserId, user.UserType, referralCode, summarySubStatus, daysToFill, patientState, patientLastName, physicianLastName, measureId, inpTreatment, avgDays, insType, statProc, authCode, category,
            //    salesReferralUser, insuranceType, pharmacyReferral, registry, onLabel, source, timeToProcess, location, dateType, districtManager, refInProcess, strength, consignment, 0, true);

            var exportResults = new List<Common.Models.DetailsExport>();
            foreach (var r in results.Data)
            {
                Common.ExcelUtility.AddDetailsRow(exportResults, r);
            }
            // _reportRequestRepository.ExportExcel(param, null);
            if (results.Data.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Details Report for " + programName + ".xlsx");
                    using (MemoryStream mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                return;
            }

            var grid = new System.Web.UI.WebControls.GridView();
            grid.DataSource = exportResults;

            grid.DataBind();

            foreach (TableCell cell in grid.HeaderRow.Cells)
            {
                cell.Text = cell.Text.Replace("_", " ").Replace("Percent", "%");
                cell.Style.Add("background-color", "#b5b1b1");
            }

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(Common.ExcelUtility.ToDataTable(results, user.UserType));
                Common.ExcelUtility.SetDateFormatColumns(results, wb, "Details Data");
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Details Report for " + programName + ".xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }

            //Response.ClearContent();
            //Response.AddHeader("content-disposition", "attachment; filename=Details Report for " + programName + ".xls");
            //Response.ContentType = "application/excel";
            //StringWriter sw = new StringWriter();
            //HtmlTextWriter htw = new HtmlTextWriter(sw);

            //grid.RenderControl(htw);

            //Response.Write(sw.ToString());

            //Response.End();
        }

        public ActionResult Analysis(int programId, string dateType, string inpTreatment, string dateTypeStr, string referralType = null, string strength = null)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            var user = UserInfoCookie.GetUserInfo();
            Extension.Helper.LogPageAccess(connectionString, Request, user);

            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var results = _reportRequestRepository.GetProgramSalesAnalysis(programId, user.UserId,
                user.UserType, isArmadaEmployee, dateType, inpTreatment, referralType, strength);
            //var results = new Repository.Repository(connectionString).GetProgramSalesAnalysis(programId, user.UserId,
            //    user.UserType, isArmadaEmployee, dateType, inpTreatment, referralType, strength);
            ViewData["referrals"] = results.Count == 0 ? "0"
                : results.Where(s => s.RegionName != null && s.RegionName.ToLower().Contains("total for")).Sum(s => s.TotalCount).ToString("##,###");
            ViewData["tomeperiod"] = dateTypeStr + ' ' + DateUtility.GetDateString(dateType);
            ViewData["dateType"] = dateType.Contains("qtd") ? "qtd" : dateType;
            ViewData["programId"] = programId;
            ViewData["referraltype"] = referralType;
            ViewData["excelurl"] = "/Details/ExportAnalysisExcel?programId=" + programId + "&dateType=" + dateType + "&inpTreatment=" + inpTreatment +
                "&dateTypeStr=" + dateTypeStr + (referralType == null ? "" : "&referralType=" + referralType) +
                (strength == null ? "" : "&strength=" + strength);
            return View(results);
        }

        public void ExportAnalysisExcel(int programId, string dateType, string inpTreatment, string dateTypeStr, string referralType = null, string strength = null)
        {
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            //var results = new Repository.Repository(connectionString).GetProgramSalesAnalysis(programId, user.UserId,
            //    user.UserType, isArmadaEmployee, dateType, inpTreatment, referralType, strength);
            var results = _reportRequestRepository.GetProgramSalesAnalysis(programId, user.UserId,
               user.UserType, isArmadaEmployee, dateType, inpTreatment, referralType, strength);
            var programName = _reportRequestRepository.GetProgramName(programId);

            var exportResults = new List<AnalysisExport>();
            //foreach (var r in results)
            //{
            //    exportResults.Add(new AnalysisExport
            //    {
            //        Region = r.RegionName,
            //        District_Manager = r.DistrictManagerName,
            //        Sales_Rep = r.SalesRepName,
            //        Area = r.SalesRepAreaName,
            //        Referrals = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName) ? "" : r.TotalCount.ToString(),
            //        Avg_Per_Rep = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName) ? "" : r.AvgPerRep.ToString(CultureInfo.InvariantCulture),
            //        Percent_District = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName) ? "" : r.PercentageDistrict + "%",
            //        Percent_Total = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName) ? "" : r.PercentageTotal + "%"
            //    });
            //}
            foreach (var r in results)
            {
                exportResults.Add(new AnalysisExport
                {
                    Region = r.RegionName,
                    District_Manager = r.DistrictManagerName,
                    Sales_Rep = r.SalesRepName,
                    Area = r.SalesRepAreaName,
                    Referrals = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName)
                    && string.IsNullOrEmpty(r.SalesRepName) && string.IsNullOrEmpty(r.SalesRepAreaName) && r.TotalCount == 0
                     && r.AvgPerRep == 0 && r.PercentageDistrict == 0 && r.PercentageTotal == 0 ? "" : r.TotalCount.ToString(),
                    Avg_Per_Rep = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName)
                    && string.IsNullOrEmpty(r.SalesRepName) && string.IsNullOrEmpty(r.SalesRepAreaName) && r.TotalCount == 0
                     && r.AvgPerRep == 0 && r.PercentageDistrict == 0 && r.PercentageTotal == 0 ? "" : r.AvgPerRep.ToString(CultureInfo.InvariantCulture),
                    Percent_District = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName)
                    && string.IsNullOrEmpty(r.SalesRepName) && string.IsNullOrEmpty(r.SalesRepAreaName) && r.TotalCount == 0
                     && r.AvgPerRep == 0 && r.PercentageDistrict == 0 && r.PercentageTotal == 0 ? "" : r.PercentageDistrict + "%",
                    Percent_Total = string.IsNullOrEmpty(r.RegionName) && string.IsNullOrEmpty(r.DistrictManagerName)
                    && string.IsNullOrEmpty(r.SalesRepName) && string.IsNullOrEmpty(r.SalesRepAreaName) && r.TotalCount == 0
                     && r.AvgPerRep == 0 && r.PercentageDistrict == 0 && r.PercentageTotal == 0 ? "" : r.PercentageTotal + "%"
                });
            }

            if (exportResults.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Analysis Report for " + programName + ".xlsx");
                    using (MemoryStream mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                return;
            }

            var grid = new System.Web.UI.WebControls.GridView();
            grid.DataSource = exportResults;

            grid.DataBind();

            foreach (TableCell cell in grid.HeaderRow.Cells)
            {
                cell.Text = cell.Text.Replace("_", " ").Replace("Percent", "%");
                cell.Style.Add("background-color", "#b5b1b1");
            }

            foreach (GridViewRow row in grid.Rows)
            {
                if (row.Cells[0].Text == "&nbsp;" && row.Cells[1].Text == "&nbsp;")
                {
                    foreach (TableCell cell in row.Cells)
                    {
                        cell.Style.Add("background-color", "#b5b1b1");
                    }
                }
            }

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(Common.ExcelUtility.ToDataTable(grid));

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Analysis Report for " + programName + ".xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }

            //Response.ClearContent();
            //Response.AddHeader("content-disposition", "attachment; filename=Analysis Report for " + programName + ".xls");
            //Response.ContentType = "application/excel";
            //StringWriter sw = new StringWriter();
            //HtmlTextWriter htw = new HtmlTextWriter(sw);

            //grid.RenderControl(htw);

            //Response.Write(sw.ToString());

            //Response.End();
        }

        [HttpGet]
        public JsonResult GetAspnNotes(int aspnrxId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetAspnNotes(aspnrxId, user.UserId, user.UserType, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAspnHistoy(int programId, int aspnrxId, string uiSearch)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetAspnHistory(aspnrxId, user.UserId, user.UserType, programId, uiSearch),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAspnStatusNotes(int programId, int aspnrxId, string uiSearch)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            return Json(new Repository.Repository(connectionString).GetAspnStatusNotes(aspnrxId, user.UserId, user.UserType, programId, uiSearch, isArmadaEmployee),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetReportRequest()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            //var reportRequestRepo = new ReportRequestRepository(connectionString);
            //var reportRequests = reportRequestRepo.GetReportRequests("AnalyticsUMP", user.UserId);
            var reportRequests = _reportRequestRepository.GetReportRequests("AnalyticsUMP", user.UserId);
            return Json(reportRequests, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public void DownloadReportByReportIdAndType(int reportId, string reportType)
        {
            System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                       Environment.NewLine + Environment.NewLine + "Get ReportRequest for download at " + DateTime.Now.ToLongTimeString() + " (" + reportId + ")");
            var reportRequest = _reportRequestRepository.GetReportById(reportId);
            System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                      Environment.NewLine + Environment.NewLine + "Got ReportRequest for download at " + DateTime.Now.ToLongTimeString() + " (" +
                      reportRequest.Id + ")");
            System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                       Environment.NewLine + Environment.NewLine + "Start download at " + DateTime.Now.ToLongTimeString() + " (" +
                       reportRequest.Id + ")");
            //if (!reportRequest.FileData.Any()) return;
            //System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
            //    Environment.NewLine + Environment.NewLine + "Get byte to string at " + DateTime.Now.ToLongTimeString() + " (" +
            //    reportRequest.Id + ")");
            //var textData = Encoding.ASCII.GetString(reportRequest.FileData);
            //System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
            //    Environment.NewLine + Environment.NewLine + "Got byte to string at " + DateTime.Now.ToLongTimeString() + " (" +
            //    reportRequest.Id + ")");
            //if (reportType.Equals("xlsx"))
            //{
            //    System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
            //        Environment.NewLine + Environment.NewLine + "Start download excel at " + DateTime.Now.ToLongTimeString() + " (" +
            //        reportRequest.Id + ")");
            //    using (var wb = new XLWorkbook())
            //    {
            //        wb.Worksheets.Add(Common.ExcelUtility.ToDataTableFromTextData(textData));
            //        Response.Clear();
            //        Response.Buffer = true;
            //        Response.Charset = "";
            //        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            //        Response.AddHeader("content-disposition",
            //            "attachment;filename=Details Report for " + reportRequest.FileName + ".xlsx");
            //        using (var mStream = new MemoryStream())
            //        {
            //            wb.SaveAs(mStream);
            //            mStream.WriteTo(Response.OutputStream);
            //            Response.Flush();
            //            Response.End();
            //        }
            //    }
            //    System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
            //        Environment.NewLine + "End download excel at " + DateTime.Now.ToLongTimeString() + " (" +
            //        reportRequest.Id + ")"+ Environment.NewLine);
            //}
            //else
            //{
            //    System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
            //        Environment.NewLine + Environment.NewLine + "Start download pdf at " + DateTime.Now.ToLongTimeString() + " (" +
            //        reportRequest.Id + ")");
            //    var path = Server.MapPath("~/PdfReport");
            //    if (!Directory.Exists(path))
            //    {
            //        Directory.CreateDirectory(path);
            //    }
            //    var fileName = path + reportRequest.FileName+".pdf";
            //    var document = new Document(PageSize.A2, 5f, 5f, 5f, 5f);
            //    try
            //    {
            //        PdfWriter.GetInstance(document, new FileStream(fileName, FileMode.Create));
            //        var totalLines = textData.Split('\n');
            //        var colCount = totalLines[0].Split('|').Length;
            //        var table = new PdfPTable(colCount)
            //        {
            //            TotalWidth = 3000f,
            //            LockedWidth = true,
            //            SpacingBefore = 5f
            //        };
            //        var widths = new float[colCount];
            //        for (var i = 0; i < colCount; i++)
            //        {
            //            widths[i] = 1f;
            //        }
            //        table.SetWidths(widths);
            //        table.HorizontalAlignment = 0;
            //        Common.PdfUtility.AddHeadersFromTextData(table, totalLines[0]);
            //        for (var row = 1; row < totalLines.Length - 1; row++)
            //        {
            //            Common.PdfUtility.AddRowFromTextData(table, totalLines[row]);
            //        }
            //        document.Open();
            //        document.Add(new Paragraph("Details Report for " + reportRequest.FileName,
            //            FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
            //        document.Add(new Paragraph("Number of Referrals: " + (totalLines.Length - 1).ToString("##,###"),
            //            FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
            //        document.Add(table);
            //    }
            //    catch (Exception)
            //    {
            //        // ignored
            //    }
            //    finally
            //    {
            //        var fileInfo = new FileInfo(fileName);
            //        document.Close();
            //        Response.ClearContent();
            //        Response.ClearHeaders();
            //        Response.AddHeader("Content-Disposition", "inline;filename=" + fileName);
            //        Response.AddHeader("Content-Length", fileInfo.Length.ToString());
            //        Response.ContentType = "application/pdf";
            //        Response.WriteFile(fileName);
            //        Response.Flush();
            //        Response.Clear();
            //        System.IO.File.Delete(fileName);
            //        System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
            //            Environment.NewLine + "End download pdf at " + DateTime.Now.ToLongTimeString() + " (" +
            //            reportRequest.Id + ")"+ Environment.NewLine);
            //    }
            //}
            //if (string.IsNullOrEmpty(reportRequest.DownloadedOn))
            //                _reportRequestRepository.OnDownloaded(reportId);
            //return;
            //if (reportType.Equals("xlsx"))
            //{
            //    if (reportRequest.FileData.Any())
            //    {
            //        using (var excelPackage = new ExcelPackage())
            //        {
            //            Response.ClearContent();
            //            Response.AddHeader("content-disposition", "attachment;filename=" + reportRequest.FileName+ ".xlsx");
            //            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            //            Response.BinaryWrite(reportRequest.FileData);
            //            Response.End();
            //            if (string.IsNullOrEmpty(reportRequest.DownloadedOn))
            //                _reportRequestRepository.OnDownloaded(reportId);
            //        }
            //    }
            //}
            //else
            //{
            //    if (reportRequest.FileData.Any())
            //    {
            //        Response.Clear();
            //        Response.ContentType = "application/pdf";
            //        Response.AddHeader("content-disposition", "attachment;filename=" + reportRequest.DownloadableFilePdf);
            //        Response.OutputStream.Write(reportRequest.PdfFile, 0, reportRequest.PdfFile.Length);
            //        Response.OutputStream.Flush();
            //        Response.OutputStream.Close();
            //        using (var mStream = new MemoryStream(reportRequest.FileData))
            //        {
            //            mStream.WriteTo(Response.OutputStream);
            //            Response.Flush();
            //            Response.End();
            //            if (string.IsNullOrEmpty(reportRequest.DownloadedOn))
            //                _reportRequestRepository.OnDownloaded(reportId);
            //        }

            //    }
            //} 
            var user = UserInfoCookie.GetUserInfo();
            var asembiaFilePath = Server.MapPath("~/AsembiaObj");
            if (!Directory.Exists(asembiaFilePath))
                Directory.CreateDirectory(asembiaFilePath);
            var selectedFile = asembiaFilePath + "\\" + reportRequest.FileName;
            if (System.IO.File.Exists(selectedFile))
            {
                var binaryData = System.IO.File.ReadAllBytes(selectedFile);
                var results = _reportRequestRepository.ByteArrayToObject(binaryData).CastTo<Common.Models.DetailsDataConfig>();
                if (reportType.Equals("xlsx"))
                {
                    var exportResults = new List<Common.Models.DetailsExport>();
                    foreach (var r in results.Data)
                    {
                        Common.ExcelUtility.AddDetailsRow(exportResults, r);
                    }

                    if (results.Data.Count == 0)
                    {
                        using (var wb = new XLWorkbook())
                        {
                            wb.Worksheets.Add("No Data Available");
                            Response.Clear();
                            Response.Buffer = true;
                            Response.Charset = "";
                            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                            Response.AddHeader("content-disposition", "attachment;filename=Details Report for " + reportRequest.DownloadableFile + ".xlsx");
                            using (var mStream = new MemoryStream())
                            {
                                wb.SaveAs(mStream);
                                mStream.WriteTo(Response.OutputStream);
                                Response.Flush();
                                Response.End();
                            }
                        }
                        return;
                    }
                    var grid = new GridView();
                    grid.DataSource = exportResults;
                    grid.DataBind();
                    foreach (TableCell cell in grid.HeaderRow.Cells)
                    {
                        cell.Text = cell.Text.Replace("_", " ").Replace("Percent", "%");
                        cell.Style.Add("background-color", "#b5b1b1");
                    }
                    using (var wb = new XLWorkbook())
                    {
                        wb.Worksheets.Add(Common.ExcelUtility.ToDataTable(results, user.UserType));
                        Common.ExcelUtility.SetDateFormatColumns(results, wb, "Details Data");
                        Response.Clear();
                        Response.Buffer = true;
                        Response.Charset = "";
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment;filename=Details Report for " + reportRequest.FileName + ".xlsx");
                        using (var mStream = new MemoryStream())
                        {
                            wb.SaveAs(mStream);
                            mStream.WriteTo(Response.OutputStream);
                            Response.Flush();
                            Response.End();
                        }
                    }
                    System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                          Environment.NewLine + Environment.NewLine + "End download excel at " + DateTime.Now.ToLongTimeString() + " (" +
                          reportRequest.Id + ")");
                }
                else
                {
                    var path = Server.MapPath("~/PdfReport");
                    if (!Directory.Exists(path))
                        Directory.CreateDirectory(path);
                    var fileName = path + "/Details Report For" + reportRequest.FileName + ".pdf";
                    var document = new Document(PageSize.A2, 5f, 5f, 5f, 5f);
                    try
                    {
                        PdfWriter.GetInstance(document, new FileStream(fileName, FileMode.Create));
                        var colCount = results.Config.Count(c => !c.Name.Contains("_btn_"));
                        var table = new PdfPTable(colCount);
                        table.TotalWidth = 1180f;
                        table.LockedWidth = true;
                        table.SpacingBefore = 5f;
                        var widths = new float[colCount];
                        for (var i = 0; i < colCount; i++)
                        {
                            widths[i] = 1f;
                        }
                        table.SetWidths(widths);
                        table.HorizontalAlignment = 0;

                        Common.PdfUtility.AddHeaders(table, results.Config, user.UserType);

                        foreach (var data in results.Data)
                        {
                            Common.PdfUtility.AddRow(table, data, results.Config, user.UserType);
                        }

                        document.Open();

                        document.Add(new Paragraph("Details Report for " + reportRequest.FileName, FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                        document.Add(new Paragraph("Number of Referrals: " + results.Data.Count.ToString("##,###"), FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                        document.Add(table);
                    }
                    catch
                    {

                    }
                    finally
                    {
                        var fileInfo = new FileInfo(fileName);
                        document.Close();
                        Response.ClearContent();
                        Response.ClearHeaders();
                        Response.AddHeader("Content-Disposition", "inline;filename=" + fileName);
                        Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        Response.ContentType = "application/pdf";
                        Response.WriteFile(fileName);
                        Response.Flush();
                        Response.Clear();
                        System.IO.File.Delete(fileName);
                    }
                    System.IO.File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                         Environment.NewLine + Environment.NewLine + "End download pdf at " + DateTime.Now.ToLongTimeString() + " (" +
                         reportRequest.Id + ")");
                }
            }

        }

        public ActionResult Index2()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            Extension.Helper.LogPageAccess(connectionString, Request, user);
            return View();
        }

        public ActionResult OrderDetails(int programId, int? aspnxId, int? fillingPharmacyId, int? fillingCompanyId, int? patientId, int? doctorId, int? ndc,
            string programStatus = null, string doctorState = null, string dateType = null, string physicianLastNameSrcQry = null, string from = null, string to = null,
            string divReport = null, string shipFrom = null, string shipTo = null)
        {
            if (!Request.IsAuthenticated)
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);

            if (!IsValidProgram(programId))
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);

            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            Extension.Helper.LogPageAccess(connectionString, Request, user);

            //var results1 = new Repository.Repository(connectionString).GetOrderDetails(programId, aspnxId, programStatus,
            //    doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
            //    isArmadaEmployee, patientId, doctorId, ndc, user.UserId, user.UserType, divReport, shipFrom, shipTo);
            var results = _reportRequestRepository.GetOrderDetails(programId, aspnxId, programStatus,
                doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
                isArmadaEmployee, patientId, doctorId, ndc, user.UserId, user.UserType, divReport, shipFrom, shipTo);
            var dates = Common.Extension.DateUtility.GetDates(dateType ?? "allreferrals", programId, connectionString);
            var fromDate = dates[0].Split('-')[1] + '/' + dates[0].Split('-')[2] + '/' + dates[0].Split('-')[0];
            var toDate = dates[1].Split('-')[1] + '/' + dates[1].Split('-')[2] + '/' + dates[1].Split('-')[0];

            var queryString = "?programId=" + programId + (aspnxId == null ? "" : " & aspnxId = " + aspnxId) + (fillingPharmacyId == null ? "" : " & fillingPharmacyId = " + fillingPharmacyId)
                       + (fillingCompanyId == null ? "" : "&fillingCompanyId=" + fillingCompanyId) + (programStatus == null ? "" : "&programStatus=" + programStatus)
                       + (patientId == null ? "" : "&patientId=" + patientId) + (physicianLastNameSrcQry == null ? "" : "&physicianLastNameSrcQry=" + physicianLastNameSrcQry)
                       + (doctorId == null ? "" : "&doctorId=" + doctorId) + (ndc == null ? "" : "&ndc=" + ndc) + (from == null ? "" : "&from=" + from) + (to == null ? "" : "&to=" + to)
                       + (doctorState == null ? "" : "&doctorState=" + doctorState) + (dateType == null ? "" : "&dateType=" + dateType) + (divReport == null ? "" : "&divReport=" + divReport)
                       + (shipTo == null ? "" : "&shipTo=" + shipTo) + (shipFrom == null ? "" : "&shipFrom=" + shipFrom);
            ViewData["excelurl"] = "/Details/ExportOrderDetails" + queryString;

            ViewData["divreport"] = divReport;
            ViewData["programId"] = programId;
            ViewData["patientid"] = patientId;
            ViewData["ndc"] = ndc;
            ViewData["fillingPharmacyId"] = fillingPharmacyId;
            ViewData["orders"] = results.Count.ToString("##,###");
            ViewData["status"] = programStatus;
            ViewData["aspndid"] = aspnxId;
            ViewData["state"] = doctorState;
            ViewData["fromdate"] = from ?? fromDate;
            ViewData["todate"] = to ?? toDate;
            ViewData["shipfromdate"] = shipFrom ?? fromDate;
            ViewData["shiptodate"] = shipTo ?? toDate;

            return View(results);
        }

        public ActionResult UniquePatientDetails(int programId, int? fillingPharmacyId, int? fillingCompanyId, int? patientId, string ndc,
            string programStatus = null, string doctorState = null, string dateType = null, string physicianLastNameSrcQry = null, string from = null, string to = null,
            string patientLastNameSrcQry = null, string chartDate = null)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            Extension.Helper.LogPageAccess(connectionString, Request, user);

            //var results1 = new Repository.Repository(connectionString).GetUniquePatientDetails(programId, programStatus,
            //    doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
            //    isArmadaEmployee, patientId, ndc, user.UserId, user.UserType, patientLastNameSrcQry);
            var results = _reportRequestRepository.GetUniquePatientDetails(programId, programStatus,
                doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
                isArmadaEmployee, patientId, ndc, user.UserId, user.UserType, patientLastNameSrcQry, chartDate);

            //var dates = Common.Extension.DateUtility.GetDates(dateType ?? "allreferrals", programId, connectionString);
            //var fromDate = dates[0].Split('-')[1] + '/' + dates[0].Split('-')[2] + '/' + dates[0].Split('-')[0];
            //var toDate = dates[1].Split('-')[1] + '/' + dates[1].Split('-')[2] + '/' + dates[1].Split('-')[0];

            var queryString = "?programId=" + programId + (fillingPharmacyId == null ? "" : " & fillingPharmacyId = " + fillingPharmacyId)
                       + (fillingCompanyId == null ? "" : "&fillingCompanyId=" + fillingCompanyId) + (programStatus == null ? "" : "&programStatus=" + programStatus)
                       + (patientId == null ? "" : "&patientId=" + patientId) + (physicianLastNameSrcQry == null ? "" : "&physicianLastNameSrcQry=" + physicianLastNameSrcQry)
                       + (ndc == null ? "" : "&ndc=" + ndc) + (from == null ? "" : "&from=" + from) + (to == null ? "" : "&to=" + to)
                       + (doctorState == null ? "" : "&doctorState=" + doctorState) + (dateType == null ? "" : "&dateType=" + dateType)
                       + (patientLastNameSrcQry == null ? "" : "&patientLastNameSrcQry=" + patientLastNameSrcQry)
                       + (chartDate == null ? "" : "&chartDate=" + chartDate);
            ViewData["excelurl"] = "/Details/UpDetailsExport" + queryString;

            ViewData["programId"] = programId;
            ViewData["patientid"] = patientId;
            ViewData["ndc"] = ndc;
            ViewData["fillingPharmacyId"] = fillingPharmacyId;
            ViewData["orders"] = results.Count.ToString("##,###");
            ViewData["status"] = programStatus;
            ViewData["state"] = doctorState;
            ViewData["fromdate"] = from ?? "";
            ViewData["todate"] = to ?? "";
            ViewData["physicianLastnamesrcqry"] = string.IsNullOrEmpty(physicianLastNameSrcQry) ? "" : physicianLastNameSrcQry.Replace("%", "");
            ViewData["physicianLastnamesrcqryoptr"] = string.IsNullOrEmpty(physicianLastNameSrcQry) ? "beginswith"
                    : physicianLastNameSrcQry.StartsWith("%") && physicianLastNameSrcQry.EndsWith("%") ? "contains"
                    : physicianLastNameSrcQry.StartsWith("%") ? "endswith" : "beginswith";


            return View(results);
        }

        public void ExportOrderDetails(int programId, int? aspnxId, int? fillingPharmacyId, int? fillingCompanyId, int? patientId, int? doctorId, int? ndc,
            string programStatus = null, string doctorState = null, string dateType = null, string physicianLastNameSrcQry = null, string from = null, string to = null,
            string divReport = null, string shipFrom = null, string shipTo = null)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var programName = _reportRequestRepository.GetProgramName(programId);
            //var results = new Repository.Repository(connectionString).GetOrderDetails(programId, aspnxId, programStatus,
            //    doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
            //    isArmadaEmployee, patientId, doctorId, ndc, user.UserId, user.UserType, divReport, shipFrom, shipTo);
            var results = _reportRequestRepository.GetOrderDetails(programId, aspnxId, programStatus,
                doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
                isArmadaEmployee, patientId, doctorId, ndc, user.UserId, user.UserType, divReport, shipFrom, shipTo);

            var exportResults = new List<Common.Models.OrderDetailsExport>();
            foreach (var r in results)
            {
                Common.ExcelUtility.AddOrderDetailsRow(exportResults, r);
            }

            if (exportResults.Count == 0)
            {
                using (var wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Order Details Report for " + programName + ".xlsx");
                    using (var mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                return;
            }

            var grid = new System.Web.UI.WebControls.GridView();
            grid.DataSource = exportResults;

            grid.DataBind();

            foreach (TableCell cell in grid.HeaderRow.Cells)
            {
                cell.Text = cell.Text.Replace("_", " ").Replace("Percent", "%");
                cell.Style.Add("background-color", "#b5b1b1");
            }

            using (var wb = new XLWorkbook())
            {
                wb.Worksheets.Add(ExcelUtility.ToDataTable(grid));
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Order Details Report for " + programName + ".xlsx");
                using (var mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public void UpDetailsExport(int programId, int? fillingPharmacyId, int? fillingCompanyId, int? patientId, string ndc,
            string programStatus = null, string doctorState = null, string dateType = null, string physicianLastNameSrcQry = null, string from = null, string to = null,
            string patientLastNameSrcQry = null, string chartDate = null)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var user = UserInfoCookie.GetUserInfo();
            var isArmadaEmployee = UserInfoCookie.IsArmadaEmployee(user);
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var programName = _reportRequestRepository.GetProgramName(programId);
            //var results1 = new Repository.Repository(connectionString).GetUniquePatientDetails(programId, programStatus,
            //    doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
            //    isArmadaEmployee, patientId, ndc, user.UserId, user.UserType, patientLastNameSrcQry);
            var results = _reportRequestRepository.GetUniquePatientDetails(programId, programStatus,
                doctorState, dateType, physicianLastNameSrcQry, fillingPharmacyId, fillingCompanyId, from, to,
                isArmadaEmployee, patientId, ndc, user.UserId, user.UserType, patientLastNameSrcQry, chartDate);
            var exportResults = new List<Common.Models.UpDetailsExport>();
            foreach (var r in results)
            {
                Common.ExcelUtility.AddUpDetailsRow(exportResults, r);
            }

            if (exportResults.Count == 0)
            {
                using (var wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Unique Patient Details Report for " + programName + ".xlsx");
                    using (var mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                return;
            }

            var grid = new System.Web.UI.WebControls.GridView();
            grid.DataSource = exportResults;

            grid.DataBind();

            foreach (TableCell cell in grid.HeaderRow.Cells)
            {
                cell.Text = cell.Text.Replace("_", " ").Replace("Percent", "%");
                cell.Style.Add("background-color", "#b5b1b1");
            }

            using (var wb = new XLWorkbook())
            {
                wb.Worksheets.Add(Common.ExcelUtility.ToDataTable(grid));

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Unique Patient Details Report for " + programName + ".xlsx");
                using (var mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public ActionResult GetDetailsReferralTimeToProcess(int programId, string location, string pa, string dateType,
            bool includeWeekends, int year, int month)
        {
            if (!Request.IsAuthenticated)
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            if (!IsValidProgram(programId))
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }

            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var result = _reportRequestRepository.GetDetailsReferralTimeToProcess(programId, location,
                pa, dateType, includeWeekends, year, month);

            var queryString = "?programId=" + programId + "&location=" + location + "&pa=" + pa + "&dateType=" +
                              dateType + "&includeWeekends=" + includeWeekends + "&year=" + year + "&month=" + month;

            ViewData["excelurl"] = "/Details/GetDetailsExportReferralTimeToProcess" + queryString;
            ViewData["referrals"] = result.Count.ToString("##,##0");

            return View(result);
        }

        public void GetDetailsExportReferralTimeToProcess(int programId, string location, string pa, string dateType,
            bool includeWeekends, int year, int month)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var result = _reportRequestRepository.GetDetailsReferralTimeToProcess(programId, location,
                pa, dateType, includeWeekends, year, month);

            if (result.Count == 0)
            {
                using (var wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Referral Time To Process.xlsx");
                    using (var mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                return;
            }

            using (var wb = new XLWorkbook())
            {
                wb.Worksheets.Add(Common.ExcelUtility.ToDataTable(result));
                ExcelUtility.SetDateFormatColumn(wb, "Referral Time To Process", 5);
                ExcelUtility.SetDateFormatColumn(wb, "Referral Time To Process", 6);
                ExcelUtility.SetDateFormatColumn(wb, "Referral Time To Process", 7);
                ExcelUtility.SetDateFormatColumn(wb, "Referral Time To Process", 8);

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Referral Time To Process.xlsx");
                using (var mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public ActionResult GetConsignmentDetails(int programId, string startDate, string endDate, bool isConsignment)
        {
            var result = _reportRequestRepository.GetConsignmentDetails(programId, startDate, endDate, isConsignment);
            ViewData["excelurl"] = "/Details/GetConsignmentDetailsExport?programId=" + programId + "&startDate=" + startDate +
                                   "&endDate=" + endDate + "&isConsignment=" + isConsignment;
            return View(result);
        }
        [HttpGet]
        public JsonResult GetPAActivity(int aspnrxId)
        {
            var results= _reportRequestRepository.GetPAActivity(aspnrxId);
            return Json(results,JsonRequestBehavior.AllowGet);
        }

        public void GetConsignmentDetailsExport(int programId, string startDate, string endDate, bool isConsignment, string exportUser = null, string exportUserEmail = null)
        {
            var results = _reportRequestRepository.GetConsignmentDetails(programId, startDate, endDate, isConsignment);

            if (results.Count == 0)
            {
                using (var wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Consignment Details.xlsx");
                    using (var mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
                return;
            }

            using (var wb = new XLWorkbook())
            {
                wb.Worksheets.Add(Common.ExcelUtility.ToConsignmentDataTable(results));

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Consignment Details.xlsx");
                using (var mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        //private Dictionary<string, string> GetReportsTo(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.ReportsToName_59_, Value = d.ReportToId }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetSalesReferral(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.ReferrerName_60_, Value = d.SalesReferralId }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetProgramStatus(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.ProgramStatus_53_, Value = d.ProgramStatus_53_ }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetProgramSubStatus(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.ProgramSubStatus_65_, Value = d.ProgramSubStatus_65_ }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetInsuranceTypes(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.InsuranceType_31_, Value = d.InsuranceTypeId }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetRegistryPatiens(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.RegistryPatient_85_, Value = d.RegistryPatient_85_ }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetOnLabels(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.OnLabel_86_, Value = d.OnLabel_86_ }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        //private Dictionary<string, string> GetSources(List<Details> details)
        //{
        //    var data = details.Select(d => new { Name = d.Source_75_, Value = d.Source_75_ }).Distinct();
        //    return data.OrderBy(d => d.Name).ToDictionary(d => d.Value, d => d.Name);
        //}

        private bool IsValidProgram(int programId)
        {
            var applicationId = ConfigurationManager.AppSettings["ApplicationId"];
            var user = UserInfoCookie.GetUserInfo();
            return _reportRequestRepository.GetPrograms(user.UserId, applicationId).Any();
        }

        private bool IsRequestQueueUser(string userId)
        {
            return !bool.Parse(ConfigurationManager.AppSettings["requestqueue:Configurable"]) ||
                ConfigurationManager.AppSettings["requestqueue:Users"].ToLower().Contains(userId.ToLower());
        }

        private string GetExcelExportUrl(string userId, int recordCount)
        {
            if (IsRequestQueueUser(userId))
            {
                if (recordCount < int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueSkip"]))
                    return "ExportExcel";
                if ((recordCount >= int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueSkip"])
                     && recordCount <= int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueWait"]))
                    &&
                    (new Repository.Repository(ConfigurationManager.ConnectionStrings["connString"].ConnectionString)
                      .GetWaitedRequests() > int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueMax"])))
                {
                    return "ExportExcel";
                }
                return "ReportRequest";
            }
            return "ExportExcel";
        }

        private string GetPdfExportUrl(string userId, int recordCount)
        {
            if (IsRequestQueueUser(userId))
            {
                if (recordCount < int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueSkip"]))
                    return "ExportPdf";
                if ((recordCount >= int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueSkip"])
                     && recordCount <= int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueWait"]))
                    &&
                    (new Repository.Repository(ConfigurationManager.ConnectionStrings["connString"].ConnectionString)
                      .GetWaitedRequests() > int.Parse(ConfigurationManager.AppSettings["requestqueue:QueueMax"])))
                {
                    return "ExportPdf";
                }
                return "ReportRequest";
            }
            return "ExportPdf";
        }
    }
}