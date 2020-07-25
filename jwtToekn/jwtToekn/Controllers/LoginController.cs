using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Routing;
using jwtToekn.Filters;
using jwtToekn.Models;

namespace jwtToekn.Controllers
{
    public class LoginController : ApiController
    {
        [UserAuthenticationFilter]
        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public HttpResponseMessage Login(User user)
        {
            User u = new UserRepository.UserRepository().GetUser(user.Username);
            if (u == null)
                return Request.CreateResponse(HttpStatusCode.NotFound,
                    "The user was not found.");
            bool credentials = u.Password.Equals(user.Password);
            if (!credentials) return Request.CreateResponse(HttpStatusCode.Forbidden,
                "The username/password combination was wrong.");
            return Request.CreateResponse(HttpStatusCode.OK,
                TokenManager.GenerateToken(user.Username));
        }

        [HttpGet]
        [Route("validate")]
        public HttpResponseMessage Validate(string token, string username)
        {
            bool exists = new UserRepository.UserRepository().GetUser(username) != null;
            if (!exists) return Request.CreateResponse(HttpStatusCode.NotFound,
                "The user was not found.");
            string tokenUsername = TokenManager.ValidateToken(token);
            if (username.Equals(tokenUsername))
                return Request.CreateResponse(HttpStatusCode.OK);
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("JustTest")]
        public HttpResponseMessage Test(string token, string username)
        {
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Authorize]
        [HttpGet]
        [Route("JustTestAuth")]
        public HttpResponseMessage TestWithAuth()
        {
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
