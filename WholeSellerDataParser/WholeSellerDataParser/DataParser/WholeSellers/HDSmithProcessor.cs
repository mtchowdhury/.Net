using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OfficeOpenXml;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
   public class HDSmithProcessor
    {
       public List<HDSmith> ProcessHDSmith(string path)
       {
           var entries = new List<HDSmith>();

           if (File.Exists(path))
           {

               var file = new FileInfo(@path);
               using (var package = new ExcelPackage(file))
               {
                   var worksheet = package.Workbook.Worksheets[1];
                   var rowCount = worksheet.Dimension.End.Row;

                   for (var row = 2; row <= rowCount; row++)
                   {


                       var FCDATE = worksheet.Cells[row, 1].Value;
                       var DC_NAME = worksheet.Cells[row, 2].Value;
                       var DC_DEA = worksheet.Cells[row, 3].Value;
                       var FAC_NAME = worksheet.Cells[row, 4].Value;
                       var FAC_DEA = worksheet.Cells[row, 5].Value;
                       var FAC_HIN = worksheet.Cells[row, 6].Value;
                       var FAC_CITY = worksheet.Cells[row, 7].Value;
                       var FAC_STATE = worksheet.Cells[row, 8].Value;
                       var CWAC = worksheet.Cells[row, 9].Value;
                       var CCOST = worksheet.Cells[row, 10].Value;
                       var CQTY = worksheet.Cells[row, 11].Value;
                       var SALE_CR = worksheet.Cells[row, 12].Value;
                       var CONTRACT = worksheet.Cells[row, 13].Value;
                       var CONT_START = worksheet.Cells[row, 14].Value;
                       var NDC = worksheet.Cells[row, 15].Value;
                       var OLD_NDC = worksheet.Cells[row, 16].Value;
                       var UPC = worksheet.Cells[row, 17].Value;
                       var UPN = worksheet.Cells[row, 18].Value;
                       var INVOICE = worksheet.Cells[row, 19].Value;
                       var SDATE = worksheet.Cells[row, 20].Value;
                       var CTOTAL = worksheet.Cells[row, 21].Value;
                       var PROD_NAME = worksheet.Cells[row, 22].Value;
                       var PROD_SIZE = worksheet.Cells[row,23].Value;
                       var PROD_STRNG = worksheet.Cells[row, 24].Value;
                       var FILLER = worksheet.Cells[row, 25].Value;
                       var DC_NR = worksheet.Cells[row, 26].Value;
                       var FAC_ACCT = worksheet.Cells[row, 27].Value;
                       var WH_OEN = worksheet.Cells[row, 28].Value;
                       var VE_ITEMNR = worksheet.Cells[row, 29].Value;
                       var VENDOR = worksheet.Cells[row, 30].Value;
                       var IDATE = worksheet.Cells[row, 31].Value;
                       var CONT_ALT = worksheet.Cells[row, 32].Value;
                       var CONVERSION = worksheet.Cells[row, 33].Value;
                       var CREDREBILL = worksheet.Cells[row, 34].Value;
                       var DISCOUNT = worksheet.Cells[row, 35].Value;
              



                       entries.Add(new HDSmith
                       {



                           FCDATE = FCDATE!=null? FCDATE.ToString():"",
                           DC_NAME = DC_NAME != null ? DC_NAME.ToString() : "",
                           DC_DEA = DC_DEA != null ? DC_DEA.ToString() : "",
                           FAC_NAME = FAC_NAME != null ? FAC_NAME.ToString() : "",
                           FAC_DEA = FAC_DEA != null ? FAC_DEA.ToString() : "",
                           FAC_HIN = FAC_HIN != null ? FAC_HIN.ToString() : "",
                           FAC_CITY = FAC_CITY != null ? FAC_CITY.ToString() : "",
                           FAC_STATE = FAC_STATE != null ? FAC_STATE.ToString() : "",
                           CWAC = CWAC != null ? CWAC.ToString() : "",
                           CCOST = CCOST != null ? CCOST.ToString() : "",
                           CQTY = CQTY != null ? CQTY.ToString() : "",
                           SALE_CR = SALE_CR != null ? SALE_CR.ToString() : "",
                           CONTRACT = CONTRACT != null ? CONTRACT.ToString() : "",
                           CONT_START = CONT_START != null ? CONT_START.ToString() : "",
                           NDC = NDC != null ? NDC.ToString() : "",
                           OLD_NDC = OLD_NDC != null ? OLD_NDC.ToString() : "",
                           UPC = UPC != null ? UPC.ToString() : "",
                           UPN = UPN != null ? UPN.ToString() : "",
                           INVOICE = INVOICE != null ? INVOICE.ToString() : "",
                           SDATE = SDATE != null ? SDATE.ToString() : "",
                           CTOTAL = CTOTAL != null ? CTOTAL.ToString() : "",
                           PROD_NAME = PROD_NAME != null ? PROD_NAME.ToString() : "",
                           PROD_SIZE = PROD_SIZE != null ? PROD_SIZE.ToString() : "",
                           PROD_STRNG = PROD_STRNG != null ? PROD_STRNG.ToString() : "",
                           FILLER = FILLER != null ? FILLER.ToString() : "",
                           DC_NR = DC_NR != null ? DC_NR.ToString() : "",
                           FAC_ACCT = FAC_ACCT != null ? FAC_ACCT.ToString() : "",
                           WH_OEN = WH_OEN != null ? WH_OEN.ToString() : "",
                           VE_ITEMNR = VE_ITEMNR != null ? VE_ITEMNR.ToString() : "",
                           VENDOR = VENDOR != null ? VENDOR.ToString() : "",
                           IDATE = IDATE != null ? IDATE.ToString() : "",
                           CONT_ALT = CONT_ALT != null ? CONT_ALT.ToString() : "",
                           CONVERSION = CONVERSION != null ? CONVERSION.ToString() : "",
                           CREDREBILL = CREDREBILL != null ? CREDREBILL.ToString() : "",
                           DISCOUNT = DISCOUNT != null ? DISCOUNT.ToString() : "",
                           //    BATCH = BATCH,
                           //    WHOLESALER = WHOLESALER,


                           //    WH_CONT = WH_CONT,
                           //    MATCH_COID = MATCH_COID,
                           //    MATCH_TYPE = MATCH_TYPE,
                           //    SHIP_QTY = SHIP_QTY,
                           //    COST = COST,
                           //    TOT_COST = TOT_COST,
                           //    WAC = WAC,


                           //    SHIP_DATE = SHIP_DATE,
                           //    INV_DATE = INV_DATE,
                           //    REC_DATE = REC_DATE,


                           //    MMID = MMID,
                           //    WHID = WHID,
                           //    WRPID = WRPID,
                           //    ITID = ITID,


                           //    SALE_CRW = SALE_CRW,
                           //    SALE_CRSRC = SALE_CRSRC,
                           //    EXTRA = EXTRA

                       });
                   }

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
