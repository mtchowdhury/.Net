using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
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
                    var ss = line.Split('|').ToList();
                    if (ss[0] == "AWP") continue;

                    //  var FAC_NAME = ss[0];
                    var FILLER1 = ss[0];
                    var FILLER2 = ss[1];
                    var FILLER3 = ss[2];
                    var FILLER4 = ss[3];
                    var CONTRACT = ss[4];
                    var FILLER5 = ss[5];
                    var FAC_ACCT = ss[6];
                    var FAC_CITY = ss[7];
                    var FAC_DEA = ss[8];
                    var FAC_HIN = ss[9];
                    var FAC_NAME = ss[10];
                    var FILLER6 = ss[11];
                    var PO_NUMBER = ss[12];
                    var FAC_STATE = ss[13];
                    var DC_DEA = ss[14];
                    var  DC_NAME = ss[15];
                    var FILLER7 = ss[16];
                    var DROP_SHIP = ss[17];
                    var GPO = ss[18];
                    var IDATE = ss[19];
                    var INVOICE = ss[20];
                    var NDC = ss[21];
                    var COST = ss[22];
                    var ODATE = ss[23];
                    var OUTER_PK = ss[24];
                    var   PROD_FORM = ss[25];
                    var PROD_SIZE = ss[26];
                    var PROD_STRNG = ss[27];
                    var PROD_UM = ss[28];
                    var ORDER_QTY = ss[29];
                    var SHIP_QTY = ss[30];
                    var REASON_NS = ss[31];
                    var   FILLER8 = ss[32];
                    var SDATE = ss[33];
                    var TOT_COST = ss[34];
                    var FILLER9 = ss[35];
                    var  PROD_NAME = ss[36];
                    var PROD_UD = ss[37];
                    var   UP_DN_CHG = ss[38];
                    var UPC = ss[39];
                    var VENDOR = ss[40];
                    var    FILLER10 = ss[41];
                    var VE_ITEMNR = ss[42];
                    var WAC = ss[43];
                    var   FILLER11 = ss[44];
                    var FILLER12 = ss[45];
                    var WH_OEN = ss[46];
                    var FILLER13 = ss[47];




                    var ssss = Int32.Parse(ORDER_QTY.Split('.')[0]);





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
                        COST = COST!=""?double.Parse(COST):0.0 ,
                        ODATE = ODATE.Trim(),
                        OUTER_PK = OUTER_PK.Trim(),
                        PROD_FORM = PROD_FORM.Trim(),
                        PROD_SIZE = PROD_SIZE!=""?Int32.Parse(PROD_SIZE) :0 ,
                        PROD_STRNG = PROD_STRNG.Trim(),
                        PROD_UM = PROD_UM.Trim(),
                        ORDER_QTY = ORDER_QTY != "" ? Int32.Parse(ORDER_QTY.Split('.')[0]) : 0, 
                        SHIP_QTY = SHIP_QTY != "" ? Int32.Parse(SHIP_QTY.Split('.')[0]) : 0 ,
                        REASON_NS = REASON_NS.Trim(),
                        FILLER8 = FILLER8.Trim(),
                        SDATE = SDATE.Trim(),
                        TOT_COST = TOT_COST != "" ? double.Parse(TOT_COST) : 0.0 ,
                        FILLER9 = FILLER9.Trim(),
                        PROD_NAME = PROD_NAME.Trim(),
                        PROD_UD = PROD_UD.Trim(),
                        UP_DN_CHG = UP_DN_CHG.Trim(),
                        UPC = UPC.Trim(),
                        VENDOR = VENDOR.Trim(),
                        FILLER10 = FILLER10.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        WAC = WAC != "" ? double.Parse(WAC) : 0.0  ,
                        FILLER11 = FILLER11.Trim(),
                        FILLER12 = FILLER12.Trim(),
                        WH_OEN = WH_OEN.Trim(),
                        FILLER13 = FILLER13.Trim(),
                        BATCH = DateTime.Now,
                        WHID = 162,
                        WRPID = 15945,
                        WHOLESALER = "Mckesson SP",
                        ORDER_DATE = GetDateTimeFromString(SDATE) ,
                        SHIP_DATE = GetDateTimeFromString(SDATE),
                        INV_DATE = GetDateTimeFromString(SDATE) ,
                        REC_DATE = GetDateTimeFromString(SDATE) ,
                        WH_CONT = "",
                        //MATCH_COID = DC_NAME,
                        //MATCH_TYPE = DC_NAME,
                        //SALE_CR = DC_NAME,
                        //MMID = DC_NAME,
                        //ITID = DC_NAME,
                        //SALE_CRW = DC_NAME,
                        SALE_CRSRC = "O",
                        //EXTRA = DC_NAME




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
