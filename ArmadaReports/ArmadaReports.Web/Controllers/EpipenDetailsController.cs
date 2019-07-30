using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Export;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Repository.Epipen;
using ClosedXML.Excel;
using ArmadaReports.Web.Models.Epipen;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class EpipenDetailsController : Controller
    {
        // GET: EpipenDetails
        public ActionResult NewRepeatCustomersDetail(string inpCustomerCategory, string disneySchoolId, string state, int year, string zip, string schoolName, string schoolId, string releaseDate)
        {
            ViewData["year"] = year;
            ViewData["category"] = inpCustomerCategory;
            ViewData["zip"] = zip;
            ViewData["schoolid"] = schoolId;
            ViewData["state"] = state;
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            Extension.Helper.LogPageAccess(connectionString, Request, user);

            var results = new EpipenRepository(connectionString).GetNewRepeatCustomerDetails(inpCustomerCategory,
                disneySchoolId, state, year, zip, schoolName, schoolId, releaseDate);

            var exportUrl = "/EpipenDetails/ExportNewRepeatCustomersDetail?inpCustomerCategory=" + inpCustomerCategory +
                            "&disneySchoolId=" + disneySchoolId + "&state=" + state + "&year=" + year + "&zip=" + zip +
                            "&schoolName=" + schoolName + "&schoolId=" + schoolId + "&releaseDate=" + releaseDate;
            ViewData["excelurl"] = exportUrl;

            return View(results);
        }

        public void ExportNewRepeatCustomersDetail(string inpCustomerCategory, string disneySchoolId, string state, int year, string zip, string schoolName, string schoolId, string releaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results = new EpipenRepository(connectionString).GetNewRepeatCustomerDetails(inpCustomerCategory,
                disneySchoolId, state, year, zip, schoolName, schoolId, releaseDate);

            if (results.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=New Repeat Customer Report.xlsx");
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(results, year));

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=New Repeat Customer Report.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public ActionResult SchoolByStateDetails(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string releaseDate)
        {
            ViewData["begdate"] = begDate;
            ViewData["enddate"] = endDate;
            ViewData["category"] = inpCustomerCategory;
            ViewData["zip"] = schoolZip;
            ViewData["schoolid"] = schoolId;
            ViewData["state"] = state;
            ViewData["releasedate"] = releaseDate;
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            Extension.Helper.LogPageAccess(connectionString, Request, user);

            var results = new EpipenRepository(connectionString).GetSchoolByStateDetails(begDate, endDate, inpCustomerCategory,
                disneySchoolId, state, schoolZip, schoolId);

            var exportUrl = "/EpipenDetails/ExportSchoolByStateDetails?inpCustomerCategory=" + inpCustomerCategory +
                            "&disneySchoolId=" + disneySchoolId + "&state=" + state + "&schoolZip=" + schoolZip +
                            "&schoolId=" + schoolId + "&begDate=" + begDate + "&endDate=" + endDate + "&releaseDate=" + releaseDate;
            ViewData["excelurl"] = exportUrl;

            return View(results);
        }

        public void ExportSchoolByStateDetails(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string releaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results = new EpipenRepository(connectionString).GetSchoolByStateDetails(begDate, endDate, inpCustomerCategory, disneySchoolId, state, schoolZip, schoolId);
            var subResults = new EpipenRepository(connectionString).GetDetailsSchoolCounts(begDate, endDate,
                inpCustomerCategory, disneySchoolId, releaseDate, endDate, state, 5);

            var totalRow = subResults.FirstOrDefault(s => s.SchoolState.Equals("Grand Total:"));
            var revisedResults = subResults.Where(s => !s.SchoolState.Equals("Grand Total:")).ToList();
            revisedResults.Add(totalRow);

            if (results.Count == 0 && revisedResults.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Unique Total Count of School.xlsx");
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(revisedResults, releaseDate));
                wb.Worksheets.Add(ExcelUtility.ToDataTable(results, releaseDate));
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Order Details-By School State.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public ActionResult EpipenOrderDetails(string dateType, string begDate, string endDate, string orderBegDate, string orderEndDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string schoolName, int orderId, int batchId, string inpPharmacy, string inpDoctor, string inpContactName, string inpSearchOrderId, string releaseDate)
        {
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            ViewData["begdate"] = begDate;
            ViewData["enddate"] = endDate;
            ViewData["orderbegdate"] = orderBegDate;
            ViewData["orderenddate"] = orderEndDate;
            ViewData["category"] = inpCustomerCategory;
            ViewData["zip"] = schoolZip;
            ViewData["schoolid"] = schoolId;
            ViewData["schoolname"] = schoolName;
            ViewData["orderid"] = orderId;
            ViewData["batchid"] = batchId;
            ViewData["inppharmacy"] = inpPharmacy;
            ViewData["inpdoctor"] = inpDoctor;
            ViewData["inpcontactName"] = inpContactName;
            ViewData["inpsearchorderid"] = inpSearchOrderId;
            ViewData["state"] = state;
            ViewData["releasedate"] = releaseDate;
            ViewData["disneyschoolid"] = disneySchoolId;
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            var user = UserInfoCookie.GetUserInfo();
            Extension.Helper.LogPageAccess(connectionString, Request, user);

            var results = new EpipenRepository(connectionString).GetEpipenOrderDetails(begDate, endDate, inpCustomerCategory,
                disneySchoolId, state, schoolZip, schoolId, schoolName, orderId, batchId, inpPharmacy, inpDoctor, inpContactName, inpSearchOrderId);
            var subResults = new EpipenRepository(connectionString).GetOrderQtys(begDate, endDate, inpCustomerCategory, disneySchoolId, releaseDate, 5);

            var exportUrl = "/EpipenDetails/ExportEpipenOrderDetails?inpCustomerCategory=" + inpCustomerCategory + "&orderBegDate=" + orderBegDate + "&orderEndDate=" + orderEndDate +
                            "&disneySchoolId=" + disneySchoolId + "&state=" + state + "&schoolZip=" + schoolZip + "&releaseDate=" + releaseDate +
                            "&schoolId=" + schoolId + "&begDate=" + begDate + "&endDate=" + endDate + "&schoolName=" + schoolName + "&orderId=" + orderId + "&batchId=" + batchId +
                            "&inpPharmacy=" + inpPharmacy + "&inpDoctor=" + inpDoctor + "&inpContactName=" + inpContactName + "&inpSearchOrderId=" + inpSearchOrderId;
            ViewData["excelurl"] = exportUrl;

            return View(results.Take(5000).ToList());
        }

        public void ExportEpipenOrderDetails(string dateType, string begDate, string endDate, string orderBegDate, string orderEndDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string schoolName, int orderId, int batchId, string inpPharmacy, string inpDoctor, string inpContactName, string inpSearchOrderId, string releaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results = new EpipenRepository(connectionString).GetEpipenOrderDetails(begDate, endDate, inpCustomerCategory,
                disneySchoolId, state, schoolZip, schoolId, schoolName, orderId, batchId, inpPharmacy, inpDoctor, inpContactName, inpSearchOrderId);
            var subResults = new EpipenRepository(connectionString).GetOrderQtys(begDate, endDate, inpCustomerCategory, disneySchoolId, releaseDate, 5);

            var totalRow = subResults.FirstOrDefault(s => s.PrimaryColumn.Equals("Grand Total:"));
            var revisedResults = subResults.Where(s => !s.PrimaryColumn.Equals("Grand Total:")).ToList();
            revisedResults.Add(totalRow);

            if (results.Count == 0 && revisedResults.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Order Details Report.xlsx");
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(revisedResults, releaseDate));
                wb.Worksheets.Add(ExcelUtility.ToDataTable(results.Take(100000).ToList()));
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Order Details Report.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }
    }
}