using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Madventx
{
    public class MedvantxDeliveryModel
    {
        public long Count { get; set; }
        public decimal DeliveredPercentage { get; set; }
        public decimal ExceptionsPercentage { get; set; }
        public int DeliveredVolume { get; set; }
        public int ExceptionsVolume { get; set; }

        private DateTime _date;
        public DateTime Date
        {
            get
            {
                if (Month.HasValue && Year.HasValue)
                {
                    _date = new DateTime(Year.Value, Month.Value, 1);
                }

                return _date;
            }
            set { _date = value; }
        }

        public int? Month { get; set; }
        public int? Year { get; set; }

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