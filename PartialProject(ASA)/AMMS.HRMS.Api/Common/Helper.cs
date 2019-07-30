using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;

namespace AMMS.HRMS.Api.Common
{
    public static class Helper
    {
        public static string GetUser(HttpRequestHeaders headers)
        {
            IEnumerable<string> headerValues;
            var user = string.Empty;
            if (headers.TryGetValues("User", out headerValues))
                user = headerValues.FirstOrDefault();
            return user;
        }

        public static string GetEmployee(HttpRequestHeaders headers)
        {
            IEnumerable<string> headerValues;
            var emp = string.Empty;
            if (headers.TryGetValues("EmId", out headerValues))
                emp = headerValues.FirstOrDefault();
            return emp;
        }
    }
}