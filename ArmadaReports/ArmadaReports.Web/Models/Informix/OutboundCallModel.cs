using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class OutboundCallModel
    {
        //public DateTime DateTimeOriginal { get; set; }
        //public DateTime DateTimeConnect { get; set; }
        //public DateTime DateTimeDisconnect { get; set; }
        //public int Duration { get; set; }
        //public long CauseValue { get; set; }
        //public string PartyPattern { get; set; }
        public long McTotalCalls { get; set; }
        public long McDurationCause { get; set; }
        public long McCauseValue { get; set; }
        public long AcTotalCalls { get; set; }
        public long AcDurationCause { get; set; }
        public long AcCauseValue { get; set; }
        public DateTime Date { get; set; }
        public int WeekNumber { get; set; }
        public int MonthNumber { get; set; }
        public int Year { get; set; }
    }
}