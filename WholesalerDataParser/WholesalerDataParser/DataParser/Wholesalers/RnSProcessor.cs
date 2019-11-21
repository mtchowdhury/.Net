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
   public class RnSProcessor
    {
        public List<RnSPharma> ProcessRnS(string path)
        {
            var entries = new List<RnSPharma>();
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
                    string firstSheetName = sheetsName.Rows[0][2].ToString();

                    //Query String 
                    // string sql = string.Format("SELECT * FROM [{0}]", firstSheetName);

                    // for xlsx file , not working in xls 
                    string sql = "Select * From [" + firstSheetName + "]";

                    OleDbDataAdapter ada = new OleDbDataAdapter(sql, constr);

                    ada.Fill(dt);
                }






                foreach (DataRow row in dt.Rows)
                {

                    var FAC_NAME = row["Customer Name (Ship To)"].ToString().Trim();
                    var FAC_ADDR = row["Customer Street Address (Ship To)"].ToString().Trim();
                    var FAC_CITY = row["Customer City (Ship To)"].ToString().Trim();
                    var FAC_STATE = row["Customer State (Ship To)"].ToString().Trim();
                    var FAC_ZIP = row["Customer Zip (Ship To)"].ToString().Trim();


                    var FAC_DEA = row["Customer DEA "].ToString().Trim();
                    var FAC_HIN = row["HIN #"].ToString().Trim();
                    var FILLER1 = row["Armada Group Flag"].ToString().Trim();
                    var PROD_NAME = row["Description"].ToString().Trim();
                    var CNDC = row["Complete NDC"].ToString().Trim();


                    var INV_DATE = row["Invoice Date"].ToString().Trim();
                    var INVOICE = row["Invoice Number"].ToString().Trim();
                    var SHIP_QTY = row["Quantity Sold"].ToString().Trim();
                    var TOT_COST = row["Extended Sell"].ToString().Trim();
                    var FILLER2 = "";






                    entries.Add(new RnSPharma
                    {
                    
                        FAC_NAME = FAC_NAME,
                        FAC_ADDR = FAC_ADDR,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        FAC_ZIP = FAC_ZIP,


                        FAC_DEA = FAC_DEA,
                        FAC_HIN = FAC_HIN,
                        FILLER1 = FILLER1,
                        PROD_NAME = PROD_NAME,
                        CNDC = CNDC,


                        INV_DATE = INV_DATE,
                        INVOICE = INVOICE,
                        SHIP_QTY = SHIP_QTY,
                        TOT_COST = TOT_COST,
                        FILLER2 = FILLER2,

                        //BATCH = DateTime.Now,
                        //COST = 7.9900,// eta pore dekhte hobe
                        //NDC = CNDC,
                        //WHID = 154,
                        //WRPID = 14691,
                        //WHOLESALER = "R&S Northeast",
                        //REC_DATE = DateTime.Parse(INV_DATE),
                        //CONTRACT = CONTRACT,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //SALE_CR = "C",
                        //MMID = MMID,
                        //ITID = ITID,
                        //SALE_CRW = "C",
                        //SALE_CRSRC = "O",
                        //EXTRA = EXTRA,




                    });
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
