using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AMMS.Repository.Interfaces;
using AMMS.Repository.Repositories;

namespace AMMS.HRMS.Api.MessageHandler
{
    public class ApiKeyHandler : DelegatingHandler
    {
        private IUserRepository _userRepository;

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (request.RequestUri.ToString().Contains("api/InvalidateCache") || request.RequestUri.ToString().Contains("api/Export")
                 || request.RequestUri.ToString().Contains("upload"))
                return await base.SendAsync(request, cancellationToken);
            var isValidApiKey = false;
            IEnumerable<string> apiHeader;
            IEnumerable<string> userHeader;

            var checkApiKeyExists = request.Headers.TryGetValues("ApiKey", out apiHeader);
            var checkUserExists = request.Headers.TryGetValues("User", out userHeader);
            if (!checkUserExists)
            {
                return request.CreateErrorResponse(HttpStatusCode.Forbidden, "User Not Found");

            }
            if (checkApiKeyExists)
            {
                _userRepository = new UserRepository(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString);
                var user = _userRepository.Get(int.Parse(int.Parse(userHeader.FirstOrDefault()).ToString()));
                if (apiHeader.FirstOrDefault() != null && apiHeader.FirstOrDefault().Equals(user.SecretKey) && DateTime.FromBinary(BitConverter.ToInt64(Convert.FromBase64String(apiHeader.FirstOrDefault()), 0)) > DateTime.UtcNow.AddHours(-24))
                {
                    isValidApiKey = true;
                }
            }

            if (!isValidApiKey) return request.CreateResponse(HttpStatusCode.Forbidden, "Bad API key");
            return await base.SendAsync(request, cancellationToken);
        }
    }
}