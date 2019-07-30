using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
{
  public  class CardinalProcesor
    {
        public List<Cardinal> ProcessCardinal(string path)
        {
            var entries = new List<Cardinal>();
            if (File.Exists(path))
            {

                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    var dcname = line.Substring(0, 30);
                    var dcnr = line.Substring(30, 3);
                    var facacct = line.Substring(33, 12);
                    var dcdea = line.Substring(45, 9);

                    var facdea = line.Substring(54, 9);
                    var facname = line.Substring(63, 30); 
                    var whoen = line.Substring(93, 7); 
                    var ndc = line.Substring(100, 11);
                    var ndc13 = line.Substring(111, 13);
                    var vendor = line.Substring(124, 30);
                    var prodname = line.Substring(154, 40);

                 

                    var generic = line.Substring(194, 40); 

                    var produd = line.Substring(234, 20);
                    var prodstring = line.Substring(254, 20);
                    var itemsize = line.Substring(274, 20);
                    var invoice = line.Substring(294, 12);
                    var prodsize = line.Substring(306, 20);


                    var idate = line.Substring(326, 8);
                    var costpllus = line.Substring(334, 11);
                    var wac = line.Substring(345, 11);

                    var awp = line.Substring(356, 11);
                    var ahfs = line.Substring(367, 8);

                    var gpo = line.Substring(375, 12);
                    var sdate = line.Substring(387, 8); 
                    var shipqty = line.Substring(395, 8);
                    var cost = line.Substring(403, 12);
                    var contract = "";
                    if (entries.Count<1)
                    contract= line.Substring(415, 10);

                    //var sdate = line.Substring(0, 8);
                    //var shipqty = line.Substring(8, 5);


                    //var cost = line.Substring(391, 20);

                    //var contract = line.Substring(0, 5);
                    //var batch = line.Substring(5, 15);


                    //var wholesaler = line.Substring(414, 21);

                    //var salecr = line.Substring(0, 6);
                    //var invdate = line.Substring(6, 15);
                    //var shipdate = line.Substring(437, 1);
                    //var recdate = line.Substring(438, 24);
                    //var whid = line.Substring(462, 21);
                    //var wrpid = line.Substring(457, 26);
                    //var matchcoid = line.Substring(483, 59);

                    //var whcont = line.Substring(0, 1);
                    //var salecrw = line.Substring(1, 58);
                    //var salecrsr = line.Substring(1, 58);
                    //var extra = line.Substring(1, 58);


                  
                    entries.Add(new Cardinal
                    {
                     DC_NAME = dcname.Trim(),
                     DC_NR = dcnr.Trim(),
                     FAC_ACCT = facacct.Trim(),
                     DC_DEA = dcdea.Trim(),
                     FAC_DEA = facdea.Trim(),
                     FAC_NAME = facname.Trim(),
                     WH_OEN = whoen.Trim(),
                     NDC = ndc.Trim(),
                     NDC13 = ndc13.Trim(),
                     VENDOR = vendor.Trim(),
                     PROD_NAME = prodname.Trim(),
                     GENERIC = generic.Trim(),
                     PROD_UD = produd.Trim(),
                    // PROD_FORM = prodform,
                     PROD_STRNG = prodstring.Trim(),
                     ITEM_SIZE =Int32.Parse(itemsize.Trim()) ,
                    // FILLER4 = filler4,
                  //   FILLER5 = filler5,
                     INVOICE = invoice.Trim(),
                     PROD_SIZE = double.Parse(prodsize.Trim()),
                     IDATE = idate.Trim(),
                     COST_PLLUS = costpllus.Trim(),
                     WAC = wac.Trim(),
                     AWP = awp.Trim(),
                     AHFS = Int32.Parse(ahfs.Trim()) ,
                     GPO = gpo.Trim(),
                        SDATE = sdate.Trim(),
                        SHIP_QTY = Int32.Parse(shipqty.Trim()),
                        COST = cost.Trim(),
                        CONTRACT = contract.Trim(),
                        BATCH = DateTime.Now,
                        WHOLESALER = "Cardinal",
                       // SALE_CR = ,
                        INV_DATE = GetDateTimeFromString(sdate.Trim()),
                        SHIP_DATE = GetDateTimeFromString(sdate.Trim()),
                        REC_DATE = GetDateTimeFromString(sdate.Trim()),
                        WHID = 0,
                        WRPID = 9,
                        MATCH_COID = 0,
                       // WH_CONT = whcont,
                      //  SALE_CRW = salecrw,
                        SALE_CRSRC = "O",
                       // EXTRA = extra




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
    }
}
