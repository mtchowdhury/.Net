using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class BioCareProcessor
    {
        public List<BioCare> ProcessBioCare(string path)
        {
            var entries = new List<BioCare>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    
                    if(line.Contains("contract"))continue;
                    string sep = "\t";

                   // string[] splitContent = line.Split(sep.ToCharArray());
                    var ss= line.Split(sep.ToCharArray());

                    var CONTRACT = ss[0];
                    var CCOST = ss[1];
                    var FAC_NAME = ss[2];
                    var FAC_ACCT = ss[3];
                    var FAC_DEA = ss[4];
                    var FAC_HIN = ss[5];
                    var FAC_CITY = ss[6];
                    var FAC_STATE = ss[7];
                    var WH_OEN = ss[8];
                    var DC_DEA = ss[9];


                    var DC_NAME = ss[10];
                    var DROP_SHIP = ss[11];
                    var FILLER1 = ss[12];
                    var INV_DATE = ss[13];
                    var INVOICE = ss[14];
                    var NDC = ss[15].Replace("-","");
                    var FILLER2 = ss[16];
                    var CQTY = ss[17];
                    var SHIP_DATE = ss[18];
                    var PROD_SIZE = ss[19];
                    var FILLER3 = ss[20];
                    var CTOTCOST = ss[21].Replace("\"",""); 
                    var PROD_NAME = ss[22];
                    var PROD_UM = ss[23];
                    var UP_DN_CHG = ss[24].Replace("%","");
                    var VENDOR = ss[25];
                    var VE_ITEMNR = ss[26];
                    var WAC = ss[27];
                    var FILLER4 = ss[28];
                    var WH_NOTES = ss[29];

                    //var TOT_COST = line.Substring(0, 8).Trim();
                    //var WH_CONT = line.Substring(0, 8).Trim();
                    //var REC_DATE = line.Substring(0, 8).Trim();
                    //var WRPID = line.Substring(0, 8).Trim();
                    //var UPC = line.Substring(0, 8).Trim();


                    entries.Add(new BioCare
                    {
                        CONTRACT = CONTRACT.Trim(),
                        CCOST =CCOST.Trim() ,
                        FAC_NAME = FAC_NAME.Trim(),
                        FAC_ACCT = FAC_ACCT.Trim(),
                        FAC_DEA = FAC_DEA.Trim(),
                        FAC_HIN = FAC_HIN.Trim(),
                        FAC_CITY = FAC_CITY.Trim(),
                        FAC_STATE = FAC_STATE.Trim(),
                        WH_OEN = WH_OEN.Trim(),
                        DC_DEA = DC_DEA.Trim(),
                        DC_NAME = DC_NAME.Trim(),
                        DROP_SHIP = DROP_SHIP.Trim(),
                        FILLER1 = FILLER1.Trim(),
                        INV_DATE = INV_DATE.Trim(),
                        INVOICE = INVOICE.Trim(),
                        NDC = NDC.Trim(),
                        FILLER2 = FILLER2.Trim(),
                        CQTY = CQTY.Trim(),
                        SHIP_DATE = SHIP_DATE.Trim(),
                        PROD_SIZE = PROD_SIZE.Trim(),
                        FILLER3 = FILLER3.Trim(),
                        CTOTCOST = CTOTCOST.Trim(),
                        PROD_NAME = PROD_NAME.Trim(),
                        PROD_UM = PROD_UM.Trim(),
                        UP_DN_CHG = UP_DN_CHG.Trim(),
                        VENDOR = VENDOR.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        WAC = WAC.Trim(),
                        FILLER4 = FILLER4.Trim(),
                        WH_NOTES = WH_NOTES.Trim()

                        //BATCH = DateTime.Now,
                        //WHOLESALER = "BIOCARE",
                        //COST = CCOST,
                        //SHIP_QTY = CQTY,
                        //TOT_COST = TOT_COST,
                        //WH_CONT = CONTRACT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //REC_DATE = DateTime.Parse(SHIP_DATE),
                        //MMID = MMID,
                        //ITID = ITID,
                        //WHID = 158,
                        //WRPID = 14821,
                        //SALE_CR = SALE_CR,
                        //WH_CONT = "",
                        //MATCH_COID = "",
                        //MATCH_TYPE = "",
                        //UPC = "" 




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
