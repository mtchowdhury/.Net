using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AMMS.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {


        public ActionResult Index()
        {
            return View();
        }

        


        public ActionResult SyncWidget()
        {
			return View();
		}
		
        public ActionResult Angview()
        {
            ViewBag.Message = "Your angular page";

            return View();
        }
    }
}