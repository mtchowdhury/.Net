using ArmadaReports.Web.Export;
using ArmadaReports.Web.Repository;
using ClosedXML.Excel;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class ReportController : BaseController
    {
        //
        // GET: /Report/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetRegistrationReport(string appId = "All")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            AnalyticUser user = UserInfoCookie.GetUserInfo();
            if (user != null && user.UserId != null)
            {
                if (appId == "All")
                {
                    var repo = new Repository.Repository(connectionString);
                    var apps = repo.GetFilterValuesByStrId("[analytics].[GetApplicationNames]", user.UserId);
                    if (apps.Count == 1)
                        appId = apps[0].Value;
                }

                var results = new ReportRepository(connectionString).GetRegistrationReportData(appId);


                var role = new UserRepository(connectionString).GetRoleByUser(user.UserId);
                var cipher = new UserRepository(connectionString).IsCipherUser(user.UserId);
                ViewData["usertype"] = role.UserType;
                ViewData["userid"] = user.UserId;
                ViewData["cipher"] = cipher;
                ViewData["userrolename"] = user.HasPrivilege;
                ViewData["isauviq"] = ConfigurationManager.AppSettings["Auviq"].Split('|')
                        .Any(u => u.ToLower().Equals(user.UserId.ToLower())) ? "1" : "0";

                Extension.Helper.LogPageAccess(connectionString, Request, user);

                ViewData["application"] = appId;
                ViewData["userid"] = user.UserId;
                ViewData["excelurl"] = "/Report/GetRegistrationReportExport?appId=" + appId;

                return View(results);
            }
            else
            {
                return RedirectToAction("UnAuthorized", "Account");
            }
        }

        public void GetRegistrationReportExport(string appId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results = new ReportRepository(connectionString).GetRegistrationReportData(appId);

            if (results.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Reports Data Report.xlsx");
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

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(ExcelUtility.ToDataTable(results));
                ExcelUtility.SetDateFormatColumn(wb, "Reports Data Report", 2);

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Reports Data Report.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public ActionResult GetSalesRepActivityReport(string programName = "All")
        {

            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();

            var results = new ReportRepository(connectionString).GetSalesRepActivity(programName);
            Extension.Helper.LogPageAccess(connectionString, Request, user);
            var programs = new Repository.Repository(connectionString).GetPrograms(user.UserId, ConfigurationManager.AppSettings["ApplicationId"]);
            ViewData["programs"] = programs.ToDictionary(p=>p.Name, p=>p.Name);
            ViewData["programname"] = programName;
            var program = programs.FirstOrDefault(p => p.Name.Equals(programName));
            ViewData["programid"] = program?.Id ?? -1;
            var userEmail = new ConfigRepository(connectionString).GetUserEmail(user.UserId);
            ViewData["useremail"] = userEmail;
            ViewData["excelurl"] = "/Report/GetSalesRepActivityReportExport?programName=" + programName;
            return View(results);
            //if (UserInfoCookie.GetUserInfo().UserType.Contains("PROGRAMMGR"))
            //{
            //    var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            //    var user = UserInfoCookie.GetUserInfo();

            //    var userEmail = new ConfigRepository(connectionString).GetUserEmail(user.UserId);
            //    if (programName.Equals("Afrezza") && (!userEmail.ToLower().Contains("afrezza") && !userEmail.ToLower().Contains("mannkindcorp")))
            //    {
            //        LogOff();
            //        return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //    }
            //    if ((programName.Equals("Auvi-Q") || programName.Equals("Evzio")) && !userEmail.ToLower().Contains("kaleo"))
            //    {
            //        LogOff();
            //        return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //    }

            //    var results = new ReportRepository(connectionString).GetSalesRepActivity(programName);
            //    Extension.Helper.LogPageAccess(connectionString, Request, user);
            //    ViewData["useremail"] = userEmail;
            //    ViewData["programname"] = programName;
            //    ViewData["excelurl"] = "/Report/GetSalesRepActivityReportExport?programName=" + programName;
            //    return View(results);
            //}
            //else
            //{
            //    LogOff();
            //    return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //}
        }

        public void GetSalesRepActivityReportExport(string programName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();

            //if (!user.UserType.Equals("PROGRAMMGR"))
            //{
            //    LogOff();
            //    Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //}


            var userEmail = new ConfigRepository(connectionString).GetUserEmail(user.UserId);
            //if (programName.Equals("Afrezza") && (!userEmail.ToLower().Contains("afrezza") && !userEmail.ToLower().Contains("mannkindcorp")))
            //{
            //    LogOff();
            //    Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //}
            //if ((programName.Equals("Auvi-Q") || programName.Equals("Evzio")) && !userEmail.ToLower().Contains("kaleo"))
            //{
            //    LogOff();
            //    Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            //}

            var results = new ReportRepository(connectionString).GetSalesRepActivity(programName);
            var isAfrezza = userEmail.ToLower().Contains("afrezza") || userEmail.ToLower().Contains("mannkindcorp");

            if (results.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Sales Rep Activity.xlsx");
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

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(ExcelUtility.ToDataTable(results, isAfrezza));
                if(!isAfrezza)
                    ExcelUtility.SetDateFormatColumn(wb, "Sales Rep Activity", 4);
                ExcelUtility.SetDateFormatColumn(wb, "Sales Rep Activity", isAfrezza ? 5 : 6);

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Sales Rep Activity.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public ActionResult GetNewRxByPhysician(int programId = -1)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            AnalyticUser user = UserInfoCookie.GetUserInfo();
            if (user != null && user.UserId != null)
            {

                var results = new ReportRepository(connectionString).GetNewRxByPhysician(programId, user.UserId, user.UserType);

                Extension.Helper.LogPageAccess(connectionString, Request, user);

                ViewData["programId"] = programId;
                ViewData["excelurl"] = "/Report/GetNewRxByPhysicianExport?programId=" + programId;

                return View(results);
            }
            else
            {
                return RedirectToAction("UnAuthorized", "Account");
            }
        }

        public void GetNewRxByPhysicianExport(int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            AnalyticUser user = UserInfoCookie.GetUserInfo();
            if (user != null && user.UserId != null)
            {

                var results = new ReportRepository(connectionString).GetNewRxByPhysician(programId, user.UserId, user.UserType);

                if (results.Rows.Count == 0)
                {
                    using (XLWorkbook wb = new XLWorkbook())
                    {
                        wb.Worksheets.Add("No Data Available");

                        Response.Clear();
                        Response.Buffer = true;
                        Response.Charset = "";
                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        Response.AddHeader("content-disposition", "attachment;filename=NewRx By Physician.xlsx");
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

                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(ExcelUtility.ToDataTable(results));

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=NewRx By Physician.xlsx");
                    using (MemoryStream mStream = new MemoryStream())
                    {
                        wb.SaveAs(mStream);
                        mStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
            else
            {
                LogOff();
                Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }
        }
    }
}