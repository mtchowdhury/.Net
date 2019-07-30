using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.ReportRequestHandler.Models
{
    public class ReportRequest
    {
        public int Id { get; set; }
        public string Application { get; set; }
        public string UserId { get; set; }
        public string RequestedReport { get; set; }
        public int ProgramId { get; set; }
        public string ProgramName { get; set; }
        public string ReportType { get; set; }
        public int Status { get; set; }
        public string StatusString { get; set; }
        public string DownloadableFileExcel { get; set; }
        public string DownloadableFilePdf { get; set; }
        public string FileName { get; set; }
        public string DownloadableFileSizeExcel { get; set; }
        public string DownloadableFileSizePdf { get; set; }
        public string FileSize { get; set; }
        public string RequestedOn { get; set; }
        public string ProcessingStartedOn { get; set; }
        public string GeneratedOn { get; set; }
        public string DownloadedOn { get; set; }
        public string Parameters { get; set; }
        public byte[] ExcelFile { get; set; }
        public byte[] PdfFile { get; set; }
        public byte?[] FileData { get; set; }
        public string DownloadableFile { get; set; }
    }
}
