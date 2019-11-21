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
using WholesalerDataParser.EDMX;
using FastMember;
using System.IO;

namespace WholesalerDataParser.Repository
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

        public bool PreParsingProcess(int importTypeId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    SqlCommand cmd = new SqlCommand("[wholeSaler].[PreParsingProcess]", connection);

                    cmd.Parameters.Add("@importTypeId", SqlDbType.Int);
                    cmd.Parameters["@importTypeId"].Value = importTypeId;

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteReader();

                }
                catch (Exception ex)
                {
                   // File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);

                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);

                    return false;
                }
                finally
                {
                    connection.Close();
                }

                return true;


            }

        }
        public bool FileParsed(string importFilePath,DateTime importFileDateTime)
        {


            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    string query = "SELECT * FROM [wholesaler].[ImportLog] where importFilePath='" + importFilePath + "' and importFileDateTime='"+ importFileDateTime.ToString("dd-MMMM-yyyy HH:mm:ss") + "'";
                    SqlCommand cmd = new SqlCommand(query, connection);

                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.HasRows)
                    {
                        return true;
                    }

                    return false;
                }

                catch
                {
                    return true;
                }
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

                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                }

                return true;
            }
        }


        public bool InsertImportLog(int importTypeId, DateTime importFileDateTime, string importFilePath, int importFileRows)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    SqlCommand cmd = new SqlCommand("[wholeSaler].[InsertImportLog]", connection);

                    cmd.Parameters.Add("@importTypeId", SqlDbType.Int);
                    cmd.Parameters["@importTypeId"].Value = importTypeId;

                    cmd.Parameters.Add("@importFileDateTime", SqlDbType.DateTime);
                    cmd.Parameters["@importFileDateTime"].Value = importFileDateTime.ToString("dd-MMMM-yyyy HH:mm:ss");

                    cmd.Parameters.Add("@importFilePath", SqlDbType.VarChar);
                    cmd.Parameters["@importFilePath"].Value = importFilePath;

                    cmd.Parameters.Add("@importFileRows", SqlDbType.Int);
                    cmd.Parameters["@importFileRows"].Value = importFileRows;

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteReader();

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

                return true;


            }

        }


        public bool BulkAddAmerisource(List<Amerisource> datas)
        {


            int dd = datas.Count;

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                

                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
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
                                "SALE_CRW", "SALE_CRSRC", "EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }

                    }


                    SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForAmerisource]", connection);
                    cmd.CommandTimeout = 0;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteReader();



                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }


        public bool BulkAddAnda(List<Anda> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[Anda]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FAC_NAME", "FAC_DEA", "FAC_HIN", "FAC_CITY", "FAC_STATE", "ODATE",
                                                                "INV_DATE", "INVOICE", "VENDOR", "VE_ITEMNR", "NDC", "UPC", "PROD_NAME",
                                                                "PROD_FORM", "PROD_STRNG", "PROD_SIZE", "ORDER_QTY", "SHIP_QTY", "TOT_COST",
                                                                "FILLER1", "FILLER2", "CONTRACT", "GPO", "FILLER3", "BATCH", "WHID", "WRPID",
                                                                "WHOLESALER", "DC_NAME", "COST", "ORDER_DATE", "REC_DATE", "WH_CONT", "MATCH_COID",
                                                                "MATCH_TYPE", "SALE_CR", "MMID", "ITID", "SALE_CRW", "SALE_CRSRC", "EXTRA"))
                        {
                            sbCopy.WriteToServer(reader);
                        }

                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForAnda]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }



        public bool BulkAddASD(List<ASD> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[ASD]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FAC_ACCT", "FAC_NAME", "FAC_DEA", "FAC_HIN", "FAC_ADDR", "FAC_CITY", "FAC_STATE", "CNDC",
                                                                     "SHIP_QTY", "SDATE", "COST", "TOT_COST", "PROD_NAME", "VENDOR", "WH_OEN", "IDATE", "INVOICE",
                                                                     "CONTRACT", "FILLER2", "FILLER3", "FILLER4", "FILLER5", "PLASMA", "BATCH", "NDC", "WHID", "WRPID",
                                                                     "WHOLESALER", "INV_DATE", "SHIP_DATE", "REC_DATE", "WH_CONT", "MATCH_COID", "MATCH_TYPE", "SALE_CR",
                                                                     "MMID", "ITID", "SALE_CRW", "SALE_CRSRC", "EXTRA"))
                        {
                            sbCopy.WriteToServer(reader);
                        }

                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForASD]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
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
                        sbCopy.BulkCopyTimeout = 0;
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
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
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
                        sbCopy.BulkCopyTimeout = 0;
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
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }


        public bool BulkAddCardinal_W(List<Cardinal_W> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[Cardinal_W]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id","DC_NAME","DC_DEA","FAC_NAME","FAC_CITY","FAC_STATE","FAC_DEA","FAC_OLDDEA","FAC_HIN","FAC_OLDHIN","CWAC","CCOST","ITEM_SIZE","CSHIP_QTY","CTOT_COST"
                                                                ,"FILLER","SALE_CR","CONTRACT","FILLER1","NDC","OLD_NDC","UPC","OLD_UPC","UPN","OLD_UPN","INVOICE"
                                                                ,"IDATE","FILLER2","SDATE","PROD_NAME","PROD_SIZE","PROD_STRNG","FILLER3","FAC_ACCT","FILLER4","WH_OEN"
                                                                ,"VENDOR","FILLER5","FAC_ADDR","BATCH","WHOLESALER","WAC","COST","SHIP_QTY","TOT_COST","INV_DATE"
                                                                ,"SHIP_DATE","REC_DATE","MMID","ITID","WHID","WRPID","MATCH_COID","MATCH_TYPE","WH_CONT","SALE_CRW","SALE_CRSRC","EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForCardinal_W]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }


        public bool BulkAddCardinalSPD(List<CardinalSPD> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[CardinalSPD]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FILLER1", "CHG_AMOUNT", "CHG_DATE",
                                "CHG_NUM", "FILLER2",
                                "COST_TOT", "FAC_ACCT", "FAC_CITY", "FAC_DEA", "FAC_HIN",
                                 "FAC_NAME", "FILLER3", "PO_NUMBER", "FAC_STATE", "FILLER4", "FILLER5",
                                 "DROP_SHIP", "GPO", "INV_DATE",
                                "INVOICE", "NDC", "FILLER6", "ORDER_DATE", "FILLER7",
                                "PROD_FORM", "FILLER8", "PROD_STRNG", "FILLER9", "FILLER10", "SHIP_QTY",
                                "FILLER11",
                                 "FILLER12", "SHIP_DATE", "TOT_COST", "FILLER13", "PROD_NAME", "FILLER14",
                                 "FILLER15", "FILLER16", "VENDOR", "FILLER17", "FILLER18", "FILLER19",
                                 "FILLQR20", "FILLER21", "FILLER22", "FILLAR23", "BATCH", "COST",
                                 "WHID", "WRPID", "WHOLESALER", "DC_NAME", "REC_DATE", "WH_CONT",
                                 "MATCH_COID", "MATCH_TYPE", "SALE_CR", "MMID", "ITID", "SALE_CRW",
                                 "SALE_CRSRC", "EXTRA"

                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForCardinalSPD]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddCuraScript(List<CuraScript> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[CuraScript]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FAC_ACCT", "FAC_NAME", "FILLER1",
                                "FILLER2", "FAC_CITY",
                                "FAC_STATE", "FAC_ZIP", "FAC_DEA", "CONTRACT", "VENDOR",
                                 "PROD_NAME", "VE_ITEMNR", "LOT_NUMBER", "LOT_EXPR", "NDC", "WH_OEN",
                                 "INV_DATE", "INVOICE", "FILLER3",
                                "SHIP_QTY", "COST", "TOT_COST", "TOT_FEE", "BATCH",
                                "WH_CONT", "WHOLESALER", "MATCH_COID", "MATCH_TYPE", "REC_DATE", "MMID",
                                "ITID",
                                 "WHID", "WRPID", "SALE_CR", "SALE_CRW", "SALE_CRSRC", "EXTRA"

                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForCuraScript]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
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
                        sbCopy.BulkCopyTimeout = 0;
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
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddHdSmith(List<HDSmith> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[HDSmith]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FCDATE", "DC_NAME", "DC_DEA",
                                "FAC_NAME", "FAC_DEA",
                                "FAC_HIN", "FAC_CITY", "FAC_STATE", "CWAC", "CCOST",
                                 "CQTY", "SALE_CR", "CONTRACT", "CONT_START", "NDC", "OLD_NDC",
                                 "UPC", "UPN", "INVOICE",
                                "SDATE", "CTOTAL", "PROD_NAME", "PROD_SIZE", "PROD_STRNG",
                                "FILLER", "DC_NR", "FAC_ACCT", "WH_OEN", "VE_ITEMNR", "VENDOR",
                                "IDATE", "CONT_ALT", "CONVERSION", "CREDREBILL", "DISCOUNT", "BATCH", "WHOLESALER",
                                "WH_CONT", "MATCH_COID", "MATCH_TYPE", "SHIP_QTY", "COST", "TOT_COST", "WAC",
                                "SHIP_DATE", "INV_DATE", "REC_DATE", "MMID", "WHID", "WRPID", "ITID",
                                "SALE_CRW", "SALE_CRSRC", "EXTRA"

                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForHdSmith]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddKinray(List<Kinray> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[Kinray]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FAC_NAME", "NDC", "PROD_NAME",
                                "PROD_SIZE", "VENDOR",
                                "SHIP_QTY", "COST", "TOT_COST", "INVOICE", "IDATE",
                                 "GPO", "CONTRACT", "FAC_DEA", "FAC_ACCT", "VE_ITEMNR", "BATCH",
                                 "WHID", "WRPID", "WHOLESALER",
                                "DC_NAME", "INV_DATE", "REC_DATE", "WH_CONT", "MATCH_COID",
                                "MATCH_TYPE", "SALE_CR", "MMID", "ITID", "SALE_CRW", "SALE_CRSRC",
                                "EXTRA"

                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForKinray]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddMCkesson(List<MCKESSON> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[MCKESSON]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "WHOLESALER", "FAC_ACCT", "FAC_NAME",
                                "FAC_ADDR", "FAC_CITY",
                                "FAC_STATE", "FAC_ZIP", "FAC_DEA", "SHIP_DATE", "INV_DATE",
                                 "INVOICE", "PO_NUMBER", "VENDOR", "VE_ACCT", "VE_ITEMNR", "PROD_NAME",
                                 "DC_NR", "NDC", "UPC",
                                "FILLER01", "FILLER02", "FILLER03", "FILLER04", "PROD_FORM",
                                "GEN_ID", "GEN_NAME", "PROD_STRNG", "PROD_SIZE", "GEN_IND", "PROD_UM",
                                "FILLER05", "AWP",
                                "WAC", "ORDER_QTY", "SHIP_QTY", "COST", "TOT_COST",
                                "NEWEXTRA", "GPO", "CONTRACT", "LEAD_NAME", "REASON_NS", "WH_NOTES",
                                "CREDIT_CD", "REASON_DES", "CHG_AMOUNT",
                                "FILLER06", "FILLER07", "BATCH", "SALE_CR", "MMID", "ITID", "WRPID",
                                "DC_NAME", "WH_CONT",
                                "MATCH_COID", "MATCH_TYPE", "REC_DATE", "SALE_CRW", "SALE_CRSRC", "EXTRA"
                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForMCKESSON]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }
        public bool BulkAddMcKessonSP(List<McKessonSP> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[McKessonSP]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FILLER1", "FILLER2", "FILLER3",
                                "FILLER4", "CONTRACT",
                                "FILLER5", "FAC_ACCT", "FAC_CITY", "FAC_DEA", "FAC_HIN",
                                 "FAC_NAME", "FILLER6", "PO_NUMBER", "FAC_STATE", "DC_DEA", "DC_NAME",
                                 "FILLER7", "DROP_SHIP", "GPO",
                                "IDATE", "INVOICE", "NDC", "COST", "ODATE",
                                "OUTER_PK", "PROD_FORM", "PROD_SIZE", "PROD_STRNG", "PROD_UM", "ORDER_QTY",
                                "SHIP_QTY",
                                 "REASON_NS", "FILLER8", "SDATE", "TOT_COST", "FILLER9", "PROD_NAME",
                                 "PROD_UD", "UP_DN_CHG", "UPC", "VENDOR", "FILLER10", "VE_ITEMNR",
                                 "WAC", "FILLER11", "FILLER12", "WH_OEN", "FILLER13", "BATCH",
                                 "WHID", "WRPID", "WHOLESALER", "ORDER_DATE", "SHIP_DATE", "INV_DATE",
                                 "REC_DATE", "WH_CONT", "MATCH_COID", "MATCH_TYPE", "SALE_CR", "MMID",
                                 "ITID", "SALE_CRW",
                                 "SALE_CRSRC", "EXTRA"

                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForMcKessonSP]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }

        public bool BulkAddMorrisDickson(List<MorrisDickson> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[MorrisDickson]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FCDATE", "DC_NAME", "DC_DEA", "FAC_NAME", "FAC_DEA", "FAC_HIN", "FAC_CITY",
                                                          "FAC_STATE", "CWAC", "CCOST", "CQTY", "SALE_CR", "CONTRACT", "CONT_START", "NDC",
                                                          "OLD_NDC", "UPC", "UPN", "FILLER", "INVOICE", "SDATE", "CTOTAL", "PROD_NAME",
                                                          "PROD_SIZE", "PROD_STRNG", "DC_NR", "FAC_ACCT", "WH_OEN", "VE_ITEMNR", "FILLER1",
                                                          "VENDOR", "IDATE", "CHG_NUM", "CONVERSION", "CREDREBILL", "DISCOUNT", "BATCH",
                                                          "WHOLESALER", "WH_CONT", "MATCH_COID", "MATCH_TYPE", "SHIP_QTY", "COST", "TOT_COST",
                                                          "WAC", "SHIP_DATE", "INV_DATE", "REC_DATE", "MMID", "WHID", "WRPID", "ITID", "SALE_CRW", "SALE_CRSRC", "EXTRA"))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForMorrisDickson]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
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
                        sbCopy.BulkCopyTimeout = 0;
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
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }


        public bool BulkAddRDC(List<RDC> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[RDC]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FCDATE", "DC_NAME", "DC_DEA", "FAC_NAME", "FAC_DEA", "FAC_HIN", "FAC_CITY", "FAC_STATE", "CWAC",
                                                                    "CCOST", "CQTY", "SALE_CR", "CONTRACT", "CONT_START", "NDC", "OLD_NDC", "UPC", "UPN", "INVOICE", "SDATE",
                                                                    "CTOTAL", "PROD_NAME", "PROD_SIZE", "PROD_STRNG", "FILLER", "DC_NR", "FAC_ACCT", "WH_OEN", "VE_ITEMNR",
                                                                    "VENDOR", "IDATE", "CHG_NUM", "CONVERSION", "CREDREBILL", "DISCOUNT", "BATCH", "WHOLESALER", "WH_CONT",
                                                                    "MATCH_COID", "MATCH_TYPE", "SHIP_QTY", "COST", "TOT_COST", "WAC", "SHIP_DATE", "INV_DATE", "REC_DATE",
                                                                    "MMID", "WHID", "WRPID", "ITID", "SALE_CRW", "SALE_CRSRC", "EXTRA"))
                        {
                            sbCopy.WriteToServer(reader);
                        }

                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForRDC]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }





        public bool BulkAddRnS(List<RnSPharma> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[RnSPharma]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FAC_NAME", "FAC_ADDR", "FAC_CITY",
                                "FAC_STATE", "FAC_ZIP",
                                "FAC_DEA", "FAC_HIN", "FILLER1", "PROD_NAME", "CNDC",
                                 "INV_DATE", "INVOICE", "SHIP_QTY", "TOT_COST", "FILLER2", "BATCH",
                                 "COST", "NDC", "WHID",
                                "WRPID", "WHOLESALER", "REC_DATE", "CONTRACT", "WH_CONT",
                                "MATCH_COID", "MATCH_TYPE", "SALE_CR", "MMID", "ITID", "SALE_CRW",
                                "SALE_CRSRC", "EXTRA"

                                ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholesaler].[UpdateCalculatedColumnsForRnS]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }




        public bool BulkAddSmithDrugs(List<SmithDrug> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[SmithDrugs]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "FCDATE", "DC_NAME", "DC_DEA", "FAC_NAME", "FAC_DEA", "CWAC", "CCOST", "CQTY", "SALE_CR"
                                                                , "CONTRACT", "CONT_START", "NDC", "OLD_NDC", "UPC", "UPN", "INVOICE", "SDATE", "CTOTAL"
                                                                , "PROD_NAME", "PROD_SIZE", "PROD_STRNG", "FILLER", "UP_DN_CHG", "FILLER2", "FAC_ACCT"
                                                                , "VE_ITEMNR", "IDATE", "VEN_NR", "CHG_NUM", "CONVERSION", "BATCH", "WHOLESALER"
                                                                , "WH_CONT", "MATCH_COID", "MATCH_TYPE", "SHIP_QTY", "COST", "TOT_COST", "WAC"
                                                                , "SHIP_DATE", "INV_DATE", "REC_DATE", "MMID", "WHID", "WRPID", "ITID", "SALE_CRW", "SALE_CRSRC", "EXTRA"))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForSmithDrugs]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
                    return false;
                }
                finally
                {
                    connection.Close();
                }

            }

            return true;
        }




        public bool BulkAddValleyWholesale(List<ValleyWholesale> datas)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                try
                {
                    using (var sbCopy = new SqlBulkCopy(connection))
                    {
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholesaler].[ValleyWholesale]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "PDATE", "WHOLESALER", "DC_DEA", "FAC_NAME", "FAC_DEA", "CWAC",
                                            "CCOST", "CQTY", "SALE_CR", "CONTRACT", "PROD_CODE", "NDC", "INVOICE", "SDATE", "CTOT_COST",
                                            "PROD_NAME", "DI", "UP_CHARGE", "DIVISION", "FAC_ACCT", "VE_ITEMNR", "IDATE", "VENDOR", "BATCH",
                                            "WAC", "COST", "SHIP_QTY", "TOT_COST", "MATCH_TYPE", "SHIP_DATE", "INV_DATE", "WH_CONT", "MATCH_COID",
                                            "REC_DATE", "MMID", "WHID", "WRPID", "ITID", "SALE_CRW", "SALE_CRSRC", "EXTRA" ))
                        {
                            sbCopy.WriteToServer(reader);
                        }
                        SqlCommand cmd = new SqlCommand("[wholeSaler].[UpdateCalculatedColumnsForValleyWholesale]", connection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.ExecuteReader();
                    }

                }
                catch (Exception ex)
                {
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
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
                        sbCopy.BulkCopyTimeout = 0;
                        sbCopy.BatchSize = 10000;
                        sbCopy.DestinationTableName = "[wholeSaler].[ValueDrugs]";
                        using (
                            var reader = ObjectReader.Create(datas, "Id", "DC_NAME","DC_DEA","WHOLESALER"
                                ,"FAC_NAME","FAC_DEA","FAC_HIN","FAC_CITY","FAC_STATE","FAC_ACCT","CORDERDATE"
                                ,"CSHIPDATE","CINVDATE","INVOICE","VENDOR","WH_OEN","NDC","UPC","VE_ITEMNR"
                                ,"PROD_NAME","PROD_FORM","PROD_STRNG","PROD_SIZE","PROD_UM","PROD_UD"
                                ,"OUTER_PK","CWAC","CORDERQTY","CSHIPQTY","CCOST","CUPDNCHG","CTOTCOST"
                                ,"CONTRACT","GPO","CHG_NUM","CCHGDATE","CCHGAMOUNT","CAPPRDATE","PRIV_CONTR"
                                ,"SPECIAL","NET_ITEM","REASON_NS","DROP_SHIP","PO_NUMBER","WH_NOTES","BATCH"
                                ,"ORDER_DATE","SHIP_DATE","INV_DATE","WAC" ,"ORDER_QTY","SHIP_QTY","COST"
                                ,"UP_DN_CHG","TOT_COST","CHG_DATE","CHG_AMOUNT","APPR_DATE","WH_CONT"
                                ,"MATCH_COID","MATCH_TYPE","MMID","ITID","WHID","WRPID","SALE_CR","REC_DATE"
                                ,"SALE_CRW","SALE_CRSRC","EXTRA"))
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
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],Environment.NewLine + ex.Message);
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
