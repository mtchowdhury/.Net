    using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.SurveyMonkey.Model
{
    public class AnswersStatsByQuestion
    {
        public DateTime Week { get; set; }
        public Int64 NumberofRecords { get; set; }
        public string Answer { get; set; }

        public string WeekFormatted
        {
            get
            {
                return Week.ToString("MMM dd");
            }
        }
    }
}