using System;
using System.Configuration;
using System.IO;
using System.Net.Mail;

namespace WholesalerDataParser.Repository
{
    class MailManager
    {


        private string _smtp;
        private int _port;
        private string _from;
        private string _subject;
        private string _password;
        private string _requestedBy;

        public MailManager()
        {

        }

        public MailManager(string smtp, int port, string from, string subject, string password, string requestedBy)
        {
            _smtp = smtp;
            _port = port;
            _from = from;
            _subject = subject;
            _password = password;
            _requestedBy = requestedBy;
        }

        public bool Send( string email, string EmailBody, string attachmentFile)
        {
            using (var smtpClient = new SmtpClient(_smtp, _port))
            {
                try
                {
                    //smtpClient.UseDefaultCredentials = true;
                    smtpClient.Credentials = new System.Net.NetworkCredential(_from, _password);
                    smtpClient.EnableSsl = true;

                    var message = new MailMessage
                    {
                        IsBodyHtml = true,
                        From = new MailAddress(_from),
                        To = { email },
                        Subject = _subject 
                    };

                    message.Body = EmailBody;

                  //  var attachment = new Attachment(attachmentFile);
                  //  message.Attachments.Add(attachment);

                    smtpClient.Send(message);


                    return true;
                }
                catch (Exception exception)
                {

                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                      Environment.NewLine + "Email Eroor : " + exception.Message);

                    return false;
                }
            }
           
        }

    }
}
