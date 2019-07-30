using ArmadaReports.Common.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArmadaReports.Common
{
    public static class PdfUtility
    {
        public static PdfPCell CreateCell(string value, float fontSize = 6)
        {
            var phrase = new Phrase(value, FontFactory.GetFont("Arial", fontSize, Font.NORMAL, BaseColor.BLACK));
            var cell = new PdfPCell(phrase) { BorderColor = BaseColor.WHITE };
            return cell;
        }

        public static PdfPCell CreateHeaderCell(string value, float fontSize = 6)
        {
            var phrase = new Phrase(value, FontFactory.GetFont("Arial", fontSize, Font.BOLD, BaseColor.BLACK));
            var cell = new PdfPCell(phrase)
            {
                BackgroundColor = BaseColor.LIGHT_GRAY,
                BorderColor = BaseColor.LIGHT_GRAY
            };
            return cell;
        }

        public static void AddHeadersFromTextData(PdfPTable table, string headers)
        {
            var columns = headers.Split('|');
            foreach (var column in columns)
            {
                table.AddCell(CreateHeaderCell(column));
            }
        }
        public static void AddHeaders(PdfPTable table, List<DetailsField> config, string role)
        {
            foreach (var c in config)
            {
                if (!c.Name.Contains("_btn_") && Extension.Helper.HasRoleAccess(c, role))
                    table.AddCell(CreateHeaderCell(string.IsNullOrEmpty(c.CustomName) ? c.Name : c.CustomName));
            }
            //table.AddCell(CreateHeaderCell("Program"));
            //table.AddCell(CreateHeaderCell("Type"));
            ////table.AddCell(CreateHeaderCell("Refill Count"));
            ////table.AddCell(CreateHeaderCell("Patient ID"));
            //table.AddCell(CreateHeaderCell("ASPN ID"));
            //table.AddCell(CreateHeaderCell("Created On"));
            //table.AddCell(CreateHeaderCell("Status"));
            //table.AddCell(CreateHeaderCell("Program Status"));
            //table.AddCell(CreateHeaderCell("Substatus"));
            //table.AddCell(CreateHeaderCell("Order Qty"));
            //table.AddCell(CreateHeaderCell("Refills Prescribed"));
            //table.AddCell(CreateHeaderCell("Fill Qty"));
            //table.AddCell(CreateHeaderCell("Fill Date"));
            //table.AddCell(CreateHeaderCell("Ship Date"));
            //table.AddCell(CreateHeaderCell("Days To Fill"));
            //table.AddCell(CreateHeaderCell("Filling Pharmacy"));
            ////table.AddCell(CreateHeaderCell("Pharmacy NPI"));
            //table.AddCell(CreateHeaderCell("Phy. First Name"));
            //table.AddCell(CreateHeaderCell("Phy. Last Name"));
            //table.AddCell(CreateHeaderCell("Physcian NPI"));
            //table.AddCell(CreateHeaderCell("Prescriber Address"));
            //table.AddCell(CreateHeaderCell("Prescriber City"));
            //table.AddCell(CreateHeaderCell("Prescriber Zip"));
            //table.AddCell(CreateHeaderCell("Prescriber State"));
            //table.AddCell(CreateHeaderCell("Hub Patient ID"));
            //table.AddCell(CreateHeaderCell("BIN Number"));
            //table.AddCell(CreateHeaderCell("Tubes"));
            //table.AddCell(CreateHeaderCell("Copay"));
            //table.AddCell(CreateHeaderCell("Payer"));
        }

        public static void AddRowFromTextData(PdfPTable table, string row)
        {
            var columns = row.Split('|');
            foreach (var column in columns)
            {
                table.AddCell(CreateCell(column));
            }
        }
        public static void AddRow(PdfPTable table, Details details, List<DetailsField> config, string role)
        {
            foreach (var c in config)
            {
                if (c.Name.Contains("_btn_") || !Extension.Helper.HasRoleAccess(c, role)) continue;
                table.AddCell(CreateCell(Extension.Helper.GetPropertyValue(details, "_" + c.Id + "_")));
            }
            //table.AddCell(CreateCell(details.ProgramName_52_));
            //table.AddCell(CreateCell(details.ReferralType_69_));
            //table.AddCell(CreateCell(details.AspnRxId_4_));
            //table.AddCell(CreateCell(details.CreatedDate_16_));
            //table.AddCell(CreateCell(details.AspnStatus_63_));
            //table.AddCell(CreateCell(details.ProgramStatus_53_));
            //table.AddCell(CreateCell(details.ProgramSubStatus_65_));
            //table.AddCell(CreateCell(details.OrderQty_35_));
            //table.AddCell(CreateCell(details.PrescriptionNumber));
            //table.AddCell(CreateCell(details.FillQty_21_));
            //table.AddCell(CreateCell(details.FillDate_20_));            
            //table.AddCell(CreateCell(details.ShipDate_61_));
            //table.AddCell(CreateCell(details.DaysToFill_19_));
            //table.AddCell(CreateCell(details.FillingPharmacyName_22_));
            //table.AddCell(CreateCell(details.PhysicianFirstName_42_43_));
            //table.AddCell(CreateCell(details.PhysicianLastName_42_44_));
            //table.AddCell(CreateCell(details.Npi_34_45_));
            //table.AddCell(CreateCell(details.Address1_1__47_));
            //table.AddCell(CreateCell(details.City_48_));
            //table.AddCell(CreateCell(details.PostalCode_51_));
            //table.AddCell(CreateCell(details.State_50_));
            //table.AddCell(CreateCell(details.HubPatientId_27_8_));
            //table.AddCell(CreateCell(details.BinNumber_7_));
            //table.AddCell(CreateCell(details.RegranexTubesFilled_68_));
            //table.AddCell(CreateCell(details.Copay_10_));
            //table.AddCell(CreateCell(details.ReferrerName_60_));
        }

        public static void AddHeaders(PdfPTable table, int year)
        {
            table.AddCell(CreateHeaderCell("NPI"));
            table.AddCell(CreateHeaderCell("Physician Last Name"));
            table.AddCell(CreateHeaderCell("Physician First Name"));
            table.AddCell(CreateHeaderCell("Address"));
            table.AddCell(CreateHeaderCell("City"));
            table.AddCell(CreateHeaderCell("State"));
            table.AddCell(CreateHeaderCell("Zip"));
            table.AddCell(CreateHeaderCell("Sales Referral"));
            table.AddCell(CreateHeaderCell("Jan " + year));
            table.AddCell(CreateHeaderCell("Feb " + year));
            table.AddCell(CreateHeaderCell("Mar " + year));
            table.AddCell(CreateHeaderCell("Apr " + year));
            table.AddCell(CreateHeaderCell("May " + year));
            table.AddCell(CreateHeaderCell("Jun " + year));
            table.AddCell(CreateHeaderCell("Jul " + year));
            table.AddCell(CreateHeaderCell("Aug " + year));
            table.AddCell(CreateHeaderCell("Sep " + year));
            table.AddCell(CreateHeaderCell("Oct " + year));
            table.AddCell(CreateHeaderCell("Nov " + year));
            table.AddCell(CreateHeaderCell("Dec " + year));
            table.AddCell(CreateHeaderCell(year + " New Patients"));
        }

        public static void AddRow(PdfPTable table, PatientEnrollment item)
        {
            table.AddCell(CreateCell(item.NPI));
            table.AddCell(CreateCell(item.LastName));
            table.AddCell(CreateCell(item.FirstName));
            table.AddCell(CreateCell(item.Address1));
            table.AddCell(CreateCell(item.City));
            table.AddCell(CreateCell(item.State));
            table.AddCell(CreateCell(item.PostalCode));
            table.AddCell(CreateCell(item.ReferrerName));
            table.AddCell(CreateCell(item.January));
            table.AddCell(CreateCell(item.February));
            table.AddCell(CreateCell(item.March));
            table.AddCell(CreateCell(item.April));
            table.AddCell(CreateCell(item.May));
            table.AddCell(CreateCell(item.June));
            table.AddCell(CreateCell(item.July));
            table.AddCell(CreateCell(item.August));
            table.AddCell(CreateCell(item.September));
            table.AddCell(CreateCell(item.October));
            table.AddCell(CreateCell(item.November));
            table.AddCell(CreateCell(item.December));
            table.AddCell(CreateCell(item.YearTotal));
        }
    }
}