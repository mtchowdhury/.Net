using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public  class RDCProcesor
    {
        public List<RDC> ProcessRDC(string path)
        {
            var entries = new List<RDC>();
            if (File.Exists(path))
            {



                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {


                    int[] tempListLength = new int[] {
                                                        8,    //0      
                                                        40,   //1     
                                                        9,    //2  
                                                        25,   //3
                                                        9,    //4  
                                                        10,   //5  
                                                        10,   //6  
                                                        11,   //7 
                                                        10,   //8
                                                        10,   //9
                                                        6,   //10 
                                                        1,   //11 
                                                        10,  //12 
                                                        10,  //13 
                                                        11,  //14 
                                                        10,  //15 
                                                        10,  //16 
                                                        18,  //17 
                                                        7,   //18 
                                                        8,   //19 
                                                        12,  //20                                                     
                                                        40,  //21 
                                                        8,   //22 
                                                        10,  //23 
                                                        10,  //24 
                                                        6,   //25 
                                                        12,  //26 
                                                        8,   //27 
                                                        10,   //28 
                                                        40,   //29 
                                                        8,   //30
                                                        10,   //31
                                                        10,   //32 
                                                        3,   //33 
                                                        1,   //34 
                                                 };


                    //  421
                    //  397

                    // if line lenght 397 remove last 4 element from array tempListLength

                    if (line.Length == 397)
                    {
                        List<int> lst_numbers = new List<int>(tempListLength);
                        lst_numbers.RemoveAt(31);
                        lst_numbers.RemoveAt(31);
                        lst_numbers.RemoveAt(31);
                        lst_numbers.RemoveAt(31);
                        tempListLength = lst_numbers.ToArray();
                    }



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
                    string INVOICE = tempWords[18].Trim();
                    string SDATE = tempWords[19].Trim();
                    string CTOTAL = tempWords[20].Trim();
                    string PROD_NAME = tempWords[21].Trim();
                    string PROD_SIZE = tempWords[22].Trim();
                    string PROD_STRNG = tempWords[23].Trim();
                    string FILLER = tempWords[24].Trim();
                    string DC_NR = tempWords[25].Trim();
                    string FAC_ACCT = tempWords[26].Trim();
                    string WH_OEN = tempWords[27].Trim();
                    string VE_ITEMNR = tempWords[28].Trim();
                    string VENDOR = tempWords[29].Trim();
                    string IDATE = tempWords[30].Trim();


                    string CHG_NUM = "";
                    string CONVERSION = "";
                    string CREDREBILL = "";
                    string DISCOUNT = "";

                    if (line.Length != 397)
                    {
                        CHG_NUM = tempWords[31];
                        CONVERSION = tempWords[32];
                        CREDREBILL = tempWords[33];
                        DISCOUNT = tempWords[34];
                    }



                    entries.Add(new RDC
                    {


                        FCDATE = FCDATE  ,
                        DC_NAME = DC_NAME ,
                        DC_DEA = DC_DEA  ,
                        FAC_NAME  = FAC_NAME    ,
                        FAC_DEA = FAC_DEA ,
                        FAC_HIN = FAC_HIN ,
                        FAC_CITY  = FAC_CITY    ,
                        FAC_STATE = FAC_STATE   ,
                        CWAC  = CWAC    ,
                        CCOST = CCOST   ,
                        CQTY  = CQTY    ,
                        SALE_CR = SALE_CR ,
                        CONTRACT  = CONTRACT    ,
                        CONT_START = CONT_START  ,
                        NDC = NDC ,
                        OLD_NDC = OLD_NDC ,
                        UPC = UPC ,
                        UPN = UPN ,
                        INVOICE = INVOICE ,
                        SDATE = SDATE   ,
                        CTOTAL = CTOTAL  ,
                        PROD_NAME = PROD_NAME   ,
                        PROD_SIZE = PROD_SIZE   ,
                        PROD_STRNG = PROD_STRNG  ,
                        FILLER = FILLER  ,
                        DC_NR = DC_NR   ,
                        FAC_ACCT  = FAC_ACCT    ,
                        WH_OEN = WH_OEN  ,
                        VE_ITEMNR = VE_ITEMNR   ,
                        VENDOR = VENDOR  ,
                        IDATE = IDATE   ,
                        CHG_NUM = CHG_NUM ,
                        CONVERSION = CONVERSION  ,
                        CREDREBILL = CREDREBILL  ,
                        DISCOUNT  = DISCOUNT    ,

                        //BATCH = BATCH   ,
                        //WHOLESALER = WHOLESALER  ,
                        //WH_CONT = WH_CONT ,
                        //MATCH_COID = MATCH_COID  ,
                        //MATCH_TYPE = MATCH_TYPE  ,
                        //SHIP_QTY  = SHIP_QTY    ,
                        //COST  = COST    ,
                        //TOT_COST  = TOT_COST    ,
                        //WAC = WAC ,
                        //SHIP_DATE = SHIP_DATE   ,
                        //INV_DATE  = INV_DATE    ,
                        //REC_DATE  = REC_DATE    ,
                        //MMID  = MMID    ,
                        //WHID  = WHID    ,
                        //WRPID = WRPID   ,
                        //ITID  = ITID    ,
                        //SALE_CRW  = SALE_CRW    ,
                        //SALE_CRSRC = SALE_CRSRC  ,
                        //EXTRA = EXTRA   ,




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
