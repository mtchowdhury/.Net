using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using AMMS.Sync.Interfaces;
using AMMS.Sync.Models;
using AMMS.Web.Models;
using Microsoft.Synchronization;

namespace AMMS.Web.Controllers
{
    public class SyncController : Controller
    {
        private readonly IDbSyncService _dbSyncService;

        public SyncController(IDbSyncService dbSyncService)
        {
            _dbSyncService = dbSyncService;
        }

        public JsonResult SetRemoteProvision(string scope = null)
        {
            string message;
            _dbSyncService.CreateRemoteProvision(out message, scope);
            if (!string.IsNullOrEmpty(message))
                return Json(new DbSyncStatus { Message = message }, JsonRequestBehavior.AllowGet);
            return Json(new SyncStatus {Message = "Success"}, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetLocalProvision(string db, string scope = null)
        {
            string message;
            _dbSyncService.CreateLocalProvision(out message, ConfigurationManager.ConnectionStrings[db].ConnectionString, scope);
            if (!string.IsNullOrEmpty(message))
                return Json(new DbSyncStatus { Message = message }, JsonRequestBehavior.AllowGet);
            return Json(new SyncStatus { Message = "Success" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Start(string db, string direction, string scope = null)
        {
            var stat = _dbSyncService.Synchronize(GetSyncDirection(direction), ConfigurationManager.ConnectionStrings[db].ConnectionString, scope);
            return Json(new DbSyncStatus
            {
                Message = stat.Message,
                StartTime = stat.StartTime.ToString("dd-MM-yyyy hh:mm:ss"),
                Uploaded = stat.Uploaded,
                Downloaded = stat.Downloaded,
                CompletedTime = stat.CompletedTime.ToString("dd-MM-yyyy hh:mm:ss")
            }, JsonRequestBehavior.AllowGet);
        }

        private SyncDirectionOrder GetSyncDirection(string direction)
        {
            return direction.ToLower().Equals("upload") ? SyncDirectionOrder.Upload : SyncDirectionOrder.Download;
        }
    }
}
