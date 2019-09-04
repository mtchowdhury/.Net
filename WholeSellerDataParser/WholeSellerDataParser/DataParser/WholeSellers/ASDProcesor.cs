using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public  class ASDProcesor
    {
        public List<ASD> ProcessASD(string path)
        {
            var entries = new List<ASD>();

            if (File.Exists(path))
            {

                

                string FileName = path;


                 FileInfo fi = new FileInfo(FileName);



//// Check file type
                //string ext = fi.Extension;

                //if (ext == ".xls")
                //{

                //}
                //else
                //{

                //}


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
                    string sql = string.Format("SELECT * FROM [{0}]", firstSheetName);

                    // for xlsx file , not working in xls 
                    //string sql = "Select * From [" + firstSheetName + "$A3:end]   where [CUST_SHIP_TO_CITY] is not null";

                    OleDbDataAdapter ada = new OleDbDataAdapter(sql, constr);

                    ada.Fill(dt);
                }


                // Update datatable columns as row number 5
                foreach (DataColumn column in dt.Columns)
                {
                    string cName = dt.Rows[3][column.ColumnName].ToString();
                    if (!dt.Columns.Contains(cName) && cName != "")
                    {
                        column.ColumnName = cName;
                    }

                }


                // Delete first 4 rows
                dt.Rows[0].Delete();
                dt.Rows[1].Delete();
                dt.Rows[2].Delete();
                dt.Rows[3].Delete();

                dt.AcceptChanges();



                foreach (DataRow row in dt.Rows)
                {

                    if (row["BPCd"].ToString().Trim() =="")
                    {
                        continue;
                    }


                    string FAC_ACCT = row["BPCd"].ToString().Trim();
                    string FAC_NAME = row["BPCdDesc"].ToString().Trim();
                    string FAC_DEA = row["DEALicenseNbr"].ToString().Trim();
                    string FAC_HIN = row["HINNbr"].ToString().Trim();
                    string FAC_ADDR = row["Addr"].ToString().Trim();
                    string FAC_CITY = row["City"].ToString().Trim();
                    string FAC_STATE = row["State"].ToString().Trim();
                    string CNDC = row["NDCCd"].ToString().Trim();
                    string SHIP_QTY = row["DelivQty"].ToString().Trim();
                    string SDATE = row["Del Date"].ToString().Trim();
                    string COST = row["UnitPrice"].ToString().Trim();
                    string TOT_COST = row["ExtPriceNet"].ToString().Trim();
                    string PROD_NAME = row["ItemCdDesc"].ToString().Trim();
                    string VENDOR = row["Supplier"].ToString().Trim();
                    string WH_OEN = row["SlsOrdNbr"].ToString().Trim();
                    string IDATE = row["Invoice Date"].ToString().Trim();
                    string INVOICE = row["InvoiceNbr"].ToString().Trim();
                    string CONTRACT = row["Contract #"].ToString().Trim();
                    string FILLER2 = row["ALB Eq Units"].ToString().Trim();
                    string FILLER3 = row["IVIG Grams"].ToString().Trim();
                    string FILLER4 = row["Factor Int Units"].ToString().Trim();
                    string FILLER5 = row["Micrograms"].ToString().Trim();
                    string PLASMA = row["Plasma or Non Plasma"].ToString().Trim();

                    //BATCH
                    //NDC
                    //WHID
                    //WRPID
                    //WHOLESALER
                    //INV_DATE
                    //SHIP_DATE
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


                    entries.Add(new ASD
                    {
                        FAC_ACCT = FAC_ACCT,
                        FAC_NAME = FAC_NAME,
                        FAC_DEA = FAC_DEA,
                        FAC_HIN = FAC_HIN,
                        FAC_ADDR = FAC_ADDR,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        CNDC = CNDC,
                        SHIP_QTY = SHIP_QTY,
                        SDATE = SDATE,
                        COST = COST,
                        TOT_COST = TOT_COST,
                        PROD_NAME = PROD_NAME,
                        VENDOR = VENDOR,
                        WH_OEN = WH_OEN,
                        IDATE = IDATE,
                        INVOICE = INVOICE,
                        CONTRACT = CONTRACT,
                        FILLER2 = FILLER2,
                        FILLER3 = FILLER3,
                        FILLER4 = FILLER4,
                        FILLER5 = FILLER5,
                        PLASMA = PLASMA,

                        //BATCH = BATCH,
                        //NDC = NDC,
                        //WHID = WHID,
                        //WRPID = WRPID,
                        //WHOLESALER = WHOLESALER,
                        //INV_DATE = INV_DATE,
                        //SHIP_DATE = SHIP_DATE,
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
