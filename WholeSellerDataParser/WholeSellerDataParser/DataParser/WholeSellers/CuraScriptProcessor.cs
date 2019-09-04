using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
   public class CuraScriptProcessor
    {
        public List<CuraScript> ProcessCuraScript(string path)
        {
            var entries = new List<CuraScript>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    //if (entries.Count > 1083850) return entries; ;
                    if (line == "" ||line== ",,,,,,,,,,,,,,,,,,,,,,") continue;
                    var ss = line.Split(',').ToList();
                    if (ss[0] == "Ship To Num") continue;



                    
                    var  FAC_ACCT =ss[0];
                    var FAC_NAME = ss[1];
                    var FILLER1 = ss[2];

                    var FILLER2 = ss[3];
                    var FAC_CITY = ss[4];

                    var FAC_STATE = ss[5];
                    var FAC_ZIP = ss[6];
                    var FAC_DEA = ss[7];
                    var CONTRACT = ss[8];
                    var VENDOR = ss[9];

                    var PROD_NAME = ss[10];
                    var VE_ITEMNR = ss[11];
                    var LOT_NUMBER = ss[12];
                    var LOT_EXPR = ss[13];
                    var NDC = ss[14];
                    var WH_OEN = ss[15];

                    var INV_DATE = ss[16].Length<10 ? "0"+ss[16]:ss[16];
                    var INVOICE = ss[17];
                    var FILLER3 = ss[18];

                    var SHIP_QTY = ss[19];
                    var COST = ss[20];
                    var TOT_COST = ss[21];
                    var TOT_FEE = ss[22];
            
                




                    entries.Add(new CuraScript
                    {

                        FAC_ACCT = FAC_ACCT,
                        FAC_NAME = FAC_NAME,
                        FILLER1 = FILLER1,


                        FILLER2 = FILLER2,
                        FAC_CITY = FAC_CITY,


                        FAC_STATE = FAC_STATE,
                        FAC_ZIP = FAC_ZIP,
                        FAC_DEA = FAC_DEA,
                        CONTRACT = CONTRACT,
                        VENDOR = VENDOR,


                        PROD_NAME = PROD_NAME,
                        VE_ITEMNR = VE_ITEMNR,
                        LOT_NUMBER = LOT_NUMBER,
                        LOT_EXPR = LOT_EXPR,
                        NDC = NDC,
                        WH_OEN = WH_OEN,


                        INV_DATE = INV_DATE,
                        INVOICE = INVOICE,
                        FILLER3 = FILLER3,


                        SHIP_QTY = SHIP_QTY!=""?Int32.Parse(SHIP_QTY.Trim()):0 ,
                        COST = COST!=""? double.Parse(COST.Trim()):0 ,
                        TOT_COST = TOT_COST != "" ? double.Parse(TOT_COST.Trim()) : 0  ,
                        TOT_FEE = TOT_FEE != "" ? double.Parse(TOT_FEE.Trim()) : 0 ,
                        BATCH = DateTime.Now,


                        WH_CONT = CONTRACT,
                        WHOLESALER = "Curascript SD",
                        //MATCH_COID = FAC_ACCT,
                        //MATCH_TYPE = FAC_ACCT,
                        REC_DATE  = INV_DATE!=""? DateTime.ParseExact(INV_DATE.Trim() + " 00:00:00 AM", "MM/dd/yyyy hh:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture) : (DateTime?)null,


                       // DateTime.Parse(INV_DATE.Trim()):(DateTime?) null,
                        //MMID = FAC_ACCT,


                        //ITID = FAC_ACCT,


                        WHID = 165,
                        WRPID = 27039,
                        //SALE_CR = FAC_ACCT,
                        //SALE_CRW = FAC_ACCT,
                        SALE_CRSRC = "O",
                        //EXTRA = FAC_ACCT



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
