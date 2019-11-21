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
    public class AndaProcesor
    {
        public List<Anda> ProcessAnda(string path)
        {
            var entries = new List<Anda>();

            string FileName = path;
            string filename = Path.GetFileName(path);
            string sql = "";



            if (File.Exists(path))
            {



               
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

                    
                    if (filename.Contains("weekly"))
                    {
                        sql = "Select * From [" + firstSheetName + "A3:end]   where [CUST_SHIP_TO_CITY] is not null";
                    }
                    else
                    {
                        sql = "Select * From [" + firstSheetName + "A4:end]   where [CUST_SHIP_TO_CITY] is not null";
                    }


                    OleDbDataAdapter ada = new OleDbDataAdapter(sql, constr);

                    ada.Fill(dt);
                }
                


                foreach (DataRow row in dt.Rows)
                {
                    string FAC_NAME = row["CUST_SHIP_TO_NAME"].ToString().Trim();
                    string FAC_DEA = row["DEA"].ToString().Trim();
                    string FAC_HIN = row["HIN"].ToString().Trim();
                    string FAC_CITY = row["CUST_SHIP_TO_CITY"].ToString().Trim();
                    string FAC_STATE = row["CUST_SHIP_TO_STATE"].ToString().Trim();
                    string ODATE = row["ORDER DATE"].ToString().Trim();
                    string INV_DATE = row["INV DATE"].ToString().Trim();
                    string INVOICE = row["INV/CM#"].ToString().Trim();
                    string VENDOR = row["VEND_NAME"].ToString().Trim();
                    string VE_ITEMNR = row["ITEM_NO"].ToString().Trim();
                    string NDC = row["NDC"].ToString().Trim();
                    string UPC = row["SCAN_CD"].ToString().Trim();
                    string PROD_NAME = row["BRAND_NAME"].ToString().Trim();
                    string PROD_FORM = row["FORM"].ToString().Trim();
                    string PROD_STRNG = row["STRENGTH"].ToString().Trim();
                    string PROD_SIZE = row["SIZE"].ToString().Trim();
                    string ORDER_QTY = row["QTY ORDERED"].ToString().Trim();
                    string SHIP_QTY = row["QTY SHIPPED"].ToString().Trim();
                    string TOT_COST = row["EXT INV/CM AMT"].ToString().Trim();
                    string FILLER1 = row["UP/DOWN AMT"].ToString().Trim();

                    string FILLER2 = "";
                    string CONTRACT = "";

                    if (filename.Contains("weekly"))
                    {
                         FILLER2 = row["TOTAL COST"].ToString().Trim();
                         CONTRACT = row["CONTRACT NO"].ToString().Trim();
                    }
                    else
                    {

                         FILLER2 = row["VEND_CONTRACT_NO"].ToString().Trim();
                         CONTRACT = row["TOTAL COST"].ToString().Trim();
                    }
                     
                    string GPO = row["GPO"].ToString().Trim();
                    string FILLER3 = row["NET ITEM"].ToString().Trim();


                    //BATCH
                    //WHID
                    //WRPID
                    //WHOLESALER
                    //DC_NAME
                    //COST
                    //ORDER_DATE
                    //REC_DATE
                    //WH_CONT
                    //MATCH_COID
                    //MATCH_TYPE
                    //SALE_CR
                    //MMID
                    //ITID
                    //SALE_CRW
                    //SALE_CRSRC
                    //EXTRA



                    entries.Add(new Anda
                    {
                        FAC_NAME = FAC_NAME,
                        FAC_DEA = FAC_DEA,
                        FAC_HIN = FAC_HIN,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        ODATE = ODATE,
                        INV_DATE = INV_DATE,
                        INVOICE = INVOICE,
                        VENDOR = VENDOR,
                        VE_ITEMNR = VE_ITEMNR,
                        NDC = NDC,
                        UPC = UPC,
                        PROD_NAME = PROD_NAME,
                        PROD_FORM = PROD_FORM,
                        PROD_STRNG = PROD_STRNG,
                        PROD_SIZE = PROD_SIZE,
                        ORDER_QTY = ORDER_QTY,
                        SHIP_QTY = SHIP_QTY,
                        TOT_COST = TOT_COST,
                        FILLER1 = FILLER1,
                        FILLER2 = FILLER2,
                        CONTRACT = CONTRACT,
                        GPO = GPO,
                        FILLER3 = FILLER3,

                        //BATCH = BATCH,
                        //WHID = WHID,
                        //WRPID = WRPID,
                        //WHOLESALER = WHOLESALER,
                        //DC_NAME = DC_NAME,
                        //COST = COST,
                        //ORDER_DATE = ORDER_DATE,
                        //REC_DATE = REC_DATE,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //SALE_CR = SALE_CR,
                        //MMID = MMID,
                        //ITID = ITID,
                        //SALE_CRW = SALE_CRW,
                        //SALE_CRSRC = SALE_CRSRC,
                        //EXTRA = EXTRA,




                    });


                }



            }
            return entries;
        }


    }
}
