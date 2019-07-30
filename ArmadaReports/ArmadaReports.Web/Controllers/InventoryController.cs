using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using ArmadaReports.Web.Export;
using ArmadaReports.Web.Helper;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Models.Inventory;
using ArmadaReports.Web.Repository.Inventory;
using CanvasJSChartPanel;

namespace ArmadaReports.Web.Controllers
{
    public class InventoryController : BaseController
    {
        private int InventoryColumnsCount = int.Parse(ConfigurationManager.AppSettings["InventoryPanelsColumnsCount"]);
        private const string ExcelContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        private const string FileNameDateTimeFormat = "MM/dd/yyyy_HH_mm";

        private InventoryReportRepository inventoryReportRepository;
        public InventoryController()
        {
            inventoryReportRepository = new InventoryReportRepository();
            InitColumns();
        }

        private void InitColumns()
        {
            ViewBag.InventoryColumnsCount = InventoryColumnsCount;
            ViewBag.PharmacyInventoryColumns = GetPharmacyInventoryColumns();
            ViewBag.WholesalerInventoryColumns = GetWholesalerInventoryColumns();
        }

        private List<TableDataColumn> GetWholesalerInventoryColumns()
        {
            var result = new List<TableDataColumn>()
            {
                new TableDataColumn()
                {
                    Title = " ",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Wholesaler"}
                    }
                },
                new TableDataColumn()
                {
                    Title = "Auvi-Q Inj 0.15mg (Cartons)",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Stock On-Hand"},
                        new TableDataColumn() {Title = "≤ 52 week Dating"},
                        new TableDataColumn() {Title = "> 52 Week ≤ 54 Week Dating"},
                        new TableDataColumn() {Title = ">54 Week Dating"},
                    }
                },
                new TableDataColumn()
                {
                    Title = "Auvi-Q Inj 0.1mg (Cartons)",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Stock On-Hand"},
                        new TableDataColumn() {Title = "≤ 52 week Dating"},
                        new TableDataColumn() {Title = "> 52 Week ≤ 54 Week Dating"},
                        new TableDataColumn() {Title = ">54 Week Dating"},
                    }
                }
            };

            if (InventoryColumnsCount == 3)
            {
                result.Add(new TableDataColumn()
                {
                    Title = "Auvi-Q Inj 0.3mg (Cartons)",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Stock On-Hand"},
                        new TableDataColumn() {Title = "≤ 52 week Dating"},
                        new TableDataColumn() {Title = "> 52 Week ≤ 54 Week Dating"},
                        new TableDataColumn() {Title = ">54 Week Dating"},
                    }
                });
            }

            return result;
        }

        private List<TableDataColumn> GetPharmacyInventoryColumns()
        {
            var result = new List<TableDataColumn>()
            {
                new TableDataColumn()
                {
                    Title = " ",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Pharmacy"}
                    }
                },
                new TableDataColumn()
                {
                    Title = "Auvi-Q Inj 0.15mg (Cartons)",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Units Filled Previous Week"},
                        new TableDataColumn() {Title = "≤ 52 week Dating"},
                        new TableDataColumn() {Title = "> 52 Week ≤ 54 Week Dating"},
                        new TableDataColumn() {Title = ">54 Week Dating"},
                    }
                },
                new TableDataColumn()
                {
                    Title = "Auvi-Q Inj 0.1mg (Cartons)",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Units Filled Previous Week"},
                        new TableDataColumn() {Title = "≤ 52 week Dating"},
                        new TableDataColumn() {Title = "> 52 Week ≤ 54 Week Dating"},
                        new TableDataColumn() {Title = ">54 Week Dating"},
                    }
                }
            };

            if (InventoryColumnsCount == 3)
            {
                result.Add(new TableDataColumn()
                {
                    Title = "Auvi-Q Inj 0.3mg (Cartons)",
                    ChildColumns = new List<TableDataColumn>()
                    {
                        new TableDataColumn() {Title = "Units Filled Previous Week"},
                        new TableDataColumn() {Title = "≤ 52 week Dating"},
                        new TableDataColumn() {Title = "> 52 Week ≤ 54 Week Dating"},
                        new TableDataColumn() {Title = ">54 Week Dating"},
                    }
                });
            }

            return result;
        }


        // GET: Inventory
        public ActionResult Reports()
        {
            if (UserInfoCookie.GetUserInfo().IsKaleo == 1 && UserInfoCookie.GetUserInfo().KaleoUserType == 1)
            {
                List<InventoryPharmacyModel> inventoryPharmacies = inventoryReportRepository.GetInventoryPharmacies();
                var inventoryTypes = inventoryPharmacies.Select(o => o.InventoryType).Distinct().OrderByDescending(o => o).ToList();
                var pharmacies = inventoryPharmacies.Where(o => o.InventoryType == inventoryTypes.FirstOrDefault()).Select(o => o.PharmacyName).Distinct().OrderBy(o => o).ToList();
                pharmacies.Insert(0, "All");
                ViewBag.PharmacyNames = pharmacies;
                ViewBag.InventoryTypes = inventoryTypes;
                ViewBag.BaseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/";

                return View();
            }
            else
            {
                LogOff();
                return Redirect(ReadFromConfig.UnauthorizedRedirectUrl);
            }
        }

        public ActionResult GetPharmacyInventoryReport(string inventoryType)
        {
            List<PharmacyInventoryReportModel> reportModel = inventoryReportRepository.GetPharmacyInventoryReportData(inventoryType);

            List<Dictionary<string, string>> result = new List<Dictionary<string, string>>();

            var drugs = inventoryReportRepository.GetPharmacyInventoryReportDrugs();

            if (InventoryColumnsCount == 3 && drugs.Count == 2)
            {
                drugs.Add(new DrugsModel() { DrugName = drugs[drugs.Count - 1].DrugName + "$Copy"});
            }

            foreach (var pharmacy in reportModel.Select(o => o.PharmacyName).Distinct().ToList())
            {
                Dictionary<string, string> dictionary = new Dictionary<string, string>();
                dictionary.Add("Pharmacy", pharmacy);
                foreach (var drug in drugs)
                {
                    var drugInfo = reportModel.FirstOrDefault(o => o.PharmacyName == pharmacy && o.DrugName == drug.DrugName.Replace("$Copy", "")) ?? new PharmacyInventoryReportModel();
                    dictionary.Add("UnitsFilledPreviousWeek" + drug.DrugName, WrapToA(pharmacy, drug.DrugName, "UnitsFilledPreviousWeek", !drugInfo.UnitsFilledPreviousWeek.HasValue ? "&mdash;" : drugInfo.UnitsFilledPreviousWeek.Value.ToString()));                    
                    dictionary.Add("Less52WeekDating" + drug.DrugName, WrapToA(pharmacy, drug.DrugName, "Less52WeekDating", !drugInfo.Less52WeekDating.HasValue ? "&mdash;" : drugInfo.Less52WeekDating.Value.ToString()));
                    dictionary.Add("Greater52AndLess54WeekDating" + drug.DrugName, WrapToA(pharmacy, drug.DrugName, "Greater52AndLess54WeekDating", !drugInfo.Greater52AndLess54WeekDating.HasValue ? "&mdash;" : drugInfo.Greater52AndLess54WeekDating.Value.ToString()));
                    dictionary.Add("Greater54WeekDating" + drug.DrugName, WrapToA(pharmacy, drug.DrugName, "Greater54WeekDating", !drugInfo.Greater54WeekDating.HasValue ? "&mdash;" : drugInfo.Greater54WeekDating.Value.ToString()));
                }
                result.Add(dictionary);
            }
            return new JsonDataContractActionResult(result);
        }

        public ActionResult PharmacyInventoryDetail()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            ViewBag.QueryString = Request.Url.Query;
            ViewBag.BaseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/";
            ViewBag.IsExportDenied = !new Repository.ConfigRepository(connectionString).IsExportDenied(92);
            return View();
        }

        public ActionResult GetPharmacyInventoryReportDetail(string pharmacy, string drugName, string week,
            string inventorytype, bool excel = false)
        {
            if (string.IsNullOrEmpty(pharmacy) && string.IsNullOrEmpty(drugName) && string.IsNullOrEmpty(week))
                return new JsonDataContractActionResult(new List<PharmacyProductInventoryTableModel>());

            var data = inventoryReportRepository.GetPharmacyProductInventoryTableModelData(pharmacy, drugName, week,
                inventorytype);

            if (Request.IsLocal && data.Count == 0)
            {
                data.Add(new PharmacyProductInventoryTableModel()
                {
                    DrugName = "Test",
                    ExpDate = DateTime.Now,
                    ExpDateStr = "ExpDateStr",
                    InventoryType = "InventoryType",
                    LotNumber = "LotNumber",
                    OnHandCartons = 1,
                    Pharmacy = "Pharmacy"
                });
            }
        

            if (excel)
            {
                StreamExcelService<PharmacyProductInventoryTableModel> excelService = new StreamExcelService<PharmacyProductInventoryTableModel>();
                MemoryStream fileStream = excelService.GenerateExcel(data, "Pharmacy", "InventoryType", "DrugName", "LotNumber", "ExpDate", "OnHandCartons", "DateLoaded");
                var fileDownloadName = $"PharmacyInventoryReportDetail_{DateTime.Now.ToString(FileNameDateTimeFormat)}.xlsx";
                return new FileStreamResult(fileStream, ExcelContentType)
                {
                    FileDownloadName = fileDownloadName
                };
            }

            return new JsonDataContractActionResult(data);
        }

        public ActionResult GetWholesalerInventoryReport()
        {
            List<WholesalerInventoryReportModel> reportModel = inventoryReportRepository.GetWholesalerInventoryReportModelData();

            List<Dictionary<string, string>> result = new List<Dictionary<string, string>>();

            var drugs = inventoryReportRepository.GetWholesalerInventoryReportDrugs().Take(InventoryColumnsCount);

            foreach (var wholesalerName in reportModel.Select(o => o.WholesalerName).Distinct().ToList())
            {
                Dictionary<string, string> dictionary = new Dictionary<string, string>();
                dictionary.Add("WholesalerName", wholesalerName);
                foreach (var drug in drugs)
                {
                    var drugInfo = reportModel.FirstOrDefault(o => o.WholesalerName == wholesalerName && o.DrugName == drug.DrugName) ?? new WholesalerInventoryReportModel();
                    dictionary.Add("StockOnHand" + drug.DrugName, WrapToA(wholesalerName, drug.DrugName, "StockOnHand", !drugInfo.StockOnHand.HasValue ? "&mdash;" : drugInfo.StockOnHand.Value.ToString()));
                    dictionary.Add("Less52WeekDating" + drug.DrugName, WrapToA(wholesalerName, drug.DrugName, "Less52WeekDating", !drugInfo.Less52WeekDating.HasValue ? "&mdash;" : drugInfo.Less52WeekDating.Value.ToString()));
                    dictionary.Add("Greater52AndLess54WeekDating" + drug.DrugName, WrapToA(wholesalerName, drug.DrugName, "Greater52AndLess54WeekDating", !drugInfo.Greater52AndLess54WeekDating.HasValue ? "&mdash;" : drugInfo.Greater52AndLess54WeekDating.Value.ToString()));
                    dictionary.Add("Greater54WeekDating" + drug.DrugName, WrapToA(wholesalerName, drug.DrugName, "Greater54WeekDating", !drugInfo.Greater54WeekDating.HasValue ? "&mdash;" : drugInfo.Greater54WeekDating.Value.ToString()));
                }
                result.Add(dictionary);
            }
            return new JsonDataContractActionResult(result);
        }

        public ActionResult WholesalerInventoryDetail()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            ViewBag.QueryString = Request.Url.Query;
            ViewBag.BaseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/";
            ViewBag.IsExportDenied = !new Repository.ConfigRepository(connectionString).IsExportDenied(92);
            return View();
        }

        public ActionResult GetWholesalerInventoryReportDetail(string wholesaler, string drugName, string week, bool excel = false)
        {
            if (string.IsNullOrEmpty(wholesaler))
                return new JsonDataContractActionResult(new List<WholesalerInventoryReportDetailTableModel>());

            var data = inventoryReportRepository.GetWholesalerInventoryReportDetailTableModelData(wholesaler, drugName, week);

            if (excel)
            {
                StreamExcelService<WholesalerInventoryReportDetailTableModel> excelService = new StreamExcelService<WholesalerInventoryReportDetailTableModel>();
                MemoryStream fileStream = excelService.GenerateExcel(data, "WholesalerName", "ProductName", "LOTNumber", "ExpirationDate", "Location", "OnHandQty", "DateReported", "NDC");
                var fileDownloadName = $"WholesalerInventoryReportDetail_{DateTime.Now.ToString(FileNameDateTimeFormat)}.xlsx";
                return new FileStreamResult(fileStream, ExcelContentType)
                {
                    FileDownloadName = fileDownloadName
                };
            }

            return new JsonDataContractActionResult(data);
        }

        public ActionResult GetExpirationReport(string expirationInventoryType, string expirationPharmacyName)
        {
            List<ExpirationReportModel> reportModel = inventoryReportRepository.GetExpirationReportModelData(expirationInventoryType, expirationPharmacyName);

            List<Dictionary<string, string>> result = new List<Dictionary<string, string>>();
            var drugs = inventoryReportRepository.GetPharmacyInventoryReportDrugs();

            foreach (var expirationDate in reportModel.Select(o => o.ExpirationDate).Distinct().ToList())
            {
                Dictionary<string, string> dictionary = new Dictionary<string, string>();
                string expirationDateStr = expirationDate?.ToString("MM/dd/yyyy");
                dictionary.Add("ExpirationDate", expirationDateStr);
                foreach (var drug in drugs)
                {
                    var drugInfo = reportModel.FirstOrDefault(o => o.ExpirationDate == expirationDate && o.DrugName == drug.DrugName) ?? new ExpirationReportModel() { DrugName = drug.DrugName, ExpirationDate = expirationDate };
                    dictionary.Add("TotalPerDrug" + drug.DrugName, ExpirationReportWrapToA(drugInfo.TotalPerDrug.ToString(), drug.DrugName, expirationDateStr, drugInfo.IsLess52WeekDating, drugInfo.IsGreater52AndLess54WeekDating));
                }

                dictionary.Add("Total", reportModel.Where(o => o.ExpirationDate == expirationDate).Sum(o => o.TotalPerDrug).ToString());
                result.Add(dictionary);
            }


            return new JsonDataContractActionResult(result);
        }

        public ActionResult ExpirationDetail()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            ViewBag.QueryString = Request.Url.Query;
            ViewBag.BaseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/";
            ViewBag.IsExportDenied = !new Repository.ConfigRepository(connectionString).IsExportDenied(92);
            return View();
        }

        public ActionResult GetExpirationReportDetail(string pharmacy, string drugName, string inventorytype, string expirationDate, bool excel = false)
        {
            if (string.IsNullOrEmpty(pharmacy) && string.IsNullOrEmpty(drugName) && string.IsNullOrEmpty(inventorytype) && string.IsNullOrEmpty(expirationDate))
                return new JsonDataContractActionResult(new List<PharmacyProductInventoryTableModel>());

            var data = inventoryReportRepository.GetExceptionReportDetailTableModelData(pharmacy, drugName, inventorytype, expirationDate);

            if (excel)
            {
                StreamExcelService<PharmacyProductInventoryTableModel> excelService = new StreamExcelService<PharmacyProductInventoryTableModel>();
                MemoryStream fileStream = excelService.GenerateExcel(data, "Pharmacy", "InventoryType", "CountedOnDate", "DrugName", "LotNumber", "ExpDate", "OnHandCartons", "DateLoaded");
                var fileDownloadName = $"ExpirationReportDetail_{DateTime.Now.ToString(FileNameDateTimeFormat)}.xlsx";
                return new FileStreamResult(fileStream, ExcelContentType)
                {
                    FileDownloadName = fileDownloadName
                };
            }

            return new JsonDataContractActionResult(data);
        }

        public ActionResult GetPharmacyNames(string inventoryType)
        {
            List<InventoryPharmacyModel> inventoryPharmacies = inventoryReportRepository.GetInventoryPharmacies();
            var pharmacies = inventoryPharmacies.Where(o => o.InventoryType == inventoryType).Select(o => o.PharmacyName).Distinct().OrderBy(o => o).ToList();
            pharmacies.Insert(0, "All");

            return Json(pharmacies, JsonRequestBehavior.AllowGet);
        }

        private string WrapToA(string name, string drugName, string week, string value)
        {
            if (value != "&mdash;" && value != "0")
                return $"<span><a data-name='{name}' data-drug='{drugName}' data-week='{week}' href='javascript:;'>{value}</a></span>";
            return $"<span>{value}</span>";
        }

        private string ExpirationReportWrapToA(string value, string drugName, string expirationDate, bool isLess52WeekDating, bool isGreater52AndLess54WeekDating)
        {
            if (value != "0")
                return $"<a data-isless52weekdating='{isLess52WeekDating.ToString().ToLower()}' data-isgreater52andless54weekdating='{isGreater52AndLess54WeekDating.ToString().ToLower()}' data-drug='{drugName}' data-expiration='{expirationDate}' href='javascript:;'>{value}</a>";
            return value;
        }
    }
}