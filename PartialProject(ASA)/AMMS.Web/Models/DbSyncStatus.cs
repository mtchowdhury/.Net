using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AMMS.Web.Models
{
    public class DbSyncStatus
    {
        public string Message { get; set; }
        public string StartTime { get; set; }
        public string Uploaded { get; set; }
        public string Downloaded { get; set; }
        public string CompletedTime { get; set; }
    }
}