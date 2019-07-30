using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.SurveyMonkey.Model
{
    public class AvgAnswerByQuestionType
    {
        public DateTime Week { get; set; }
        public string WeekFormatted
        {
            get
            {
                return Week.ToString("MMM dd");
            }
        }
        public double AVGAnswerValue { get; set; }
    }
}