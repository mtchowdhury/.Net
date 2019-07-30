using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
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

                  var ss=  line.Split('^').ToList();
                    var DC_NAME = ss[0];
                 var
                    DC_DEA = ss[1];
                    var WHOLESALER = ss[2];
                 
                    var FAC_NAME = ss[3];
               var
                    FAC_DEA = ss[4];
                    var FAC_HIN = ss[5];
                   var
                    FAC_CITY = ss[6];
                    var FAC_STATE = ss[7];
                   var FAC_ACCT = ss[8];
                    var ODATE = ss[9];
                   var
                    SDATE = ss[10];
                    var IDATE = ss[11];
                  
                    var INVOICE = ss[12];
                   var
                    VENDOR = ss[13];
                  
                    var WH_OEN = ss[14];
                  var
                    NDC = ss[15];
                    var UPC = ss[16];
                  var
                    VE_ITEMNR = ss[17];
                    var PROD_NAME = ss[18];
                   var
                    PROD_FORM = ss[19];
                    var PROD_STRNG = ss[20];
                  var
                    PROD_SIZE = ss[21];
                    var PROD_UM = ss[22];
                  var
                    OUTER_PK = ss[23].Split('.')[0];//eta int or float korte hobe
                    var PROD_UD = ss[24];
                   var
                    ITEM_SIZE = ss[25].Split('.')[0];//eta int or float korte hobe
                    var AWP = ss[26]; ;
                  var
                    WAC = ss[27];
                    
                    var ORDER_QTY = ss[28];
                  var
                    SHIP_QTY = ss[29];
                    var COST = ss[30];
                  var
                    UP_DN_CHG = ss[31];
                    var TOT_COST = ss[32];
                  var
                    CONTRACT = ss[33];
                   
                    var SALE_CR = ss[34];
                  
                  var
                    CDATE = ss[35];
                    var CHG_NUM = ss[36];
                  var
                    CHG_AMOUNT = ss[37];
                    var ADATE = ss[38];
                   var
                    PRIV_CONTR = ss[39];
                    var WH_SPEC = ss[40];
                  var
                    NET_PR = ss[41];
                    var OMIT = ss[42];
                   var
                    DROP_SHIP = ss[43];
                    var PO_NUMBER = ss[44];  //
                    //so far above fields are ok
                  // var
                  //  BATCH = ss[45];
                  //  var WH_CONT = "";
                  //var
                  //  MATCH_COID = "";
                  //  var MATCH_TYPE = ss[0];
                  //var
                  //  ORDER_DATE = ss[0];
                  //  var SHIP_DATE = ss[0];
                  //var
                  //  INV_DATE = "";
                  //  var REC_DATE = "";
                  //var
                  //  CHG_DATE = "";
                  //  var APPR_DATE = "";
                  //var
                  //  MMID = "";
                  //  var ITID = "";
                  //var
                  //  WHID = "";
                  //  var WRPID = "";
                  //var
                  //  SALE_CRW = "";
                  //  var SALE_CRSRC = "";
                  //var EXTRA = "";


                   // var sss = Int32.Parse(OUTER_PK.Trim());
                   // var sfdf = Int32.Parse(ORDER_QTY.Trim());
                   // var fwe = Int32.Parse(SHIP_QTY.Trim());
                   //   var
                   // gsdfg = double.Parse(COST);
                   // var hhhhtyjht = double.Parse(UP_DN_CHG.Trim());
                     
                   //var hrerh = double.Parse(TOT_COST.Trim());
                   // double? dsgftr4 =CHG_AMOUNT.Trim()!=""? double.Parse(CHG_AMOUNT.Trim()):(double?) null ;

                    entries.Add(new Dakota
                    {
                        DC_NAME =DC_NAME,
                        DC_DEA = DC_DEA,
                        WHOLESALER = WHOLESALER,
                        FAC_NAME = FAC_NAME,
                        FAC_DEA = FAC_DEA,
                        FAC_HIN = FAC_HIN,
                        FAC_CITY = FAC_CITY,
                        FAC_STATE = FAC_STATE,
                        FAC_ACCT = FAC_ACCT,
                        ODATE = ODATE,
                        SDATE = SDATE,
                        IDATE = IDATE,
                        INVOICE = INVOICE,
                        VENDOR = VENDOR,
                        WH_OEN =WH_OEN,
                        NDC = NDC==""? "00000000000":NDC,
                        UPC = UPC,
                        VE_ITEMNR = VE_ITEMNR,
                        PROD_NAME =PROD_NAME,
                        PROD_FORM = PROD_FORM,
                        PROD_STRNG =PROD_STRNG,
                        PROD_SIZE = PROD_SIZE,
                        PROD_UM = PROD_UM,
                        OUTER_PK = Int32.Parse(OUTER_PK.Trim()),
                        PROD_UD = PROD_UD,
                        ITEM_SIZE =Int32.Parse(ITEM_SIZE.Trim()) ,
                        AWP =AWP,
                        WAC = WAC,
                        ORDER_QTY = Int32.Parse(ORDER_QTY.Trim()),
                        SHIP_QTY = Int32.Parse(SHIP_QTY.Trim()),
                        COST = double.Parse(COST),
                        UP_DN_CHG   = double.Parse(UP_DN_CHG.Trim()),
                        TOT_COST = double.Parse(TOT_COST.Trim()),
                        CONTRACT =CONTRACT,
                        SALE_CR = SALE_CR,
                        CDATE = CDATE,
                        CHG_NUM = CHG_NUM,
                        CHG_AMOUNT = CHG_AMOUNT.Trim() != "" ? double.Parse(CHG_AMOUNT.Trim()) : (double?)null,
                        ADATE = ADATE,
                        PRIV_CONTR = PRIV_CONTR,
                        WH_SPEC = WH_SPEC,
                        NET_PR = NET_PR,
                        OMIT = OMIT,
                        DROP_SHIP = DROP_SHIP,
                        PO_NUMBER = PO_NUMBER,
                        BATCH = DateTime.Now,
                       // WH_CONT = "",
                       // MATCH_COID = "",
                       // MATCH_TYPE = "",
                        ORDER_DATE = GetDateTimeFromString(ODATE),
                        SHIP_DATE = GetDateTimeFromString(SDATE),
                        INV_DATE = GetDateTimeFromString(IDATE),
                        REC_DATE = GetDateTimeFromString(IDATE),
                        CHG_DATE = GetDateTimeFromString(ADATE.Trim()),
                        APPR_DATE = GetDateTimeFromString(ADATE.Trim()),
                       // MMID = "",
                       // ITID = "",
                        WHID = 0,
                        WRPID = 147,
                        SALE_CRSRC = "O"
                      //  SALE_CRW = "",
                       // SALE_CRSRC = "",
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
