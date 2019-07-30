using System;
using System.Net;
using System.Net.Mail;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models;
using ClosedXML.Excel;

namespace ArmadaReports.Web.MailHelper
{
    public class MailManager
    {
        private string _smtp;
        private int _port;
        private string _from;
        private string _template;
        private string _replySubject;
        private string _replyBody;

        public MailManager(string smtp, int port, string from, string template, string replySubject, string replyBody)
        {
            _smtp = smtp;
            _port = port;
            _from = from;
            _template = template;
            _replyBody = replyBody;
            _replySubject = replySubject;
        }

        public MessageResult Send(MailConfig mailConfig, MailTemplateModel mailTemplate)
        {
            using (var smtpClient = new SmtpClient(_smtp, _port))
            {
                try
                {
                    //var creds = new NetworkCredential(_emailSender, _smtpPassword);
                    smtpClient.UseDefaultCredentials = true;
                    smtpClient.EnableSsl = true;
                    var message = new MailMessage();
                    message.IsBodyHtml = true;
                    message.From = new MailAddress(mailTemplate.Email);
                    mailConfig.To.Split(';').ForEach(t => message.To.Add(t));
                    mailConfig.Cc.Split(';').ForEach(c => message.CC.Add(c));
                    message.Subject = mailTemplate.Subject;
                    message.Body = FormatTemplate(mailTemplate, _template);
                    smtpClient.Send(message);

                    return SendReply(smtpClient, mailTemplate);
                }
                catch (Exception exception)
                {
                    return new MessageResult(false, exception.Message);
                }
            } 
        }

        public MessageResult SendReply(SmtpClient smtpClient, MailTemplateModel mailTemplate)
        {
            try
            {
                var message = new MailMessage();
                message.IsBodyHtml = true;
                message.From = new MailAddress(_from);
                message.To.Add(mailTemplate.Email);
                message.CC.Add(mailTemplate.ManagerEmail);
                message.Subject = _replySubject;
                message.Body = _replyBody.Replace("&lt;", "<")
                                         .Replace("&gt;", ">");
                smtpClient.Send(message);
                return new MessageResult(true, "Mail sent successfully");
            }
            catch (Exception exception)
            {
                return new MessageResult(false, exception.Message);
            }
        }

        private string FormatTemplate(MailTemplateModel templateModel, string template)
        {
            return template.ReplaceValue("FirstName", templateModel.FirstName)
                .ReplaceValue("LastName", templateModel.LastName)
                .ReplaceValue("ASPNID", templateModel.AspnId)
                .ReplaceValue("Email", templateModel.Email)
                .ReplaceValue("Description", templateModel.Description)
                .ReplaceValue("HCPFirstName", templateModel.HcpFirstName)
                .ReplaceValue("HCPLastName", templateModel.HcpLastName)
                .ReplaceValue("HCPOfficialContact", templateModel.HcpOfficialContact)
                .ReplaceValue("HCPPhone", templateModel.HcpPhone)
                .ReplaceValue("ManagerEmail", templateModel.ManagerEmail)
                .ReplaceValue("ManagerName", templateModel.ManagerName)
                .ReplaceValue("Address", templateModel.Address)
                .ReplaceValue("City", templateModel.City)
                .ReplaceValue("State", templateModel.State)
                .ReplaceValue("Zip", templateModel.Zip)
                .Replace("&lt;", "<")
                .Replace("&gt;", ">");
        }
    }
}