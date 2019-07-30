using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Madventx
{
    public class MedvantxPercentageModel
    {
        public decimal Percentage { get; set; }
        public DateTime Date { get; set; }

        public string FormattedDate(string period)
        {
            switch (period)
            {
                case "Day":
                    return Date.ToString("MMM dd");
                case "Week":
                    return Date.ToString("MMM dd");
                case "Month":
                    return Date.ToString("MMM’yy ");
            }

            return Date.ToString();
        }
    }
}