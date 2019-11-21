using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class CuraScriptCSVProcessor
    {
        public List<CuraScript> ProcessCuraScript(string path)
        {
            var entries = new List<CuraScript>();
            if (File.Exists(path))
            {

                var LineArray = File.ReadLines(path);

                foreach (var line in LineArray)
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
                        TOT_FEE = TOT_FEE.Trim()

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
                        //SALE_CR = FAC_ACCT,
                        //SALE_CRW = FAC_ACCT,
                        //SALE_CRSRC = "O",
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
