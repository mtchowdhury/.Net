using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public  class MorrisDicksonProcesor
    {
        public List<MorrisDickson> ProcessMorrisDickson(string path)
        {
            var entries = new List<MorrisDickson>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                   

                    int[] tempListLength = new int[] {
                                                8,    //0 
                                                40,   //1 
                                                9,   //2
                                                25,   //3
                                                9,    //4
                                                9,    //5
                                                20,    //6                       
                                                2,    //7
                                                10,    //8
                                                10,   //9
                                                6,    //10
                                                1,    //11
                                                12,   //12
                                                8,    //13
                                                11,   //14
                                                11 ,  //15
                                                10,   //16
                                                10,    //17
                                                19,    //18
                                                7,   //19
                                                8,  //20
                                                12,  //21                                                    
                                                40,  //22
                                                9,  //23
                                                27, //24
                                                1,  //25
                                                1,  //26
                                                9,  //27
                                                15, //28
                                                 1, //29
                                                40, //30
                                                9,  //31
                                                21, //32
                                                1,  //33
                                                1,  //34
                                                1,  //35
                                                5   //36
                                                 };

                    if (line.Length < tempListLength.Sum())
                    {
                        continue;
                    }

                    // GET - words from Length
                    List<string> tempWords = SplitStringByLengthArray(line, tempListLength);

                    string FCDATE = tempWords[0].Trim();
                    string DC_NAME = tempWords[1].Trim();
                    string DC_DEA = tempWords[2].Trim();
                    string FAC_NAME = tempWords[3].Trim();
                    string FAC_DEA = tempWords[4].Trim();
                    string FAC_HIN = tempWords[5].Trim();
                    string FAC_CITY = tempWords[6].Trim();
                    string FAC_STATE = tempWords[7].Trim();
                    string CWAC = tempWords[8].Trim();
                    string CCOST = tempWords[9].Trim();
                    string CQTY = tempWords[10].Trim();
                    string SALE_CR = tempWords[11].Trim();
                    string CONTRACT = tempWords[12].Trim();
                    string CONT_START = tempWords[13].Trim();
                    string NDC = tempWords[14].Trim();
                    string OLD_NDC = tempWords[15].Trim();
                    string UPC = tempWords[16].Trim();
                    string UPN = tempWords[17].Trim();
                    string FILLER = tempWords[18].Trim();
                    string INVOICE = tempWords[19].Trim();
                    string SDATE = tempWords[20].Trim();
                    string CTOTAL = tempWords[21].Trim();
                    string PROD_NAME = tempWords[22].Trim();
                    string PROD_SIZE = tempWords[23].Trim();
                    string PROD_STRNG = tempWords[24].Trim();
                    string DC_NR = tempWords[25].Trim();
                    string FAC_ACCT = tempWords[26].Trim();
                    string WH_OEN = tempWords[27].Trim();
                    string VE_ITEMNR = tempWords[28].Trim();
                    string FILLER1 = tempWords[29].Trim();
                    string VENDOR = tempWords[30].Trim();
                    string IDATE = tempWords[31].Trim();
                    string CHG_NUM = tempWords[32].Trim();
                    string CONVERSION = tempWords[33].Trim();
                    string CREDREBILL = tempWords[34].Trim();
                    string DISCOUNT = tempWords[35].Trim();
                    //string BATCH = tempWords[36].Trim();
                    //string WHOLESALER =	 tempWords[37].Trim();	
                    //string WH_CONT =	 tempWords[38].Trim();	
                    //string MATCH_COID =	 tempWords[39].Trim();	
                    //string MATCH_TYPE =	 tempWords[40].Trim();	
                    //string SHIP_QTY =	 tempWords[41].Trim();	
                    //string COST =	 tempWords[42].Trim();	
                    //string TOT_COST =	 tempWords[43].Trim();	
                    //string WAC =	 tempWords[44].Trim();	
                    //string SHIP_DATE =	 tempWords[45].Trim();	
                    //string INV_DATE =	 tempWords[46].Trim();	
                    //string REC_DATE =	 tempWords[47].Trim();	
                    //string MMID =	 tempWords[48].Trim();	
                    //string WHID =	 tempWords[49].Trim();	
                    //string WRPID =	 tempWords[50].Trim();	
                    //string ITID =	 tempWords[51].Trim();	
                    //string SALE_CRW =	 tempWords[52].Trim();	
                    //string SALE_CRSRC =	 tempWords[53].Trim();	
                    //string EXTRA =	 tempWords[54].Trim();	




                    entries.Add(new MorrisDickson
                    {
                FCDATE  =  FCDATE  ,
                DC_NAME =  DC_NAME ,
                DC_DEA  =  DC_DEA  ,
                FAC_NAME    =  FAC_NAME    ,
                FAC_DEA =  FAC_DEA ,
                FAC_HIN =  FAC_HIN ,
                FAC_CITY    =  FAC_CITY    ,
                FAC_STATE   =  FAC_STATE   ,
                CWAC    =  CWAC    ,
                CCOST   =  CCOST   ,
                CQTY    =  CQTY    ,
                SALE_CR =  SALE_CR ,
                CONTRACT    =  CONTRACT    ,
                CONT_START  =  CONT_START  ,
                NDC =  NDC ,
                OLD_NDC =  OLD_NDC ,
                UPC =  UPC ,
                UPN =  UPN ,
                FILLER  =  FILLER  ,
                INVOICE =  INVOICE ,
                SDATE   =  SDATE   ,
                CTOTAL  =  CTOTAL  ,
                PROD_NAME   =  PROD_NAME   ,
                PROD_SIZE   =  PROD_SIZE   ,
                PROD_STRNG  =  PROD_STRNG  ,
                DC_NR   =  DC_NR   ,
                FAC_ACCT    =  FAC_ACCT    ,
                WH_OEN  =  WH_OEN  ,
                VE_ITEMNR   =  VE_ITEMNR   ,
                FILLER1 =  FILLER1 ,
                VENDOR  =  VENDOR  ,
                IDATE = IDATE,
                CHG_NUM = CHG_NUM,
                CONVERSION = CONVERSION,
                CREDREBILL = CREDREBILL,
                DISCOUNT = DISCOUNT,
                //BATCH   =  BATCH   ,
                //WHOLESALER  =  WHOLESALER  ,
                //WH_CONT =  WH_CONT ,
                //MATCH_COID  =  MATCH_COID  ,
                //MATCH_TYPE  =  MATCH_TYPE  ,
                //SHIP_QTY    =  SHIP_QTY    ,
                //COST    =  COST    ,
                //TOT_COST    =  TOT_COST    ,
                //WAC =  WAC ,
                //SHIP_DATE   =  SHIP_DATE   ,
                //INV_DATE    =  INV_DATE    ,
                //REC_DATE    =  REC_DATE    ,
                //MMID    =  MMID    ,
                //WHID    =  WHID    ,
                //WRPID   =  WRPID   ,
                //ITID    =  ITID    ,
                //SALE_CRW    =  SALE_CRW    ,
                //SALE_CRSRC  =  SALE_CRSRC  ,
                //EXTRA   =  EXTRA   ,




                    });
                }
            }
            return entries;
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


        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var  month = datestr.Substring(0, 2);
            var date = datestr.Substring(2, 2);
            var year = datestr.Substring(4, 4);


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
}
