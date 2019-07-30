using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WholeSellerDataParser.EDMX;

namespace WholeSellerDataParser.DataParser
{
    public class SmithDrugsProcessor
    {
        public List<SmithDrug> ProcessSmithDrugs(string path)
        {
            var entries = new List<SmithDrug>();
            {
              
                var lines = File.ReadLines(path);
                foreach (var line in lines)
                {
                    var s = line.Substring(0, 8).Trim();
                    var ss = line.Substring(8, 40).Trim();
                    var sss = line.Substring(48, 9).Trim();
                    var ssss = line.Substring(57, 25).Trim();
                    var sssss = line.Substring(82, 9).Trim();
                    var cwac = line.Substring(91, 10).Trim();
                    var ccost_cqty_salecr_contract = line.Substring(101, 27);
                    var ccost = ccost_cqty_salecr_contract.Substring(0, 10).Trim();
                    var cqty = ccost_cqty_salecr_contract.Substring(10, 6).Trim();
                    var salecr = ccost_cqty_salecr_contract.Substring(16, 1).Trim();
                    var contract = ccost_cqty_salecr_contract.Substring(17, ccost_cqty_salecr_contract.Length - 17).Trim();

                    var contstart_ndc_oldndc = line.Substring(128, 31);

                    var contstart = contstart_ndc_oldndc.Substring(0, 8).Trim();
                    var ndc = contstart_ndc_oldndc.Substring(8, 11).Trim();
                    var oldndc = contstart_ndc_oldndc.Substring(19, contstart_ndc_oldndc.Length - 19).Trim();




                    var upc = line.Substring(159, 24).Trim(); // ndc o hote pare//nop its upc
                    var invoice = line.Substring(183, 9).Trim();
                    var sdate = line.Substring(192, 11).Trim();
                    var sssssssssssss = line.Substring(203, 32);
                    //eta venge dui ta field hobe(prod name & something else)
                    var ctotal = sssssssssssss.Substring(0, 9).Trim();
                    var prodname = sssssssssssss.Substring(9, sssssssssssss.Length - 9).Trim();
                    //eta venge dui ta field hobe(prod name & something else)
                    var ssssssssssssss = line.Substring(236, 17);//prod size +prod string but got no pattern to substring it

                    var prodsize = ssssssssssssss.Substring(0, 5).Trim();
                    var prodstring = ssssssssssssss.Substring(5, ssssssssssssss.Length - 5).Trim();


                    var idate = line.Substring(287, 9).Trim();
                    var venNr = line.Substring(296, 19).Trim();
                    var conversion = line.Substring(315, 10).Trim();


                    var updnchg = line.Substring(253, 20).Trim(); //may be
                    var ssssssssssssssss = line.Substring(273, 14).Trim(); // [FacAcct] ,[VeItemnr]
                    var facacct = ssssssssssssssss.Substring(0, 4).Trim();
                    var veitemnr = ssssssssssssssss.Substring(4, ssssssssssssssss.Length - 4).Trim();

                    // var chgnum = null;
                    var batch = DateTime.Now.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss");// format fix later fixed
                    var wholesaler = "SmithDrug";
                    var whcont = salecr != "O" ? contract.Replace("-", "") : "";
                    var shipqty = cqty;
                    var cost = ccost;
                    var totCost = ctotal;
                    var wac = cwac;
                    var shipdate = sdate;
                    var invdate = idate;
                    var recdate = idate;
                    var wrpid = "36";
                    var whid = "118";
                    var salecrw = salecr;
                    var salecrsrc = 0;



                    // left columns -> matchcoid, matchtype(matchcoid <>0 then A), mmid, itid, extra


                    //var ss = line.Split(' ');

                    entries.Add(new SmithDrug
                    {
                        FcDate = s,
                        DcName = ss,
                        DcDea = sss,
                        FacName = ssss,
                        FacDea = sssss,
                        Cwac = cwac,
                        Upc = upc,
                        Invoice = invoice,
                        Sdate = sdate,
                        ProdName = prodname,
                        UpDnChg = updnchg,
                        Idate = idate,
                        VerNr = venNr,
                        Conversion = conversion,
                        Ccost = ccost,
                        Cqty = cqty,
                        SaleCr = salecr,
                        Contract = contract,
                        ContStart = contstart,
                        Ndc = ndc,
                        Ctotal = ctotal, //ctotal != "" ? Int64.Parse(ctotal) : -1  ,
                        ProdSize = prodsize,
                        ProdString = prodstring,
                        OldNdc = oldndc,
                        Batch = batch,
                        // ChgNum = 
                        Cost = cost,
                        FacAcct = facacct,
                        InvDate = GetDateTimeFromString(invdate)?.ToString("MM/dd/yyyy"),
                        //ItId =
                        //MatchCoid =match
                        WrPid = wrpid,
                        WholeSaler = wholesaler,
                        Whid = whid,
                        WhCont = whcont,
                        Wac = wac,
                        VeItemnr = veitemnr,
                        //Upn = upn
                        TotCost = totCost,
                        ShipQty = shipqty,
                        ShipDate = GetDateTimeFromString(shipdate)?.ToString("MM/dd/yyyy"),
                        SaleCrw = salecrw,
                        SaleCrsrc = salecrsrc.ToString(),
                        RecDate = GetDateTimeFromString(recdate)?.ToString("MM/dd/yyyy"),
                        Upn = "",
                        Filler = "",
                        Filler2 = "",
                        ChgNum = ""
                        //MmId = mmid

                    });

                }
               

                }
            return entries;
        }
        private DateTime? GetDateTimeFromString(string datestr)
        {
            if (string.IsNullOrEmpty(datestr)) return null;
            var date = datestr.Substring(0, 2);
            var month = datestr.Substring(2, 2);
            var year = datestr.Substring(4, 4);

            return new DateTime(Int32.Parse(year), Int32.Parse(month), Int32.Parse(date));

        }
    }
        
    }

