using ArmadaReports.Web.Models.ScoreCards;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ArmadaReports.Web.Models
{
    public class HomeIndexViewModel
    {
        public List<GetUserPrograms_Result> GetPrograms { get; set; }
        public int? ProgramId { get; set; }
        public int? PharmacyId { get; set; }
        public List<string> programs { get; set; }
        public List<SelectListItem> ProgramsList
        {
            get
            {
             return GetPrograms.Select(x => new SelectListItem()
                {
                    Value = x.ProgramName,
                    Text = x.ProgramName
                }).ToList();
            }
        }        
    }
}