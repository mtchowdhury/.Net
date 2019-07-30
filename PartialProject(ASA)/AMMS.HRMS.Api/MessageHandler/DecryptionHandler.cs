using System;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace AMMS.HRMS.Api.MessageHandler
{
    public class DecryptionHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            if (request.RequestUri.ToString().Contains("api/InvalidateCache") || request.RequestUri.ToString().Contains("upload"))
                return await base.SendAsync(request, cancellationToken);
            var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY, AMMS.Common.Globals.SecurityConfig.IV);
            var nameValues = HttpUtility.ParseQueryString(HttpContext.Current.Request.QueryString.ToString());
            foreach (var key in HttpContext.Current.Request.QueryString.AllKeys)
            {
                nameValues.Set(key, encryption.DecodeFromBase64String(HttpContext.Current.Request.QueryString.Get(key).Replace(" ", "+")));
            }
            request.RequestUri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path) + "?" + nameValues);
            return await base.SendAsync(request, cancellationToken);
        }

        private string ReconstructUrl(string url)
        {
            var encryption = new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY, AMMS.Common.Globals.SecurityConfig.IV);
            var parts = url.Split('/');
            var originalParts = parts.Select(part => (!part.Contains("@@") ? part : encryption.DecodeFromBase64String(part.Replace("@@", "").Replace(" ", "+")))).ToList();

            return string.Join("/", originalParts);
        }
    }
}