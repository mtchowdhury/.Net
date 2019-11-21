using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class McKessonSPProcessor
    {
        public List<McKessonSP> ProcessMcKessonSP(string path)
        {
            var entries = new List<McKessonSP>();
            if (File.Exists(path))
            {


                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    //if (entries.Count > 1083850) return entries; ;
                    if (line == "") continue;
                    var LineArray = line.Split('|').ToList();
                    if (LineArray[0] == "AWP") continue;

                    //  var FAC_NAME = ss[0];
                    var FILLER1 = LineArray[0];
                    var FILLER2 = LineArray[1];
                    var FILLER3 = LineArray[2];
                    var FILLER4 = LineArray[3];
                    var CONTRACT = LineArray[4];
                    var FILLER5 = LineArray[5];
                    var FAC_ACCT = LineArray[6];
                    var FAC_CITY = LineArray[7];
                    var FAC_DEA = LineArray[8];
                    var FAC_HIN = LineArray[9];
                    var FAC_NAME = LineArray[10];
                    var FILLER6 = LineArray[11];
                    var PO_NUMBER = LineArray[12];
                    var FAC_STATE = LineArray[13];
                    var DC_DEA = LineArray[14];
                    var DC_NAME = LineArray[15];
                    var FILLER7 = LineArray[16];
                    var DROP_SHIP = LineArray[17];
                    var GPO = LineArray[18];
                    var IDATE = LineArray[19];
                    var INVOICE = LineArray[20];
                    var NDC = LineArray[21];
                    var COST = LineArray[22];
                    var ODATE = LineArray[23];
                    var OUTER_PK = LineArray[24];
                    var PROD_FORM = LineArray[25];
                    var PROD_SIZE = LineArray[26];
                    var PROD_STRNG = LineArray[27];
                    var PROD_UM = LineArray[28];
                    var ORDER_QTY = LineArray[29];
                    var SHIP_QTY = LineArray[30];
                    var REASON_NS = LineArray[31];
                    var FILLER8 = LineArray[32];
                    var SDATE = LineArray[33];
                    var TOT_COST = LineArray[34];
                    var FILLER9 = LineArray[35];
                    var PROD_NAME = LineArray[36];
                    var PROD_UD = LineArray[37];
                    var UP_DN_CHG = LineArray[38];
                    var UPC = LineArray[39];
                    var VENDOR = LineArray[40];
                    var FILLER10 = LineArray[41];
                    var VE_ITEMNR = LineArray[42];
                    var WAC = LineArray[43];
                    var FILLER11 = LineArray[44];
                    var FILLER12 = LineArray[45];
                    var WH_OEN = LineArray[46];
                    var FILLER13 = LineArray[47];
                    

                    entries.Add(new McKessonSP
                    {
                        FILLER1 = FILLER1.Trim(),
                        FILLER2 = FILLER2.Trim(),
                        FILLER3 = FILLER3.Trim(),
                        FILLER4 = FILLER4.Trim(),
                        CONTRACT = CONTRACT.Trim(),
                        FILLER5 = FILLER5.Trim(),
                        FAC_ACCT = FAC_ACCT.Trim(),
                        FAC_CITY = FAC_CITY.Trim(),
                        FAC_DEA = FAC_DEA.Trim(),
                        FAC_HIN = FAC_HIN.Trim(),
                        FAC_NAME = FAC_NAME.Trim(),
                        FILLER6 = FILLER6.Trim(),
                        PO_NUMBER = PO_NUMBER.Trim(),
                        FAC_STATE = FAC_STATE.Trim(),
                        DC_DEA = DC_DEA.Trim(),
                        DC_NAME = DC_NAME.Trim(),
                        FILLER7 = FILLER7.Trim(),
                        DROP_SHIP = DROP_SHIP.Trim(),
                        GPO = GPO.Trim(),
                        IDATE = IDATE.Trim(),
                        INVOICE = INVOICE.Trim(),
                        NDC = NDC.Trim(),
                        COST = COST.Trim(),
                        ODATE = ODATE.Trim(),
                        OUTER_PK = OUTER_PK.Trim(),
                        PROD_FORM = PROD_FORM.Trim(),
                        PROD_SIZE = PROD_SIZE.Trim(),
                        PROD_STRNG = PROD_STRNG.Trim(),
                        PROD_UM = PROD_UM.Trim(),
                        ORDER_QTY = ORDER_QTY.Trim(),
                        SHIP_QTY = SHIP_QTY.Trim(),
                        REASON_NS = REASON_NS.Trim(),
                        FILLER8 = FILLER8.Trim(),
                        SDATE = SDATE.Trim(),
                        TOT_COST = TOT_COST.Trim(),
                        FILLER9 = FILLER9.Trim(),
                        PROD_NAME = PROD_NAME.Trim(),
                        PROD_UD = PROD_UD.Trim(),
                        UP_DN_CHG = UP_DN_CHG.Trim(),
                        UPC = UPC.Trim(),
                        VENDOR = VENDOR.Trim(),
                        FILLER10 = FILLER10.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        WAC = WAC.Trim(),
                        FILLER11 = FILLER11.Trim(),
                        FILLER12 = FILLER12.Trim(),
                        WH_OEN = WH_OEN.Trim(),
                        FILLER13 = FILLER13.Trim(),

                        //BATCH = BATCH,
                        //WHID = WHID,
                        //WRPID = WRPID,
                        //WHOLESALER = WHOLESALER,
                        //ORDER_DATE = ORDER_DATE,
                        //SHIP_DATE = SHIP_DATE,
                        //INV_DATE = INV_DATE,
                        //REC_DATE = REC_DATE,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = DC_NAME,
                        //MATCH_TYPE = DC_NAME,
                        //SALE_CR = DC_NAME,
                        //MMID = DC_NAME,
                        //ITID = DC_NAME,
                        //SALE_CRW = DC_NAME,
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
