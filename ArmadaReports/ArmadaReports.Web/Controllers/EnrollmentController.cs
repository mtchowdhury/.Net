using ArmadaReports.Web.Extension;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Export;
using ArmadaReports.Web.Repository;
using ClosedXML.Excel;
using iTextSharp.text;
using iTextSharp.text.pdf;
using ArmadaReports.Web.Helper;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class EnrollmentController : Controller
    {
        // GET: Enrollment
        public ActionResult PhysicianEnrollment(int programId, int begYear, string programName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;

            var user = UserInfoCookie.GetUserInfo();
            Extension.Helper.LogPageAccess(connectionString, Request, user);
            ViewData["programid"] = programId;
            ViewData["programname"] = programName;
            ViewData["year"] = begYear;

            var queryString = "?programId=" + programId + "&begYear=" + begYear + "&programName=" + programName;
            ViewData["pdfurl"] = "/Enrollment/PhysicianEnrollmentExportPdf" + queryString;
            ViewData["excelurl"] = "/Enrollment/PhysicianEnrollmentExportExcel" + queryString;

            var result = new Repository.Repository(connectionString).GetPatientEnrollment(programId, begYear, user.UserType, user.UserId);
            ViewData["count"] = (result.Count == 0 ? 0 : result.Count - 1).ToString("##,##0");

            var role = new UserRepository(connectionString).GetRoleByUser(user.UserId);
            var cipher = new UserRepository(connectionString).IsCipherUser(user.UserId);
            ViewData["usertype"] = role.UserType;
            ViewData["userid"] = user.UserId;
            ViewData["cipher"] = cipher;
            ViewData["userrolename"] = user.HasPrivilege;
            ViewData["isauviq"] = ConfigurationManager.AppSettings["Auviq"].Split('|')
                    .Any(u => u.ToLower().Equals(user.UserId.ToLower())) ? "1" : "0";

            return View(result);
        }

        public void PhysicianEnrollmentExportExcel(int programId, int begYear, string programName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var result = new Repository.Repository(connectionString).GetPatientEnrollment(programId, begYear, user.UserType, user.UserId);

            if (result.Count == 0)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add("No Data Available");

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=Patient Enrollments.xlsx");
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
                wb.Worksheets.Add(ExcelUtility.ToDataTable(result, begYear));

                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Patient Enrollments.xlsx");
                using (MemoryStream mStream = new MemoryStream())
                {
                    wb.SaveAs(mStream);
                    mStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }
            }
        }

        public void PhysicianEnrollmentExportPdf(int programId, int begYear, string programName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var user = UserInfoCookie.GetUserInfo();
            var result = new Repository.Repository(connectionString).GetPatientEnrollment(programId, begYear, user.UserType, user.UserId);

            var path = Server.MapPath("~/PDF");
            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }
            var fileName = path + "/Patient Enrollments By Physician_" + DateTime.Now.Ticks.ToString() + ".pdf";

            Document document = new Document(PageSize.A2, 5f, 5f, 5f, 5f);
            try
            {
                PdfWriter.GetInstance(document, new FileStream(fileName, FileMode.Create));
                var colCount = 21;
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

                PdfUtility.AddHeaders(table, begYear);

                foreach (var data in result)
                {
                    PdfUtility.AddRow(table, data);
                }

                document.Open();

                document.Add(new Paragraph("New Enrollments for " + programName + " (" + result.Count.ToString("##,##0") + " Physicians)", 
                    FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
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
    }
}