using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
  public  class ValueDrugsProcessor
    {
      public List<ValueDrug> ProcessValueDrugs(string path)
      {
            var entries = new List<ValueDrug>();
            if (File.Exists(path))
          {
            

              var lines = File.ReadLines(path);


              foreach (var line in lines)
              {

                  int[] Field_Length = new int[] {
                                                    20,    //0 
                                                    9,   //1 
                                                    30,   //2
                                                    40,   //3
                                                    9,    //4
                                                    9,    //5
                                                    25,    //6                       
                                                    2,    //7
                                                    15,    //8
                                                    8,   //9
                                                    8,    //10
                                                    8,    //11
                                                    15,   //12
                                                    40,    //13
                                                    10,   //14
                                                    11,   //15
                                                    11,   //16  
                                                    13,   //17
                                                    40,    //18
                                                    3,   //19
                                                    17,   //20
                                                    15,   //21
                                                    11,    //22
                                                    4,    //23
                                                    5,    //24
                                                    8,    //25
                                                    9,    //26
                                                    1,    //27
                                                    8,    //28
                                                    7,    //29
                                                    11,    //30
                                                    15,    //31
                                                    12,    //32
                                                    8,    //33
                                                    8,    //34
                                                    10,    //35
                                                    8,   //36
                                                    1,   //37
                                                    1,   //38
                                                    1,   //39
                                                    1,   //40
                                                    1,   //41
                                                    10,   //42
                                                 };


                  if (line.Length < Field_Length.Sum())
                  {
                      continue;
                  }

                  // GET - words from Length
                  List<string> tempWords = SplitStringByLengthArray(line, Field_Length);

               
                        string DC_NAME = tempWords[0].Trim();
		                string DC_DEA = tempWords[1].Trim();
		                string WHOLESALER = tempWords[2].Trim();
		                string FAC_NAME = tempWords[3].Trim();
		                string FAC_DEA = tempWords[4].Trim();
		                string FAC_HIN = tempWords[5].Trim();
		                string FAC_CITY = tempWords[6].Trim();
		                string FAC_STATE = tempWords[7].Trim();
		                string FAC_ACCT = tempWords[8].Trim();
		                string CORDERDATE = tempWords[9].Trim();
		                string CSHIPDATE = tempWords[10].Trim();
		                string CINVDATE = tempWords[11].Trim();
		                string INVOICE = tempWords[12].Trim();
		                string VENDOR = tempWords[13].Trim();
		                string WH_OEN = tempWords[14].Trim();
		                string NDC = tempWords[15].Trim();
		                string UPC = tempWords[16].Trim();
		                string VE_ITEMNR = tempWords[17].Trim();
		                string PROD_NAME = tempWords[18].Trim();
		                string PROD_FORM = tempWords[19].Trim();
		                string PROD_STRNG = tempWords[20].Trim();
		                string PROD_SIZE = tempWords[21].Trim();
		                string PROD_UM = tempWords[22].Trim();
		                string PROD_UD = tempWords[23].Trim();
		                string OUTER_PK = tempWords[24].Trim();
		                string CWAC = tempWords[25].Trim();
		                string CORDERQTY = tempWords[26].Trim();
		                string CSHIPQTY = tempWords[27].Trim();
		                string CCOST = tempWords[28].Trim();
		                string CUPDNCHG = tempWords[29].Trim();
		                string CTOTCOST = tempWords[30].Trim();
		                string CONTRACT = tempWords[31].Trim();
		                string GPO = tempWords[32].Trim();
		                string CHG_NUM = tempWords[33].Trim();
		                string CCHGDATE = tempWords[34].Trim();
		                string CCHGAMOUNT = tempWords[35].Trim();
		                string CAPPRDATE = tempWords[36].Trim();
		                string PRIV_CONTR = tempWords[37].Trim();
		                string SPECIAL = tempWords[38].Trim();
		                string NET_ITEM = tempWords[39].Trim();
		                string REASON_NS = tempWords[40].Trim();
		                string DROP_SHIP = tempWords[41].Trim();
		                string PO_NUMBER = tempWords[42].Trim();
                        string WH_NOTES = tempWords[43].Trim();


              
                  entries.Add(new ValueDrug
                  {
                      DC_NAME = DC_NAME,
                      DC_DEA = DC_DEA,
                      WHOLESALER = WHOLESALER,
                      FAC_NAME = FAC_NAME,
                      FAC_DEA = FAC_DEA,
                      FAC_HIN = FAC_HIN,
                      FAC_CITY = FAC_CITY,
                      FAC_STATE = FAC_STATE,
                      FAC_ACCT = FAC_ACCT,
                      CORDERDATE = CORDERDATE,
                      CSHIPDATE = CSHIPDATE,
                      CINVDATE = CINVDATE,
                      INVOICE = INVOICE,
                      VENDOR = VENDOR,
                      WH_OEN = WH_OEN,
                      NDC = NDC,
                      UPC = UPC,
                      VE_ITEMNR = VE_ITEMNR,
                      PROD_NAME = PROD_NAME,
                      PROD_FORM = PROD_FORM,
                      PROD_STRNG = PROD_STRNG,
                      PROD_SIZE = PROD_SIZE,
                      PROD_UM = PROD_UM,
                      PROD_UD = PROD_UD,
                      OUTER_PK = OUTER_PK,
                      CWAC = CWAC,
                      CORDERQTY = CORDERQTY,
                      CSHIPQTY = CSHIPQTY,
                      CCOST = CCOST,
                      CUPDNCHG = CUPDNCHG,
                      CTOTCOST = CTOTCOST,
                      CONTRACT = CONTRACT,
                      GPO = GPO,
                      CHG_NUM = CHG_NUM,
                      CCHGDATE = CCHGDATE,
                      CCHGAMOUNT = CCHGAMOUNT,
                      CAPPRDATE = CAPPRDATE,
                      PRIV_CONTR = PRIV_CONTR,
                      SPECIAL = SPECIAL,
                      NET_ITEM = NET_ITEM,
                      REASON_NS = REASON_NS,
                      DROP_SHIP = DROP_SHIP,
                      PO_NUMBER = PO_NUMBER,
                      WH_NOTES = WH_NOTES,



//BATCH
//ORDER_DATE
//SHIP_DATE
//INV_DATE
//WAC
//ORDER_QTY
//SHIP_QTY
//COST
//UP_DN_CHG
//TOT_COST
//CHG_DATE
//CHG_AMOUNT
//APPR_DATE
//WH_CONT
//MATCH_COID
//MATCH_TYPE
//MMID
//ITID
//WHID
//WRPID
//SALE_CR
//REC_DATE
//SALE_CRW
//SALE_CRSRC
//EXTRA


                });
                }
          }
          return entries;
      }

        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var year = datestr.Substring(0, 4);
            var  month = datestr.Substring(4, 2);
            var date = datestr.Substring(6, 2);
           

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
