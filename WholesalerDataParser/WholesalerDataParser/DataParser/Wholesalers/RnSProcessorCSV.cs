using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class RnSProcessorCSV
    {
        public List<RnSPharma> ProcessRnS(string path)
        {
            var entries = new List<RnSPharma>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    //if (entries.Count > 1083850) return entries; ;
                    if (line == "") continue;
                    var LineArray = line.Split(',').ToList();

                    if (LineArray[0] == "fac_name") continue;

                   
                    var FAC_NAME = LineArray[0];
                    var FAC_ADDR = LineArray[1];
                    var FAC_CITY = LineArray[2];
                    var FAC_STATE = LineArray[3];
                    var FAC_ZIP = LineArray[4];


                    var FAC_DEA = LineArray[5];
                    var FAC_HIN = LineArray[6];
                    var FILLER1 = LineArray[7];
                    var PROD_NAME = LineArray[8];
                    var CNDC = LineArray[9];


                    var INV_DATE = LineArray[10];
                    var INVOICE = LineArray[11];
                    var SHIP_QTY = LineArray[12];
                    var TOT_COST = LineArray[13];
                    var FILLER2 = LineArray[14];
                  





                    entries.Add(new RnSPharma
                    {
                    
                        FAC_NAME = FAC_NAME,
                        FAC_ADDR = FAC_ADDR,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        FAC_ZIP = FAC_ZIP,


                        FAC_DEA = FAC_DEA,
                        FAC_HIN = FAC_HIN,
                        FILLER1 = FILLER1,
                        PROD_NAME = PROD_NAME,
                        CNDC = CNDC,


                        INV_DATE = INV_DATE,
                        INVOICE = INVOICE,
                        SHIP_QTY = SHIP_QTY,
                        TOT_COST = TOT_COST,
                        FILLER2 = FILLER2,

                        //BATCH = DateTime.Now,
                        //COST = 7.9900,// eta pore dekhte hobe
                        //NDC = CNDC,
                        //WHID = 154,
                        //WRPID = 14691,
                        //WHOLESALER = "R&S Northeast",
                        //REC_DATE = DateTime.Parse(INV_DATE),
                        //CONTRACT = CONTRACT,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //SALE_CR = "C",
                        //MMID = MMID,
                        //ITID = ITID,
                        //SALE_CRW = "C",
                        //SALE_CRSRC = "O",
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
