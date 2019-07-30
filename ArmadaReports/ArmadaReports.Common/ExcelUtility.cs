using ArmadaReports.Common.Extension;
using ArmadaReports.Common.Models;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;

namespace ArmadaReports.Common
{
    public static class ExcelUtility
    {
        public static void AddDetailsRow(List<DetailsExport> exportList, Details details)
        {
            exportList.Add(new DetailsExport
            {
                Program = details.ProgramName_52_,
                Type = details.ReferralType_69_,
                ASPN_ID = details.AspnRxId_4_,
                Created_On = details.CreatedDate_16_,
                Status = details.AspnStatus_63_,
                Program_Status = details.ProgramStatus_53_,
                Substatus = details.ProgramSubStatus_65_,
                Order_Qty = details.OrderQty_35_,
                Refills_Prescribed = details.PrescriptionNumber,
                Fill_Qty = details.FillQty_21_,
                Fill_Date = details.FillDate_20_,
                Ship_Date = details.ShipDate_61_,
                Days_To_Fill = details.DaysToFill_19_,
                Filling_Pharmacy = details.FillingPharmacyName_22_,
                Physician_First_Name = details.PhysicianFirstName_42_43_,
                Physician_Last_Name = details.PhysicianLastName_42_44_,
                Physcian_NPI = details.Npi_34_45_,
                Prescriber_Address = details.Address1_1__47_,
                Prescriber_City = details.City_48_,
                Prescriber_Zip = details.PostalCode_51_,
                Prescriber_State = details.State_50_,
                Hub_Patient_ID = details.HubPatientId_27_,
                BIN_Number = details.BinNumber_7_,
                Tubes = details.RegranexTubesFilled_68_,
                Copay = details.Copay_10_126_,
                Payer = details.ReferrerName_60_
            });
        }

        public static void AddOrderDetailsRow(List<OrderDetailsExport> exportList, OrderDetails details)
        {
            exportList.Add(new OrderDetailsExport
            {
                Program = details.ProgramName,
                Created_On = details.CreatedOn,
                Assigned_On = details.AssignedOn,
                Application_Expiration_Date = details.ApplicationExpirationDate,
                Application_Approval_Date = details.ApplicationApprovalDate,
                Address = details.Address1,
                ASPN_ID = details.AspnrxId,
                Filling_Pharmacy = details.FillingPharmacyName,
                Type = details.ReferralType,
                State = details.State,
                NDC = details.Ndc,
                NPI = details.Npi,
                //Patient_ID = details.PatientId,
                Physician = details.PhysicianFirstName + " " + details.PhysicianLastName,
                Prescriber_Zip = details.PrescriberZip,
                Program_Status = details.ProgramStatus,
                Ship_Date = details.ShipDate
            });
        }

        public static void AddUpDetailsRow(List<UpDetailsExport> exportList, UniquePatientDetails details)
        {
            exportList.Add(new UpDetailsExport
            {
                Program = details.ProgramName,
                Application_Expiration_Date = details.ApplicationExpirationDate,
                Application_Approval_Date = details.ApplicationApprovalDate,
                Address = details.Address1,
                Filling_Pharmacy = details.FillingPharmacyName,
                State = details.State,
                NDC = details.Ndc,
                NPI = details.Npi,
                //Patient_ID = details.PatientId,
                Physician = details.PhysicianFirstName + " " + details.PhysicianLastName,
                Prescriber_Zip = details.PrescriberZip,
                Program_Status = details.ProgramStatus
            });
        }

        public static System.Data.DataTable ToDataTable(GridView gridView)
        {
            System.Data.DataTable dt = new System.Data.DataTable("GridView_Data");
            foreach (TableCell cell in gridView.HeaderRow.Cells)
            {
                dt.Columns.Add(cell.Text);
            }
            foreach (GridViewRow row in gridView.Rows)
            {
                dt.Rows.Add();
                for (int i = 0; i < row.Cells.Count; i++)
                {
                    dt.Rows[dt.Rows.Count - 1][i] = row.Cells[i].Text.Replace("&nbsp;", "");
                }
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(DetailsDataConfig result, string role)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Details Data");
            if (result != null)
            {

                if (result.Config.Any())
                {
                    foreach (var c in result.Config)
                    {
                        if (c.Name.Contains("_btn_") || !Helper.HasRoleAccess(c, role)) continue;
                        dt.Columns.Add(string.IsNullOrEmpty(c.CustomName) ? c.Name : c.CustomName);
                    }
                }
                if (result.Data.Any())
                {
                    foreach (var data in result.Data)
                    {
                        dt.Rows.Add();
                        var i = 0;
                        foreach (var c in result.Config)
                        {
                            if (c.Name.Contains("_btn_") || !Helper.HasRoleAccess(c, role)) continue;
                            dt.Rows[dt.Rows.Count - 1][i] = Helper.GetPropertyValue(data, "_" + c.Id + "_");
                            i++;
                        }
                    }
                }
            }

            return dt;
        }
        public static System.Data.DataTable ToDataTableFromTextData(string textData)
        {
            var dt = new System.Data.DataTable("Details Data");
            var rows = textData.Split('\n');
            for (var row = 0; row < 1; row++)
            {
                var columns = rows[row].Split('|');
                for (var column = 0; column < columns.Length - 1; column++)
                {
                    dt.Columns.Add(columns[column]);
                }
            }
            for (var row = 1; row < rows.Length - 1; row++)
            {
                dt.Rows.Add();
                var columns = rows[row].Split('|');
                for (var column = 0; column < columns.Length - 1; column++)
                {
                    dt.Rows[dt.Rows.Count-1][column] = columns[column];
                }
            }
            return dt;
        }
        public static string GetStringFormattedData(DetailsDataConfig result, string role,bool isService)
        {
            var dataText = "";
            if (result != null)
            {

                if (result.Config.Any())
                {
                    foreach (var c in result.Config)
                    {
                        if (c.Name.Contains("_btn_") || !Helper.HasRoleAccess(c, role)) continue;
                        dataText= dataText + c.Name + "|";
                    }

                    dataText = dataText.Substring(0, dataText.Length - 1);
                    
                }
                if (result.Data.Any())
                {
                    if(isService)
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before Getting properties U R at " + DateTime.Now.ToLongTimeString());
                    var properties = result.Data.First().GetType().GetProperties();
                    if (isService)
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After Getting properties U R at " + DateTime.Now.ToLongTimeString());
                    foreach (var data in result.Data)
                    {
                        dataText +=  Environment.NewLine;
                        var rowDatas = "";
                        foreach (var c in result.Config)
                        {
                            if (c.Name.Contains("_btn_") || !Helper.HasRoleAccess(c, role)) continue;
                            if (isService)
                                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before Getting properties (V) U R at " + DateTime.Now.ToString("hh:mm:ss.fff tt"));
                            rowDatas = rowDatas+ Helper.GetPropertyValueForText(data, "_" + c.Id + "_",properties)+"|";
                            if (isService)
                                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After Getting properties (V) U R at " + DateTime.Now.ToString("hh:mm:ss.fff tt"));
                        }

                        rowDatas = rowDatas.Substring(0, rowDatas.Length - 1);
                        dataText += rowDatas;
                    }
                }
            }

            return dataText;
        }
        public static System.Data.DataTable ToDataTable(List<NewRepeatCustomerDetails> result, int year)
        {
            System.Data.DataTable dt = new System.Data.DataTable("New Repeat Customer Details");
            dt.Columns.Add("School State");
            dt.Columns.Add("School Name");
            dt.Columns.Add("School ID");
            dt.Columns.Add("School Zip");
            dt.Columns.Add("New " + year);
            dt.Columns.Add("Repeat " + year);
            dt.Columns.Add("Customer " + year);

            dt.Columns[4].DataType = dt.Columns[5].DataType = dt.Columns[6].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                decimal d = 0;
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.SchoolState;
                dt.Rows[dt.Rows.Count - 1][1] = data.SchoolName;
                dt.Rows[dt.Rows.Count - 1][2] = data.SchoolId;
                dt.Rows[dt.Rows.Count - 1][3] = data.SchoolZip;

                if (year == 2012)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2012, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2012, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2012, out d) ? d : 0;
                }
                else if (year == 2013)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2013, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2013, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2013, out d) ? d : 0;
                }
                else if (year == 2014)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2014, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2014, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2014, out d) ? d : 0;
                }
                else if (year == 2015)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2015, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2015, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2015, out d) ? d : 0;
                }
                else if (year == 2016)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2016, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2016, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2016, out d) ? d : 0;
                }
                else if (year == 2017)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2017, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2017, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2017, out d) ? d : 0;
                }
                else if (year == 2018)
                {
                    dt.Rows[dt.Rows.Count - 1][4] = decimal.TryParse(data.New2018, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][5] = decimal.TryParse(data.Repeat2018, out d) ? d : 0;
                    dt.Rows[dt.Rows.Count - 1][6] = decimal.TryParse(data.Customer2018, out d) ? d : 0;
                }
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<NewRepeatCust> result, int year)
        {
            System.Data.DataTable dt = new System.Data.DataTable("New Repeat Customers");
            dt.Columns.Add("School State");
            dt.Columns.Add("New " + year);
            dt.Columns.Add("Repeat " + year);
            dt.Columns.Add("Customer " + year);
            dt.Columns.Add("Total Customer");
            dt.Columns.Add("Participated Schools %");
            dt.Columns.Add(year + " Enrollment %");
            dt.Columns.Add("Total Enrollment %");

            dt.Columns[1].DataType = dt.Columns[2].DataType = dt.Columns[3].DataType = dt.Columns[4].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.State;
                dt.Rows[dt.Rows.Count - 1][1] = data.New;
                dt.Rows[dt.Rows.Count - 1][2] = data.Repeat;
                dt.Rows[dt.Rows.Count - 1][3] = data.Customer;
                dt.Rows[dt.Rows.Count - 1][4] = data.TotalCustomer;
                dt.Rows[dt.Rows.Count - 1][5] = data.PerticipatedSchoolPecnt + "%(" + data.TotalCustomer + ")";
                dt.Rows[dt.Rows.Count - 1][6] = data.EnrollmentSchoolPecnt + "%(" + data.Enrollment + ")";
                dt.Rows[dt.Rows.Count - 1][7] = data.TotalEnrollmentSchoolPecnt + "%(" + data.Enrollment + ")";
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<SchoolStateDetails> result, string releaseDate)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Unique School Count Details");
            dt.Columns.Add(releaseDate.Equals("ReleaseDate") ? "Processed Date" : "School State");
            dt.Columns.Add("School Name");
            dt.Columns.Add("Processed  Date");
            dt.Columns.Add("Contact Name");
            dt.Columns.Add("Contact Title");
            dt.Columns.Add("Contact Address1");
            dt.Columns.Add("Contact City");
            dt.Columns.Add("Contact State");
            dt.Columns.Add("Contact Zip");
            dt.Columns.Add("Contact Email Address");
            dt.Columns.Add("Contact Phone");

            foreach (var data in result)
            {
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.SchoolState;
                dt.Rows[dt.Rows.Count - 1][1] = data.SchoolName;
                dt.Rows[dt.Rows.Count - 1][2] = data.ReleaseDate;
                dt.Rows[dt.Rows.Count - 1][3] = data.ContactName;
                dt.Rows[dt.Rows.Count - 1][4] = data.ContactTitle;
                dt.Rows[dt.Rows.Count - 1][5] = data.ContactAddress1;
                dt.Rows[dt.Rows.Count - 1][6] = data.ContactCity;
                dt.Rows[dt.Rows.Count - 1][7] = data.ContactState;
                dt.Rows[dt.Rows.Count - 1][8] = data.ContactZip;
                dt.Rows[dt.Rows.Count - 1][9] = data.ContactEmailAddress;
                dt.Rows[dt.Rows.Count - 1][10] = data.ContactPhone;
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<SchoolCount> result, string releaseDate)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Unique School Count Summary");
            dt.Columns.Add(releaseDate.Equals("ReleaseDate") ? "Processed Date" : "School State");
            dt.Columns.Add("Total Unique School");
            dt.Columns.Add("Total School");
            dt.Columns.Add("Differences");

            dt.Columns[1].DataType = dt.Columns[2].DataType = dt.Columns[3].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.SchoolState;
                dt.Rows[dt.Rows.Count - 1][1] = data.DistinctSchoolCount;
                dt.Rows[dt.Rows.Count - 1][2] = data.TotalSchoolCount;
                dt.Rows[dt.Rows.Count - 1][3] = data.SchoolDiff;
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<EpipenOrderDetails> result)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Order Details");
            dt.Columns.Add("School State");
            dt.Columns.Add("School Name");
            dt.Columns.Add("School ID");
            dt.Columns.Add("Processed Date");
            dt.Columns.Add("School Zip");
            dt.Columns.Add("Batch ID");
            dt.Columns.Add("Order Date");
            dt.Columns.Add("Order ID");
            dt.Columns.Add("Pharmacy Name");
            dt.Columns.Add("Doctor Name");
            dt.Columns.Add("Contact Name");
            dt.Columns.Add("Contact Address1");
            dt.Columns.Add("Contact Address2");
            dt.Columns.Add("Contact City");
            dt.Columns.Add("Contact State");
            dt.Columns.Add("Contact Zip");
            dt.Columns.Add("Contact Email Address");
            dt.Columns.Add("Contact Phone");
            dt.Columns.Add("-");
            dt.Columns.Add("Reg Free Qty");
            dt.Columns.Add("Reg Repl Qty");
            dt.Columns.Add("Reg Disc Qty");
            dt.Columns.Add("Jr Free Qty");
            dt.Columns.Add("Jr Repl Qty");
            dt.Columns.Add("Jr Disc Qty");
            dt.Columns.Add("Other Free Qty");
            dt.Columns.Add("Total Units");
            dt.Columns.Add("--");
            dt.Columns.Add("Box Qty");
            dt.Columns.Add("Videos Qty");

            dt.Columns[19].DataType = dt.Columns[20].DataType = dt.Columns[21].DataType =
                dt.Columns[22].DataType = dt.Columns[23].DataType = dt.Columns[24].DataType =
                dt.Columns[25].DataType = dt.Columns[26].DataType = dt.Columns[28].DataType =
                dt.Columns[29].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.SchoolState;
                dt.Rows[dt.Rows.Count - 1][1] = data.SchoolName;
                dt.Rows[dt.Rows.Count - 1][2] = data.SchoolId;
                dt.Rows[dt.Rows.Count - 1][3] = data.ReleaseDate;
                dt.Rows[dt.Rows.Count - 1][4] = data.SchoolZip;
                dt.Rows[dt.Rows.Count - 1][5] = data.BatchID;
                dt.Rows[dt.Rows.Count - 1][6] = data.OrderDate;
                dt.Rows[dt.Rows.Count - 1][7] = data.OrderID;
                dt.Rows[dt.Rows.Count - 1][8] = data.PharmacyName;
                dt.Rows[dt.Rows.Count - 1][9] = data.DoctorName;
                dt.Rows[dt.Rows.Count - 1][10] = data.ContactName;
                dt.Rows[dt.Rows.Count - 1][11] = data.ContactAddress1;
                dt.Rows[dt.Rows.Count - 1][12] = data.ContactAddress2;
                dt.Rows[dt.Rows.Count - 1][13] = data.ContactCity;
                dt.Rows[dt.Rows.Count - 1][14] = data.ContactState;
                dt.Rows[dt.Rows.Count - 1][15] = data.ContactZip;
                dt.Rows[dt.Rows.Count - 1][16] = data.ContactEmailAddress;
                dt.Rows[dt.Rows.Count - 1][17] = data.ContactPhone;
                dt.Rows[dt.Rows.Count - 1][18] = "";
                dt.Rows[dt.Rows.Count - 1][19] = data.RegFreeQty;
                dt.Rows[dt.Rows.Count - 1][20] = data.RegReplQty;
                dt.Rows[dt.Rows.Count - 1][21] = data.RegDiscQty;
                dt.Rows[dt.Rows.Count - 1][22] = data.JrFreeQty;
                dt.Rows[dt.Rows.Count - 1][23] = data.JrReplQty;
                dt.Rows[dt.Rows.Count - 1][24] = data.JrDiscQty;
                dt.Rows[dt.Rows.Count - 1][25] = data.OtherFreeQty;
                dt.Rows[dt.Rows.Count - 1][26] = data.TotalUnits;
                dt.Rows[dt.Rows.Count - 1][27] = "";
                dt.Rows[dt.Rows.Count - 1][28] = data.BoxQty;
                dt.Rows[dt.Rows.Count - 1][29] = data.VideosQty;
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<OrderQuantity> result, string releaseDate)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Order Details Summary");
            dt.Columns.Add(releaseDate.Equals("ReleaseDate") ? "Processed Date" : "School State");
            dt.Columns.Add("Total Unique School");
            dt.Columns.Add("Reg Free Qty");
            dt.Columns.Add("Reg Repl Qty");
            dt.Columns.Add("Reg Disc Qty");
            dt.Columns.Add("Jr Free Qty");
            dt.Columns.Add("Jr Repl Qty");
            dt.Columns.Add("Jr Disc Qty");
            dt.Columns.Add("Other Free Qty");
            dt.Columns.Add("Total Units");
            dt.Columns.Add("-");
            dt.Columns.Add("Box Qty");
            dt.Columns.Add("Videos Qty");

            dt.Columns[1].DataType = dt.Columns[2].DataType = dt.Columns[3].DataType =
                dt.Columns[4].DataType = dt.Columns[5].DataType = dt.Columns[6].DataType =
                dt.Columns[7].DataType = dt.Columns[8].DataType = dt.Columns[9].DataType =
                dt.Columns[11].DataType = dt.Columns[12].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.PrimaryColumn;
                dt.Rows[dt.Rows.Count - 1][1] = data.DistinctSchoolCount;
                dt.Rows[dt.Rows.Count - 1][2] = data.RegFreeQty;
                dt.Rows[dt.Rows.Count - 1][3] = data.RegReplQty;
                dt.Rows[dt.Rows.Count - 1][4] = data.RegDiscQty;
                dt.Rows[dt.Rows.Count - 1][5] = data.JrFreeQty;
                dt.Rows[dt.Rows.Count - 1][6] = data.JrReplQty;
                dt.Rows[dt.Rows.Count - 1][7] = data.JrDiscQty;
                dt.Rows[dt.Rows.Count - 1][8] = data.OtherFreeQty;
                dt.Rows[dt.Rows.Count - 1][9] = data.TotalUnits;
                dt.Rows[dt.Rows.Count - 1][10] = "";
                dt.Rows[dt.Rows.Count - 1][11] = data.BoxQty;
                dt.Rows[dt.Rows.Count - 1][12] = data.VideosQty;
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<PatientEnrollment> result, int year)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Patient Enrollments");
            dt.Columns.Add("NPI");
            dt.Columns.Add("Physician Last Name");
            dt.Columns.Add("Physician First Name");
            dt.Columns.Add("Address");
            dt.Columns.Add("City");
            dt.Columns.Add("State");
            dt.Columns.Add("Zip");
            dt.Columns.Add("Sales Referral");
            dt.Columns.Add("Jan " + year);
            dt.Columns.Add("Feb " + year);
            dt.Columns.Add("Mar " + year);
            dt.Columns.Add("Apr " + year);
            dt.Columns.Add("May " + year);
            dt.Columns.Add("Jun " + year);
            dt.Columns.Add("Jul " + year);
            dt.Columns.Add("Aug " + year);
            dt.Columns.Add("Sep " + year);
            dt.Columns.Add("Oct " + year);
            dt.Columns.Add("Nov " + year);
            dt.Columns.Add("Dec " + year);
            dt.Columns.Add(year + " New Patients");

            dt.Columns[8].DataType = dt.Columns[9].DataType = dt.Columns[10].DataType = dt.Columns[11].DataType =
                dt.Columns[12].DataType = dt.Columns[13].DataType = dt.Columns[14].DataType = dt.Columns[15].DataType =
                dt.Columns[16].DataType = dt.Columns[17].DataType = dt.Columns[18].DataType =
                dt.Columns[19].DataType = dt.Columns[20].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                dt.Rows.Add();
                var i = 0;
                decimal d;
                dt.Rows[dt.Rows.Count - 1][i++] = data.NPI;
                dt.Rows[dt.Rows.Count - 1][i++] = data.LastName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.FirstName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.Address1;
                dt.Rows[dt.Rows.Count - 1][i++] = data.City;
                dt.Rows[dt.Rows.Count - 1][i++] = data.State;
                dt.Rows[dt.Rows.Count - 1][i++] = data.PostalCode;
                dt.Rows[dt.Rows.Count - 1][i++] = data.ReferrerName;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.January, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.February, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.March, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.April, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.May, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.June, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.July, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.August, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.September, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.October, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.November, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.December, out d) ? d : 0;
                dt.Rows[dt.Rows.Count - 1][i++] = decimal.TryParse(data.YearTotal, out d) ? d : 0;
            }

            return dt;
        }

        public static void SetDateFormatColumn(XLWorkbook wb, string worksheetName, int columnPos)
        {
            var sheet = wb.Worksheets.Worksheet(worksheetName);
            foreach (var cell in sheet.Column(columnPos).Cells())
            {
                DateTime date;
                if (cell.Value != null && DateTime.TryParse(cell.Value.ToString(), out date))
                    cell.DataType = XLCellValues.DateTime;
            }
        }

        public static void SetDateFormatColumns(DetailsDataConfig config, XLWorkbook wb, string worksheetName)
        {
            var columnPositions = (from con in config.Config where con.Name.Contains(" On") || con.Name.Contains("Date") select (con.Order - 1))
                                    .ToList();
            var sheet = wb.Worksheets.Worksheet(worksheetName);
            foreach (var columnPos in columnPositions)
            {
                foreach (var cell in sheet.Column(columnPos).Cells())
                {
                    DateTime date;
                    if (cell.Value != null && DateTime.TryParse(cell.Value.ToString(), out date))
                        cell.DataType = XLCellValues.DateTime;
                }
            }
        }

        public static System.Data.DataTable ToDataTable(List<ReportRegistrationModel> result)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Reports Data Report");
            dt.Columns.Add("Application Name");
            dt.Columns.Add("Create Date");
            dt.Columns.Add("Organization");
            dt.Columns.Add("Phone Number");
            dt.Columns.Add("First Name");
            dt.Columns.Add("Last Name");
            dt.Columns.Add("Address");
            dt.Columns.Add("City");
            dt.Columns.Add("Zip");
            dt.Columns.Add("State");
            dt.Columns.Add("NPI");

            foreach (var data in result)
            {
                int i = 0;
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][i++] = data.ApplicationName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.CreateDate;
                dt.Rows[dt.Rows.Count - 1][i++] = data.Organization;
                dt.Rows[dt.Rows.Count - 1][i++] = data.Phone;
                dt.Rows[dt.Rows.Count - 1][i++] = data.FirstName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.LastName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.Address1;
                dt.Rows[dt.Rows.Count - 1][i++] = data.City;
                dt.Rows[dt.Rows.Count - 1][i++] = data.Zip;
                dt.Rows[dt.Rows.Count - 1][i++] = data.State;
                dt.Rows[dt.Rows.Count - 1][i++] = data.NPI;
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<SalesRepActivityModel> result, bool isAfrezza)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Sales Rep Activity");
            dt.Columns.Add("User Name");
            dt.Columns.Add("User Type");
            dt.Columns.Add("Email");
            if (!isAfrezza)
            {
                dt.Columns.Add("Last Login Date");
            }
            dt.Columns.Add("Program Name");
            dt.Columns.Add("Accessed On");
            dt.Columns.Add("Accessed Count");

            dt.Columns[isAfrezza ? 5 : 6].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                int i = 0;
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][i++] = data.UserName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.UserType;
                dt.Rows[dt.Rows.Count - 1][i++] = data.Email;
                if (!isAfrezza)
                {
                    dt.Rows[dt.Rows.Count - 1][i++] = data.LastLoginDate;
                }
                dt.Rows[dt.Rows.Count - 1][i++] = data.ProgramName;
                dt.Rows[dt.Rows.Count - 1][i++] = data.AccessedOn;
                dt.Rows[dt.Rows.Count - 1][i++] = data.AccessedCount;
            }

            return dt;
        }

        public static System.Data.DataTable ToDataTable(List<ReferralTimeToProcessDetails> result)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Referral Time To Process");
            dt.Columns.Add("ASPN ID");
            dt.Columns.Add("Days To Process");
            dt.Columns.Add("PA Required");
            dt.Columns.Add("Status");
            dt.Columns.Add("Created Date");
            dt.Columns.Add("Assigned Date");
            dt.Columns.Add("Fill Date");
            dt.Columns.Add("Ship Date");

            dt.Columns[0].DataType = dt.Columns[1].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][0] = data.AspnRxID;
                dt.Rows[dt.Rows.Count - 1][1] = data.DaysToProcess;
                dt.Rows[dt.Rows.Count - 1][2] = data.PriorAuthRequired;
                dt.Rows[dt.Rows.Count - 1][3] = data.Status;
                dt.Rows[dt.Rows.Count - 1][4] = data.CreatedDate.ToString("MM/dd/yyyy");
                dt.Rows[dt.Rows.Count - 1][5] = data.AssignedDate.ToString("MM/dd/yyyy");
                dt.Rows[dt.Rows.Count - 1][6] = data.FillDate.ToString("MM/dd/yyyy");
                dt.Rows[dt.Rows.Count - 1][7] = data.ShipDate.ToString("MM/dd/yyyy");
            }

            return dt;
        }

        public static System.Data.DataTable ToConsignmentDataTable(List<ConsignmentDetails> result)
        {
            System.Data.DataTable dt = new System.Data.DataTable("Consignment Details Data");
            dt.Columns.Add("AspnRx ID");
            dt.Columns.Add("Assigned Pharmacy");
            dt.Columns.Add("Fill Type");
            dt.Columns.Add("Progam Status");
            dt.Columns.Add("BIN Number");
            dt.Columns.Add("PCN Number");
            dt.Columns.Add("Needs By Date Passed");
            dt.Columns.Add("Referral Type");
            dt.Columns.Add("Fill No.");

            dt.Columns[0].DataType = Type.GetType("System.Decimal");

            foreach (var data in result)
            {
                int i = 0;
                dt.Rows.Add();
                dt.Rows[dt.Rows.Count - 1][i++] = data.AspnrxID;
                dt.Rows[dt.Rows.Count - 1][i++] = data.AssignedPharmacy;
                dt.Rows[dt.Rows.Count - 1][i++] = data.FillType;
                dt.Rows[dt.Rows.Count - 1][i++] = data.ProgramStatus;
                dt.Rows[dt.Rows.Count - 1][i++] = data.BinNumber;
                dt.Rows[dt.Rows.Count - 1][i++] = data.PcnNumber;
                dt.Rows[dt.Rows.Count - 1][i] = data.NeedsByDatePassed;
                dt.Rows[dt.Rows.Count - 1][i] = data.ReferralType;
                dt.Rows[dt.Rows.Count - 1][i] = data.FillNo;
            }

            return dt;
        }
    }
}
