using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace jwtToekn.Models
{
    public class User
    {
        public string Username { get; set; }
        public string  Password { get; set; }   

    }

    public enum UserRole
    {
        NORMAL,
        ADMIN
    }
}