using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
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
                    var LineArray = line.Split('|').ToList();
                    if (LineArray[0] == "Distrib Ctr Name") continue;


                    var DC_NAME = LineArray[0];
                    var DC_DEA = LineArray[1];
                    var WHOLESALER = LineArray[2];
                    var FAC_NAME = LineArray[3];
                    var FAC_DEA = LineArray[4];
                    var FAC_HIN = LineArray[5];
                    var FAC_CITY = LineArray[6];
                    var FAC_STATE = LineArray[7];
                    var FAC_ACCT = LineArray[8];
                    var odate = LineArray[9];
                    var sdate = LineArray[10];
                    var idate = LineArray[11];
                    var invoice = LineArray[12];
                    var vendor = LineArray[13];
                    var whoen = LineArray[14];
                    var ndc = LineArray[15];
                    var upc = LineArray[16];
                    var veitemnr = LineArray[17];
                    var prodname = LineArray[18];
                    var PROD_FORM = LineArray[19];
                    var prodstring = LineArray[20];
                    var prodsize = LineArray[21];
                    var produm = LineArray[22];
                    var outerpack = LineArray[23];
                    var produd = LineArray[24];
                    var totalunit  = LineArray[25];
                    var awp = LineArray[26]; ;
                    var wac = LineArray[27];
                    var orderqt = LineArray[28];
                    var shipqty = LineArray[29];
                    var cost = LineArray[30];
                    var updnchg  = LineArray[31];
                    var totcost = LineArray[32];
                    var contract = LineArray[33];
                    var gpo = LineArray[34];
                    var chgdate = LineArray[35];
                    var chgnum = LineArray[36];
                    var chgamount = LineArray[37];
                    var chgappr = LineArray[38];
                    var privcontr = LineArray[39];
                    var source = LineArray[40];
                    var netitem = LineArray[41];
                    var notship = LineArray[42];
                    var dropship = LineArray[43];
                    var ponumber = LineArray[44];
                    var whnotes = LineArray[45];

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
                        DC_NAME = DC_NAME.Trim(),
                        DC_DEA = DC_DEA.Trim(),
                        WHOLESALER = WHOLESALER.Trim(),
                        FAC_NAME = FAC_NAME.Trim(),
                        FAC_DEA = FAC_DEA.Trim(),
                        FAC_HIN = FAC_HIN.Trim(),
                        FAC_CITY = FAC_CITY.Trim(),
                        FAC_STATE = FAC_STATE.Trim(),
                        FAC_ACCT = FAC_ACCT.Trim(),
                        ODATE = odate.Trim(),
                        SDATE = sdate.Trim(),
                        IDATE = idate.Trim(),
                        INVOICE = invoice.Trim(),
                        VENDOR = vendor.Trim(),
                        WH_OEN = whoen.Trim(),
                        NDC = ndc.Trim(),
                        UPC = upc.Trim(),
                        VE_ITEMNR = veitemnr.Trim(),
                        PROD_NAME = prodname.Trim(),
                        PROD_FORM = PROD_FORM.Trim(),
                        PROD_STRNG = prodstring.Trim(),
                        PROD_SIZE = prodsize.Trim(),
                        PROD_UM = produm.Trim(),
                        OUTER_PACK = outerpack.Trim(),
                        PROD_UD = produd.Trim(),
                        TOTAL_UNIT = totalunit.Trim(),
                        AWP = awp.Trim(),
                        WAC =  wac.Trim(),
                        ORDER_QTY =orderqt.Trim() ,
                        SHIP_QTY =shipqty.Trim() ,
                        COST = cost,
                        UP_DN_CHG = updnchg,
                        TOT_COST = totcost,
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
                        //BATCH = DateTime.Now,
                        //WH_CONT = "",
                        //MATCH_COID = "",
                        //MATCH_TYPE = "",
                        //ORDER_DATE = odate != "" ? GetDateTimeFromString(odate.Trim()) : null,
                        //SHIP_DATE = sdate != "" ? GetDateTimeFromString(sdate.Trim()) : null,
                        //INV_DATE = idate != "" ? GetDateTimeFromString(idate.Trim()) : null,
                        //REC_DATE = idate != "" ? GetDateTimeFromString(idate.Trim()) : null,
                        //MMID = "",
                        //ITID = "",
                        //WHID = 134,
                        //WRPID = 80,
                        //SALE_CR = "",
                        //SALE_CRW = "",
                        //SALE_CRSRC = "O",
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
