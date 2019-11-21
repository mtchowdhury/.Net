using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
  public  class CardinalProcesorW
    {
        public List<Cardinal_W> ProcesorCardinalW(string path)
        {
            var entries = new List<Cardinal_W>();


            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);


                foreach (var line in lines)
                {



                    int[] Field_Length = new int[] {
                                                        40, //0			
                                                        9, //1			
                                                        25, //2			
                                                        20, //3			
                                                        2, //4			
                                                        9, //5			
                                                        9, //6			
                                                        9, //7			
                                                        9, //8			
                                                        10, //9			
                                                        10, //10			
                                                        4, //11			
                                                        10, //12			
                                                        13, //13			
                                                        15, //14			
                                                        1, //15			
                                                        10, //16			
                                                        8, //17			
                                                        11, //18			
                                                        11, //19			
                                                        14, //20			
                                                        12, //21			
                                                        13, //22			
                                                        13, //23			
                                                        9, //24			
                                                        8, //25			
                                                        8, //26			
                                                        8, //27			
                                                        40, //28			
		                                                9, //29	
                                                        9, //30	
                                                        11, //31	
                                                        10, //32	
                                                        3, //33	
                                                        7, //34	
                                                        40, //35	
                                                        83
                                                     };

                    int va = Field_Length.Sum();

                    if (line.Length < Field_Length.Sum())
                    {
                        
                        continue;
                    }

                    // GET - words from Length
                    List<string> tempWords = SplitStringByLengthArray(line, Field_Length);

                    string DC_NAME = tempWords[0].Trim();
                    string DC_DEA = tempWords[1].Trim();
                    string FAC_NAME = tempWords[2].Trim();
                    string FAC_CITY = tempWords[3].Trim();
                    string FAC_STATE = tempWords[4].Trim();
                    string FAC_DEA = tempWords[5].Trim();
                    string FAC_OLDDEA = tempWords[6].Trim();
                    string FAC_HIN = tempWords[7].Trim();
                    string FAC_OLDHIN = tempWords[8].Trim();
                    string CWAC = tempWords[9].Trim();
                    string CCOST = tempWords[10].Trim();
                    string ITEM_SIZE = tempWords[11].Trim();
                    string CSHIP_QTY = tempWords[12].Trim();
                    string CTOT_COST = tempWords[13].Trim();
                    string FILLER = tempWords[14].Trim();
                    string SALE_CR = tempWords[15].Trim();
                    string CONTRACT = tempWords[16].Trim();
                    string FILLER1 = tempWords[17].Trim();
                    string NDC = tempWords[18].Trim();
                    string OLD_NDC = tempWords[19].Trim();
                    string UPC = tempWords[20].Trim();
                    string OLD_UPC = tempWords[21].Trim();
                    string UPN = tempWords[22].Trim();
                    string OLD_UPN = tempWords[23].Trim();
                    string INVOICE = tempWords[24].Trim();
                    string IDATE = tempWords[25].Trim();
                    string FILLER2 = tempWords[26].Trim();
                    string SDATE = tempWords[27].Trim();
                    string PROD_NAME = tempWords[28].Trim();
                    string PROD_SIZE = tempWords[29].Trim();
                    string PROD_STRNG = tempWords[30].Trim();
                    string FILLER3 = tempWords[31].Trim();
                    string FAC_ACCT = tempWords[32].Trim();
                    string FILLER4 = tempWords[33].Trim();
                    string WH_OEN = tempWords[34].Trim();
                    string VENDOR = tempWords[35].Trim();
                    string FILLER5 = tempWords[36].Trim();
                    string FAC_ADDR = tempWords[37].Trim();


                    entries.Add(new Cardinal_W
                    {
                        DC_NAME = DC_NAME,
                        DC_DEA = DC_DEA,
                        FAC_NAME = FAC_NAME,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        FAC_DEA = FAC_DEA,
                        FAC_OLDDEA = FAC_OLDDEA,
                        FAC_HIN = FAC_HIN,
                        FAC_OLDHIN = FAC_OLDHIN,
                        CWAC = CWAC,
                        CCOST = CCOST,
                        ITEM_SIZE = ITEM_SIZE,
                        CSHIP_QTY = CSHIP_QTY,
                        CTOT_COST = CTOT_COST,
                        FILLER = FILLER,
                        SALE_CR = SALE_CR,
                        CONTRACT = CONTRACT,
                        FILLER1 = FILLER1,
                        NDC = NDC,
                        OLD_NDC = OLD_NDC,
                        UPC = UPC,
                        OLD_UPC = OLD_UPC,
                        UPN = UPN,
                        OLD_UPN = OLD_UPN,
                        INVOICE = INVOICE,
                        IDATE = IDATE,
                        FILLER2 = FILLER2,
                        SDATE = SDATE,
                        PROD_NAME = PROD_NAME,
                        PROD_SIZE = PROD_SIZE,
                        PROD_STRNG = PROD_STRNG,
                        FILLER3 = FILLER3,
                        FAC_ACCT = FAC_ACCT,
                        FILLER4 = FILLER4,
                        WH_OEN = WH_OEN,
                        VENDOR = VENDOR,
                        FILLER5 = FILLER5,
                        FAC_ADDR = FAC_ADDR,

                        //BATCH = BATCH,
                        //WHOLESALER = WHOLESALER,
                        //WAC = WAC,
                        //COST = COST,
                        //SHIP_QTY = SHIP_QTY,
                        //TOT_COST = TOT_COST,
                        //INV_DATE = INV_DATE,
                        //SHIP_DATE = SHIP_DATE,
                        //REC_DATE = REC_DATE,
                        //MMID = MMID,
                        //ITID = ITID,
                        //WHID = WHID,
                        //WRPID = WRPID,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //WH_CONT = WH_CONT,
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
