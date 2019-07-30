using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Models.Informix
{
    public class CallCenterStat
    {
        //public int Id { get; set; }
        //public string csq_name { get; set; }
        //public decimal call_skills { get; set; }
        //public decimal calls_presented { get; set; }
        //public decimal avg_queue_time { get; set; }
        //public decimal max_queue_time { get; set; }
        //public decimal calls_handled { get; set; }
        //public decimal avg_speed_answer { get; set; }
        //public decimal avg_handle_time { get; set; }
        //public decimal max_handle_time { get; set; }
        //public decimal calls_abandoned { get; set; }
        //public decimal avg_time_abandon { get; set; }
        //public decimal max_time_abandon { get; set; }
        //public decimal avg_calls_abandoned { get; set; }
        //public decimal max_calls_abandoned { get; set; }
        //public decimal calls_dequeued { get; set; }
        //public decimal avg_time_dequeue { get; set; }
        //public decimal max_time_dequeue { get; set; }
        //public decimal calls_handled_by_other { get; set; }
        //public decimal latestsynchtime { get; set; }
        //public string stat_date { get; set; }
        //public string date_type { get; set; }
        //public string date_frequency { get; set; }

        public double AdCallsPresented { get; set; }
        public double AdCallsHandled { get; set; }
        public double AdAvgSpeedAnswer { get; set; }
        public double AdAvgHandledTime { get; set; }
        public double AdCallsAbandoned { get; set; }

        public double HlCallsPresented { get; set; }
        public double HlCallsHandled { get; set; }
        public double HlAvgSpeedAnswer { get; set; }
        public double HlAvgHandledTime { get; set; }
        public double HlCallsAbandoned { get; set; }

        public string StateDate { get; set; }
        public string DateType { get; set; }
        public string DateFrequency { get; set; }
    }
}