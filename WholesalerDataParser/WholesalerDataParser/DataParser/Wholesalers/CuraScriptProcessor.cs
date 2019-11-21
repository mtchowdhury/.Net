using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class CuraScriptProcessor
    {
        public List<CuraScript> ProcessCuraScript(string path)
        {
            var entries = new List<CuraScript>();
            if (File.Exists(path))
            {

                string FileName = path;


                DataTable dt = new DataTable("tbltemp");



                String constr = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" +
                                FileName +
                                ";Mode=Read;Extended Properties='Excel 12.0 XML;HDR=YES;IMEX=1;';";


                using (OleDbConnection conn = new OleDbConnection(constr))
                {
                    conn.Open();
                    //Get All Sheets Name
                    DataTable sheetsName = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, new object[] { null, null, null, "Table" });

                    //Get the First Sheet Name
                    string firstSheetName = sheetsName.Rows[1][2].ToString();

                    //Query String 
                    // string sql = string.Format("SELECT * FROM [{0}]", firstSheetName);

                    // for xlsx file , not working in xls 
                    string sql = "Select * From [" + firstSheetName + "]   where [Ship To Num] is not null";

                    OleDbDataAdapter ada = new OleDbDataAdapter(sql, constr);

                    ada.Fill(dt);



                foreach (DataRow row in dt.Rows)
                {


                    var FAC_ACCT = row["Ship To Num"].ToString().Trim();
                    var FAC_NAME = row["Ship to Name"].ToString().Trim();
                    var FILLER1 = row["Ship to Address #1"].ToString().Trim();

                    var FILLER2 = row["Ship to Address #2"].ToString().Trim();
                    var FAC_CITY = row["Ship to City"].ToString().Trim();

                    var FAC_STATE = row["Ship to State"].ToString().Trim();
                    var FAC_ZIP = row["Ship to Zip"].ToString().Trim();
                    var FAC_DEA = row["DEA#"].ToString().Trim();
                    var CONTRACT = row["Contract Num"].ToString().Trim();
                    var VENDOR = row["Vendor Name"].ToString().Trim();

                    var PROD_NAME = row["Product Description"].ToString().Trim();
                    var VE_ITEMNR = row["Item#"].ToString().Trim();
                    var LOT_NUMBER = row["Lot#"].ToString().Trim();
                    var LOT_EXPR = row["Lot Expiration Date"].ToString().Trim();
                    var NDC = row["NDC Number"].ToString().Trim();
                    var WH_OEN = row["Order Num"].ToString().Trim();

                    var INV_DATE = row["Invoice Date"].ToString().Trim();
                    var INVOICE = row["Invoice/Credit Num"].ToString().Trim();
                    var FILLER3 = row["Shipping Warehouse num"].ToString().Trim();

                    var SHIP_QTY = row["Quantity Shipped/Returned"].ToString().Trim();
                    var COST = row["Unit Sell Price"].ToString().Trim();
                    var TOT_COST = row["Ext Sales Amt"].ToString().Trim();
                    var TOT_FEE = row["Admin Fee"].ToString().Trim();






                    entries.Add(new CuraScript
                    {

                        FAC_ACCT = FAC_ACCT.Trim(),
                        FAC_NAME = FAC_NAME.Trim(),
                        FILLER1 = FILLER1.Trim(),


                        FILLER2 = FILLER2.Trim(),
                        FAC_CITY = FAC_CITY.Trim(),


                        FAC_STATE = FAC_STATE.Trim(),
                        FAC_ZIP = FAC_ZIP.Trim(),
                        FAC_DEA = FAC_DEA.Trim(),
                        CONTRACT = CONTRACT.Trim(),
                        VENDOR = VENDOR.Trim(),


                        PROD_NAME = PROD_NAME.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        LOT_NUMBER = LOT_NUMBER.Trim(),
                        LOT_EXPR = LOT_EXPR.Trim(),
                        NDC = NDC.Trim(),
                        WH_OEN = WH_OEN.Trim(),


                        INV_DATE = INV_DATE.Trim(),
                        INVOICE = INVOICE.Trim(),
                        FILLER3 = FILLER3.Trim(),


                        SHIP_QTY = SHIP_QTY.Trim() ,
                        COST = COST.Trim(),
                        TOT_COST = TOT_COST.Trim()  ,
                        TOT_FEE = TOT_FEE.Trim(),

                        //BATCH = DateTime.Now,
                        //WH_CONT = CONTRACT,
                        //WHOLESALER = "Curascript SD",
                        //MATCH_COID = FAC_ACCT,
                        //MATCH_TYPE = FAC_ACCT,
                        //REC_DATE  = INV_DATE!=""? DateTime.ParseExact(INV_DATE.Trim() + " 00:00:00 AM", "MM/dd/yyyy hh:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture) : (DateTime?)null,
                        // DateTime.Parse(INV_DATE.Trim()):(DateTime?) null,
                        //MMID = FAC_ACCT,
                        //ITID = FAC_ACCT,
                        //WHID = 165,
                        //WRPID = 27039,
                        SALE_CR = "C"
                        //SALE_CRW = FAC_ACCT,
                        //SALE_CRSRC = "O",
                        //EXTRA = FAC_ACCT



                    });
                }


                    dt =new  DataTable();
                        //Get the second Sheet Name
                        firstSheetName = sheetsName.Rows[2][2].ToString();

                    // for xlsx file , not working in xls 
                    sql = "Select * From [" + firstSheetName + "]   where [Ship To Num] is not null";

                    ada = new OleDbDataAdapter(sql, constr);

                    ada.Fill(dt);






                    foreach (DataRow row in dt.Rows)
                    {


                        var FAC_ACCT = row["Ship To Num"].ToString().Trim();
                        var FAC_NAME = row["Ship to Name"].ToString().Trim();
                        var FILLER1 = row["Ship to Address #1"].ToString().Trim();

                        var FILLER2 = row["Ship to Address #2"].ToString().Trim();
                        var FAC_CITY = row["Ship to City"].ToString().Trim();

                        var FAC_STATE = row["Ship to State"].ToString().Trim();
                        var FAC_ZIP = row["Ship to Zip"].ToString().Trim();
                        var FAC_DEA = row["DEA#"].ToString().Trim();
                        var CONTRACT = row["Contract Num"].ToString().Trim();
                        var VENDOR = row["Vendor Name"].ToString().Trim();

                        var PROD_NAME = row["Product Description"].ToString().Trim();
                        var VE_ITEMNR = row["Item#"].ToString().Trim();
                        var LOT_NUMBER = row["Lot#"].ToString().Trim();
                        var LOT_EXPR = row["Lot Expiration Date"].ToString().Trim();
                        var NDC = row["NDC Number"].ToString().Trim();
                        var WH_OEN = row["Order Num"].ToString().Trim();

                        var INV_DATE = row["Invoice Date"].ToString().Trim();
                        var INVOICE = row["Invoice/Credit Num"].ToString().Trim();
                        var FILLER3 = row["Shipping Warehouse num"].ToString().Trim();

                        var SHIP_QTY = row["Quantity Shipped/Returned"].ToString().Trim();
                        var COST = row["Unit Sell Price"].ToString().Trim();
                        var TOT_COST = row["Ext Sales Amt"].ToString().Trim();
                        var TOT_FEE = row["Admin Fee"].ToString().Trim();






                        entries.Add(new CuraScript
                        {

                            FAC_ACCT = FAC_ACCT.Trim(),
                            FAC_NAME = FAC_NAME.Trim(),
                            FILLER1 = FILLER1.Trim(),


                            FILLER2 = FILLER2.Trim(),
                            FAC_CITY = FAC_CITY.Trim(),


                            FAC_STATE = FAC_STATE.Trim(),
                            FAC_ZIP = FAC_ZIP.Trim(),
                            FAC_DEA = FAC_DEA.Trim(),
                            CONTRACT = CONTRACT.Trim(),
                            VENDOR = VENDOR.Trim(),


                            PROD_NAME = PROD_NAME.Trim(),
                            VE_ITEMNR = VE_ITEMNR.Trim(),
                            LOT_NUMBER = LOT_NUMBER.Trim(),
                            LOT_EXPR = LOT_EXPR.Trim(),
                            NDC = NDC.Trim(),
                            WH_OEN = WH_OEN.Trim(),


                            INV_DATE = INV_DATE.Trim(),
                            INVOICE = INVOICE.Trim(),
                            FILLER3 = FILLER3.Trim(),


                            SHIP_QTY = SHIP_QTY.Trim(),
                            COST = COST.Trim(),
                            TOT_COST = TOT_COST.Trim(),
                            TOT_FEE = TOT_FEE.Trim(),

                            //BATCH = DateTime.Now,
                            //WH_CONT = CONTRACT,
                            //WHOLESALER = "Curascript SD",
                            //MATCH_COID = FAC_ACCT,
                            //MATCH_TYPE = FAC_ACCT,
                            //REC_DATE  = INV_DATE!=""? DateTime.ParseExact(INV_DATE.Trim() + " 00:00:00 AM", "MM/dd/yyyy hh:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture) : (DateTime?)null,
                            // DateTime.Parse(INV_DATE.Trim()):(DateTime?) null,
                            //MMID = FAC_ACCT,
                            //ITID = FAC_ACCT,
                            //WHID = 165,
                            //WRPID = 27039,
                            SALE_CR = "O"
                            //SALE_CRW = FAC_ACCT,
                            //SALE_CRSRC = "O",
                            //EXTRA = FAC_ACCT



                        });
                    }

                }


            }
            return entries;
        }

        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var month = datestr.Substring(4, 2);
            var date = datestr.Substring(6, 2);
            var year = datestr.Substring(0, 4);


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
}
