using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Export;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Repository;
using ArmadaReports.Web.Repository.Epipen;
using ClosedXML.Excel;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class EpipenChartController : Controller
    {
        [HttpGet]
        public JsonResult GetSchoolCounts(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, int totalAt = 5)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetSchoolCounts(begDate, endDate, inpCustomerCategory, disneySchoolId, inpStateReleaseDate, totalAt),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDetailsSchoolCounts(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, string date, string state, int totalAt = 5)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetDetailsSchoolCounts(begDate, endDate, inpCustomerCategory, disneySchoolId, inpStateReleaseDate, date, state, totalAt),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetNewRepeatCustomers(int year, string inpCustomerCategory, string disneySchoolId, string state, int totalAt = 5)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetNewRepeatCustomers(inpCustomerCategory, disneySchoolId, state, year, totalAt),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProductMix(string dateType, string inpCustomerCategory, string disneySchoolId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetProductMix(dateType, inpCustomerCategory, disneySchoolId),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetOrderQtys(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, int totalAt = 5)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetOrderQtys(begDate, endDate, inpCustomerCategory, disneySchoolId, inpStateReleaseDate, totalAt),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDetailsOrderQtys(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, string date, string state, int totalAt = 5)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetDetailsOrderQtys(begDate, endDate, inpCustomerCategory, disneySchoolId, inpStateReleaseDate, state, date, totalAt),
                JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetOrderMaps(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            return Json(new Repository.Epipen.EpipenRepository(connectionString).GetOrderMaps(begDate, endDate, inpCustomerCategory, disneySchoolId),
                JsonRequestBehavior.AllowGet);
        }

        public void GetNewRepeatCustomersExport(int year, string inpCustomerCategory, string disneySchoolId, string state)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results = new Repository.Epipen.EpipenRepository(connectionString).GetNewRepeatCustomers(inpCustomerCategory,
                    disneySchoolId, state, year, 5);
            var totalRow = results.FirstOrDefault(s => s.State.Equals("Grand Total:"));
            var revisedResults = results.Where(s => !s.State.Equals("Grand Total:")).ToList();
            revisedResults.Add(totalRow);

            if (revisedResults.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=New Repeat Customer Analysis.xlsx");
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(revisedResults, year));

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=New Repeat Customer Analysis.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public void NewRepeatCustomersDetailExport(string inpCustomerCategory, string disneySchoolId, string state, int year, string zip, string schoolName, string schoolId, string releaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results1 = new EpipenRepository(connectionString).GetNewRepeatCustomers(inpCustomerCategory,
                    disneySchoolId, state, year, 5);
            var totalRow = results1.FirstOrDefault(s => s.State.Equals("Grand Total:"));
            var revisedResults = results1.Where(s => !s.State.Equals("Grand Total:")).ToList();
            revisedResults.Add(totalRow);
            var results2 = new EpipenRepository(connectionString).GetNewRepeatCustomerDetails(inpCustomerCategory,
                disneySchoolId, state, year, zip, schoolName, schoolId, releaseDate);

            if (revisedResults.Count == 0 && results2.Count == 0)
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(revisedResults, year));
                wb.Worksheets.Add(ExcelUtility.ToDataTable(results2, year));

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

        public void GetSchoolCountsExport(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            var results = new EpipenRepository(connectionString).GetSchoolCounts(begDate, endDate,
                inpCustomerCategory, disneySchoolId, inpStateReleaseDate, 5);

            var totalRow = results.FirstOrDefault(s => s.SchoolState.Equals("Grand Total:"));
            var revisedResults = results.Where(s => !s.SchoolState.Equals("Grand Total:")).ToList();
            revisedResults.Add(totalRow);

            if (revisedResults.Count == 0)
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(revisedResults, inpStateReleaseDate));
                if(inpStateReleaseDate.Equals("ReleaseDate"))
                    ExcelUtility.SetDateFormatColumn(wb, "Unique School Count Summary", 1);
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
        }

        public void SchoolByStateDetailsExport(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string releaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var results = new EpipenRepository(connectionString).GetSchoolByStateDetails(begDate, endDate, inpCustomerCategory, disneySchoolId, state, schoolZip, schoolId);
            var subResults = new EpipenRepository(connectionString).GetSchoolCounts(begDate, endDate,
                inpCustomerCategory, disneySchoolId, releaseDate, 5);

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

                if (releaseDate.Equals("ReleaseDate"))
                    ExcelUtility.SetDateFormatColumn(wb, "Unique School Count Summary", 1);

                if (releaseDate.Equals("ReleaseDate"))
                    ExcelUtility.SetDateFormatColumn(wb, "Unique School Count Details", 1);
                ExcelUtility.SetDateFormatColumn(wb, "Unique School Count Details", 3);

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

        public void GetOrderQtysExport(string begDate, string endDate, string dateType, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var dates = DateUtility.GetDates(dateType);
            begDate = dateType.Equals("na") ? begDate : dates[0];
            endDate = dateType.Equals("na") ? endDate : dates[1];
            var results = new EpipenRepository(connectionString).GetOrderQtys(begDate, endDate, inpCustomerCategory, disneySchoolId, inpStateReleaseDate, 5);
            var totalRow = results.FirstOrDefault(s => s.PrimaryColumn.Equals("Grand Total:"));
            var revisedResults = results.Where(s => !s.PrimaryColumn.Equals("Grand Total:")).ToList();
            revisedResults.Add(totalRow);

            if (revisedResults.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Order Quantity Analysis.xlsx");
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(revisedResults, inpStateReleaseDate));
                if (inpStateReleaseDate.Equals("ReleaseDate"))
                    ExcelUtility.SetDateFormatColumn(wb, "Order Details Summary", 1);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Order Quantity Analysis.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public void EpipenOrderDetailsExport(string dateType, string begDate, string endDate, string orderBegDate, string orderEndDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string schoolName, int orderId, int batchId, string inpPharmacy, string inpDoctor, string inpContactName, string inpSearchOrderId, string releaseDate)
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

                if (releaseDate.Equals("ReleaseDate"))
                    ExcelUtility.SetDateFormatColumn(wb, "Order Details Summary", 1);

                ExcelUtility.SetDateFormatColumn(wb, "Order Details", 4);
                ExcelUtility.SetDateFormatColumn(wb, "Order Details", 7);

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