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
       private CrudRepo _crudRepo;

        public bool ProcessAllWholeSeller()
        {
            var result = false;

            var vd=new ValueDrugsProcessor();
            var valueDrugsEntries = vd.ProcessValueDrugs(_filepathvd);

            var smiths= new SmithDrugsProcessor();
            var smithDrugEntries = smiths.ProcessSmithDrugs(_filepathsmiths);

            var cardinal=new CardinalProcesor();
            var cardinalEntries = cardinal.ProcessCardinal(_filepathcardinal);

            var dakota = new DakotaProcessor();
            var dakotaEntries = dakota.ProcessDakota(_filepathdakota);

            var amerisource = new AmerisourceProcessor();
            var amerisourceEntries = amerisource.ProcessAmerisource(_filepathamerisource);
            var ncmutual = new NcMutualProcessor();
            var ncmutualEntries = ncmutual.ProcessNcMutual(_filepathncmutual);
            var biocare = new BioCareProcessor();
            var biocareEntries = biocare.ProcessBioCare(_filepathbiocare);

            //if (smithDrugEntries.Any())
            //{
            //    _crudRepo = new CrudRepo();

            //    result = _crudRepo.BulkAddSmiths(smithDrugEntries);

            //}
            //if (valueDrugsEntries.Any())
            //{
            //    _crudRepo = new CrudRepo();
            //  //  var ss = _crudRepo.AddAll(valueDrugsEntries);
            //    result = _crudRepo.BulkAddValueDrugs(valueDrugsEntries);

            //}
            //if (cardinalEntries.Any())
            //{
            //    _crudRepo = new CrudRepo();
            //     result = _crudRepo.BulkAddCardinal(cardinalEntries);

            //}
            //if (dakotaEntries.Any())
            //{
            //    _crudRepo = new CrudRepo();
            //    result = _crudRepo.BulkAddDakota(dakotaEntries);

            //}
            //if (amerisourceEntries.Any())
            //{
            //    _crudRepo = new CrudRepo();
            //    result = _crudRepo.BulkAddAmerisource(amerisourceEntries);

            //}
            //return result;

            //if (ncmutualEntries.Any())
            //{
            //    _crudRepo = new CrudRepo();
            //    result = _crudRepo.BulkAddNcMutual(ncmutualEntries);

            //}
            if (biocareEntries.Any())
            {
                _crudRepo = new CrudRepo();
                result = _crudRepo.BulkAddBioCare(biocareEntries);

            }
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
