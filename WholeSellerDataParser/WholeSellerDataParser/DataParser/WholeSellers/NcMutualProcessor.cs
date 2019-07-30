using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public class NcMutualProcessor
    {
        public List<NcMutual> ProcessNcMutual(string path)
        {
            var entries = new List<NcMutual>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    //if (entries.Count > 1083850) return entries; ;
                    if (line == "") continue;
                    var ss = line.Split('|').ToList();
                    if (ss[0] == "Distrib Ctr Name") continue;


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
                    var odate = ss[9];
                    var
                     sdate = ss[10];
                    var idate = ss[11];

                    var invoice = ss[12];
                    var
                     vendor = ss[13];

                    var whoen = ss[14];
                    var ndc
                       = ss[15];
                    var upc = ss[16];
                    var veitemnr
                       = ss[17];
                    var prodname = ss[18];
                    var PROD_FORM
                      = ss[19];
                    var prodstring = ss[20];
                    var prodsize
                       = ss[21];
                    var produm = ss[22];
                    var outerpack
                       = ss[23];//eta int or float korte hobe
                    var produd = ss[24];
                    var totalunit
                         = ss[25];//eta int or float korte hobe
                    var awp = ss[26]; ;
                    var
                      wac = ss[27];

                    var orderqt = ss[28];
                    var
                       shipqty = ss[29];
                    var cost = ss[30];
                    var updnchg
                       = ss[31];
                    var totcost = ss[32];
                    var
                      contract = ss[33];

                    var gpo = ss[34];

                    var chgdate
                       = ss[35];
                    var chgnum = ss[36];
                    var chgamount
                       = ss[37];
                    var chgappr
                      = ss[38];
                    var privcontr
                      = ss[39];

                    var source
                      = ss[40];

                    var netitem
                      = ss[41];
                    var notship
                      = ss[42];
                    var dropship
                      = ss[43];
                    var ponumber
                      = ss[44];
                    var whnotes
                      = ss[45];

                    //var ORDER_DATE = odate != "" ? GetDateTimeFromString(odate.Trim()) : null;
                    //var AWP = awp != "" ? double.Parse(awp.Trim()) : 0.0000;
                    //var WAC = wac != "" ? double.Parse(wac.Trim()) : 0.0000;
                    //var UP_DN_CHG = updnchg != "" ? double.Parse(updnchg.Trim()) : 0.0000;
                    //var TOT_COST = totcost != "" ? double.Parse(totcost.Trim()) : 0.0000;
                    //var ORDER_QTY = Int32.Parse(orderqt.Trim());
                    //var SHIP_QTY = Int32.Parse(shipqty.Trim());
                    //var SHIP_DATE = sdate != "" ? GetDateTimeFromString(sdate.Trim()) : null;
                    //var INV_DATE = idate != "" ? GetDateTimeFromString(idate.Trim()) : null;
                    //var REC_DATE = idate != "" ? GetDateTimeFromString(idate.Trim()) : null;
                    // var sss = DateTime.Parse(idate.Trim())

                    entries.Add(new NcMutual
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
                        ODATE=odate,
                        SDATE = sdate,
                        IDATE = idate,
                        INVOICE = invoice,
                        VENDOR = vendor,
                        WH_OEN = whoen,
                        NDC = ndc!="" ?ndc: "00000000000",
                        UPC = upc,
                        VE_ITEMNR = veitemnr,
                        PROD_NAME = prodname,
                        PROD_FORM = PROD_FORM,
                        PROD_STRNG = prodstring,
                        PROD_SIZE = prodsize,
                        PROD_UM = produm,
                        OUTER_PACK = outerpack,
                        PROD_UD = produd,
                        TOTAL_UNIT =totalunit,
                        AWP = awp!=""?double.Parse(awp.Trim()):0.0000,
                        WAC = wac != "" ? double.Parse(wac.Trim()):0.0000,
                        ORDER_QTY =Int32.Parse(orderqt.Trim()) ,
                        SHIP_QTY =Int32.Parse(shipqty.Trim()) ,
                        COST = cost,
                        UP_DN_CHG = updnchg!=""? double.Parse(updnchg.Trim()):0.0000,
                        TOT_COST = totcost != "" ? double.Parse(totcost.Trim()):0.0000,
                        CONTRACT = contract,
                        GPO = gpo,
                        CHG_DATE = chgdate,
                        CHG_NUM = chgnum,
                        CHG_AMOUNT = chgamount,
                        CHG_APPR = chgappr,
                        PRIV_CONTR = privcontr,
                        SOURCE = source,
                        NET_ITEM = netitem,
                        NOT_SHIP = notship,
                        DROP_SHIP = dropship,
                        PO_NUMBER = ponumber,
                        WH_NOTES = whnotes,
                        BATCH = DateTime.Now,
                        //WH_CONT = "",
                        //MATCH_COID = "",
                        //MATCH_TYPE = "",
                        ORDER_DATE = odate!=""? GetDateTimeFromString(odate.Trim()):null,
                        SHIP_DATE = sdate != "" ? GetDateTimeFromString(sdate.Trim()) : null,
                        INV_DATE = idate != "" ? GetDateTimeFromString(idate.Trim()) : null,
                        REC_DATE = idate != "" ? GetDateTimeFromString(idate.Trim()) : null,
                        //MMID = "",
                        //ITID = "",
                        WHID = 134,
                        WRPID = 80,
                        //SALE_CR = "",
                        //SALE_CRW = "",
                        SALE_CRSRC = "O",
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
