using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Models.Madventx;
using ArmadaReports.Web.Repository;
using CanvasJSChartPanel;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    public class MadventxController : Controller
    {
        private ChartDataRepository _chartDataRepository;

        public MadventxController()
        {
            _chartDataRepository = new ChartDataRepository();
        }

        public JsonResult GetMedvantxDeliveredVsExceptionOrderVolume(string period, string deliveryStatus)
        {
            ChartData chartData = new ChartData();

            List<MedvantxDeliveryModel> data = _chartDataRepository.MedvantxDeliveredVsExceptionOrderVolume(period, deliveryStatus);

            if (data.Count > 0)
            {
                if (deliveryStatus == "All")
                {
                    chartData.AddDataSeries(new DataSeries()
                    {
                        Type = "stackedColumn",
                        LegendText = "Delivered",
                        ShowInLegend = true,
                        ToolTipContent = "Total Volume: {customDecimalValue2}<br/>Delivered vol: {y}<br/>Exceptions vol: {customDecimalValue1}<br/>Delivered %: {customStringValue1}<br/>Exception %: {customStringValue2}",
                        DataPoints = data.Select(a => new DataPoint()
                        {
                            Label = a.FormattedDate(period),
                            //IndexLabel = a.DeliveredPercentage.ToString("F") + "%",
                            CustomStringValue1 = a.DeliveredPercentage.ToString("F") + "%",
                            CustomStringValue2 = a.ExceptionsPercentage.ToString("F") + "%",
                            CustomDecimalValue1 = a.ExceptionsVolume,
                            CustomDecimalValue2 = a.ExceptionsVolume + a.DeliveredVolume,
                            IndexLabel = a.DeliveredVolume.ToString(),
                            Y = a.DeliveredVolume
                        }).ToList()
                    });
                    chartData.AddDataSeries(new DataSeries()
                    {
                        Type = "stackedColumn",
                        LegendText = "Exceptions",
                        ShowInLegend = true,
                        ToolTipContent = "Total Volume: {customDecimalValue2}<br/>Delivered vol: {customDecimalValue1}<br/>Exceptions vol: {y}<br/>Delivered %: {customStringValue1}<br/>Exception %: {customStringValue2}",
                        DataPoints = data.Select(a => new DataPoint()
                        {
                            Label = a.FormattedDate(period),
                            //IndexLabel = a.ExceptionsPercentage.ToString("F") + "%",
                            CustomStringValue1 = a.DeliveredPercentage.ToString("F") + "%",
                            CustomStringValue2 = a.ExceptionsPercentage.ToString("F") + "%",
                            CustomDecimalValue1 = a.DeliveredVolume,
                            CustomDecimalValue2 = a.ExceptionsVolume + a.DeliveredVolume,
                            IndexLabel = a.ExceptionsVolume.ToString(),
                            Y = a.ExceptionsVolume
                        }).ToList()
                    });
                }
                else
                {
                    chartData.AddDataSeries(new DataSeries()
                    {
                        Type = "column",
                        LegendText = deliveryStatus,
                        ShowInLegend = true,
                        DataPoints = data.Select(a => new DataPoint()
                        {
                            Label = a.FormattedDate(period),
                            IndexLabel = a.Count.ToString(),
                            Y = a.Count
                        }).ToList()
                    });
                }
            }

            return Json(chartData.GetDataSeries(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMedvantxUPS48hrDeliveryOrderVolume(string period, string hoursFilter)
        {
            ChartData chartData = new ChartData();

            List<MedvantxDeliveryModel> data = _chartDataRepository.MedvantxUPS48hrDeliveryOrderVolume(period, hoursFilter);

            if (data.Count > 0)
            {
                chartData.AddDataSeries(new DataSeries()
                {
                    Type = "column",
                    LegendText = hoursFilter,
                    ShowInLegend = true,
                    DataPoints = data.Select(a => new DataPoint()
                    {
                        Label = a.FormattedDate(period),
                        IndexLabel = a.Count.ToString(),
                        Y = a.Count
                    }).ToList()
                });
            }

            return Json(chartData.GetDataSeries(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMedvantxUPS48hrDeliverySuccessRate(string period)
        {
            ChartData chartData = new ChartData();

            List<MedvantxPercentageModel> data = _chartDataRepository.MedvantxUPS48hrDeliverySuccessRate(period);

            if (data.Count > 0)
            {
                chartData.AddDataSeries(new DataSeries()
                {
                    Type = "line",
                    ToolTipContent = "{label}: {y}%",
                    DataPoints = data.Select(a => new DataPoint()
                    {
                        Label = a.FormattedDate(period),
                        IndexLabel = a.Percentage.ToString(),
                        Y = a.Percentage
                    }).ToList()
                });
            }

            return Json(chartData.GetDataSeries(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCleanPathFromBVDirectlyIntoScheduleDelivery(string period, string cleanBVFilter, bool excludeOnhold, bool excludeCancelled)
        {
            ChartData chartData = new ChartData();

            List<KaleoCycleReportModel> data = _chartDataRepository.CleanPathFromBVDirectlyIntoScheduleDelivery(period, cleanBVFilter, excludeOnhold, excludeCancelled);

            if (data.Count > 0)
            {
                chartData.AddDataSeries(new DataSeries()
                {
                    Type = "column",
                    LegendText = cleanBVFilter,
                    ShowInLegend = true,
                    DataPoints = data.Select(a => new DataPoint()
                    {
                        Label = a.FormattedDate(period),
                        IndexLabel = a.Average.ToString("F"),
                        Y = Math.Round(a.Average, 2)
                    }).ToList()
                });
            }

            return Json(chartData.GetDataSeries(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetIndirectPathFromBVDirectlyIntoAnyStatus(string period, string indirectFilter, bool excludeOnhold, bool excludeCancelled)
        {
            ChartData chartData = new ChartData();

            List<KaleoCycleReportModel> data = _chartDataRepository.IndirectPathFromBVDirectlyIntoAnyStatus(period, indirectFilter, excludeOnhold, excludeCancelled);

            if (data.Count > 0)
            {
                chartData.AddDataSeries(new DataSeries()
                {
                    Type = "column",
                    LegendText = indirectFilter,
                    ShowInLegend = true,
                    DataPoints = data.Select(a => new DataPoint()
                    {
                        Label = a.FormattedDate(period),
                        IndexLabel = a.Average.ToString("F"),
                        Y = Math.Round(a.Average, 2)
                    }).ToList()
                });
            }

            return Json(chartData.GetDataSeries(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVolumePercentOfCleanPathVSIndirectPath(string period, bool excludeOnhold, bool excludeCancelled)
        {
            ChartData chartData = new ChartData();

            List<KaleoCycleReportPercentageModel> data = _chartDataRepository.VolumePercentOfCleanPathVSIndirectPath(period, excludeOnhold, excludeCancelled);

            if (data.Count > 0)
            {
                chartData.AddDataSeries(new DataSeries()
                {
                    Type = "stackedColumn",
                    LegendText = "Clean Path",
                    ShowInLegend = true,
                    ToolTipContent = "{label}<br/>Volume: {y}<br/>Percentage: {indexLabel}",
                    DataPoints = data.Select(a => new DataPoint()
                    {
                        Label = a.FormattedDate(period),
                        IndexLabel = a.CleanPathPercentage.ToString("F") + "%",
                        Y = a.CleanPathVolume
                    }).ToList()
                });
                chartData.AddDataSeries(new DataSeries()
                {
                    Type = "stackedColumn",
                    LegendText = "Indirect Path",
                    ShowInLegend = true,
                    ToolTipContent = "{label}<br/>Volume: {y}<br/>Percentage: {indexLabel}",
                    DataPoints = data.Select(a => new DataPoint()
                    {
                        Label = a.FormattedDate(period),
                        IndexLabel = a.IndirectPathPercentage.ToString("F") + "%",
                        Y = a.IndirectPathVolume
                    }).ToList()
                });
            }

            return Json(chartData.GetDataSeries(), JsonRequestBehavior.AllowGet);
        }
    }
}