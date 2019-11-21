using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
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
                    var LineArray = line.Split('|').ToList();
                    if (LineArray[1] == "Cust Acct ID (TOS)") continue;


                    var WHOLESALER = LineArray[0];
                    var FAC_ACCT = LineArray[1];
                    var FAC_NAME = LineArray[2];
                    var FAC_ADDR = LineArray[3];
                    var FAC_CITY = LineArray[4];
                    var FAC_STATE = LineArray[5];
                    var FAC_ZIP = LineArray[6];
                    var FAC_DEA = LineArray[7];
                    var SHIP_DATE = LineArray[8];
                    var INV_DATE = LineArray[9];
                    var INVOICE = LineArray[10];
                    var PO_NUMBER = LineArray[11];
                    var VENDOR = LineArray[12];
                    var VE_ACCT = LineArray[13];
                    var VE_ITEMNR = LineArray[14];
                    var PROD_NAME = LineArray[15];
                    var DC_NR = LineArray[16];
                    var NDC = LineArray[17];
                    var UPC = LineArray[18];
                    var FILLER01 = LineArray[19];
                    var FILLER02 = LineArray[20];
                    var FILLER03 = LineArray[21];
                    var FILLER04 = LineArray[22];
                    var PROD_FORM = LineArray[23];
                    var GEN_ID = LineArray[24];
                    var GEN_NAME = LineArray[25];
                    var PROD_STRNG = LineArray[26];
                    var PROD_SIZE = LineArray[27];
                    var GEN_IND = LineArray[28];
                    var PROD_UM = LineArray[29];
                    var FILLER05 = LineArray[30];
                    var AWP = LineArray[31];
                    var WAC = LineArray[32];
                    var ORDER_QTY = LineArray[33];
                    var SHIP_QTY = LineArray[34];
                    var COST = LineArray[35];
                    var TOT_COST = LineArray[36];
                    var NEWEXTRA = LineArray[37];
                    var GPO = LineArray[38];
                    var CONTRACT = LineArray[39];
                    var LEAD_NAME = LineArray[40];
                    var REASON_NS = LineArray[41];
                    var WH_NOTES = LineArray[42];
                    var CREDIT_CD = LineArray[43];
                    var REASON_DES = LineArray[44];
                    var CHG_AMOUNT = LineArray[45];
                    var FILLER06 = LineArray[46];
                    var FILLER07 = LineArray[47];
                    
                   

                 

                    entries.Add(new MCKESSON
                    {
                        WHOLESALER = WHOLESALER.Trim(),
                        FAC_ACCT = FAC_ACCT.Trim(),
                        FAC_NAME = FAC_NAME.Trim(),
                        FAC_ADDR = FAC_ADDR.Trim(),
                        FAC_CITY = FAC_CITY.Trim(),
                        FAC_STATE = FAC_STATE.Trim(),
                        FAC_ZIP = FAC_ZIP.Trim(),
                        FAC_DEA = FAC_DEA.Trim(),
                        SHIP_DATE = SHIP_DATE.Trim(),
                        INV_DATE = INV_DATE.Trim(),
                        INVOICE = INVOICE.Trim(),
                        PO_NUMBER = PO_NUMBER.Trim(),
                        VENDOR = VENDOR.Trim(),
                        VE_ACCT = VE_ACCT.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        PROD_NAME = PROD_NAME.Trim(),
                        DC_NR = DC_NR.Trim(),
                        NDC = NDC.Trim(),
                        UPC = UPC.Trim(),
                        FILLER01 = FILLER01.Trim(),
                        FILLER02 = FILLER02.Trim(),
                        FILLER03 = WHOLESALER.Trim(),
                        FILLER04 = FILLER04.Trim(),
                        PROD_FORM = PROD_FORM.Trim(),
                        GEN_ID = GEN_ID.Trim(),
                        GEN_NAME = GEN_NAME.Trim(),
                        PROD_STRNG = PROD_STRNG.Trim(),
                        PROD_SIZE = PROD_SIZE.Trim(),
                        GEN_IND = GEN_IND.Trim(),
                        PROD_UM = PROD_UM.Trim(),
                        FILLER05 = FILLER05.Trim(),
                        AWP = AWP.Trim(),
                        WAC = WAC.Trim(),
                        ORDER_QTY = ORDER_QTY.Trim(),
                        SHIP_QTY = SHIP_QTY ,
                        COST = COST ,
                        TOT_COST = TOT_COST.Trim(),
                        NEWEXTRA = NEWEXTRA.Trim(),
                        GPO = GPO.Trim(),
                        CONTRACT = CONTRACT.Trim(),
                        LEAD_NAME = LEAD_NAME.Trim(),
                        REASON_NS = REASON_NS.Trim(),
                        WH_NOTES = WH_NOTES.Trim(),
                        CREDIT_CD = CREDIT_CD.Trim(),
                        REASON_DES = REASON_DES.Trim(),
                        CHG_AMOUNT = CHG_AMOUNT.Trim(),
                        FILLER06 = FILLER06.Trim(),
                        FILLER07 = FILLER07.Trim(),
                        //BATCH = BATCH,
                        //SALE_CR = SALE_CR,
                        //MMID = MMID,
                        //ITID = ITID,
                        //WRPID = WRPID,
                        //DC_NAME = DC_NAME,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //REC_DATE = REC_DATE,
                        //SALE_CRW = SALE_CRW,
                        //SALE_CRSRC = SALE_CRSRC,
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
