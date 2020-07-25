using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using jwtToekn.Models;

namespace jwtToekn.Filters
{
   
    public class UserAuthenticationFilter :AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if(SkipAuthorization(actionContext))return;
          var user=  actionContext.Request.Headers.GetValues("user").FirstOrDefault();
          var tk=  actionContext.Request.Headers.GetValues("token").FirstOrDefault();
          if (!SkipAuthorization(actionContext) && !Validate(tk, user))
          {
              actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
          }
           
        }
     private bool Validate(string token, string username)
        {
            bool exists = new UserRepository.UserRepository().GetUser(username) != null;
           // if (!exists) return Request.CreateResponse(HttpStatusCode.NotFound,
              //  "The user was not found.");
            string tokenUsername = TokenManager.ValidateToken(token);
            if (!username.Equals(tokenUsername)) 
                //return Request.CreateResponse(HttpStatusCode.OK);
           // return Request.CreateResponse(HttpStatusCode.BadRequest);
            return false;
            return true;
        }
     private static bool SkipAuthorization(HttpActionContext actionContext)
     {
         Contract.Assert(actionContext != null);
         return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
     }
    }
}