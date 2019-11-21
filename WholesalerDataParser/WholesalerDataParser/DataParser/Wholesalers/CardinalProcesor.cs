using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
  public  class CardinalProcesor
    {
        public List<Cardinal> ProcessCardinal(string path)
        {
            var entries = new List<Cardinal>();


            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);


                foreach (var line in lines)
                {


                    int[] Field_Length = new int[] {
                                                        30, //0
                                                        3, //1
                                                        12, //2
                                                        9, //3
                                                        9, //4
                                                        30, //5
                                                        7, //6
                                                        11, //7
                                                        13, //8
                                                        30, //9
                                                        40, //10
                                                        40, //11
                                                        10, //12
                                                        10, //13
                                                        20, //14
                                                        10, //15
                                                        10, //16
                                                        12, //17
                                                        10, //18
                                                        10, //19
                                                        8, //20
                                                        11, //21
                                                        11, //22
                                                        11, //23
                                                        8, //24
                                                        12, //25
                                                        8, //26
                                                        8, //27
                                                        12, //28
                                                        
                                                 };


                    if (line.Length < Field_Length.Sum())
                    {
                        int va= Field_Length.Sum();
                        continue;
                    }

                    // GET - words from Length
                    List<string> tempWords = SplitStringByLengthArray(line, Field_Length);

                    string DC_NAME = tempWords[0].Trim();
                    string DC_NR = tempWords[1].Trim();
                    string FAC_ACCT = tempWords[2].Trim();
                    string DC_DEA = tempWords[3].Trim();
                    string FAC_DEA = tempWords[4].Trim();
                    string FAC_NAME = tempWords[5].Trim();
                    string WH_OEN = tempWords[6].Trim();
                    string NDC = tempWords[7].Trim();
                    string NDC13 = tempWords[8].Trim();
                    string VENDOR = tempWords[9].Trim();
                    string PROD_NAME = tempWords[10].Trim();
                    string GENERIC = tempWords[11].Trim();
                    string PROD_UD = tempWords[12].Trim();
                    string  PROD_FORM = tempWords[13].Trim();
                    string PROD_STRNG = tempWords[14].Trim();
                    string ITEM_SIZE = tempWords[15].Trim();
                    string FILLER4 = tempWords[16].Trim();                  
                    string INVOICE = tempWords[17].Trim();
                    string PROD_SIZE = tempWords[18].Trim();
                    string FILLER5 = tempWords[19].Trim();
                    string IDATE = tempWords[20].Trim();
                    string COST_PLLUS = tempWords[21].Trim();
                    string WAC = tempWords[22].Trim();
                    string AWP = tempWords[23].Trim();
                    string AHFS = tempWords[24].Trim();
                    string GPO = tempWords[25].Trim();
                    string SDATE = tempWords[26].Trim();
                    string SHIP_QTY = tempWords[27].Trim();
                    string COST = tempWords[28].Trim();
                    string CONTRACT = tempWords[29].Trim();




                    entries.Add(new Cardinal
                    {
                        DC_NAME = DC_NAME,
                        DC_NR = DC_NR,
                        FAC_ACCT = FAC_ACCT,
                        DC_DEA = DC_DEA,
                        FAC_DEA = FAC_DEA,
                        FAC_NAME = FAC_NAME,
                        WH_OEN = WH_OEN,
                        NDC = NDC,
                        NDC13 = NDC13,
                        VENDOR = VENDOR,
                        PROD_NAME = PROD_NAME,
                        GENERIC = GENERIC,
                        PROD_UD = PROD_UD,
                        PROD_FORM = PROD_FORM,
                        PROD_STRNG = PROD_STRNG,
                        ITEM_SIZE = ITEM_SIZE,
                        FILLER4 = FILLER4,
                        INVOICE = INVOICE,
                        PROD_SIZE = PROD_SIZE,
                        FILLER5 = FILLER5,
                        IDATE = IDATE,
                        COST_PLLUS = COST_PLLUS,
                        WAC = WAC,
                        AWP = AWP,
                        AHFS = AHFS,
                        GPO = GPO,
                        SDATE = SDATE,
                        SHIP_QTY = SHIP_QTY,
                        COST = COST,
                        CONTRACT = CONTRACT



                        //BATCH = DateTime.Now,
                        //WHOLESALER = "Cardinal",
                        //SALE_CR = ,
                        //INV_DATE = GetDateTimeFromString(sdate.Trim()),
                        //SHIP_DATE = GetDateTimeFromString(sdate.Trim()),
                        //REC_DATE = GetDateTimeFromString(sdate.Trim()),
                        //WHID = 0,
                        //WRPID = 9,
                        //MATCH_COID = 0,
                        //WH_CONT = whcont,
                        //SALE_CRW = salecrw,
                        //SALE_CRSRC = "O",
                        //EXTRA = extra




                    });
                }
            }
            return entries;
        }

        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var  month = datestr.Substring(0, 2);
            var date = datestr.Substring(2, 2);
            var year = datestr.Substring(4, 4);


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }



        public static List<string> SplitStringByLengthArray(string iTextLine, int[] Field_Length)
        {

            // Generate Index by add Previous length
            int[] iListIndex = new int[Field_Length.Length];

            int sum = Field_Length[0];

            iListIndex[0] = Field_Length[0];

            for (int i = 1; i < Field_Length.Length; i++)
            {
                sum = sum + Field_Length[i];

                iListIndex[i] = sum;

            }


            // INIT
            List<string> retObj = new List<string>();
            int currStartPos = 0;

            // GET - clear index list from dupl. and sort it
            int[] tempListIndex = iListIndex.Distinct()
                                            .OrderBy(o => o)
                                            .ToArray();
            // CTRL
            if (tempListIndex.Length != iListIndex.Length)
            {
                // ERR
                throw new Exception("Input  iListIndex contains duplicate indexes");
            }


            for (int jj = 0; jj < tempListIndex.Length; ++jj)
            {
                try
                {
                    // SET - line chunk
                    retObj.Add(iTextLine.Substring(currStartPos,
                                                   tempListIndex[jj] - currStartPos));
                }
                catch (Exception)
                {
                    // SET - line is shorter than expected
                    retObj.Add(string.Empty);
                }
                // GET - update start position
                currStartPos = tempListIndex[jj];
            }
            // SET
            retObj.Add(iTextLine.Substring(currStartPos));
            // RET
            return retObj;
        }


    }
}
