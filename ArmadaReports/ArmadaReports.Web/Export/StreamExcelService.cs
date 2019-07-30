using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using FastMember;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace ArmadaReports.Web.Export
{
    public class StreamExcelService<T> where T : class
    {
        public MemoryStream GenerateExcel(IEnumerable<T> data, params string[] properties)
        {
            var fileStream = new MemoryStream();
            DataTable dataTable = new DataTable();
            using (var reader = ObjectReader.Create<T>(data, properties))
            {
                dataTable.Load(reader);
            }

            using (var package = new ExcelPackage())
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Sheet1");
                worksheet.Cells["A1"].LoadFromDataTable(dataTable, true);
                SetDateTimeFormToDateTimeColumns(worksheet, dataTable);
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                package.SaveAs(fileStream);
            }

            fileStream.Position = 0;

            return fileStream;
        }

        private void SetDateTimeFormToDateTimeColumns(ExcelWorksheet worksheet, DataTable dataTable)
        {
            foreach (DataColumn dataColumn in dataTable.Columns)
            {
                if (dataColumn.DataType == typeof(DateTime))
                {
                    int columnIndex = dataTable.Columns.IndexOf(dataColumn) + 1;
                    using (ExcelRange column = worksheet.Cells[2, columnIndex, worksheet.Dimension.End.Row, columnIndex])
                    {
                        column.Style.Numberformat.Format = "MM/DD/YYYY";
                        column.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    }
                }
            }
        }
    }
}