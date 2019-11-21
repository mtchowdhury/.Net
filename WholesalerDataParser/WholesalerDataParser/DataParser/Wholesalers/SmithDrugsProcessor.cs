using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser
{
    public class SmithDrugsProcessor
    {
        public List<SmithDrug> ProcessSmithDrugs(string path)
        {
            var entries = new List<SmithDrug>();
            {
              
                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {

                    int[] Field_Length = new int[] {
                                                    8,    //0 
                                                    40,   //1 
                                                    9,   //2
                                                    25,   //3
                                                    9,    //4
                                                    10,    //5
                                                    10,    //6                       
                                                    6,    //7
                                                    1,    //8
                                                    10,   //9
                                                    8,    //10
                                                    11,    //11
                                                    12,   //12
                                                    11,    //13
                                                    13,    //14
                                                    9,   //15
                                                    8,   //16                                                    
                                                    12,   //17
                                                    20,    //18
                                                    9,   //19
                                                    9,   //20
                                                    2,   //21
                                                    5,    //22
                                                    16,    //23

                                                    4,    //24
                                                    10,    //25
                                                    8,    //26
                                                    10,    //27
                                                    9,    //28
                                                   
                                                    
                                                 };




                    if (line.Length < Field_Length.Sum())
                    {
                        continue;
                    }

                    // GET - words from Length
                    List<string> tempWords = SplitStringByLengthArray(line, Field_Length);
                    
                    string FCDATE = tempWords[0].Trim();
                    string DC_NAME = tempWords[1].Trim();
                    string DC_DEA = tempWords[2].Trim();
                    string FAC_NAME = tempWords[3].Trim();
                    string FAC_DEA = tempWords[4].Trim();
                    string CWAC = tempWords[5].Trim();
                    string CCOST = tempWords[6].Trim();
                    string CQTY = tempWords[7].Trim();
                    string SALE_CR = tempWords[8].Trim();
                    string CONTRACT = tempWords[9].Trim();
                    string CONT_START = tempWords[10].Trim();
                    string NDC = tempWords[11].Trim();
                    string OLD_NDC = tempWords[12].Trim();
                    string UPC = tempWords[13].Trim();
                    string UPN = tempWords[14].Trim();
                    string INVOICE = tempWords[15].Trim();
                    string SDATE = tempWords[16].Trim();
                    string CTOTAL = tempWords[17].Trim();
                    string PROD_NAME = tempWords[18].Trim();
                    string PROD_SIZE = tempWords[19].Trim();
                    string PROD_STRNG = tempWords[20].Trim();
                    string FILLER = tempWords[21].Trim();                   
                    string UP_DN_CHG = tempWords[22].Trim();
                    string FILLER2 = tempWords[23].Trim();

                    string FAC_ACCT = tempWords[24].Trim();
                    string VE_ITEMNR = tempWords[25].Trim();
                    string IDATE = tempWords[26].Trim();
                    string VEN_NR = tempWords[27].Trim();
                    string CHG_NUM = tempWords[28].Trim();
                    string CONVERSION = tempWords[29].Trim();
                    


                    entries.Add(new SmithDrug
                    {
                        FCDATE = FCDATE,
                        DC_NAME = DC_NAME,
                        DC_DEA = DC_DEA,
                        FAC_NAME = FAC_NAME,
                        FAC_DEA = FAC_DEA,
                        CWAC = CWAC,
                        CCOST = CCOST,
                        CQTY = CQTY,
                        SALE_CR = SALE_CR,
                        CONTRACT = CONTRACT,
                        CONT_START = CONT_START,
                        NDC = NDC,
                        OLD_NDC = OLD_NDC,
                        UPC = UPC,
                        UPN = UPN,
                        INVOICE = INVOICE,
                        SDATE = SDATE,
                        CTOTAL = CTOTAL,
                        PROD_NAME = PROD_NAME,
                        PROD_SIZE = PROD_SIZE,
                        PROD_STRNG = PROD_STRNG,
                        FILLER = FILLER,
                        UP_DN_CHG = UP_DN_CHG,
                        FILLER2 = FILLER2,
                        FAC_ACCT = FAC_ACCT,
                        VE_ITEMNR = VE_ITEMNR,
                        IDATE = IDATE,
                        VEN_NR = VEN_NR,
                        CHG_NUM = CHG_NUM,
                        CONVERSION = CONVERSION,
                        //BATCH = BATCH,
                        //WHOLESALER = WHOLESALER,
                        //WH_CONT = WH_CONT,
                        //MATCH_COID = MATCH_COID,
                        //MATCH_TYPE = MATCH_TYPE,
                        //SHIP_QTY = SHIP_QTY,
                        //COST = COST,
                        //TOT_COST = TOT_COST,
                        //WAC = WAC,
                        //SHIP_DATE = SHIP_DATE,
                        //INV_DATE = INV_DATE,
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
            var date = datestr.Substring(0, 2);
            var month = datestr.Substring(2, 2);
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

