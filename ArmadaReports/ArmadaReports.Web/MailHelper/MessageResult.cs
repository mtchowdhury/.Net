namespace ArmadaReports.Web.MailHelper
{
    public class MessageResult
    {
        public MessageResult(bool success, string message)
        {
            Success = success;
            Message = message;
        }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}