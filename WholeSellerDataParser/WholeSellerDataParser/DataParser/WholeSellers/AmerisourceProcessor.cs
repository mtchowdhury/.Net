using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
   public class AmerisourceProcessor
    {
        public List<Amerisource> ProcessAmerisource(string path)
        {
            var entries = new List<Amerisource>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    if (entries.Count > 1083850) return entries; ;
                    if (line=="")continue;
                    var ss = line.Split('|').ToList();
                    if(ss[0]== "DISTRIBUTION CENTER NAME")continue;
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
                    var sdate = ss[9];
                    var
                     idate = ss[10];
                    var INVOICE = ss[11];

                    var VENDOR = ss[12];
                    var
                     WH_OEN = ss[13];

                    var NDC = ss[14];
                    var VE_ITEMNR
                       = ss[15];
                    var PROD_NAME = ss[16];
                    var PROD_FORM
                       = ss[17];
                    var strqty = ss[18];
                    var strcd
                      = ss[19];
                    var sizeqty = ss[20];
                    var sizecd  
                       = ss[21];
                    var produm = ss[22];
                    var produd
                       = ss[23];//eta int or float korte hobe
                    var awp = ss[24];
                    var wac
                         = ss[25];//eta int or float korte hobe
                    var orderqty = ss[26]; ;
                    var
                      shipqty = ss[27];

                    var cost = ss[28];
                    var
                       UP_DN_CHG = ss[29];
                    var TOT_COST = ss[30];
                    var whcontid
                       = ss[31];
                    var gpo = ss[32];
                    var
                      contract = ss[33];

                    var privcontract = ss[34];

                    var whnotes
                       = ss[35];
                    var dropship = ss[36];
                    var ponumber
                       = ss[37];

                    //var sssss = idate.Trim().Substring(0, 10)+ " 00:00:00 AM";
                   // var sss = DateTime.Parse(idate.Trim().Substring(0,10));
                    //var sss = DateTime.Parse(sdate.Trim());
                   // var sss = DateTime.ParseExact(idate.Trim().Substring(0, 10) + " 00:00:00 AM", "MM/dd/yyyy h:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture); ;

                    entries.Add(new Amerisource
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
                        SDATE = sdate,
                        IDATE = idate,
                        INVOICE = INVOICE,
                        VENDOR = VENDOR,
                        WH_OEN = WH_OEN,
                        NDC = NDC == "" ? "00000000000" : NDC,
                        VE_ITEMNR = VE_ITEMNR,
                        PROD_NAME = PROD_NAME,
                        PROD_FORM = PROD_FORM,
                        STR_QTY = strqty,
                        STR_CD = strcd,
                        SIZE_QTY = sizeqty,
                        SIZE_CD = sizecd,
                        PROD_UM = produm,
                        PROD_UD = produd,
                        AWP = awp!=""? double.Parse(awp):0.00 ,
                        WAC = double.Parse(wac)  ,
                        ORDER_QTY = Int32.Parse(Math.Floor(double.Parse(orderqty.Trim())).ToString()   ),
                        SHIP_QTY = Int32.Parse(Math.Floor(double.Parse(shipqty.Trim())).ToString()),
                        //Int32.Parse(.Trim()),
                        COST = cost,
                        UP_DN_CHG = UP_DN_CHG,
                        TOT_COST = TOT_COST,
                        WH_CONTID = whcontid,
                        GPO = gpo,
                        CONTRACT = contract,
                        PRIV_CONTR = privcontract,
                        WH_NOTES = whnotes.Trim() ,
                        DROP_SHIP =dropship,
                        PO_NUMBER = ponumber,
                        BATCH = DateTime.Now,
                        PROD_STRNG =strqty+strcd,
                        PROD_SIZE = sizeqty+sizecd,
                        WH_CONT = contract,
                       // MATCH_COID = GetDateTimeFromString(IDATE),
                      //  MATCH_TYPE = GetDateTimeFromString(ADATE.Trim()),
                        SHIP_DATE = DateTime.ParseExact(sdate.Trim().Substring(0, 10) + " 00:00:00 AM", "MM/dd/yyyy h:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture),
                        INV_DATE = DateTime.ParseExact(idate.Trim().Substring(0, 10) + " 00:00:00 AM", "MM/dd/yyyy h:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture),
                        REC_DATE = DateTime.ParseExact(idate.Trim().Substring(0, 10) + " 00:00:00 AM", "MM/dd/yyyy h:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture),
                        
                        WHID = 0,
                        WRPID = 7,
                       // SALE_CR = "O",
                       // UPC = "O",
                       // SALE_CRW = "O",
                      //  SALE_CRSRC = "O",
                      //  EXTRA = "O"





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
