using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WholesalerDataParser.DataParser;

namespace WholesalerDataParser
{
    class Program
    {
        private static FileProcessor _fileProcessor;
        static void Main(string[] args)
        {
            _fileProcessor=new FileProcessor();
            var processed= _fileProcessor.ProcessAllWholesaler();
            //MessageBox.Show("File Processed:"+ processed.ToString());
        }
    }
}
