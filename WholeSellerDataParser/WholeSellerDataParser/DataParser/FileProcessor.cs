using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WholeSellerDataParser.DataParser.WholeSellers;
using WholeSellerDataParser.EDMX;
using WholeSellerDataParser.Repository;

namespace WholeSellerDataParser.DataParser
{
   public class FileProcessor
    {
        private readonly string _filepathsmiths = ConfigurationManager.AppSettings["FileLocationSmithDrugs"];
        private readonly string _filepathvd = ConfigurationManager.AppSettings["FileLocationValueDrugs"];
       private readonly string _filepathcardinal = ConfigurationManager.AppSettings["FileLocationCardinal"];
       private readonly string _filepathdakota = ConfigurationManager.AppSettings["FileLocationDakota"];
       private readonly string _filepathamerisource = ConfigurationManager.AppSettings["FileLocationAmerisource"];
       private readonly string _filepathncmutual = ConfigurationManager.AppSettings["FileLocationNcMutual"];
       private readonly string _filepathbiocare= ConfigurationManager.AppSettings["FileLocationBioCare"];
        private readonly string _filepathValleyWholesale = ConfigurationManager.AppSettings["FileLocationValleyWholesale"];
        private readonly string _filepathMorrisDickson = ConfigurationManager.AppSettings["FileLocationMorrisDickson"];
        private readonly string _filepathAnda = ConfigurationManager.AppSettings["FileLocationAnda"];
        private readonly string _filepathmckesson = ConfigurationManager.AppSettings["FileLocationMckesson"];
        private readonly string _filepathASD = ConfigurationManager.AppSettings["FileLocationASD"];
        private readonly string _filepathRnS = ConfigurationManager.AppSettings["FileLocationRnS"];
        private readonly string _filepathHdSmith = ConfigurationManager.AppSettings["FileLocationHdSmith"];
        private readonly string _filepathKinray = ConfigurationManager.AppSettings["FileLocationKinray"];
        private readonly string _filepathCuraScript = ConfigurationManager.AppSettings["FileLocationCuraScript"];
        private readonly string _filepathCardinalSPD = ConfigurationManager.AppSettings["FileLocationCardinalSPD"];
        private readonly string _filepathMcKessonSPD = ConfigurationManager.AppSettings["FileLocationMcKessonSp"];
        private readonly string _filepathRDC = ConfigurationManager.AppSettings["FileLocationRDC"];



        private CrudRepo _crudRepo;



        
        public bool ProcessAllWholeSeller()
        {



            //1   Amerisource
            //2   Anda
            //3   ASD
            //4   BioCARE
            //5   Cardinal
            //6   CardinalSPD
            //7   Curascript
            //8   Dakota
            //9   HDSmith
            //10  Kinray
            //11  McKesson
            //12  MckessonSP
            //13  Metro Medical Supply
            //14  MorrisDickson
            //15  NC Mutual
            //16  R & S Pharma
            //17  RDC
            //18  SmithDrug
            //19  Valley Wholesale
            //20  ValueDrug


            //Amerisource 7
            //Anda 143
            //ASD 116
            //BioCARE 14821
            //Cardinal 9
            //CardinalSPD 14695
            //Curascript 27039
            //Dakota 147
            //HDSmith 11
            //Kinray 10
            //McKesson 8
            //MckessonSP 15945
            //Metro Medical Supply 135
            //MorrisDickson 29
            //NC Mutual 80
            //R & S Pharma 14691
            //  RDC 6
            //  SmithDrug 36
            //  Valley Wholesale 57
            //  ValueDrug 77





            var result = false;
            Console.WriteLine("Enter  importTypeId :");
            int importTypeId = int.Parse(Console.ReadLine());



            if (importTypeId == 1)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - amerisource");

                var amerisource = new AmerisourceProcessor();
                var amerisourceEntries = amerisource.ProcessAmerisource(_filepathamerisource);

                if (amerisourceEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddAmerisource(amerisourceEntries);

                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathamerisource);


              
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathamerisource;
                var importFileRows = amerisourceEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }





            if (importTypeId == 2)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - Anda");

                var Anda = new AndaProcesor();
                var AndaEntries = Anda.ProcessAnda(_filepathAnda);

                if (AndaEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddAnda(AndaEntries);

                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathAnda);


               
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathAnda;
                var importFileRows = AndaEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }



            if (importTypeId == 3)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - ASD");

                var ASD = new ASDProcesor();
                var ASDEntries = ASD.ProcessASD(_filepathASD);

                if (ASDEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddASD(ASDEntries);

                }

                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathASD);

               
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathASD;
                var importFileRows = ASDEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }



            if (importTypeId == 4)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - biocare");

                var biocare = new BioCareProcessor();
                var biocareEntries = biocare.ProcessBioCare(_filepathbiocare);

                if (biocareEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddBioCare(biocareEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathbiocare);


              
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathbiocare;
                var importFileRows = biocareEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }



            if (importTypeId == 5)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - cardinal");

                var cardinal = new CardinalProcesor();
                var cardinalEntries = cardinal.ProcessCardinal(_filepathcardinal);

                if (cardinalEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddCardinal(cardinalEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathcardinal);


                
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathcardinal;
                var importFileRows = cardinalEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }



            if (importTypeId == 6)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - CardinalSPD");

                var card = new CardinalSPDProcessor();
                var cardEntries = card.ProcessCardinalSPD(_filepathCardinalSPD);

                if (cardEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddCardinalSPD(cardEntries);

                }




                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathCardinalSPD);


               
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathCardinalSPD;
                var importFileRows = cardEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }




            if (importTypeId == 7)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - CuraScript");

                var cscr = new CuraScriptProcessor();
                var cscrEntries = cscr.ProcessCuraScript(_filepathCuraScript);

                if (cscrEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddCuraScript(cscrEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathCuraScript);


               
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathCuraScript;
                var importFileRows = cscrEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);



            }




            if (importTypeId == 8)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - dakota");

                var dakota = new DakotaProcessor();
                var dakotaEntries = dakota.ProcessDakota(_filepathdakota);

                if (dakotaEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddDakota(dakotaEntries);

                }




                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathdakota);


               
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathdakota;
                var importFileRows = dakotaEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }


            if (importTypeId == 9)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - HdSmith");

                var hds = new HDSmithProcessor();
                var hdsEntries = hds.ProcessHDSmith(_filepathHdSmith);

                if (hdsEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddHdSmith(hdsEntries);

                }




                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathHdSmith);


              
                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathHdSmith;
                var importFileRows = hdsEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);


            }


            if (importTypeId == 10)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - Kinray");

                var kinray = new KinrayProcessro();
                var kinrayEntries = kinray.ProcessKinray(_filepathKinray);

                if (kinrayEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddKinray(kinrayEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathKinray);



                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathKinray;
                var importFileRows = kinrayEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);
            }


            if (importTypeId == 11)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - Mckesson");

                var mcKesson = new MckessonProcessor();
                var mcKessonEntries = mcKesson.ProcessMckessons(_filepathmckesson);

                if (mcKessonEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddMCkesson(mcKessonEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathmckesson);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathmckesson;
                var importFileRows = mcKessonEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }



            if (importTypeId == 12)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - MckessonSP");

                var mckp = new McKessonSPProcessor();
                var mckpEntries = mckp.ProcessMcKessonSP(_filepathMcKessonSPD);

                if (mckpEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddMcKessonSP(mckpEntries);

                }

                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathMcKessonSPD);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathMcKessonSPD;
                var importFileRows = mckpEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }





            if (importTypeId == 14)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - MorrisDickson");

                var MorrisDickson = new MorrisDicksonProcesor();
                var MorrisDicksonEntries = MorrisDickson.ProcessMorrisDickson(_filepathMorrisDickson);

                if (MorrisDicksonEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddMorrisDickson(MorrisDicksonEntries);

                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathMorrisDickson);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathMorrisDickson;
                var importFileRows = MorrisDicksonEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }




            if (importTypeId == 15)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - NcMutual");

                var ncmutual = new NcMutualProcessor();
                var ncmutualEntries = ncmutual.ProcessNcMutual(_filepathncmutual);

                if (ncmutualEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddNcMutual(ncmutualEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathncmutual);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathncmutual;
                var importFileRows = ncmutualEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }




            if (importTypeId == 16)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - R&S Pharma");

                var rns = new RnSProcessor();
                var rnsEntries = rns.ProcessRnS(_filepathRnS);

                if (rnsEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddRnS(rnsEntries);

                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathRnS);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathRnS;
                var importFileRows = rnsEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);
            }



            if (importTypeId == 17)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - RDC");

                var RDC = new RDCProcesor();
                var RDCEntries = RDC.ProcessRDC(_filepathRDC);

                if (RDCEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddRDC(RDCEntries);

                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathRnS);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathRnS;
                var importFileRows = RDCEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }







            if (importTypeId == 18)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - SmithDrugs");

                var smiths = new SmithDrugsProcessor();
                var smithDrugEntries = smiths.ProcessSmithDrugs(_filepathsmiths);

                if (smithDrugEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddSmiths(smithDrugEntries);

                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathsmiths);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathsmiths;
                var importFileRows = smithDrugEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }



            if (importTypeId == 19)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - ValleyWholesale");

                var ValleyWholesale = new ValleyWholesaleProcesor();
                var ValleyWholesaleEntries = ValleyWholesale.ProcessValleyWholesale(_filepathValleyWholesale);

                if (ValleyWholesaleEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddValleyWholesale(ValleyWholesaleEntries);

                }



                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathValleyWholesale);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathValleyWholesale;
                var importFileRows = ValleyWholesaleEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }


            if (importTypeId == 20)
            {
                Console.WriteLine("Start Parsing :" + importTypeId + " - ValueDrugs");

                var vd = new ValueDrugsProcessor();
                var valueDrugsEntries = vd.ProcessValueDrugs(_filepathvd);

                if (valueDrugsEntries.Any())
                {
                    _crudRepo = new CrudRepo();
                    result = _crudRepo.BulkAddValueDrugs(valueDrugsEntries);


                }


                //InsertImportLog
                FileInfo fi = new FileInfo(_filepathvd);

                var importFileDateTime = fi.CreationTime;
                // var lastmodified = fi.LastWriteTime;
                var importFilePath = _filepathvd;
                var importFileRows = valueDrugsEntries.Count;

                _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

            }




            Console.WriteLine("Parsing Complete Status :" + result);
            Console.ReadLine();

            return result;

        }

       private DateTime? GetDateTimeFromString(string datestr)
       {
           if (string.IsNullOrEmpty(datestr)) return null;
           var date = datestr.Substring(0, 2);
           var month = datestr.Substring(2, 2);
           var year = datestr.Substring(4, 4);
           
           return new DateTime(Int32.Parse(year), Int32.Parse(month) , Int32.Parse(date));
           
       }

      
    }
}
