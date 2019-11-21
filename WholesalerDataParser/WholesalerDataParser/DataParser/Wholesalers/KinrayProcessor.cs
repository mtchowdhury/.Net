using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class KinrayProcessor
    {
        public List<Kinray> ProcessKinray(string path)
        {
            var entries = new List<Kinray>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    if (line == "") continue;
                    // var LineArray = line.Split(',').ToList();

                    var LineArray = line.Split(new string[] { @"""," }, StringSplitOptions.None).ToList();

                    if (LineArray[0] == @"""MEMBER") continue;




                    var FAC_NAME = LineArray[0].Replace("\"", "").Trim();

                    var tempStr = LineArray[1].Split(',').ToList();

                    var NDC = tempStr[0].Replace("\"", "").Trim();
                    var PROD_NAME = tempStr[1].Replace("\"", "").Trim();

                    var PROD_SIZE = LineArray[2].Replace("\"", "").Trim();
                    var VENDOR = LineArray[3].Replace("\"", "").Trim();

                    tempStr = LineArray[4].Split(',').ToList();

                    var SHIP_QTY = tempStr[0].Replace("\"", "").Trim();
                    var COST = tempStr[1].Replace("\"", "").Trim();
                    var TOT_COST = tempStr[2].Replace("\"", "").Trim();
                    var INVOICE = tempStr[3].Replace("\"", "").Trim();

                    tempStr = LineArray[5].Split(',').ToList();

                    var IDATE = tempStr[0].Replace("\"", "").Trim();
                    var GPO = tempStr[1].Replace("\"", "").Trim();


                    var CONTRACT = LineArray[6].Replace("\"", "").Trim();
                    var FAC_DEA = LineArray[7].Replace("\"", "").Trim();

                    tempStr = LineArray[8].Split(',').ToList();

                    var FAC_ACCT = tempStr[0].Replace("\"", "").Trim();
                    var VE_ITEMNR = tempStr[1].Replace("\"", "").Trim();






                    entries.Add(new Kinray
                    {

                        FAC_NAME = FAC_NAME.Trim(),
                        NDC = NDC.Trim(),
                        PROD_NAME = PROD_NAME.Trim(),
                        PROD_SIZE = PROD_SIZE.Trim(),
                        VENDOR = VENDOR.Trim(),
                        SHIP_QTY = SHIP_QTY.Trim(),
                        COST = COST.Trim(),
                        TOT_COST = TOT_COST.Trim(),
                        INVOICE = INVOICE,
                        IDATE = IDATE,
                        GPO = GPO,
                        CONTRACT = CONTRACT,
                        FAC_DEA = FAC_DEA,
                        FAC_ACCT = FAC_ACCT,
                        VE_ITEMNR = VE_ITEMNR,

                        //BATCH = BATCH,
                        //WHID = WHID,
                        //WRPID = WRPID,
                        //WHOLESALER = WHOLESALER,
                        //DC_NAME = DC_NAME,
                        //INV_DATE = INV_DATE,
                        //REC_DATE = REC_DATE,
                        //WH_CONT = CONTRACT,
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
