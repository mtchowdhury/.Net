using System;

namespace ArmadaReports.Web.Models.NetworkCapacity
{
    public class NetworkCapacityData
    {
        public int AssignedCapacity { get; set; }
        public int TotalCapacity { get; set; }
        public int RemainingCapacity { get; set; }
        public int ProgramPharmacyCapacityID { get; set; }
        public string PharmacyName { get; set; }
        public int Capacity { get; set; }
        public DateTime Createdon { get; set; }
        public DateTime EffectiveDate { get; set; }

    }
}