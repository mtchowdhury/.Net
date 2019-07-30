using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
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
                    var NDC = ss[15].Replace("-","");//-bad dite hobe
                    var FILLER2 = ss[16];
                    var CQTY = ss[17];
                    var SHIP_DATE = ss[18];
                    var PROD_SIZE = ss[19];
                    var FILLER3 = ss[20];
                    var CTOTCOST = ss[21].Replace("\"",""); // \ bad dite hobe
                    var PROD_NAME = ss[22];
                    var PROD_UM = ss[23];
                    var UP_DN_CHG = ss[24].Replace("%","");// % bad dite hobe
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
                        CONTRACT = CONTRACT,
                        CCOST =double.Parse(CCOST) ,
                        FAC_NAME = FAC_NAME,
                        FAC_ACCT = FAC_ACCT,
                        FAC_DEA = FAC_DEA,
                        FAC_HIN = FAC_HIN,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        WH_OEN = WH_OEN,
                        DC_DEA = DC_DEA,
                        DC_NAME = DC_NAME,
                        DROP_SHIP = DROP_SHIP,
                        FILLER1 = FILLER1,
                        INV_DATE = INV_DATE,
                        INVOICE = INVOICE,
                        NDC = NDC,  //ndc != "" ? ndc : "00000000000",
                        FILLER2 = FILLER2,
                        CQTY = CQTY,
                        SHIP_DATE = DateTime.Parse(SHIP_DATE) ,
                        PROD_SIZE =Int32.Parse(PROD_SIZE) ,
                        FILLER3 = Int32.Parse(FILLER3) ,
                        CTOTCOST =double.Parse(CTOTCOST) ,
                        PROD_NAME = PROD_NAME,
                        PROD_UM = PROD_UM,
                        UP_DN_CHG = UP_DN_CHG, //awp != "" ? double.Parse(awp.Trim()) : 0.0000,
                        VENDOR = VENDOR, //wac != "" ? double.Parse(wac.Trim()) : 0.0000,
                        VE_ITEMNR = VE_ITEMNR, //Int32.Parse(orderqt.Trim()),
                        WAC = WAC, //Int32.Parse(shipqty.Trim()),
                        FILLER4 = FILLER4,
                        WH_NOTES = WH_NOTES, //updnchg != "" ? double.Parse(updnchg.Trim()) : 0.0000,
                        TOT_COST = CTOTCOST, //totcost != "" ? double.Parse(totcost.Trim()) : 0.0000,
                        BATCH = DateTime.Now,
                        WHOLESALER = "BIOCARE",
                        COST = CCOST,
                        SHIP_QTY = CQTY,
                       // TOT_COST = TOT_COST,
                        WH_CONT = CONTRACT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        REC_DATE =DateTime.Parse(SHIP_DATE) ,
                        //MMID = MMID,
                        //ITID = ITID,
                        WHID = 158,
                        WRPID = 14821,
                        //SALE_CR = SALE_CR,
                        //WH_CONT = "",
                        //MATCH_COID = "",
                        //MATCH_TYPE = "",
                        UPC = "" //odate != "" ? GetDateTimeFromString(odate.Trim()) : null,
                                  //  SALE_CRW = SALE_CRW sdate != "" ? GetDateTimeFromString(sdate.Trim()) : null,
                                  //  SALE_CRSRC = SALE_CRSRC idate != "" ? GetDateTimeFromString(idate.Trim()) : null,
                                  // EXTRA = EXTRA idate != "" ? GetDateTimeFromString(idate.Trim()) : null,






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
