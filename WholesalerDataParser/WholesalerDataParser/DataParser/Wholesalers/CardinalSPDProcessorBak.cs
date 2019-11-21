using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OfficeOpenXml;
using WholesalerDataParser.EDMX;

namespace WholesalerDataParser.DataParser.Wholesalers
{
   public class CardinalSPDProcessorBak
    {
        public List<CardinalSPD> ProcessCardinalSPD(string path)
        {
            var entries = new List<CardinalSPD>();

            if (File.Exists(path))
            {

                var file = new FileInfo(@path);
                using (var package = new ExcelPackage(file))
                {
                    var worksheet = package.Workbook.Worksheets[1];
                    var rowCount = worksheet.Dimension.End.Row;

                    for (var row = 2; row <= rowCount; row++)
                    {
                        //var FCDATE = worksheet.Cells[row, 1].Value;
                        if(worksheet.Cells[row, 5].Value==null)continue;
                        
                       var FILLER1 = worksheet.Cells[row, 1].Value;
                        var CHG_AMOUNT = worksheet.Cells[row, 2].Value;
                        var CHG_DATE = worksheet.Cells[row, 3].Value;
                        var CHG_NUM = worksheet.Cells[row, 4].Value;
                        var FILLER2 = worksheet.Cells[row, 5].Value;
                        var COST_TOT = worksheet.Cells[row, 6].Value;
                        var FAC_ACCT = worksheet.Cells[row, 7].Value;
                        var FAC_CITY = worksheet.Cells[row, 8].Value;
                        var FAC_DEA = worksheet.Cells[row, 9].Value;
                        var FAC_HIN = worksheet.Cells[row, 10].Value;
                        var FAC_NAME = worksheet.Cells[row, 11].Value;
                        var FILLER3 = worksheet.Cells[row, 12].Value;
                        var PO_NUMBER = worksheet.Cells[row, 13].Value;
                        var FAC_STATE = worksheet.Cells[row, 14].Value;
                        var FILLER4 = worksheet.Cells[row, 15].Value;
                        var FILLER5 = worksheet.Cells[row, 16].Value;
                        var DROP_SHIP = worksheet.Cells[row, 17].Value;
                        var GPO = worksheet.Cells[row, 18].Value;
                        var INV_DATE = worksheet.Cells[row, 19].Value;
                        var INVOICE = worksheet.Cells[row, 20].Value;
                        var NDC = worksheet.Cells[row, 21].Value;
                        var FILLER6 = worksheet.Cells[row, 22].Value;
                        var ORDER_DATE = worksheet.Cells[row, 23].Value;
                        var FILLER7 = worksheet.Cells[row, 24].Value;
                        var PROD_FORM = worksheet.Cells[row, 25].Value;
                        var FILLER8 = worksheet.Cells[row, 26].Value;
                        var PROD_STRNG = worksheet.Cells[row, 27].Value;
                        var FILLER9 = worksheet.Cells[row, 28].Value;
                        var FILLER10 = worksheet.Cells[row, 29].Value;
                        var SHIP_QTY = worksheet.Cells[row, 30].Value;
                        var FILLER11 = worksheet.Cells[row, 31].Value;
                        var FILLER12 = worksheet.Cells[row, 32].Value;
                        var SHIP_DATE = worksheet.Cells[row, 33].Value;
                        var TOT_COST = worksheet.Cells[row, 34].Value;
                        var FILLER13 = worksheet.Cells[row, 35].Value;
                        var PROD_NAME = worksheet.Cells[row, 36].Value;
                        var FILLER14 = worksheet.Cells[row, 37].Value;
                        var FILLER15 = worksheet.Cells[row, 38].Value;
                        var FILLER16 = worksheet.Cells[row, 39].Value;
                        var VENDOR = worksheet.Cells[row, 40].Value;
                        var FILLER17 = worksheet.Cells[row, 41].Value;
                        var FILLER18 = worksheet.Cells[row, 42].Value;
                        var FILLER19 = worksheet.Cells[row, 43].Value;
                        var FILLQR20 = worksheet.Cells[row, 44].Value;
                        var FILLER21 = worksheet.Cells[row, 45].Value;
                        var FILLER22 = worksheet.Cells[row, 46].Value;
                        var FILLAR23 = worksheet.Cells[row, 47].Value;
                 






                        entries.Add(new CardinalSPD
                        {

                        
                        FILLER1= FILLER1 != null ? FILLER1.ToString().Trim() : "",
                        CHG_AMOUNT= CHG_AMOUNT != null ? CHG_AMOUNT.ToString().Trim() : "",
                        CHG_DATE = CHG_DATE != null ? CHG_DATE.ToString().Trim() : "",
                        CHG_NUM = CHG_NUM != null ? CHG_NUM.ToString().Trim() : "",
                        FILLER2 = FILLER2 != null ? FILLER2.ToString().Trim() : "",
                        COST_TOT = COST_TOT != null ?COST_TOT.ToString().Trim()  : "",
                        FAC_ACCT = FAC_ACCT != null ? FAC_ACCT.ToString().Trim() : "",
                        FAC_CITY = FAC_CITY != null ? FAC_CITY.ToString().Trim() : "",
                        FAC_DEA = FAC_DEA != null ? FAC_DEA.ToString().Trim() : "",
                        FAC_HIN= FAC_HIN != null ? FAC_HIN.ToString().Trim() : "",
                        FAC_NAME= FAC_NAME != null ? FAC_NAME.ToString().Trim() : "",
                        FILLER3= FILLER3 != null ? FILLER3.ToString().Trim() : "",
                        PO_NUMBER= PO_NUMBER != null ? PO_NUMBER.ToString().Trim() : "",
                        FAC_STATE= FAC_STATE != null ? FAC_STATE.ToString().Trim() : "",
                        FILLER4= FILLER4 != null ? FILLER4.ToString().Trim() : "",
                        FILLER5= FILLER5 != null ? FILLER5.ToString().Trim() : "",
                        DROP_SHIP= DROP_SHIP != null ? DROP_SHIP.ToString().Trim() : "",
                        GPO= GPO != null ? GPO.ToString().Trim() : "",
                        INV_DATE= INV_DATE != null ? INV_DATE.ToString().Trim().Substring(0,8) : "",
                        INVOICE= INVOICE != null ? INVOICE.ToString().Trim() : "",
                        NDC= NDC != null ? NDC.ToString().Trim() : "",
                        FILLER6= FILLER6 != null ? FILLER6.ToString().Trim() : "",
                        ORDER_DATE= ORDER_DATE != null ? ORDER_DATE.ToString().Trim().Substring(0, 8) : "",
                        FILLER7= FILLER7 != null ? FILLER7.ToString().Trim() : "",
                        PROD_FORM= PROD_FORM != null ? PROD_FORM.ToString().Trim() : "",
                        FILLER8= FILLER8 != null ? FILLER8.ToString().Trim() : "",
                        PROD_STRNG= PROD_STRNG != null ? PROD_STRNG.ToString().Trim() : "",
                        FILLER9= FILLER9 != null ? FILLER9.ToString().Trim() : "",
                        FILLER10= FILLER10 != null ? FILLER10.ToString().Trim() : "",
                        SHIP_QTY= SHIP_QTY != null ? SHIP_QTY.ToString().Trim()   : "",
                        FILLER11= FILLER11 != null ? FILLER11.ToString().Trim() : "",
                        FILLER12= FILLER12 != null ? FILLER12.ToString().Trim() : "",
                        SHIP_DATE= SHIP_DATE != null ? SHIP_DATE.ToString().Trim().Substring(0, 8) : "",
                        TOT_COST= TOT_COST != null ? TOT_COST.ToString().Trim() : "",
                        FILLER13= FILLER13 != null ? FILLER13.ToString().Trim() : "",
                        PROD_NAME= PROD_NAME != null ? PROD_NAME.ToString().Trim() : "",
                        FILLER14= FILLER14 != null ? FILLER14.ToString().Trim() : "",
                         FILLER15= FILLER15 != null ? FILLER15.ToString().Trim() : "",
                        FILLER16= FILLER16 != null ? FILLER16.ToString().Trim() : "",
                        VENDOR= VENDOR != null ? VENDOR.ToString().Trim() : "",
                        FILLER17= FILLER17 != null ? FILLER17.ToString().Trim() : "",
                        FILLER18= FILLER18 != null ? FILLER18.ToString().Trim() : "",
                        FILLER19= FILLER19 != null ? FILLER19.ToString().Trim() : "",
                         FILLQR20= FILLQR20 != null ? FILLQR20.ToString().Trim() : "",
                        FILLER21= FILLER21 != null ? FILLER21.ToString().Trim() : "",
                        FILLER22= FILLER22 != null ? FILLER22.ToString().Trim() : "",
                        FILLAR23= FILLAR23 != null ? FILLAR23.ToString().Trim() : "",


                        //BATCH= DateTime.Now,
                        //COST= TOT_COST != null&& SHIP_QTY != null? double.Parse(TOT_COST.ToString().Trim())/ Int32.Parse(SHIP_QTY.ToString().Trim()):0.00,
                        //WHID= 153,
                        //WRPID= 14695,
                        //WHOLESALER= "Cardinal Health SPD",
                        //DC_NAME= "Cardinal Health SPD",
                        //REC_DATE=DateTime.Parse(SHIP_DATE.ToString().Trim())  ,
                        //WH_CONT= WH_CONT,
                        //MATCH_COID= MATCH_COID,
                        //MATCH_TYPE= MATCH_TYPE
                        //SALE_CR=,
                        //MMID=,
                        //ITID=,
                        //SALE_CRW=,
                        //SALE_CRSRC="O",
                        //EXTRA=


                        });
                    }

                }
            }

            return entries;
        }

        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var ss = datestr.Split('/');
            var month = ss[0];
            var date = ss[1];
            var year = ss[2];


            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
}
