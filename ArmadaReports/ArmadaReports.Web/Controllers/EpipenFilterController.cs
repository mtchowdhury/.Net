using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class EpipenFilterController : Controller
    {
        [HttpGet]
        public JsonResult GetSchoolZips(string inpCustomerCategory, string state)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetSchoolZips(inpCustomerCategory, state), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSchoolNames(string inpCustomerCategory, string state, string zip)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetSchoolNames(inpCustomerCategory, state, zip), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSchoolNamesStr(string inpCustomerCategory, string state, string zip, string schoolNameStr)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetSchoolNamesStr(inpCustomerCategory, state, zip, "%" + schoolNameStr + "%"), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetBatchIds(string state, string zip)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetBatchIds(state, zip), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetOrderIds(string state, string zip, string batchId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetOrderIds(state, zip, batchId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetOrderIdsStr(string state, string zip, string batchId, string orderId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetOrderIdsStr(state, zip, batchId, "%" + orderId + "%"), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPharmacies(string batchId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetPharmacies(batchId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDoctors(string orderId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetDoctors(orderId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetContacts(string state, string zip, string orderId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var repo = new Repository.Epipen.EpipenFilterRepository(connectionString);
            return Json(repo.GetContacts(state, zip, orderId), JsonRequestBehavior.AllowGet);
        }
    }
}