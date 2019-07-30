using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models.Inventory;
using ArmadaReports.Web.SurveyMonkey;

namespace ArmadaReports.Web.Repository.Inventory
{
    public class InventoryReportRepository
    {
        private StoredProcedureService _storedProcedureService;

        public InventoryReportRepository()
        {
            _storedProcedureService = new StoredProcedureService(
                ConfigurationManager.ConnectionStrings["connString"].ConnectionString);
        }

        public List<InventoryPharmacyModel> GetInventoryPharmacies()
        {
            return _storedProcedureService.GetData<InventoryPharmacyModel>("[dbo].[InventoryPharmaciesGetAll]").ToList();
        }

        public List<DrugsModel> GetPharmacyInventoryReportDrugs()
        {
            return _storedProcedureService.GetData<DrugsModel>("[dbo].[PharmacyProductInventoryGetDrugs]").ToList();
        }

        public List<PharmacyInventoryReportModel> GetPharmacyInventoryReportData(string inventoryType)
        {
            var result = _storedProcedureService.GetData<PharmacyInventoryReportModel>("[dbo].[PharmacyInventoryReportGetDataByInventoryType]",
                new SqlParameter[] { new SqlParameter("@InventoryType", inventoryType) }).ToList();

            if (!result.Any())
            {
                AddFakeData(result);
            }

            return result;
        }

        private static void AddFakeData(List<PharmacyInventoryReportModel> result)
        {
            for (int i = 0; i < 2; i++)
            {
                result.Add(new PharmacyInventoryReportModel()
                {
                    DrugName = "Auvi-Q INJ 0.15mg",
                    PharmacyName = "Avella " + i,
                    UnitsFilledPreviousWeek = 15,
                    Less52WeekDating = 0,
                    Greater52AndLess54WeekDating = 10,
                    Greater54WeekDating = 10
                });

                result.Add(new PharmacyInventoryReportModel()
                {
                    DrugName = "Auvi-Q INJ 0.15mg",
                    PharmacyName = "Icore " + i,
                    UnitsFilledPreviousWeek = 0,
                    Less52WeekDating = 0,
                    Greater52AndLess54WeekDating = 5,
                    Greater54WeekDating = 5
                });

                result.Add(new PharmacyInventoryReportModel()
                {
                    DrugName = "Auvi-Q INJ 0.15mg",
                    PharmacyName = "Walmart " + i,
                    UnitsFilledPreviousWeek = null,
                    Less52WeekDating = null,
                    Greater52AndLess54WeekDating = null,
                    Greater54WeekDating = null
                });

                result.Add(new PharmacyInventoryReportModel()
                {
                    DrugName = "Auvi-Q INJ 0.3mg",
                    PharmacyName = "Avella " + i,
                    UnitsFilledPreviousWeek = 15,
                    Less52WeekDating = 0,
                    Greater52AndLess54WeekDating = 10,
                    Greater54WeekDating = 10
                });

                result.Add(new PharmacyInventoryReportModel()
                {
                    DrugName = "Auvi-Q INJ 0.3mg",
                    PharmacyName = "Icore " + i,
                    UnitsFilledPreviousWeek = 0,
                    Less52WeekDating = 0,
                    Greater52AndLess54WeekDating = 5,
                    Greater54WeekDating = 5
                });

                result.Add(new PharmacyInventoryReportModel()
                {
                    DrugName = "Auvi-Q INJ 0.3mg",
                    PharmacyName = "Walmart " + i,
                    UnitsFilledPreviousWeek = null,
                    Less52WeekDating = null,
                    Greater52AndLess54WeekDating = null,
                    Greater54WeekDating = null
                });
            }            
        }

        public List<PharmacyProductInventoryTableModel> GetPharmacyProductInventoryTableModelData(string pharmacy, string drugName, string week, string inventorytype)
        {
            return _storedProcedureService.GetData<PharmacyProductInventoryTableModel>("[dbo].[PharmacyProductInventoryByPharmacy]",
                        new SqlParameter[]
                        {
                            new SqlParameter("@Pharmacy", string.IsNullOrEmpty(pharmacy) ? DBNull.Value : (object)pharmacy),
                            new SqlParameter("@DrugName", drugName),
                            new SqlParameter("@Week", week),
                            new SqlParameter("@InventoryType", inventorytype)
                        }).ToList();
        }

        public List<WholesalerInventoryReportModel> GetWholesalerInventoryReportModelData()
        {
            return _storedProcedureService.GetData<WholesalerInventoryReportModel>("[dbo].[WholesalerInventoryReportGetData]").ToList();
        }

        public List<DrugsModel> GetWholesalerInventoryReportDrugs()
        {
            return _storedProcedureService.GetData<DrugsModel>("[dbo].[WholesalerInventoryGetDrugs]").ToList();
        }

        public List<WholesalerInventoryReportDetailTableModel> GetWholesalerInventoryReportDetailTableModelData(string wholesalerName, string drugName, string week)
        {
            return _storedProcedureService.GetData<WholesalerInventoryReportDetailTableModel>("[dbo].[WholesalerInventoryByWholesalerName]",
                        new SqlParameter[]
                        {
                            new SqlParameter("@WholesalerName", wholesalerName),
                            new SqlParameter("@DrugName", drugName),
                            new SqlParameter("@Week", week),
                        }).ToList();
        }

        public List<ExpirationReportModel> GetExpirationReportModelData(string inventoryType, string pharmacyName)
        {
            return _storedProcedureService.GetData<ExpirationReportModel>("[dbo].[ExpirationInventoryReportGetDataByInventoryTypeANdPharmacyName]",
                 new SqlParameter[]
                        {
                            new SqlParameter("@InventoryType", inventoryType),
                            new SqlParameter("@PharmacyName", pharmacyName)
                        }).ToList();
        }

        public List<PharmacyProductInventoryTableModel> GetExceptionReportDetailTableModelData(string pharmacy, string drugName, string inventorytype, string expirationDate)
        {
            return _storedProcedureService.GetData<PharmacyProductInventoryTableModel>("[dbo].[ExpirationInventoryReportDetailedGetData]",
                        new SqlParameter[]
                        {
                            new SqlParameter("@PharmacyName", pharmacy),
                            new SqlParameter("@DrugName", drugName),
                            new SqlParameter("@InventoryType", inventorytype),
                            new SqlParameter("@ExpirationDate", string.IsNullOrEmpty(expirationDate) ? DBNull.Value : (object)DateTime.ParseExact(expirationDate, "MM/dd/yyyy", CultureInfo.InvariantCulture)),
                        }).ToList();
        }
    }
}