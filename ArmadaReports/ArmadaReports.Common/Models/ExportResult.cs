using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common.Models
{
    public class ExportResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public ExportResult(bool success, string message)
        {
            Success = success;
            Message = message;
        }
    }
}
