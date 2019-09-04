using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public  class MckessonProcessor
    {
        public List<MCKESSON> ProcessMckessons(string path)
        {
            var entries = new List<MCKESSON>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    //if (entries.Count > 1083850) return entries; ;
                    if (line == "") continue;
                    var ss = line.Split('|').ToList();
                    if (ss[1] == "Cust Acct ID (TOS)") continue;


                    var WHOLESALER = ss[0];
                    var FAC_ACCT = ss[1];
                    var FAC_NAME = ss[2];
                    var FAC_ADDR = ss[3];
                    var FAC_CITY = ss[4];
                    var FAC_STATE = ss[5];
                    var FAC_ZIP = ss[6];
                    var FAC_DEA = ss[7];
                    var SHIP_DATE = ss[8];
                    var INV_DATE = ss[9];
                    var INVOICE = ss[10];
                    var PO_NUMBER = ss[11];
                    var VENDOR = ss[12];
                    var VE_ACCT = ss[13];
                    var VE_ITEMNR = ss[14];
                    var PROD_NAME = ss[15];
                    var DC_NR = ss[16];
                    var NDC = ss[17];
                    var UPC = ss[18];
                    var FILLER01 = ss[19];
                    var FILLER02 = ss[20];
                    var FILLER03 = ss[21];
                    var FILLER04 = ss[22];
                    var PROD_FORM = ss[23];
                    var GEN_ID = ss[24];
                    var GEN_NAME = ss[25];
                    var PROD_STRNG = ss[26];
                    var PROD_SIZE = ss[27];
                    var GEN_IND = ss[28];
                    var PROD_UM = ss[29];
                    var FILLER05 = ss[30];
                    var AWP = ss[31];
                    var WAC = ss[32];
                    var ORDER_QTY = ss[33];
                    var SHIP_QTY = ss[34];
                    var COST = ss[35];
                    var TOT_COST = ss[36];
                    var NEWEXTRA = ss[37];
                    var GPO = ss[38];
                    var CONTRACT = ss[39];
                    var LEAD_NAME = ss[40];
                    var REASON_NS = ss[41];
                    var WH_NOTES = ss[42];
                    var CREDIT_CD = ss[43];
                    var REASON_DES = ss[44];
                    var CHG_AMOUNT = ss[45];
                    var FILLER06 = ss[46];
                    var FILLER07 = ss[47].Trim().Split("\t".ToCharArray())[0];
                    
                   

                 

                    entries.Add(new MCKESSON
                    {
                        WHOLESALER = WHOLESALER,
                        FAC_ACCT = FAC_ACCT,
                        FAC_NAME = FAC_NAME,
                        FAC_ADDR = FAC_ADDR,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        FAC_ZIP = FAC_ZIP,
                        FAC_DEA = FAC_DEA,
                        SHIP_DATE = SHIP_DATE,
                        INV_DATE = INV_DATE,
                        INVOICE = INVOICE,
                        PO_NUMBER = PO_NUMBER,
                        VENDOR = VENDOR,
                        VE_ACCT = VE_ACCT,
                        VE_ITEMNR = VE_ITEMNR,
                        PROD_NAME = PROD_NAME,
                        DC_NR = DC_NR,
                        NDC = NDC,
                        UPC = UPC,
                        FILLER01 = FILLER01,
                        FILLER02 = FILLER02,
                        FILLER03 = WHOLESALER,
                        FILLER04 = FILLER04,
                        PROD_FORM = PROD_FORM,
                        GEN_ID = GEN_ID,
                        GEN_NAME = GEN_NAME,
                        PROD_STRNG = PROD_STRNG,
                        PROD_SIZE = PROD_SIZE,
                        GEN_IND = GEN_IND,
                        PROD_UM = PROD_UM,
                        FILLER05 = FILLER05,
                        AWP =double.Parse(AWP) ,
                        WAC = double.Parse(WAC),
                        ORDER_QTY =Int32.Parse(ORDER_QTY) ,
                        SHIP_QTY = Int32.Parse(SHIP_QTY) ,
                        COST = double.Parse(COST) ,
                        TOT_COST =Double.Parse(TOT_COST) ,
                        NEWEXTRA =NEWEXTRA!=""? Int32.Parse(NEWEXTRA): (int?) null ,
                        GPO = GPO,
                        CONTRACT = CONTRACT,
                        LEAD_NAME = LEAD_NAME,
                        REASON_NS = REASON_NS,
                        WH_NOTES = WH_NOTES,
                        CREDIT_CD = CREDIT_CD,
                        REASON_DES = REASON_DES,
                        CHG_AMOUNT =double.Parse(CHG_AMOUNT) ,
                        FILLER06 = FILLER06,
                        FILLER07 = FILLER07,
                        BATCH = DateTime.Now,
                        WRPID = 8,
                        WH_CONT = CONTRACT,
                        REC_DATE =DateTime.Parse(SHIP_DATE) ,
                        SALE_CRSRC = "O"




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
