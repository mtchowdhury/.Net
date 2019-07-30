namespace ArmadaReports.Web.Models.Informix
{
    public class CsqActivityModel
    {
        public string IdField { get; set; }
        public string CsqName { get; set; }
        public string CallSkills { get; set; }
        public string CallsPresented { get; set; }
        public string AvgQueueTime { get; set; }
        public string MaxQueueTime { get; set; }
        public string CallsHandled { get; set; }
        public string AvgSpeedAnswer { get; set; }
        public string AvgHandleTime { get; set; }
        public string MaxHandleTime { get; set; }
        public string CallsAbandoned { get; set; }
        public string AvgTimeAbandon { get; set; }
        public string MaxTimeAbandon { get; set; }
        public string AvgCallsAbondoned { get; set; }
        public string MaxCallsAbondoned { get; set; }
        public string CallDequeued { get; set; }
        public string AvgTimeDequeue { get; set; }
        public string MaxTimeDequeue { get; set; }
        public string CallsHandledByOthers { get; set; }
        public string LatestSyncTime { get; set; }
        public string AbandonmentRate { get; set; }
    }
}