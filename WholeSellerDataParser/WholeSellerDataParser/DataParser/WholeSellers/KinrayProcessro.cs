using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
   public class KinrayProcessro
    {
        public List<Kinray> ProcessKinray(string path)
        {
            var entries = new List<Kinray>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    if (entries.Count >= 288) return entries; ;
                    if (line == "") continue;
                    var ss = line.Split(',').ToList();
                    if (ss[0] == "\"MEMBER\"") continue;



                    var FAC_NAME = ss[0].Replace("\"", "").Trim();
                    var NDC = ss[1].Replace("\"", "").Trim();
                    var PROD_NAME = ss[2].Replace("\"", "").Trim();
                    var PROD_SIZE = ss[3].Replace("\"", "").Trim();
                    var VENDOR = ss[4].Replace("\"", "").Trim();
                    var SHIP_QTY = ss[5].Replace("\"", "").Trim();
                    var COST = ss[6].Replace("\"", "").Trim();
                    var TOT_COST = ss[7].Replace("\"", "").Trim();
                    var INVOICE = ss[8].Replace("\"", "").Trim();
                    var IDATE = ss[9].Replace("\"", "").Trim();
                    var GPO = ss[10].Replace("\"", "").Trim();
                    var CONTRACT = ss[11].Replace("\"", "").Trim();
                    var FAC_DEA = ss[12].Replace("\"", "").Trim();
                    var FAC_ACCT = ss[13].Replace("\"", "").Trim();
                    var VE_ITEMNR = ss[14].Replace("\"", "").Trim();






                    entries.Add(new Kinray
                    {

                        FAC_NAME = FAC_NAME,
                        NDC = NDC,
                        PROD_NAME = PROD_NAME,
                        PROD_SIZE = PROD_SIZE,
                        VENDOR = VENDOR,
                        SHIP_QTY = SHIP_QTY!=""?Int32.Parse(SHIP_QTY.Trim()):0 ,
                        COST = COST != "" ? double.Parse(COST.Trim()) : 0  ,
                        TOT_COST = TOT_COST != "" ? double.Parse(TOT_COST.Trim()) : 0,
                        INVOICE = INVOICE,
                        IDATE = IDATE,
                        GPO = GPO,
                        CONTRACT = CONTRACT,
                        FAC_DEA = FAC_DEA,
                        FAC_ACCT = FAC_ACCT,
                        VE_ITEMNR = VE_ITEMNR,
                        BATCH = DateTime.Now,


                        WHID = 2,
                        WRPID = 10,
                        WHOLESALER = "Kinray",


                        DC_NAME = "Whitestone",
                        INV_DATE = GetDateTimeFromString(IDATE) ,
                        REC_DATE = GetDateTimeFromString(IDATE),
                        WH_CONT = CONTRACT,
                        //MATCH_COID = MATCH_COID,


                        //MATCH_TYPE = MATCH_TYPE,
                        //SALE_CR = SALE_CR,
                        //MMID = MMID,
                        //ITID = ITID,
                        //SALE_CRW = SALE_CRW,
                        SALE_CRSRC = "O",
                        //EXTRA = EXTRA,




                    });
                }
            }
            return entries;
        }

        private DateTime? GetDateTimeFromString(string datestr)
        {
            //062119
            if (string.IsNullOrEmpty(datestr)) return null;
            datestr = "0" + datestr;
            var month = datestr.Substring(0, 2);
            var date = datestr.Substring(2, 2);
            var year = "20"+ datestr.Substring(4, 2);


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
}
