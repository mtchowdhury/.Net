using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Epipen
{
    public class NewRepeatCust
    {
        public string State { get; set; }
        public int New { get; set; }
        public int Repeat { get; set; }
        public int Customer { get; set; }
        public int TotalCustomer { get; set; }
        public double PerticipatedSchoolPecnt { get; set; }
        public double EnrollmentSchoolPecnt { get; set; }
        public double TotalEnrollmentSchoolPecnt { get; set; }
        public int Enrollment { get; set; }
        public string DdlBegDate { get; set; }
        public string DdlEndDate { get; set; }
    }
}