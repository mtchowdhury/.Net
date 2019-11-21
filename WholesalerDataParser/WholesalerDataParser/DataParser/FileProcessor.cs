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
using WholesalerDataParser.DataParser.Wholesalers;
using WholesalerDataParser.EDMX;
using WholesalerDataParser.Repository;

namespace WholesalerDataParser.DataParser
{
    public class FileProcessor
    {


        private CrudRepo _crudRepo;


        // Generate Index by add Previous length
        int[] ListImportFileRows = new int[20];
        int importFileRows = 0;


        int[] wrpid_array = new int[] {  7,
                                            143,
                                            116,
                                            14821,
                                            9,
                                            14695,
                                            27039,
                                            147,
                                            11,
                                            10,
                                            8 ,
                                            15945,
                                            135,
                                            29,
                                            80 ,
                                            14691,
                                            6,
                                            36,
                                            57,
                                            77
                                            };


        public bool ProcessAllWholesaler()
        {

            bool status = false;

            try
            {
                //Console.WriteLine(@"*********************************
                //    1   Amerisource
                //    2   Anda
                //    3   ASD
                //    4   BioCARE
                //    5   Cardinal
                //    6   CardinalSPD
                //    7   Curascript
                //    8   Dakota
                //    9   HDSmith
                //    10  Kinray
                //    11  McKesson
                //    12  MckessonSP
                //    13  Metro Medical Supply
                //    14  MorrisDickson
                //    15  NC Mutual
                //    16  R & S Pharma
                //    17  RDC
                //    18  SmithDrug
                //    19  Valley Wholesale
                //    20  ValueDrug");

                //            //Console.WriteLine("*********************************");



                Console.WriteLine(@"************ wrpid **********************
                7       Amerisource
                143     Anda
                116     ASD
                14821   BioCARE
                9       Cardinal
                14695   CardinalSPD
                27039   Curascript
                147     Dakota
                11      HDSmith
                10      Kinray
                8       McKesson
                15945   MckessonSP
                135     Metro Medical Supply
                29      MorrisDickson
                80      NC Mutual
                14691   R & S Pharma
                6       RDC
                36      SmithDrug
                57      Valley Wholesale
                77      ValueDrug");

                Console.WriteLine("*********************************");



                ConfigurationManager.AppSettings["reportlogfile"] = ConfigurationManager.AppSettings["reportlogfile"].Replace("Date", DateTime.Now.ToString("yyyyMMdd"));


                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                    Environment.NewLine + " ******************* Parsing Started : " + DateTime.Now.ToShortDateString() + "***************************");


              


                for (int i = 0; i <= wrpid_array.Length-1; i++)
                {

                    importFileRows = 0;


                    int wrpid = wrpid_array[i];


                    string ParserFile_wrpid = ConfigurationManager.AppSettings["ParserFile_wrpid"];

                    try
                    {

                        if (int.Parse(ParserFile_wrpid) > 0)
                        {
                            wrpid = int.Parse(ParserFile_wrpid);
                           //  i=wrpid_array.Length - 1;
                        }
                    }
                    catch
                    {
                        Console.WriteLine("ParserFile_wrpid = " + ParserFile_wrpid + " Invalid");

                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                  Environment.NewLine + "ParserFileID = " + ParserFile_wrpid + " Invalid");

                        return false;
                    }



                    Console.WriteLine(GetwholesalerNameBy_wrpid(wrpid) + " - Searching File ");
                    

                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                                       Environment.NewLine + GetwholesalerNameBy_wrpid(wrpid) + "  - Searching File : " + DateTime.Now);



                    // truncate temp table before insert data
                    int importTypeId = Getwholesaler_ID_By_wrpid(wrpid);
                    _crudRepo = new CrudRepo();
                    _crudRepo.PreParsingProcess(importTypeId);


                    FileInfo[] filesInDir = GetwholesalerPathBy_wrpid(wrpid);

                    Console.WriteLine(" ");
                    Console.WriteLine("*****    " + filesInDir.Length+ "  -  Files ***** ");
                    Console.WriteLine(" ");

                    foreach (FileInfo foundFile in filesInDir)
                    {
                       
                        Console.WriteLine("*********************************");
                        Console.WriteLine(foundFile.Name);

                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                        Environment.NewLine + foundFile.Name + " Parsing Started : " + DateTime.Now);

                        try
                        {

                            status = ProcessWholesaler(wrpid, foundFile.FullName);
                        }
                        catch(Exception ex)
                        {
                            bool send_mail = SendEmail_error(ex.ToString());
                        
                        }

                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                   Environment.NewLine + GetwholesalerNameBy_wrpid(wrpid) + " Parsing status : " + status + " : " + DateTime.Now);
                    }

                    if (status)
                    {
                        ListImportFileRows[i] = importFileRows;
                    }


                    if (int.Parse(ParserFile_wrpid) > 0)
                    {
                        i = wrpid_array.Length - 1;
                    }


                }


                bool send = SendEmail_success(ListImportFileRows);



              

            }
            catch(Exception ex)
            {
                Console.WriteLine("error = " + ex.ToString() );

                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                          Environment.NewLine + ex.ToString());


                bool send = SendEmail_error(ex.ToString());

              //  Console.ReadLine();
            }

            return status;
        }

        public bool ProcessWholesaler(int wrpid, string _filepath)
        {


            var result = false;

             importFileRows = 0;


          //  Console.WriteLine("Enter wrpid : " + wrpid);

            /// Console.Write("Enter wrpid : ");

            //int wrpid = int.Parse(Console.ReadLine());

           //  int importTypeId = Getwholesaler_ID_By_wrpid(wrpid);


            //Console.WriteLine("Enter import File Name of -> "+ GetwholesalerNameByID(importTypeId));
            //string _fileName = Console.ReadLine();


           

            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + _filepath);


            if (!File.Exists(_filepath))
            {
                Console.WriteLine("\nFile not Exists");


                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                Environment.NewLine + "File not Exists ");

               // Console.ReadLine();

                return false;
            }
            else
            {
                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                                     Environment.NewLine + "File  Exists ");
                // return false;
            }




            FileInfo fi = new FileInfo(_filepath);

            string _fileName = Path.GetFileNameWithoutExtension(fi.FullName);

            // Create backup Folder
            if (!System.IO.Directory.Exists(fi.DirectoryName + @"\backup"))
                System.IO.Directory.CreateDirectory(fi.DirectoryName + @"\backup");


             string  wholesalerFile_backup = fi.DirectoryName + @"\backup\" + _fileName+"_"+ DateTime.Now.ToString("dd-MMM-yyyy hh:mm:ss ").Replace("-", "_").Replace(":","_") + fi.Extension;

           // string wholesalerFile_backup = fi.DirectoryName + @"\backup\" + _fileName + fi.Extension;


            // Delete from backup Folder if file Exists
            if (File.Exists(wholesalerFile_backup))
                File.Delete(wholesalerFile_backup);


            _crudRepo = new CrudRepo();

            if (_crudRepo.FileParsed(_filepath, fi.LastWriteTime))
            {
                  Console.WriteLine("\n Already Parsed this File");


                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                        Environment.NewLine + "Already Parsed this File");


                //// Move file in backup Folder
                File.Move(_filepath, wholesalerFile_backup);
               
               // Console.ReadLine();

                return false;
            }


           
        

            if (wrpid == 7)
            {


                Console.WriteLine("Start Parsing :" + " - amerisource");

                var amerisource = new AmerisourceProcessor();
                var amerisourceEntries = amerisource.ProcessAmerisource(_filepath);

                importFileRows = amerisourceEntries.Count;

                if (amerisourceEntries.Any())
                {

                    result = _crudRepo.BulkAddAmerisource(amerisourceEntries);

                }

                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }
            }





            if (wrpid == 143)
            {


                Console.WriteLine("Start Parsing :" + " - Anda");

                var Anda = new AndaProcesor();
                var AndaEntries = Anda.ProcessAnda(_filepath);

                importFileRows = AndaEntries.Count;

                if (AndaEntries.Any())
                {

                    result = _crudRepo.BulkAddAnda(AndaEntries);

                }

                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }



            if (wrpid == 116)
            {


                Console.WriteLine("Start Parsing :" + " - ASD");

                var ASD = new ASDProcesor();
                var ASDEntries = ASD.ProcessASD(_filepath);

                importFileRows = ASDEntries.Count;

                if (ASDEntries.Any())
                {

                    result = _crudRepo.BulkAddASD(ASDEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }



            if (wrpid == 14821)
            {





                Console.WriteLine("Start Parsing :" + " - biocare");

                var biocare = new BioCareProcessor();
                var biocareEntries = biocare.ProcessBioCare(_filepath);

                importFileRows = biocareEntries.Count;

                if (biocareEntries.Any())
                {
                    result = _crudRepo.BulkAddBioCare(biocareEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }



            if (wrpid == 9)
            {




                Console.WriteLine("Start Parsing :" + " - cardinal");

               string filename = Path.GetFileName(_filepath);

                if (filename.Substring(0,4) == "CSWJ")
                {

                    var cardinal = new CardinalProcesor();
                    var cardinalEntries = cardinal.ProcessCardinal(_filepath);

                    importFileRows = cardinalEntries.Count;

                    if (cardinalEntries.Any())
                    {
                        result = _crudRepo.BulkAddCardinal(cardinalEntries);

                    }
                }
                else
                {

                    var cardinal = new CardinalProcesorW();
                    var cardinalEntries = cardinal.ProcesorCardinalW(_filepath);

                    importFileRows = cardinalEntries.Count;

                    if (cardinalEntries.Any())
                    {
                        result = _crudRepo.BulkAddCardinal_W(cardinalEntries);

                    }

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }



            if (wrpid == 14695)
            {


                Console.WriteLine("Start Parsing :" + " - CardinalSPD");

                var card = new CardinalSPDProcessor();
                var cardEntries = card.ProcessCardinalSPD(_filepath);

                importFileRows = cardEntries.Count;

                if (cardEntries.Any())
                {
                    result = _crudRepo.BulkAddCardinalSPD(cardEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }



            }




            if (wrpid == 27039)
            {
                

                Console.WriteLine("Start Parsing :" + " - CuraScript");

                var cscr = new CuraScriptProcessor();
                var cscrEntries = cscr.ProcessCuraScript(_filepath);

                importFileRows = cscrEntries.Count;

                if (cscrEntries.Any())
                {
                    result = _crudRepo.BulkAddCuraScript(cscrEntries);

                }




                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }



            }




            if (wrpid == 147)
            {




                Console.WriteLine("Start Parsing :" + " - dakota");

                var dakota = new DakotaProcessor();
                var dakotaEntries = dakota.ProcessDakota(_filepath);

                importFileRows = dakotaEntries.Count;

                if (dakotaEntries.Any())
                {
                    result = _crudRepo.BulkAddDakota(dakotaEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }


            if (wrpid == 11)
            {



                Console.WriteLine("Start Parsing :" + " - HdSmith");

                var hds = new HDSmithProcessor();
                var hdsEntries = hds.ProcessHDSmith(_filepath);

                importFileRows = hdsEntries.Count;

                if (hdsEntries.Any())
                {

                    result = _crudRepo.BulkAddHdSmith(hdsEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }


            if (wrpid == 10)
            {




                Console.WriteLine("Start Parsing :" + " - Kinray");

                var kinray = new KinrayProcessor();
                var kinrayEntries = kinray.ProcessKinray(_filepath);

                importFileRows = kinrayEntries.Count;

                if (kinrayEntries.Any())
                {

                    result = _crudRepo.BulkAddKinray(kinrayEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }


            if (wrpid == 8)
            {



                Console.WriteLine("Start Parsing :" + " - Mckesson");

                var mcKesson = new MckessonProcessor();
                var mcKessonEntries = mcKesson.ProcessMckessons(_filepath);

                importFileRows = mcKessonEntries.Count;

                if (mcKessonEntries.Any())
                {

                    result = _crudRepo.BulkAddMCkesson(mcKessonEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }



            if (wrpid == 15945)
            {




                Console.WriteLine("Start Parsing :" + " - MckessonSP");

                var mckp = new McKessonSPProcessor();
                var mckpEntries = mckp.ProcessMcKessonSP(_filepath);

                importFileRows = mckpEntries.Count;

                if (mckpEntries.Any())
                {
                    result = _crudRepo.BulkAddMcKessonSP(mckpEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }





            if (wrpid == 29)
            {




                Console.WriteLine("Start Parsing :" + " - MorrisDickson");

                var MorrisDickson = new MorrisDicksonProcesor();
                var MorrisDicksonEntries = MorrisDickson.ProcessMorrisDickson(_filepath);

                importFileRows = MorrisDicksonEntries.Count;

                if (MorrisDicksonEntries.Any())
                {
                    result = _crudRepo.BulkAddMorrisDickson(MorrisDicksonEntries);

                }



                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }




            if (wrpid == 80)
            {



                Console.WriteLine("Start Parsing :" + " - NcMutual");

                var ncmutual = new NcMutualProcessor();
                var ncmutualEntries = ncmutual.ProcessNcMutual(_filepath);


                importFileRows = ncmutualEntries.Count;


                if (ncmutualEntries.Any())
                {
                    result = _crudRepo.BulkAddNcMutual(ncmutualEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }




            if (wrpid == 14691)
            {




                Console.WriteLine("Start Parsing :" + " - R&S Pharma");

                var rns = new RnSProcessor();
                var rnsEntries = rns.ProcessRnS(_filepath);

                importFileRows = rnsEntries.Count;

                if (rnsEntries.Any())
                {
                    result = _crudRepo.BulkAddRnS(rnsEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }



            if (wrpid == 6)
            {
                Console.WriteLine("Start Parsing :" + " - RDC");

                var RDC = new RDCProcesor();
                var RDCEntries = RDC.ProcessRDC(_filepath);

                importFileRows = RDCEntries.Count;

                if (RDCEntries.Any())
                {
                    result = _crudRepo.BulkAddRDC(RDCEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }







            if (wrpid == 36)
            {

                Console.WriteLine("Start Parsing :" + " - SmithDrugs");

                var smiths = new SmithDrugsProcessor();
                var smithDrugEntries = smiths.ProcessSmithDrugs(_filepath);

                importFileRows = smithDrugEntries.Count;

                if (smithDrugEntries.Any())
                {

                    result = _crudRepo.BulkAddSmithDrugs(smithDrugEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }

            }



            if (wrpid == 57)
            {




                Console.WriteLine("Start Parsing :" + " - ValleyWholesale");

                var ValleyWholesale = new ValleyWholesaleProcesor();
                var ValleyWholesaleEntries = ValleyWholesale.ProcessValleyWholesale(_filepath);

                importFileRows = ValleyWholesaleEntries.Count;

                if (ValleyWholesaleEntries.Any())
                {
                    result = _crudRepo.BulkAddValleyWholesale(ValleyWholesaleEntries);

                }


                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }
            }


            if (wrpid == 77)
            {





                Console.WriteLine("Start Parsing :" + " - ValueDrugs");

                var vd = new ValueDrugsProcessor();
                var valueDrugsEntries = vd.ProcessValueDrugs(_filepath);

                importFileRows = valueDrugsEntries.Count;


                if (valueDrugsEntries.Any())
                {
                    result = _crudRepo.BulkAddValueDrugs(valueDrugsEntries);

                }

                if (result)
                {

                    InsertImportLog(wrpid, _filepath, importFileRows);

                }


            }





            if (result)
            {
                // Move file in backup Folder
                File.Move(_filepath, wholesalerFile_backup);


                Console.WriteLine("Parsing Completed Successfully");
                //Console.WriteLine(importFileRows + " Rows Inserted ");

                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                           Environment.NewLine + "Parsing Completed Successfully   --- " + importFileRows + " Rows Inserted ");

               
            }
            else
            {
                Console.WriteLine("Parsing Failed");

            }




            return result;

        }

        public void InsertImportLog(int wrpid, string FilePath, int importFileRows)
        {
            int importTypeId = Getwholesaler_ID_By_wrpid(wrpid);
            //InsertImportLog
            FileInfo fi = new FileInfo(FilePath);

            var importFileDateTime = fi.LastWriteTime;
            // var lastmodified = fi.LastWriteTime;
            var importFilePath = FilePath;

            _crudRepo.InsertImportLog(importTypeId, importFileDateTime, importFilePath, importFileRows);

        }




        public FileInfo[] GetwholesalerPathBy_wrpid(int wrpid)
        {

            FileInfo[] wholesalerPathAll = null;

            string wholesalerPath = "";

            try
            {


                switch (wrpid)
                {
                    case 7:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathAmerisource"];
                        break;
                    case 143:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathAnda"];
                        break;
                    case 116:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathASD"];
                        break;
                    case 14821:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathBioCare"];
                        break;
                    case 9:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathCardinal"];
                        break;
                    case 14695:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathCardinalSPD"];
                        break;
                    case 27039:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathCuraScript"];
                        break;
                    case 147:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathDakota"];
                        break;
                    case 11:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathHdSmith"];
                        break;
                    case 10:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathKinray"];
                        break;
                    case 8:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathMckesson"];
                        break;
                    case 15945:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathMcKessonSp"];
                        break;
                    case 135:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathMetroMedicalSupply"];
                        break;
                    case 29:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathMorrisDickson"];
                        break;
                    case 80:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathNcMutual"];
                        break;
                    case 14691:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathRnS"];
                        break;
                    case 6:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathRDC"];
                        break;
                    case 36:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathSmithDrugs"];
                        break;
                    case 57:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathValleyWholesale"];
                        break;
                    case 77:
                        wholesalerPath = ConfigurationManager.AppSettings["FilePathValueDrugs"];
                        break;

                }



                FileInfo fi = new FileInfo(wholesalerPath);


                DirectoryInfo hdDirectoryInWhichToSearch = new DirectoryInfo(fi.DirectoryName);

                // FileInfo[] filesInDir = hdDirectoryInWhichToSearch.GetFiles("*" + partialName + "*.*");
                FileInfo[] filesInDir = hdDirectoryInWhichToSearch.GetFiles("*" + Path.GetFileNameWithoutExtension(fi.FullName) + "*" + fi.Extension);


                wholesalerPathAll=filesInDir;
               
            }
            catch
            {

            }

            return wholesalerPathAll;


        }





        public int Getwholesaler_ID_By_wrpid(int wrpid)
        {

            int importTypeId = 0;

            switch (wrpid)
            {
                case 7:
                    importTypeId = 1;
                    break;
                case 143:
                    importTypeId = 2;
                    break;
                case 116:
                    importTypeId = 3;
                    break;
                case 14821:
                    importTypeId = 4;
                    break;
                case 9:
                    importTypeId = 5;
                    break;
                case 14695:
                    importTypeId = 6;
                    break;
                case 27039:
                    importTypeId = 7;
                    break;
                case 147:
                    importTypeId = 8;
                    break;
                case 11:
                    importTypeId = 9;
                    break;
                case 10:
                    importTypeId = 10;
                    break;
                case 8:
                    importTypeId = 11;
                    break;
                case 15945:
                    importTypeId = 12;
                    break;
                case 135:
                    importTypeId = 13;
                    break;
                case 29:
                    importTypeId = 14;
                    break;
                case 80:
                    importTypeId = 15;
                    break;
                case 14691:
                    importTypeId = 16;
                    break;
                case 6:
                    importTypeId = 17;
                    break;
                case 36:
                    importTypeId = 18;
                    break;
                case 57:
                    importTypeId = 19;
                    break;
                case 77:
                    importTypeId = 20;
                    break;

            }

            return importTypeId;


        }


        public int Getwholesaler_wrpid_ByID(int importTypeId)
        {

            int wholesaler_wrpid = 0;

            switch (importTypeId)
            {
                case 1:
                    wholesaler_wrpid = 7;
                    break;
                case 2:
                    wholesaler_wrpid = 143;
                    break;
                case 3:
                    wholesaler_wrpid = 116;
                    break;
                case 4:
                    wholesaler_wrpid = 14821;
                    break;
                case 5:
                    wholesaler_wrpid = 9;
                    break;
                case 6:
                    wholesaler_wrpid = 14695;
                    break;
                case 7:
                    wholesaler_wrpid = 27039;
                    break;
                case 8:
                    wholesaler_wrpid = 147;
                    break;
                case 9:
                    wholesaler_wrpid = 11;
                    break;
                case 10:
                    wholesaler_wrpid = 10;
                    break;
                case 11:
                    wholesaler_wrpid = 8;
                    break;
                case 12:
                    wholesaler_wrpid = 15945;
                    break;
                case 13:
                    wholesaler_wrpid = 135;
                    break;
                case 14:
                    wholesaler_wrpid = 29;
                    break;
                case 15:
                    wholesaler_wrpid = 80;
                    break;
                case 16:
                    wholesaler_wrpid = 14691;
                    break;
                case 17:
                    wholesaler_wrpid = 6;
                    break;
                case 18:
                    wholesaler_wrpid = 36;
                    break;
                case 19:
                    wholesaler_wrpid = 57;
                    break;
                case 20:
                    wholesaler_wrpid = 77;
                    break;

            }

            return wholesaler_wrpid;


        }



        public string GetwholesalerNameBy_wrpid(int wrpid)
        {

            string wholesalerName = "";
            switch (wrpid)
            {
                case 7:
                    wholesalerName = "Amerisource";
                    break;
                case 143:
                    wholesalerName = "Anda";
                    break;
                case 116:
                    wholesalerName = "ASD";
                    break;
                case 14821:
                    wholesalerName = "BioCARE";
                    break;
                case 9:
                    wholesalerName = "Cardinal";
                    break;
                case 14695:
                    wholesalerName = "CardinalSPD";
                    break;
                case 27039:
                    wholesalerName = "Curascript";
                    break;
                case 147:
                    wholesalerName = "Dakota";
                    break;
                case 11:
                    wholesalerName = "HDSmith";
                    break;
                case 10:
                    wholesalerName = "Kinray";
                    break;
                case 8:
                    wholesalerName = "McKesson";
                    break;
                case 15945:
                    wholesalerName = "MckessonSP";
                    break;
                case 135:
                    wholesalerName = "Metro Medical Supply";
                    break;
                case 29:
                    wholesalerName = "MorrisDickson";
                    break;
                case 80:
                    wholesalerName = "NC Mutual";
                    break;
                case 14691:
                    wholesalerName = "R & S Pharma";
                    break;
                case 6:
                    wholesalerName = "RDC";
                    break;
                case 36:
                    wholesalerName = "SmithDrug";
                    break;
                case 57:
                    wholesalerName = "Valley Wholesale";
                    break;
                case 77:
                    wholesalerName = "ValueDrug";
                    break;

            }

            return wholesalerName;


        }


        public string GetwholesalerNameByID(int importTypeId)
        {

            string wholesalerName = "";
            switch (importTypeId)
            {
                case 1:
                    wholesalerName = "Amerisource";
                    break;
                case 2:
                    wholesalerName = "Anda";
                    break;
                case 3:
                    wholesalerName = "ASD";
                    break;
                case 4:
                    wholesalerName = "BioCARE";
                    break;
                case 5:
                    wholesalerName = "Cardinal";
                    break;
                case 6:
                    wholesalerName = "CardinalSPD";
                    break;
                case 7:
                    wholesalerName = "Curascript";
                    break;
                case 8:
                    wholesalerName = "Dakota";
                    break;
                case 9:
                    wholesalerName = "HDSmith";
                    break;
                case 10:
                    wholesalerName = "Kinray";
                    break;
                case 11:
                    wholesalerName = "McKesson";
                    break;
                case 12:
                    wholesalerName = "MckessonSP";
                    break;
                case 13:
                    wholesalerName = "Metro Medical Supply";
                    break;
                case 14:
                    wholesalerName = "MorrisDickson";
                    break;
                case 15:
                    wholesalerName = "NC Mutual";
                    break;
                case 16:
                    wholesalerName = "R & S Pharma";
                    break;
                case 17:
                    wholesalerName = "RDC";
                    break;
                case 18:
                    wholesalerName = "SmithDrug";
                    break;
                case 19:
                    wholesalerName = "Valley Wholesale";
                    break;
                case 20:
                    wholesalerName = "ValueDrug";
                    break;

            }

            return wholesalerName;


        }

        private MailManager _mailManager;

        public bool SendEmail_success(int[] ListImportFileRows)
        {

            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                      Environment.NewLine + "Email Sending .... ");

            string emailSMTPServer = ConfigurationManager.AppSettings["emailSMTPServer"];
            int emailSMTPport = int.Parse(ConfigurationManager.AppSettings["emailSMTPport"]);
            string emailSender = ConfigurationManager.AppSettings["emailSender"];
            string emailSubject = ConfigurationManager.AppSettings["emailSubject"] + " > " + DateTime.Now.ToString();
            string emailPassword = ConfigurationManager.AppSettings["emailPassword"];




            _mailManager = new MailManager(emailSMTPServer, emailSMTPport, emailSender, emailSubject, emailPassword, "NA");

            string email = ConfigurationManager.AppSettings["emailReceiver"];

            string Message = " WholesalerDataParserService Ran Successfully > " + DateTime.Now.ToString() + "<br/>";

            for (int i = 0; i < ListImportFileRows.Length; i++)
            {
                Message = Message + "<br/>" + GetwholesalerNameByID(i + 1) + "     :      <b>" + ListImportFileRows[i].ToString() + "</b> Rows Inserted";
            }

            string EmailBody = Message;
            string attachmentFile = null;

            bool status = _mailManager.Send(email, EmailBody, attachmentFile);

            if (status)
            {
                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                           Environment.NewLine + "Email Sent Successfully");
            }

            return status;

        }


        public bool SendEmail_error(string error)
        {

            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                      Environment.NewLine + "Email Sending .... ");

            string emailSMTPServer = ConfigurationManager.AppSettings["emailSMTPServer"];
            int emailSMTPport = int.Parse(ConfigurationManager.AppSettings["emailSMTPport"]);
            string emailSender = ConfigurationManager.AppSettings["emailSender"];
            string emailSubject = " Error :  > "+ConfigurationManager.AppSettings["emailSubject"] + " > " + DateTime.Now.ToString();
            string emailPassword = ConfigurationManager.AppSettings["emailPassword"];

         


            _mailManager = new MailManager(emailSMTPServer, emailSMTPport , emailSender, emailSubject, emailPassword, "NA");

          

           string email = ConfigurationManager.AppSettings["emailReceiver"];

            string Message = " Error :  > "  + "<br/>";
           
            Message = Message + error;

            string EmailBody = Message;
            string attachmentFile = null;

            bool status = _mailManager.Send(email, EmailBody, attachmentFile);

            if (status)
            {
                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"],
                           Environment.NewLine + "Email Sent Successfully");
            }

            return status;

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
