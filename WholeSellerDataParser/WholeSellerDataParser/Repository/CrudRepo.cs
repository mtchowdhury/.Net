using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WholeSellerDataParser.EDMX;
using FastMember;

namespace WholeSellerDataParser.Repository
{
   public class CrudRepo
   {
       private readonly string _connectionString;

       public CrudRepo()
       {
           _connectionString = ConfigurationManager.ConnectionStrings["connString"].ToString();
        }

        public T Add<T>(T entity) where T : class
        {
            using (var context = new AnalyticsEntities())
            {

                
                IDbSet<T> dbSet = context.Set<T>();
                dbSet.Add(entity);
                context.SaveChanges();
                return entity;
            }
        }

        public bool AddAll<T>(List<T> entityList) where T : class
        {
            using (var context = new AnalyticsEntities())
            {
                try
                {
                    IDbSet<T> dbSet = context.Set<T>();
                    foreach (var entity in entityList)
                    {
                        dbSet.Add(entity);
                      
                    }
                    context.SaveChanges();

                }
                catch (Exception ex)
                {

                    MessageBox.Show(ex.Message);
                }
               
                return true;
            }
        }


        public bool BulkAddSmiths(List<SmithDrug> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[SmithDrugs]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FcDate", "DcName", "DcDea", "FacName", "FacDea",
                                "Cwac", "Ccost", "Cqty", "SaleCr", "Contract",
                                "ContStart", "Ndc", "OldNdc", "Upc", "Upn", "Invoice", "Sdate", "Ctotal", "ProdName",
                                "ProdSize", "ProdString", "Filler", "UpDnChg", "Filler2",
                                "FacAcct", "VeItemnr", "Idate", "VerNr", "ChgNum", "Conversion", "Batch", "WholeSaler",
                                "WhCont", "MatchCoid", "MatchType", "ShipQty", "Cost",
                                "TotCost", "Wac", "ShipDate", "InvDate", "RecDate", "MmId", "Whid", "WrPid", "ItId",
                                "SaleCrw", "SaleCrsrc", "Extra"))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumns]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }
                    
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }
            
            return true;
        }


        public bool BulkAddValueDrugs(List<ValueDrug> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholeSaler].[ValueDrugs]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "DcName", "DcDea", "WholeSaler", "FacName", "FacDea",
                                "FacHin", "FacCity", "FacState", "FacAcct", "COrderDate",
                                "CShipDate", "CInvDate", "Invoice", "Vendor", "WhOEN", "NDC", "UPC", "VeItemNR", "ProdName",
                                "ProdForm", "ProdStrng", "ProdSize", "ProdUM", "ProdUD",
                                "OuterPK", "Cwac", "COrderQty", "CShipQty", "CCost", "CUPDNCHG", "CTotCost", "Contract",
                                "GPO", "CCHGDate", "CHGNum", "CCHGAmount", "CapRDate",
                                "PrivContr", "Special", "NetItem", "ReasonNS", "DropShip", "PONumber", "WhNotes", "Batch", "OderDate",
                                "ShipDate", "InvDate", "WAC", "OrderQty", "ShipQty", "Cost", "UpDnCHG", "TotCost", "ChgDate", "ChgAmount", "ApprDate",
                                "WhCont", "MatchCoid", "MatchType", "MMId", "ITId", "WHId", "WRPId", "SaleCR", "RecDate", "SaleCRW", "SaleCRSRC", "Extra"))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForValueDrugs]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }

        public bool BulkAddCardinal(List<Cardinal> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[Cardinal]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "DC_NAME", "DC_NR", "FAC_ACCT", "DC_DEA", "FAC_DEA",
                                "FAC_NAME", "WH_OEN", "NDC", "NDC13", "VENDOR",
                                "PROD_NAME", "GENERIC", "PROD_UD", "PROD_FORM", "PROD_STRNG", "ITEM_SIZE", "FILLER4", "INVOICE", "PROD_SIZE",
                                "FILLER5", "IDATE", "COST_PLLUS", "WAC", "AWP",
                                "AHFS", "GPO", "SDATE", "SHIP_QTY", "COST", "CONTRACT", "BATCH", "WHOLESALER",
                                "SALE_CR", "INV_DATE", "SHIP_DATE", "REC_DATE", "MMID",
                                "ITID", "WHID", "WRPID", "MATCH_COID", "MATCH_TYPE", "WH_CONT", "SALE_CRW", "SALE_CRSRC", "EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForCardinal]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }

        public bool BulkAddDakota(List<Dakota> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[Dakota]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "DC_NAME", "DC_DEA", "WHOLESALER", "FAC_NAME", "FAC_DEA",
                                "FAC_HIN", "FAC_CITY", "FAC_STATE", "FAC_ACCT", "ODATE",
                                "SDATE", "IDATE", "INVOICE", "VENDOR", "WH_OEN", "NDC", "UPC", "VE_ITEMNR", "PROD_NAME",
                                "PROD_FORM", "PROD_STRNG", "PROD_SIZE", "PROD_UM", "OUTER_PK",
                                "PROD_UD", "ITEM_SIZE", "AWP", "WAC", "ORDER_QTY", "SHIP_QTY", "COST", "UP_DN_CHG",
                                "TOT_COST", "CONTRACT", "SALE_CR", "CDATE", "CHG_NUM",
                                "CHG_AMOUNT", "ADATE", "PRIV_CONTR", "WH_SPEC", "NET_PR", "OMIT", "DROP_SHIP", "PO_NUMBER", "BATCH",
                                "WH_CONT", "MATCH_COID", "MATCH_TYPE", "ORDER_DATE", "SHIP_DATE", "INV_DATE", "INV_DATE", "CHG_DATE", "APPR_DATE",
                                "MMID", "ITID", "WHID", "WRPID", "SALE_CRW", "SALE_CRSRC", "EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForDakota]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddAmerisource(List<Amerisource> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[Amerisource]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "DC_NAME", "DC_DEA", "WHOLESALER", "FAC_NAME", "FAC_DEA",
                                "FAC_HIN", "FAC_CITY", "FAC_STATE", "FAC_ACCT", "SDATE",
                                 "IDATE", "INVOICE", "VENDOR", "WH_OEN", "NDC", "VE_ITEMNR", "PROD_NAME",
                                "PROD_FORM", "STR_QTY", "STR_CD", "SIZE_QTY", "SIZE_CD",
                                "PROD_UM", "PROD_UD", "AWP", "WAC", "ORDER_QTY", "SHIP_QTY", "COST", "UP_DN_CHG",
                                "TOT_COST", "WH_CONTID", "GPO", "CONTRACT", "PRIV_CONTR",
                                "WH_NOTES", "DROP_SHIP", "PO_NUMBER", "BATCH", "PROD_STRNG", "PROD_SIZE", "WH_CONT", "MATCH_COID", "MATCH_TYPE",
                                "SHIP_DATE", "INV_DATE", "REC_DATE", "MMID", "ITID", "WHID", "WRPID", "SALE_CR", "UPC",
                                "SALE_CRW", "SALE_CRSRC","EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForAmerisource]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }

        public bool BulkAddNcMutual(List<NcMutual> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[NcMutual]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "DC_NAME", "DC_DEA", "WHOLESALER", "FAC_NAME", "FAC_DEA",
                                "FAC_HIN", "FAC_CITY", "FAC_STATE", "FAC_ACCT", "ODATE",
                                 "SDATE", "IDATE", "INVOICE", "VENDOR", "WH_OEN", "NDC", "UPC", "VE_ITEMNR", "PROD_NAME",
                                "PROD_FORM", "PROD_STRNG", "PROD_SIZE", "PROD_UM", "OUTER_PACK",
                                "PROD_UD", "TOTAL_UNIT", "AWP", "WAC", "ORDER_QTY", "SHIP_QTY", "COST", "UP_DN_CHG",
                                "TOT_COST", "CONTRACT", "GPO", "CHG_DATE", "CHG_NUM",
                                "CHG_AMOUNT", "CHG_APPR", "PRIV_CONTR", "SOURCE", "NET_ITEM", "NOT_SHIP", "DROP_SHIP", "PO_NUMBER", "WH_NOTES",
                                "BATCH", "WH_CONT", "MATCH_COID", "MATCH_TYPE", "ORDER_DATE", "SHIP_DATE", "INV_DATE", "REC_DATE", "MMID",
                                "ITID", "WHID", "WRPID", "SALE_CR", "SALE_CRW", "SALE_CRSRC", "EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForNcMutual]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddBioCare(List<BioCare> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 5000;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[BioCare]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "CONTRACT", "CCOST", "FAC_NAME", "FAC_ACCT", "FAC_DEA",
                                "FAC_HIN", "FAC_CITY", "FAC_STATE", "WH_OEN", "DC_DEA",
                                 "DC_NAME", "DROP_SHIP", "FILLER1", "INV_DATE", "INVOICE", "NDC", "FILLER2", "CQTY", "SHIP_DATE",
                                "PROD_SIZE", "FILLER3", "CTOTCOST", "PROD_NAME", "PROD_UM",
                                "UP_DN_CHG", "VENDOR", "VE_ITEMNR", "WAC", "FILLER4", "WH_NOTES", "BATCH", "WHOLESALER",
                                "COST", "SHIP_QTY", "TOT_COST", "WH_CONT", "MATCH_COID",
                                "MATCH_TYPE", "REC_DATE", "MMID", "ITID", "WHID", "WRPID", "SALE_CR", "UPC", "SALE_CRW",
                                "SALE_CRSRC", "EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForBioCare]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public List<T> DeleteByProperty<T>(Expression<Func<T, bool>> predicate) where T : class
        {
            using (var context = new AnalyticsEntities())
            {
                IDbSet<T> dbSet = context.Set<T>();
                var entityList = dbSet.Where(predicate);
                foreach (var entity in entityList)
                {
                    dbSet.Remove(entity);
                }
                context.SaveChanges();
                return entityList.ToList();
            }
        }

        public bool DeleteAll<T>(List<T> entityList) where T : class
        {
            using (var context = new AnalyticsEntities())
            {
                IDbSet<T> dbSet = context.Set<T>();
                foreach (var entity in entityList)
                {
                    dbSet.Attach(entity);
                    dbSet.Remove(entity);
                }
                context.SaveChanges();
                return true;
            }
        }
    }
}
