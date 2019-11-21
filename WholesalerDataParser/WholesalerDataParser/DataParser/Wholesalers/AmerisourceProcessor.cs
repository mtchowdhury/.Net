using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class AmerisourceProcessor
    {
        public List<Amerisource> ProcessAmerisource(string path)
        {
            var entries = new List<Amerisource>();


            if (File.Exists(path))
            {

               // var lines = File.ReadLines(path);
                foreach (var line in File.ReadLines(path))
                {
                //    foreach (var line in lines)
                //{
                 //   if (entries.Count > 1083850) return entries; 
                  //  if (entries.Count > 1000) return entries; 
                    if (line=="")continue;
                    var LineArray = line.Split('|').ToList();
                    if(LineArray[0]== "DISTRIBUTION CENTER NAME")continue;

                    var DC_NAME = LineArray[0];
                    var DC_DEA = LineArray[1];
                    var WHOLESALER = LineArray[2];
                    var FAC_NAME = LineArray[3];
                    var FAC_DEA = LineArray[4];
                    var FAC_HIN = LineArray[5];
                    var FAC_CITY = LineArray[6];
                    var FAC_STATE = LineArray[7];
                    var FAC_ACCT = LineArray[8];
                    var sdate = LineArray[9];
                    var idate = LineArray[10];
                    var INVOICE = LineArray[11];
                    var VENDOR = LineArray[12];
                    var WH_OEN = LineArray[13];
                    var NDC = LineArray[14];
                    var VE_ITEMNR = LineArray[15];
                    var PROD_NAME = LineArray[16];
                    var PROD_FORM = LineArray[17];
                    var strqty = LineArray[18];
                    var strcd = LineArray[19];
                    var sizeqty = LineArray[20];
                    var sizecd = LineArray[21];
                    var produm = LineArray[22];
                    var produd = LineArray[23];
                    var awp = LineArray[24];
                    var wac = LineArray[25];
                    var orderqty = LineArray[26]; 
                    var shipqty = LineArray[27];
                    var cost = LineArray[28];
                    var UP_DN_CHG = LineArray[29];
                    var TOT_COST = LineArray[30];
                    var whcontid = LineArray[31];
                    var gpo = LineArray[32];
                    var contract = LineArray[33];
                    var privcontract = LineArray[34];
                    var whnotes = LineArray[35];
                    var dropship = LineArray[36];
                    var ponumber = LineArray[37];


                    entries.Add(new Amerisource
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
                        SDATE = sdate.Trim(),
                        IDATE = idate.Trim(),
                        INVOICE = INVOICE.Trim(),
                        VENDOR = VENDOR.Trim(),
                        WH_OEN = WH_OEN.Trim(),
                        NDC = NDC.Trim(),
                        VE_ITEMNR = VE_ITEMNR.Trim(),
                        PROD_NAME = PROD_NAME.Trim(),
                        PROD_FORM = PROD_FORM.Trim(),
                        STR_QTY = strqty.Trim(),
                        STR_CD = strcd.Trim(),
                        SIZE_QTY = sizeqty.Trim(),
                        SIZE_CD = sizecd.Trim(),
                        PROD_UM = produm.Trim(),
                        PROD_UD = produd.Trim(),
                        AWP = awp.Trim(),
                        WAC = wac.Trim(),
                        ORDER_QTY = orderqty.Trim(),
                        SHIP_QTY = shipqty.Trim(),
                        COST = cost.Trim(),
                        UP_DN_CHG = UP_DN_CHG.Trim(),
                        TOT_COST = TOT_COST.Trim(),
                        WH_CONTID = whcontid.Trim(),
                        GPO = gpo.Trim(),
                        CONTRACT = contract.Trim(),
                        PRIV_CONTR = privcontract.Trim(),
                        WH_NOTES = whnotes.Trim() ,
                        DROP_SHIP = dropship.Trim(),
                        PO_NUMBER = ponumber.Trim()
                        //BATCH
                        //PROD_STRNG
                        //PROD_SIZE
                        //WH_CONT
                        //MATCH_COID
                        //MATCH_TYPE
                        //SHIP_DATE
                        //INV_DATE
                        //REC_DATE
                        //MMID
                        //ITID
                        //WHID
                        //WRPID
                        //SALE_CR
                        //UPC
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
            var month = datestr.Substring(4, 2);
            var date = datestr.Substring(6, 2);
            var year = datestr.Substring(0, 4);


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
}
