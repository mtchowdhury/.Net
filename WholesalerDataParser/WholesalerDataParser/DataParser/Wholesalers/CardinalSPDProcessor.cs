using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OfficeOpenXml;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class CardinalSPDProcessor
    {
        public List<CardinalSPD> ProcessCardinalSPD(string path)
        {
            var entries = new List<CardinalSPD>();

            if (File.Exists(path))
            {

                var FileName = new FileInfo(@path);

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
                    string firstSheetName = sheetsName.Rows[0][2].ToString();

                    //Query String 
                    // string sql = string.Format("SELECT * FROM [{0}]", firstSheetName);

                    // for xlsx file , not working in xls 
                    string sql = "Select * From [" + firstSheetName + "]   where [Billing doc# date] is not null";

                    OleDbDataAdapter ada = new OleDbDataAdapter(sql, constr);

                    ada.Fill(dt);
                }






                foreach (DataRow row in dt.Rows)
                {
                    string INV_DATE = row["Billing doc# date"].ToString().Trim();
                    string INVOICE = row["Billing document"].ToString().Trim();
                    string FAC_NAME = row["Customer Name"].ToString().Trim();

                    string FAC_DEA = row["DEA Number"].ToString().Trim();
                    //string GPO = row["GPO"].ToString().Trim();
                    string GPO = "Asembia";
                    string NDC = row["NDC Number"].ToString().Trim();
                    string PROD_NAME = row["Product"].ToString().Trim();

                    string FAC_CITY = row["Ship to City"].ToString().Trim();
                    string FAC_ACCT = row["Sold To Party"].ToString().Trim();

                    string SHIP_QTY = row["Billed Qty"].ToString().Trim();
                    string TOT_COST = row["Net Invoice Amount"].ToString().Trim();





                        entries.Add(new CardinalSPD
                        {


                            FILLER1 = null,
                            CHG_AMOUNT = null,
                            CHG_DATE = null,
                            CHG_NUM = null,
                            FILLER2 = "Contract",
                            COST_TOT = null,
                            FAC_ACCT = FAC_ACCT != null ? FAC_ACCT.ToString().Trim() : "",
                            FAC_CITY = FAC_CITY != null ? FAC_CITY.ToString().Trim() : "",
                            FAC_DEA = FAC_DEA != null ? FAC_DEA.ToString().Trim() : "",
                            FAC_HIN = null,
                            FAC_NAME = FAC_NAME != null ? FAC_NAME.ToString().Trim() : "",
                            FILLER3 = null,
                            PO_NUMBER = null,
                            FAC_STATE = null,
                            FILLER4 = null,
                            FILLER5 = null,
                            DROP_SHIP = null,
                            GPO = GPO != null ? GPO.ToString().Trim() : "",
                            INV_DATE = INV_DATE != null ? INV_DATE.ToString().Trim() : "",
                            INVOICE = INVOICE != null ? INVOICE.ToString().Trim() : "",
                            NDC = NDC != null ? NDC.ToString().Trim() : "",
                            FILLER6 = null,
                            ORDER_DATE = null,
                            FILLER7 = null,
                            PROD_FORM = null,
                            FILLER8 = null,
                            PROD_STRNG = null,
                            FILLER9 = null,
                            FILLER10 = null,
                            SHIP_QTY = SHIP_QTY != null ? SHIP_QTY.ToString().Trim() : "",
                            FILLER11 = null,
                            FILLER12 = null,
                            SHIP_DATE = null,
                            TOT_COST = TOT_COST != null ? TOT_COST.ToString().Trim() : "",
                            FILLER13 = null,
                            PROD_NAME = PROD_NAME != null ? PROD_NAME.ToString().Trim() : "",
                            FILLER14 = null,
                            FILLER15 = null,
                            FILLER16 = null,
                            VENDOR = null,
                            FILLER17 = null,
                            FILLER18 = null,
                            FILLER19 = null,
                            FILLQR20 = null,
                            FILLER21 = null,
                            FILLER22 = null,
                            FILLAR23 = null,


                            //BATCH= DateTime.Now,
                            //COST= TOT_COST != null&& SHIP_QTY != null? double.Parse(TOT_COST.ToString().Trim())/ Int32.Parse(SHIP_QTY.ToString().Trim()):0.00,
                            //WHID= 153,
                            //WRPID= 14695,
                            //WHOLESALER= "Cardinal Health SPD",
                            //DC_NAME= "Cardinal Health SPD",
                            //REC_DATE=DateTime.Parse(SHIP_DATE.ToString().Trim())  ,
                            //WH_CONT= WH_CONT,
                            //MATCH_COID= MATCH_COID,
                            //MATCH_TYPE= MATCH_TYPE
                            //SALE_CR=,
                            //MMID=,
                            //ITID=,
                            //SALE_CRW=,
                            //SALE_CRSRC="O",
                            //EXTRA=


                        });
                    }

                }
            

            return entries;
        }

        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var ss = datestr.Split('/');
            var month = ss[0];
            var date = ss[1];
            var year = ss[2];


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
}
