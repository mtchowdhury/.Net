using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser.WholeSellers
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
                    var dcname = line.Substring(0, 20);
                    var dcdea = line.Substring(20, 9);
                    var wholesaler = line.Substring(29, 30);
                    var facname = line.Substring(59, 40);
                    var facdea = line.Substring(99, 9);
                    var fachin = line.Substring(108, 9); // overlap ase col#6
                    var faccity = line.Substring(117, 25); 
                    var ssssssss = line.Substring(142, 17);
                  var facstate = ssssssss.Substring(0, 2);
                  var facacct = ssssssss.Substring(2, 5);

                  //var facState = ssssssss.Substring(0, 2);

                    var sssssssss = line.Substring(159, 39); //4 fields

                  var coorderdate = sssssssss.Substring(0, 8);
                  var cshipdate = sssssssss.Substring(8, 8);
                  var cinvdate = sssssssss.Substring(16, 8);
                  var invoice = sssssssss.Substring(24, 15);


                    var vendor = line.Substring(198, 40); 
                    var whoen = line.Substring(238, 10); 
                    var ndc = line.Substring(248, 35);

                  var NDC = ndc.Substring(0, 11);
                  var UPC = ndc.Substring(11, 24);

                    var prodname = line.Substring(283, 40); 
                    var prodform = line.Substring(323, 20); //this is form
                    var prodsize = line.Substring(343, 15); 
                    var produm = line.Substring(358, 20); 
                    var sssssssssssssssss = line.Substring(378, 13);

                  var cwac = sssssssssssssssss.Substring(0, 8);
                  var corderqty = sssssssssssssssss.Substring(8, 5);


                    var ssssssssssssssssss = line.Substring(391, 20);

                  var cshipqty = ssssssssssssssssss.Substring(0, 5);
                  var ccost = ssssssssssssssssss.Substring(5, 15);


                    var ctotcostcontract = line.Substring(414, 21); 

                    var ctotcost=ctotcostcontract.Substring(0, 6);
                    var contract=ctotcostcontract.Substring(6, 15);
                    var GPO = line.Substring(437, 1); 
                    var chgnum = line.Substring(438, 24); 
                    var chgamount = line.Substring(462, 21); 
                    var sssssssssssssssssssssss = line.Substring(457, 26); 
                    var ssssssssssssssssssssssss = line.Substring(483, 59);

                  var privcontr = ssssssssssssssssssssssss.Substring(0, 1);
                  var ponumber = ssssssssssssssssssssssss.Substring(1, 58);


                    //var sssssssssssssssssssssssss = line.Substring(488, 61); 
                    // var batch = line.Substring(545, 23); 


                    //var sssssssssssssssssssssssssss = line.Substring(568, 27);  // 3 date fields are here


                    //var orderDate = sssssssssssssssssssssssssss.Substring(0, 8);
                    //  var shipDate= sssssssssssssssssssssssssss.Substring(8, 8);
                    //  var invDate= sssssssssssssssssssssssssss.Substring(16, 8);


                    //  var wac = line.Substring(592, 31); 
                    //  var orderQty = line.Substring(623, 1); 

                    //  var shipQty = line.Substring(624, 20); //ei line a multiple thakte pare 


                    //  var cost = line.Substring(647, 22); 
                    //  var updnchg = line.Substring(669, 16); 
                    //  var sssssssssssssssssssssssssssssssss = line.Substring(685, 21); // two fields

                    //  var totCost = sssssssssssssssssssssssssssssssss.Substring(0, 13);
                    //  var chgdate = sssssssssssssssssssssssssssssssss.Substring(13, 8);




                    //  var ssssssssssssssssssssssssssssssssss = line.Substring(706, 39); //two fields

                    //var chgamount = ssssssssssssssssssssssssssssssssss.Substring(0, 21);
                    //var apprdate = ssssssssssssssssssssssssssssssssss.Substring(21, 8);

                    //  var matchCoid = line.Substring(745, 16);
                    //var matchType = line.Substring(761, 8);
                    //  var mmid = line.Substring(769, 9); 
                    //  var itid = line.Substring(778, 10); 
                    //  var ssssssssssssssssssssssssssssssssssssss = line.Substring(788, 2); 
                    //  var whid = line.Substring(790, 5);  //its always 0 in the file
                    //  var ssssssssssssssssssssssssssssssssssssssss = line.Substring(795, 9); 
                    //  var sssssssssssssssssssssssssssssssssssssssss = line.Substring(804, 13); // so many fields

                    //var wrpid = sssssssssssssssssssssssssssssssssssssssss.Substring(0, 2);   //its hard coded 77
                    //var salecr = sssssssssssssssssssssssssssssssssssssssss.Substring(2, 1);
                    //var recdate = sssssssssssssssssssssssssssssssssssssssss.Substring(3, 8);
                    //var salecrw = sssssssssssssssssssssssssssssssssssssssss.Substring(11, 1);
                    //var salecrsrc = sssssssssssssssssssssssssssssssssssssssss.Substring(12, 1);

                    //  var extra = line.Substring(817, 10);
                    // var sssssssssssssssssssssssssssssssssssssssssss = line.Substring(822, 14); // ajgubi bepar hoilo ekhane niche aro data ase still all the lines length is 827
                    //var ssssssssssssssssssssssssssssssssssssssssssss = line.Substring(827, 32); 



                    //***left columns ***
                    //corderdate, 
                    //cshipdate 
                    //cinvdate
                    //invoice
                    //whoen
                    //upc 
                    //veitemnr --ni
                    //prodform
                    //prodstring --ni
                    //prodsize
                    //produm
                    //produd --ni
                    //outerpk --ni
                    //corderqty
                    //cshipqty
                    //cupndhcg --ni
                    //ctotcost
                    //contract --ni
                    //gpo --ni
                    //ccghdate
                    //chgnum --ni
                    //cchgamount --ni
                    //caprdate --ni
                    //privcont --ni
                    //special  --ni
                    //netitem --ni
                    //reasonns --ni
                    //dropships --ni
                    //ponumber
                    //whnotes --ni
                    //oderdates
                    //whcont --ni

                  //var DcName = dcname.Trim();
                  //var DcDea = dcdea.Trim();
                  //var WholeSaler = wholesaler.Trim();
                  //  var FacName = facname.Trim();
                  //  var FacDea = facdea.Trim();
                  //  var FacHin = fachin.Trim();
                  //  var FacCity = faccity.Trim();
                  //  var FacState = facstate.Trim();
                  //  var FacAcct = facacct.Trim();
                  //  var COrderDate = coorderdate.Trim();
                  //  var CShipDate = cshipdate.Trim();
                  //  var CInvDate = cinvdate.Trim();
                  //  var Invoice = invoice.Trim();
                  //  var Vendor = vendor.Trim();
                  //  var WhOEN = whoen.Trim();
                  //  var NDCc = NDC.Trim();
                  //  var UPCc = UPC.Trim();
                  //  var ProdName = prodname.Trim();
                  //  var ProdForm = prodform.Trim();
                  //  var ProdSize = prodsize.Trim();
                  //  var ProdUM = produm.Trim();

                  //  var Cwac = cwac.Trim();
                  //  var COrderQty = corderqty.Trim();
                  //  var CShipQty = cshipqty.Trim();

                  //  var CCost = ccost.Trim();
                  //  var Contract = contract.Trim();
                  //  var GPOo = GPO.Trim();
                  //  var CHGNum = chgnum.Trim();
                  //  var PrivContr = privcontr.Trim();
                  //  var PONumber = ponumber.Trim();


                  //  var Batch = DateTime.Now.ToString("u");
                  //  var OderDate = GetDateTimeFromString(coorderdate);
                  //  var ShipDate = GetDateTimeFromString(cshipdate);
                  //  var InvDate = GetDateTimeFromString(cinvdate);
                  //  var TotCost = string.Format("{0:N4}", double.Parse(ctotcost));//with 4 steps after decimal
                  //  var WAC = string.Format("{0:N4}", double.Parse(cwac));
                  //  var OrderQty = Int32.Parse(corderqty);
                  //  var ShipQty = Int32.Parse(cshipqty);
                  //  var Cost = string.Format("{0:N4}", double.Parse(ccost));
                  //  var CTotCost = ctotcost;
                  //  var UpDnCHG = "0.0000";
                  //  var ChgAmount = "0.0000";
                  //  var WhCont = contract;
                  //  var MatchCoid = 0;
                  //  var WHId = 0;
                  //  var WRPId = 77;
                  //  var SaleCR = GPO;
                  //  var SaleCRW = GPO;
                  //  var RecDate = GetDateTimeFromString(coorderdate);
                  //  var SaleCRSRC = "O";

              
                    entries.Add(new ValueDrug
                  {
                        DcName = dcname.Trim(),
                        DcDea = dcdea.Trim(),
                        WholeSaler = wholesaler.Trim(),
                        FacName = facname.Trim(),
                        FacDea = facdea.Trim(),
                        FacHin = fachin.Trim(),
                        FacCity = faccity.Trim(),
                        FacState = facstate.Trim(),
                        FacAcct = facacct.Trim(),
                        COrderDate = coorderdate.Trim(),
                        CShipDate = cshipdate.Trim(),
                        CInvDate = cinvdate.Trim(),
                        Invoice = invoice.Trim(),
                        Vendor = vendor.Trim(),
                        WhOEN = whoen.Trim(),
                        NDC = NDC.Trim(),
                        UPC = UPC.Trim(),
                        ProdName = prodname.Trim(),
                        ProdForm = prodform.Trim(),
                        ProdSize = prodsize.Trim(),
                        ProdUM = produm.Trim(),

                        Cwac = cwac.Trim(),
                        COrderQty = corderqty.Trim(),
                        CShipQty = cshipqty.Trim(),
                        
                        CCost = ccost.Trim(),
                        Contract = contract.Trim(),
                        GPO = GPO.Trim(),
                        CHGNum = chgnum.Trim(),
                        PrivContr = privcontr.Trim(),
                        PONumber = ponumber.Trim(),


                        Batch =DateTime.Now.ToString("u"),
                        OderDate = GetDateTimeFromString(coorderdate),
                        ShipDate = GetDateTimeFromString(cshipdate),
                        InvDate = GetDateTimeFromString(cinvdate),
                        TotCost = string.Format("{0:N4}", double.Parse(ctotcost))  ,//with 4 steps after decimal
                        WAC = string.Format("{0:N4}", double.Parse(cwac)),
                        OrderQty = Int32.Parse(corderqty) ,
                        ShipQty = Int32.Parse(cshipqty),
                        Cost = string.Format("{0:N4}", double.Parse(ccost)),
                        CTotCost = ctotcost,
                        UpDnCHG = "0.0000",
                        ChgAmount = "0.0000",
                        WhCont = contract,
                        MatchCoid = 0,
                        WHId = 0,
                        WRPId = 77,
                        SaleCR = GPO,
                        SaleCRW = GPO,
                        RecDate = GetDateTimeFromString(coorderdate),
                        SaleCRSRC = "O",


                  


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
    }
}
