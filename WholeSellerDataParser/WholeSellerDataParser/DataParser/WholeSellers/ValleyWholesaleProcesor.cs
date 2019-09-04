using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public  class ValleyWholesaleProcesor
    {
        public List<ValleyWholesale> ProcessValleyWholesale(string path)
        {
            var entries = new List<ValleyWholesale>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    
                    int[] tempListLength = new int[] {
                                                    6,    //0 
                                                    22,   //1 
                                                    27,   //2
                                                    25,   //3
                                                    9,    //4
                                                    8,    //5
                                                    8,    //6                       
                                                    6,    //7
                                                    1,    //8
                                                    10,   //9
                                                    1,    //10
                                                    11,    //11
                                                    9,   //12
                                                    6,    //13
                                                    10,   //14
                                                    34,   //15
                                                    1,    //16
                                                    1,    //17
                                                    1,    //18
                                                    10,   //19
                                                    10,   //20
                                                    6    //21
     
                                                 };


                    if (line.Length < tempListLength.Sum())
                    {
                        continue;
                    }

                    // GET - words from Length
                    List<string> tempWords = SplitStringByLengthArray(line, tempListLength);

                    string PDATE = tempWords[0].Trim();
                    string WHOLESALER = tempWords[1].Trim();
                    string DC_DEA = tempWords[2].Trim();
                    string FAC_NAME = tempWords[3].Trim();
                    string FAC_DEA = tempWords[4].Trim();
                    string CWAC = tempWords[5].Trim();
                    string CCOST = tempWords[6].Trim();
                    string CQTY = tempWords[7].Trim();
                    string SALE_CR = tempWords[8].Trim();
                    string CONTRACT = tempWords[9].Trim();
                    string PROD_CODE = tempWords[10].Trim();
                    string NDC = tempWords[11].Trim();
                    string INVOICE = tempWords[12].Trim();
                    string SDATE = tempWords[13].Trim();
                    string CTOT_COST = tempWords[14].Trim();
                    string PROD_NAME = tempWords[15].Trim();
                    string DI = tempWords[16].Trim();
                    string UP_CHARGE = tempWords[17].Trim();
                    string DIVISION = tempWords[18].Trim();
                    string FAC_ACCT = tempWords[19].Trim();
                    string VE_ITEMNR = tempWords[20].Trim();
                    string IDATE = tempWords[21].Trim();
                    string VENDOR = tempWords[22].Trim();

                    

                    
                    entries.Add(new ValleyWholesale
                    {                   
                        // FAC_ACCT = facacct.Trim(),
                        PDATE   =  PDATE   ,
                        WHOLESALER  =  WHOLESALER  ,
                        DC_DEA  =  DC_DEA  ,
                        FAC_NAME    =  FAC_NAME    ,
                        CWAC    =  CWAC    ,
                        FAC_DEA =  FAC_DEA ,
                        CCOST   =  CCOST   ,
                        CQTY    =  CQTY    ,
                        SALE_CR =  SALE_CR ,
                        CONTRACT    =  CONTRACT    ,
                        PROD_CODE   =  PROD_CODE   ,
                        NDC =  NDC ,
                        INVOICE =  INVOICE ,
                        SDATE   =  SDATE   ,
                        CTOT_COST   =  CTOT_COST   ,
                        PROD_NAME   =  PROD_NAME   ,
                        DI  =  DI  ,
                        UP_CHARGE   =  UP_CHARGE   ,
                        DIVISION    =  DIVISION    ,
                        FAC_ACCT    =  FAC_ACCT    ,
                        VE_ITEMNR   =  VE_ITEMNR   ,
                        IDATE   =  IDATE   ,
                        VENDOR  =  VENDOR  ,

                        //BATCH = BATCH,
                        //WAC = WAC,
                        //COST = COST,
                        //SHIP_QTY = SHIP_QTY,
                        //TOT_COST = TOT_COST,
                        //MATCH_TYPE = MATCH_TYPE,
                        //SHIP_DATE = SHIP_DATE,
                        //INV_DATE = INV_DATE,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = MATCH_COID,
                        //REC_DATE = REC_DATE,
                        //MMID = MMID,
                        //WHID = WHID,
                        //WRPID = WRPID,
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
            if (string.IsNullOrEmpty(datestr)) return null;
            var  month = datestr.Substring(0, 2);
            var date = datestr.Substring(2, 2);
            var year = datestr.Substring(4, 4);


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }


        public static List<string> SplitStringByLengthArray(string iTextLine, int[] tempListLength)
        {

            // Generate Index by add Previous length
            int[] iListIndex = new int[tempListLength.Length];

            int sum = tempListLength[0];

            iListIndex[0] = tempListLength[0];

            for (int i = 1; i < tempListLength.Length; i++)
            {
                sum = sum + tempListLength[i];

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
