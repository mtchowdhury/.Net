using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
  public  class DakotaProcessor
    {
        public List<Dakota> ProcessDakota(string path)
        {
            var entries = new List<Dakota>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                  //  LineArray
                  var LineArray=  line.Split('^').ToList();
                  var DC_NAME = LineArray[0];
                  var DC_DEA = LineArray[1];
                  var WHOLESALER = LineArray[2];
                 
                  var FAC_NAME = LineArray[3];
                  var FAC_DEA = LineArray[4];
                  var FAC_HIN = LineArray[5];
                  var FAC_CITY = LineArray[6];
                  var FAC_STATE = LineArray[7];
                  var FAC_ACCT = LineArray[8];
                  var ODATE = LineArray[9];
                  var SDATE = LineArray[10];
                  var IDATE = LineArray[11];
                  
                  var INVOICE = LineArray[12];
                  var VENDOR = LineArray[13];
                  
                  var WH_OEN = LineArray[14];
                  var NDC = LineArray[15];
                  var UPC = LineArray[16];
                  var VE_ITEMNR = LineArray[17];
                  var PROD_NAME = LineArray[18];
                  var PROD_FORM = LineArray[19];
                  var PROD_STRNG = LineArray[20];
                  var PROD_SIZE = LineArray[21];
                  var PROD_UM = LineArray[22];
                  var OUTER_PK = LineArray[23];
                  var PROD_UD = LineArray[24];
                  var ITEM_SIZE = LineArray[25];
                  var AWP = LineArray[26]; ;
                  var WAC = LineArray[27];
                    
                  var ORDER_QTY = LineArray[28];
                  var SHIP_QTY = LineArray[29];
                  var COST = LineArray[30];
                  var UP_DN_CHG = LineArray[31];
                  var TOT_COST = LineArray[32];
                  var CONTRACT = LineArray[33];
                   
                  var SALE_CR = LineArray[34];
                  
                  var CDATE = LineArray[35];
                  var CHG_NUM = LineArray[36];
                  var CHG_AMOUNT = LineArray[37];
                  var ADATE = LineArray[38];
                  var PRIV_CONTR = LineArray[39];
                  var WH_SPEC = LineArray[40];
                  var NET_PR = LineArray[41];
                  var OMIT = LineArray[42];
                  var DROP_SHIP = LineArray[43];
                  var PO_NUMBER = LineArray[44];  
                   
                    entries.Add(new Dakota
                    {
                        DC_NAME =DC_NAME.Trim(),
                        DC_DEA = DC_DEA.Trim(),
                        WHOLESALER = WHOLESALER.Trim(),
                        FAC_NAME = FAC_NAME.Trim(),
                        FAC_DEA = FAC_DEA.Trim(),
                        FAC_HIN = FAC_HIN.Trim(),
                        FAC_CITY = FAC_CITY.Trim(),
                        FAC_STATE = FAC_STATE.Trim(),
                        FAC_ACCT = FAC_ACCT.Trim(),
                        ODATE = ODATE.Trim(),
                        SDATE = SDATE.Trim(),
                        IDATE = IDATE.Trim(),
                        INVOICE = INVOICE.Trim(),
                        VENDOR = VENDOR.Trim(),
                        WH_OEN =WH_OEN.Trim(),
                        NDC = NDC.Trim(),
                        UPC = UPC.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        PROD_NAME =PROD_NAME.Trim(),
                        PROD_FORM = PROD_FORM.Trim(),
                        PROD_STRNG =PROD_STRNG.Trim(),
                        PROD_SIZE = PROD_SIZE.Trim(),
                        PROD_UM = PROD_UM.Trim(),
                        OUTER_PK = OUTER_PK.Trim(),
                        PROD_UD = PROD_UD.Trim(),
                        ITEM_SIZE =ITEM_SIZE.Trim() ,
                        AWP =AWP.Trim(),
                        WAC = WAC.Trim(),
                        ORDER_QTY = ORDER_QTY.Trim(),
                        SHIP_QTY = SHIP_QTY.Trim(),
                        COST = COST.Trim(),
                        UP_DN_CHG   =UP_DN_CHG.Trim(),
                        TOT_COST = TOT_COST.Trim(),
                        CONTRACT =CONTRACT.Trim(),
                        SALE_CR = SALE_CR.Trim(),
                        CDATE = CDATE.Trim(),
                        CHG_NUM = CHG_NUM.Trim(),
                        CHG_AMOUNT = CHG_AMOUNT.Trim() ,
                        ADATE = ADATE.Trim(),
                        PRIV_CONTR = PRIV_CONTR.Trim(),
                        WH_SPEC = WH_SPEC.Trim(),
                        NET_PR = NET_PR.Trim(),
                        OMIT = OMIT.Trim(),
                        DROP_SHIP = DROP_SHIP.Trim(),
                        PO_NUMBER = PO_NUMBER.Trim()

                        //BATCH = DateTime.Now,
                        //WH_CONT = "",
                        //MATCH_COID = "",
                        //MATCH_TYPE = "",
                        //ORDER_DATE = GetDateTimeFromString(ODATE),
                        //SHIP_DATE = GetDateTimeFromString(SDATE),
                        //INV_DATE = GetDateTimeFromString(IDATE),
                        //REC_DATE = GetDateTimeFromString(IDATE),
                        //CHG_DATE = GetDateTimeFromString(ADATE.Trim()),
                        //APPR_DATE = GetDateTimeFromString(ADATE.Trim()),
                        //MMID = "",
                        //ITID = "",
                        //WHID = 0,
                        //WRPID = 147,
                        //SALE_CRSRC = "O"
                        //SALE_CRW = "",
                        //SALE_CRSRC = "",
                        //EXTRA = ""




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
