using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Web;
using System.Web.Hosting;
using ArmadaReports.Common;
using ArmadaReports.Common.Extension;
using ArmadaReports.Common.Models;
using ArmadaReports.Logger.Service;
using ArmadaReports.ReportRequestHandler.Helper;
using ArmadaReports.ReportRequestHandler.Models;
using ClosedXML.Excel;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace ArmadaReports.ReportRequestHandler.Repositories
{
    public class ReportRequestRepository
    {
        private readonly string _connectionString;

        public ReportRequestRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private void SetArithAbortCommand(SqlConnection connection)
        {
            using (SqlCommand comm = new SqlCommand("SET ARITHABORT ON", connection))
            {
                comm.ExecuteNonQuery();
            }
        }

        public int OnRequest(string reportName, string userId, int programId, string reportType, string parameters,int rowCount)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[report].[OnRequest]", connection)
                    {
                        CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                    };
                    sqlCmd.Parameters.AddWithValue("application", "AnalyticsUMP");
                    sqlCmd.Parameters.AddWithValue("userId", userId);
                    sqlCmd.Parameters.AddWithValue("reportName", reportName);
                    sqlCmd.Parameters.AddWithValue("programId", programId);
                    sqlCmd.Parameters.AddWithValue("reportType", reportType);
                    sqlCmd.Parameters.AddWithValue("parameters", parameters);
                    sqlCmd.Parameters.AddWithValue("rowCount", rowCount);
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        var returnResult = -2;
                        if (sqlReader.Read())
                        {
                            returnResult= sqlReader.GetInt("Id");
                        }

                        connection.Close();
                        return returnResult;
                    }
                }
            }
            catch
            {
                return -2;
            }
        }

        public bool OnProcessing(int id)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[report].[OnProcessing]", connection)
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandTimeout = 500
                    };
                    sqlCmd.Parameters.AddWithValue("id", id);
                    var result= sqlCmd.ExecuteNonQuery() > 0;
                    connection.Close();
                    return result;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool OnProcessed(int id, string fileName, string fileSize)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[report].[OnProcessed]", connection)
                    {
                        CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                    };
                    sqlCmd.Parameters.AddWithValue("id", id);
                    sqlCmd.Parameters.AddWithValue("@fileName", fileName);
                    sqlCmd.Parameters.AddWithValue("@fileSize", fileSize);
                    //sqlCmd.Parameters.AddWithValue("@file", file);
                    var execResult= sqlCmd.ExecuteNonQuery() > 0;
                    connection.Close();
                    return execResult;
                }
            }
            catch
            {
                return false;
            }
        }
        public bool OnDownloaded(int id)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[report].[OnDownloaded]", connection)
                    {
                        CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                    };
                    sqlCmd.Parameters.AddWithValue("id", id);
                    var execResult= sqlCmd.ExecuteNonQuery() > 0;
                    connection.Close();
                    return execResult;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool OnDeleted(int id)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[report].[OnDeleted]", connection)
                    {
                        CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                    };
                    sqlCmd.Parameters.AddWithValue("id", id);
                    var execResult= sqlCmd.ExecuteNonQuery() > 0;
                    connection.Close();
                    return execResult;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteReportRequestQueueDataByGeneratedOnTimeDifference(int timeDifferenceInHour)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[report].[DeleteReportRequestQueueDataByGeneratedOnTimeDifference]",
                        connection) {CommandType = CommandType.StoredProcedure, CommandTimeout = 500};
                    sqlCmd.Parameters.AddWithValue("@timeDifferenceInHour", timeDifferenceInHour);
                    var execResult= sqlCmd.ExecuteNonQuery() > 0;
                    connection.Close();
                    return execResult;
                }
            }
            catch
            {
                return false;
            }
        }

        public List<ReportRequest> GetReportRequests(string application, string userId)
        {
            var reportRequestList = new List<ReportRequest>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[report].[GetReportRequests]", connection)
                {
                    CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                };
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("application", application);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        var reportRequest = new ReportRequest
                        {
                            Id = sqlReader.GetInt("Id"),
                            RequestedReport = sqlReader.GetString("RequestedReport"),
                            ProgramId = sqlReader.GetInt("ProgramId"),
                            ProgramName = sqlReader.GetString("ProgramName"),
                            ReportType = sqlReader.GetString("ReportType"),
                            Status = sqlReader.GetInt("Status"),
                            StatusString = sqlReader.GetString("StatusString")
                        };
                        reportRequest.DownloadableFile = sqlReader.GetString("DownloadableFile");
                        reportRequest.FileSize= sqlReader.GetString("DownloadableFileSize");
                        reportRequest.RequestedOn = sqlReader.GetFormattedDate("RequestedOn", "MM/dd/yyyy hh:mm:ss tt");
                        reportRequest.ProcessingStartedOn = sqlReader.GetFormattedDate("ProcessingStartedOn", "MM/dd/yyyy hh:mm:ss tt");
                        reportRequest.GeneratedOn = sqlReader.GetFormattedDate("GeneratedOn", "MM/dd/yyyy hh:mm:ss tt");
                        reportRequest.DownloadedOn = sqlReader.GetFormattedDate("DownloadedOn", "MM/dd/yyyy hh:mm:ss tt");
                        reportRequestList.Add(reportRequest);
                    }
                    connection.Close();
                }
            }
            return reportRequestList;
        }
        public ReportRequest GetOnRequestReport()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var reportRequest = new ReportRequest();
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[report].[GetOnRequestReport]", connection)
                {
                    CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                };
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        reportRequest.Id = sqlReader.GetInt("Id");
                        reportRequest.Parameters = sqlReader.GetString("Parameters");
                        break;
                    }

                    connection.Close();
                }
                return reportRequest;
            }

        }
        public ReportRequest GetReportById(int reportId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var reportRequest = new ReportRequest();
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[report].[GetReportById]", connection)
                {
                    CommandType = CommandType.StoredProcedure, CommandTimeout = 50000
                };
                sqlCmd.Parameters.AddWithValue("Id", reportId);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        reportRequest.Id = sqlReader.GetInt("Id");
                        //reportRequest.Application = sqlReader.GetString("Application");
                        //reportRequest.UserId = sqlReader.GetString("UserId");
                        //reportRequest.RequestedReport = sqlReader.GetString("RequestedReport");
                        //reportRequest.Parameters = sqlReader.GetString("Parameters");
                        //reportRequest.ProgramId = sqlReader.GetInt("ProgramId");
                        //reportRequest.ProgramName = sqlReader.GetString("ProgramName");
                        //reportRequest.ReportType = sqlReader.GetString("ReportType");
                        //reportRequest.Status = sqlReader.GetInt("Status");
                        //reportRequest.StatusString = sqlReader.GetString("StatusString");
                        reportRequest.FileName = sqlReader.GetString("DownloadableFile");
                       // reportRequest.FileSize = sqlReader.GetString("DownloadableFileSize");
                        reportRequest.FileData = (byte?[])(sqlReader["FileData"]==DBNull.Value?null: sqlReader["FileData"]);
                        //var downloadableFile = sqlReader.GetString("DownloadableFile");
                        //reportRequest.DownloadableFileExcel = string.IsNullOrEmpty(downloadableFile) ? string.Empty : downloadableFile.Split('/')[0];
                        //reportRequest.DownloadableFilePdf = string.IsNullOrEmpty(downloadableFile) ? string.Empty : downloadableFile.Split('/')[1];

                        //var downloadableFileSize = sqlReader.GetString("DownloadableFileSize");
                        //reportRequest.DownloadableFileSizeExcel = string.IsNullOrEmpty(downloadableFileSize) ? "0" : downloadableFileSize.Split('/')[0];
                        //reportRequest.DownloadableFileSizePdf = string.IsNullOrEmpty(downloadableFileSize) ? "0" : downloadableFileSize.Split('/')[1];

                        //reportRequest.RequestedOn = sqlReader.GetFormattedDate("RequestedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.ProcessingStartedOn = sqlReader.GetFormattedDate("ProcessingStartedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.GeneratedOn = sqlReader.GetFormattedDate("GeneratedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.DownloadedOn = sqlReader.GetFormattedDate("DownloadedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.ExcelFile = (byte[]) sqlReader["ExcelFile"];
                        //reportRequest.PdfFile = (byte[]) sqlReader["PdfFile"];
                        break;
                    }

                    connection.Close();
                }
                return reportRequest;
            }

        }
        public byte[] ObjectToByteArray(Object obj)
        {
            if (obj == null)
                return null;
            var bf = new BinaryFormatter();
            var ms = new MemoryStream();
            bf.Serialize(ms, obj);
            return ms.ToArray();
        }
        public Object ByteArrayToObject(byte[] arrBytes)
        {
            var memStream = new MemoryStream();
            var binForm = new BinaryFormatter();
            memStream.Write(arrBytes, 0, arrBytes.Length);
            memStream.Seek(0, SeekOrigin.Begin);
            return binForm.Deserialize(memStream);
        }
        public UserRole GetRoleByUser(string userId)
        {
            var role = new UserRole();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[analytics].[GetRoleByUser]", connection)
                {
                    CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                };
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        role.UserType = sqlReader["UserType"] != null ? sqlReader["UserType"].ToString() : string.Empty;
                        role.ReportsTo = sqlReader["ReportsTo"] != null ? sqlReader["ReportsTo"].ToString() : string.Empty;
                    }

                    connection.Close();
                }
            }
            return role;
        }

        public ReportRequest GetReportByFile(string file)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var reportRequest = new ReportRequest();
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[report].[GetReportByFile]", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 500000
                };
                sqlCmd.Parameters.AddWithValue("file", file);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        reportRequest.Id = sqlReader.GetInt("Id");
                        reportRequest.Application = sqlReader.GetString("Application");
                        reportRequest.UserId = sqlReader.GetString("UserId");
                        reportRequest.RequestedReport = sqlReader.GetString("RequestedReport");
                        reportRequest.Parameters = sqlReader.GetString("Parameters");
                        reportRequest.ProgramId = sqlReader.GetInt("ProgramId");
                        reportRequest.ProgramName = sqlReader.GetString("ProgramName");
                        reportRequest.ReportType = sqlReader.GetString("ReportType");
                        reportRequest.Status = sqlReader.GetInt("Status");
                        reportRequest.StatusString = sqlReader.GetString("StatusString");
                        //var downloadableFile = sqlReader.GetString("DownloadableFile");
                        //reportRequest.DownloadableFileExcel = string.IsNullOrEmpty(downloadableFile) ? "" : downloadableFile.Split('/')[0];
                        //reportRequest.DownloadableFilePdf = string.IsNullOrEmpty(downloadableFile) ? "" : downloadableFile.Split('/')[1];

                        //var downloadableFileSize = sqlReader.GetString("DownloadableFileSize");
                        //reportRequest.DownloadableFileSizeExcel = string.IsNullOrEmpty(downloadableFileSize) ? "0" : downloadableFileSize.Split('/')[0];
                        //reportRequest.DownloadableFileSizePdf = string.IsNullOrEmpty(downloadableFileSize) ? "0" : downloadableFileSize.Split('/')[1];

                        //reportRequest.RequestedOn = sqlReader.GetFormattedDate("RequestedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.ProcessingStartedOn = sqlReader.GetFormattedDate("ProcessingStartedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.GeneratedOn = sqlReader.GetFormattedDate("GeneratedOn", "MM/dd/yyyy hh:mm:ss tt");
                        //reportRequest.DownloadedOn = sqlReader.GetFormattedDate("DownloadedOn", "MM/dd/yyyy hh:mm:ss tt");
                        break;
                    }

                    connection.Close();
                }
                return reportRequest;
            }

        }
        public List<OrderDetails> GetOrderDetails(int programId, int? aspnxId, string programStatus, string doctorState, string dateType, string physicianLastNameSrcQry,
            int? fillingPharmacyId, int? fillingCompanyId, string from, string to, bool isArmadaEmployee, int? patientId, int? doctorId, int? ndc, string userId, string userType,
            string divReport, string shipFrom, string shipTo)
        {
            try
            {
                var dates = DateUtility.GetDates(dateType ?? "allreferrals", programId, _connectionString);
                var programs = new List<OrderDetails>();
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    SetArithAbortCommand(connection);
                    var sqlCmd = new SqlCommand(@"[analytics].[GetPAOrdersDetails]", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                    if (aspnxId == null)
                        sqlCmd.Parameters.AddWithValue("AspnRxID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AspnRxID", aspnxId);
                    if (patientId == null)
                        sqlCmd.Parameters.AddWithValue("PatientID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PatientID", patientId);
                    if (doctorId == null)
                        sqlCmd.Parameters.AddWithValue("DoctorID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DoctorID", doctorId);
                    if (ndc == null)
                        sqlCmd.Parameters.AddWithValue("NDC", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("NDC", ndc);
                    if (programStatus == null)
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", programStatus);
                    if (doctorState == null)
                        sqlCmd.Parameters.AddWithValue("DoctorState", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DoctorState", doctorState);
                    sqlCmd.Parameters.AddWithValue("BegDate", from ?? dates[0]);
                    sqlCmd.Parameters.AddWithValue("EndDate", to ?? dates[1]);
                    sqlCmd.Parameters.AddWithValue("ShipBegDate", shipFrom ?? dates[0]);
                    sqlCmd.Parameters.AddWithValue("ShipEndDate", shipTo ?? dates[1]);
                    if (physicianLastNameSrcQry == null)
                        sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", physicianLastNameSrcQry);
                    if (fillingPharmacyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", fillingPharmacyId);
                    if (fillingCompanyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", fillingCompanyId);
                    sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                    sqlCmd.Parameters.AddWithValue("UserID", userId);
                    sqlCmd.Parameters.AddWithValue("UserType", userType);
                    if (divReport == null)
                        sqlCmd.Parameters.AddWithValue("DivReport", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DivReport", divReport);

                    sqlCmd.CommandTimeout = 500;
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        while (sqlReader.Read())
                        {
                            programs.Add(new OrderDetails
                            {
                                AspnrxId = sqlReader["AspnRxID"] == null ? "" : sqlReader["AspnRxID"].ToString(),
                                DoctorId = sqlReader["DoctorID"] == null ? "" : sqlReader["DoctorID"].ToString(),
                                ProgramId = sqlReader["ProgramID"] == null ? "" : sqlReader["ProgramID"].ToString(),
                                PatientId = sqlReader["PatientID"] == null ? "" : sqlReader["PatientID"].ToString(),
                                PhysicianFirstName = sqlReader["PhysicianFirstName"] == null ? "" : sqlReader["PhysicianFirstName"].ToString(),
                                PhysicianLastName = sqlReader["PhysicianLastName"] == null ? "" : sqlReader["PhysicianLastName"].ToString(),
                                Address1 = sqlReader["Address1"] == null ? "" : sqlReader["Address1"].ToString(),
                                State = sqlReader["State"] == null ? "" : sqlReader["State"].ToString(),
                                PrescriberZip = sqlReader["PrescriberZip"] == null ? "" : sqlReader["PrescriberZip"].ToString(),
                                Npi = sqlReader["NPI"] == null ? "" : sqlReader["NPI"].ToString(),
                                ProgramStatus = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString(),
                                ShipDate = sqlReader["ShipDate"] == null ? "" : sqlReader["ShipDate"].ToString(),
                                ProgramName = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),
                                CreatedOn = sqlReader["CreatedOn"] == null ? "" : sqlReader["CreatedOn"].ToString(),
                                Ndc = sqlReader["NDC"] == null ? "" : sqlReader["NDC"].ToString(),
                                AssignedOn = sqlReader["AssignedOn"] == null ? "" : sqlReader["AssignedOn"].ToString(),
                                ReferralType = sqlReader["ReferralType"] == null ? "" : sqlReader["ReferralType"].ToString(),
                                FillingPharmacyId = sqlReader["FillingPharmacyID"] == null ? "" : sqlReader["FillingPharmacyID"].ToString(),
                                MemberName = sqlReader["MemberName"] == null ? "" : sqlReader["MemberName"].ToString(),
                                FillingPharmacyName = sqlReader["FillingPharmacyName"] == null ? "" : sqlReader["FillingPharmacyName"].ToString(),
                                HasNoMemberName = sqlReader["HasNonMemberName"] == null ? "" : sqlReader["HasNonMemberName"].ToString(),
                                CompanyName = sqlReader["CompanyName"] == null ? "" : sqlReader["CompanyName"].ToString(),
                                ApplicationApprovalDate = sqlReader["ApplicationApprovalDate"] == null ? "" : sqlReader["ApplicationApprovalDate"].ToString(),
                                ApplicationExpirationDate = sqlReader["ApplicationExpirationDate"] == null ? "" : sqlReader["ApplicationExpirationDate"].ToString()
                            });
                        }

                        connection.Close();
                    }
                }
                return programs;
            }
            catch
            {
                return new List<OrderDetails>();
            }
        }
        public List<UniquePatientDetails> GetUniquePatientDetails(int programId, string programStatus, string doctorState, string dateType, string physicianLastNameSrcQry,
            int? fillingPharmacyId, int? fillingCompanyId, string from, string to, bool isArmadaEmployee, int? patientId, string ndc, string userId, string userType,
            string patientLastNameSrcQry, string chartDate)
        {
            try
            {
                //var dates = DateUtility.GetDates(dateType ?? "allreferrals", programId, _connectionString);
                var programs = new List<UniquePatientDetails>();
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    SetArithAbortCommand(connection);
                    var sqlCmd = new SqlCommand(@"[analytics].[GetPAUniquePatientDetails]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                    if (patientId == null)
                        sqlCmd.Parameters.AddWithValue("PatientID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PatientID", patientId);
                    if (ndc == null)
                        sqlCmd.Parameters.AddWithValue("NDC", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("NDC", ndc);
                    if (programStatus == null)
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", programStatus);
                    if (doctorState == null)
                        sqlCmd.Parameters.AddWithValue("DoctorState", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DoctorState", doctorState);
                    sqlCmd.Parameters.AddWithValue("ChartDate", chartDate ?? (object)DBNull.Value);
                    sqlCmd.Parameters.AddWithValue("BegDate", from ?? (object)DBNull.Value);
                    sqlCmd.Parameters.AddWithValue("EndDate", to ?? (object)DBNull.Value);
                    if (physicianLastNameSrcQry == null)
                        sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", physicianLastNameSrcQry);
                    if (patientLastNameSrcQry == null)
                        sqlCmd.Parameters.AddWithValue("@PatientLastNameSearchQry", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("@PatientLastNameSearchQry", patientLastNameSrcQry);
                    if (fillingPharmacyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", fillingPharmacyId);
                    if (fillingCompanyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", fillingCompanyId);
                    sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                    sqlCmd.Parameters.AddWithValue("UserID", userId);
                    sqlCmd.Parameters.AddWithValue("UserType", userType);

                    sqlCmd.CommandTimeout = 500;
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        while (sqlReader.Read())
                        {
                            programs.Add(new UniquePatientDetails
                            {
                                DoctorId = sqlReader["DoctorID"] == null ? "" : sqlReader["DoctorID"].ToString(),
                                ProgramId = sqlReader["ProgramID"] == null ? "" : sqlReader["ProgramID"].ToString(),
                                PatientId = sqlReader["PatientID"] == null ? "" : sqlReader["PatientID"].ToString(),
                                PhysicianFirstName = sqlReader["PhysicianFirstName"] == null ? "" : sqlReader["PhysicianFirstName"].ToString(),
                                PhysicianLastName = sqlReader["PhysicianLastName"] == null ? "" : sqlReader["PhysicianLastName"].ToString(),
                                PatientFirstName = sqlReader["PatientFirstName"] == null ? "" : sqlReader["PatientFirstName"].ToString(),
                                PatientLastName = sqlReader["PatientLastName"] == null ? "" : sqlReader["PatientLastName"].ToString(),
                                Address1 = sqlReader["Address1"] == null ? "" : sqlReader["Address1"].ToString(),
                                State = sqlReader["State"] == null ? "" : sqlReader["State"].ToString(),
                                PrescriberZip = sqlReader["PrescriberZip"] == null ? "" : sqlReader["PrescriberZip"].ToString(),
                                Npi = sqlReader["NPI"] == null ? "" : sqlReader["NPI"].ToString(),
                                ProgramStatus = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString(),
                                ProgramName = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),
                                Ndc = sqlReader["NDC"] == null ? "" : sqlReader["NDC"].ToString(),
                                FillingPharmacyId = sqlReader["FillingPharmacyID"] == null ? "" : sqlReader["FillingPharmacyID"].ToString(),
                                MemberName = sqlReader["MemberName"] == null ? "" : sqlReader["MemberName"].ToString(),
                                FillingPharmacyName = sqlReader["FillingPharmacyName"] == null ? "" : sqlReader["FillingPharmacyName"].ToString(),
                                HasNoMemberName = sqlReader["HasNonMemberName"] == null ? "" : sqlReader["HasNonMemberName"].ToString(),
                                ApplicationApprovalDate = sqlReader["ApplicationApprovalDate"] == null ? "" : sqlReader["ApplicationApprovalDate"].ToString(),
                                ApplicationExpirationDate = sqlReader["ApplicationExpirationDate"] == null ? "" : sqlReader["ApplicationExpirationDate"].ToString(),
                                ApprovalDateFom = sqlReader["ApprovalDateFOM"] == null ? "" : sqlReader["ApprovalDateFOM"].ToString(),
                                ExpirationDateFom = sqlReader["ExpirationDateFOM"] == null ? "" : sqlReader["ExpirationDateFOM"].ToString()
                            });
                        }

                        connection.Close();
                    }
                }
                return programs;
            }
            catch (Exception exception)
            {
                return new List<UniquePatientDetails>();
            }
        }
        public List<SalesAnalysis> GetProgramSalesAnalysis(int programId, string userId, string userType, bool isArmadaEmployee, string dateType, string inpTreatment, string referralType, string strength)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var salesAnalysis = new List<SalesAnalysis>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetProgramSalesAnalysisV2]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.Parameters.AddWithValue("ReferralType", referralType == null ? DBNull.Value : (object)referralType);
                sqlCmd.Parameters.AddWithValue("strength", strength == null ? "All" : (object)strength);
                sqlCmd.CommandTimeout = 50000;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        salesAnalysis.Add(new SalesAnalysis
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? -1 : int.Parse(sqlReader["TotalCount"].ToString()),
                            ProgramId = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                            DistrictManagerId = sqlReader["DistrictManagerUserID"] == null ? "-1" : sqlReader["DistrictManagerUserID"].ToString(),
                            SalesRepId = sqlReader["SalesRepUserID"] == null ? "-1" : sqlReader["SalesRepUserID"].ToString(),
                            DistrictManagerName = sqlReader["DistrictManagerName"] == null ? "" : sqlReader["DistrictManagerName"].ToString(),
                            SalesRepName = sqlReader["SalesRepName"] == null ? "" : sqlReader["SalesRepName"].ToString(),
                            RegionName = sqlReader["RegionName"] == null ? "" : sqlReader["RegionName"].ToString(),
                            SalesRepAreaName = sqlReader["SalesRepAreaName"] == null ? "" : sqlReader["SalesRepAreaName"].ToString()
                        });
                    }

                    connection.Close();
                }
            }
            var revisedSalesAnalysis = new List<SalesAnalysis>();

            var total = salesAnalysis.Sum(s => s.TotalCount);
            foreach (var sale in salesAnalysis)
            {
                sale.PercentageTotal = Math.Round(((double)sale.TotalCount / total) * 100, 2);
            }

            var managers = salesAnalysis.Select(s => s.DistrictManagerId).Distinct().ToList();
            foreach (var m in managers)
            {
                var mTotal = salesAnalysis.Where(s => s.DistrictManagerId == m).Sum(s => s.TotalCount);
                var mCount = salesAnalysis.Count(s => s.DistrictManagerId == m);
                var districtManager = salesAnalysis.FirstOrDefault(s => s.DistrictManagerId == m);
                var districtManagerName = districtManager == null ? "" : districtManager.DistrictManagerName;
                foreach (var sale in salesAnalysis.Where(s => s.DistrictManagerId == m))
                {
                    sale.PercentageDistrict = Math.Round(((double)sale.TotalCount / mTotal) * 100, 2);
                    sale.AvgPerRep = Math.Round(((double)mTotal / mCount), 0);
                    revisedSalesAnalysis.Add(new SalesAnalysis
                    {
                        ProgramId = sale.ProgramId,
                        TotalCount = sale.TotalCount,
                        AvgPerRep = sale.AvgPerRep,
                        DistrictManagerId = sale.DistrictManagerId,
                        DistrictManagerName = sale.DistrictManagerName,
                        PercentageDistrict = sale.PercentageDistrict,
                        RegionName = sale.RegionName,
                        PercentageTotal = sale.PercentageTotal,
                        Referrals = sale.Referrals,
                        SalesRepAreaName = sale.SalesRepAreaName,
                        SalesRepId = sale.SalesRepId,
                        SalesRepName = sale.SalesRepName
                    });
                }
                revisedSalesAnalysis.Add(new SalesAnalysis
                {
                    RegionName = "Total for " + districtManagerName,
                    TotalCount = mTotal,
                    PercentageDistrict = 100.00,
                    DistrictManagerId = "-1000",
                    PercentageTotal = Math.Round(salesAnalysis.Where(s => s.DistrictManagerId == m).Sum(s => s.PercentageTotal), 2),
                    AvgPerRep = Math.Round(((double)mTotal / mCount), 0)
                });
                revisedSalesAnalysis.Add(new SalesAnalysis { DistrictManagerId = "-5000" });
            }

            return revisedSalesAnalysis;
        }
        public ExportResult ExportExcel(DetailsDataConfig detailsDataConfig, RequestParamSet requestParamSet, string fileFullName = null)
        {
            try
            {
                if (!detailsDataConfig.Data.Any())
                {
                    using (var wb = new XLWorkbook())
                    {
                        wb.Worksheets.Add("No Data Available");
                        wb.SaveAs(fileFullName);
                    }
                    return new ExportResult(true,"");
                }
                using (var wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(ExcelUtility.ToDataTable(detailsDataConfig, requestParamSet.UserType));
                    ExcelUtility.SetDateFormatColumns(detailsDataConfig, wb, "Details Data");
                    wb.SaveAs(fileFullName);
                }
                return new ExportResult(true, "");
            }
            catch(Exception ex)
            {
                return new ExportResult(false, ex.Message);
            }
        }
        public ExportResult ExportPdf(DetailsDataConfig detailsDataConfig, RequestParamSet requestParamSet, string fileFullName = null)
        {
            try
            {
                var programName = GetProgramName(requestParamSet.ProgramId);
                var document = new Document(PageSize.A2, 5f, 5f, 5f, 5f);
                if (!detailsDataConfig.Data.Any())
                {
                    try
                    {
                        PdfWriter.GetInstance(document, new FileStream(fileFullName, FileMode.Create));
                        document.Open();
                        document.Add(new Paragraph("No Data Available",
                            FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                    }
                    catch(Exception ex)
                    {
                        return new ExportResult(false, ex.Message);
                    }
                    finally
                    {
                        document.Close();
                    }
                }
                else
                {
                    try
                    {
                        PdfWriter.GetInstance(document, new FileStream(fileFullName, FileMode.Create));
                        var colCount = detailsDataConfig.Config.Count(c => !c.Name.Contains("_btn_"));
                        var table = new PdfPTable(colCount)
                        {
                            TotalWidth = 1180f, LockedWidth = true, SpacingBefore = 5f
                        };
                        // relative col widths in proportions - 1 / 3 and 2 / 3
                        var widths = new float[colCount];
                        for (var i = 0; i < colCount; i++)
                        {
                            widths[i] = 1f;
                        }
                        table.SetWidths(widths);
                        table.HorizontalAlignment = 0;
                        PdfUtility.AddHeaders(table, detailsDataConfig.Config, requestParamSet.UserType);
                        foreach (var data in detailsDataConfig.Data)
                        {
                            PdfUtility.AddRow(table, data, detailsDataConfig.Config, requestParamSet.UserType);
                        }
                        document.Open();
                        document.Add(new Paragraph("Details Report for " + programName,
                            FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                        document.Add(new Paragraph(
                            "Number of Referrals: " + detailsDataConfig.Data.Count.ToString("##,###"),
                            FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK)));
                        document.Add(table);
                    }
                    catch(Exception ex)
                    {
                        return new ExportResult(false,ex.Message);
                    }
                    finally
                    {
                        document.Close();
                    }
                }
                return new ExportResult(true,"");
            }
            catch(Exception ex)
            {
                return new ExportResult(false,ex.Message);
            }
        }

        public string GetStringFormattedData(DetailsDataConfig detailsDataConfig, string userType,bool isService=false)
        {
            return ExcelUtility.GetStringFormattedData(detailsDataConfig, userType, isService);
        }
        public string GetProgramName(int programId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetProgramById]", connection)
                {
                    CommandType = CommandType.StoredProcedure, CommandTimeout = 500
                };
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        return sqlReader["Name"]?.ToString() ?? string.Empty;
                    }
                    connection.Close();
                }
            }
            return string.Empty;
        }
        public DetailsDataConfig GetDetails(string userType, RequestParamSet requestParamSet)
        {
            try
            {
                var isExport = requestParamSet.IsExport ?? false;
                var dates = DateUtility.GetDates(requestParamSet.DateRangeType ?? "allreferrals", requestParamSet.ProgramId, _connectionString);
                if (requestParamSet.MeasureId == 100)
                {
                    var dts = DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-11), DateTime.Now);
                    dts.RemoveAt(dates.Count - 1);
                    dates = new List<string> { dts.First().ToString("yyyy-MM-dd") + " 00:00:00", dts.Last().ToString("yyyy-MM-dd") + " 23:59:59" };
                }
                var details = new List<Details>();
                using (var connection = new SqlConnection(_connectionString))
                {
                    if (requestParamSet.IsService)
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before connection open (Get Details) at " + DateTime.Now.ToLongTimeString());
                    connection.Open();
                    if (requestParamSet.IsService)
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After connection open (Get Details) at " + DateTime.Now.ToLongTimeString());
                    SetArithAbortCommand(connection);
                    var sqlCmd = new SqlCommand(GetDetailsAppSpByUserType(userType, isExport), connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("ProgramID", requestParamSet.ProgramId);
                    if (requestParamSet.AspnRxId == null)
                        sqlCmd.Parameters.AddWithValue("AspnRxID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AspnRxID", requestParamSet.AspnRxId);
                    if (requestParamSet.ProgramStatus == null)
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", requestParamSet.ProgramStatus);
                    if (requestParamSet.State == null)
                        sqlCmd.Parameters.AddWithValue("State", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("State", requestParamSet.State);
                    if (requestParamSet.ProgramSubstatus == null)
                        sqlCmd.Parameters.AddWithValue("ProgramSubstatus", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ProgramSubstatus", requestParamSet.ProgramSubstatus);
                    sqlCmd.Parameters.AddWithValue("BegDate", requestParamSet.From ?? dates[0]);
                    sqlCmd.Parameters.AddWithValue("EndDate", requestParamSet.To == null ? dates[1] : requestParamSet.To.Contains(" ") ? requestParamSet.To : requestParamSet.To + " 23:59:59");
                    if (requestParamSet.PatientLastNameSrcQry == null)
                        sqlCmd.Parameters.AddWithValue("PatientLastNameSearchQry", "%%");
                    else
                        sqlCmd.Parameters.AddWithValue("PatientLastNameSearchQry", requestParamSet.PatientLastNameSrcQry);
                    if (requestParamSet.PhysicianLastNameSrcQry == null)
                        sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", "%%");
                    else
                        sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", requestParamSet.PhysicianLastNameSrcQry);
                    if (requestParamSet.DateToUse == null)
                        sqlCmd.Parameters.AddWithValue("DateToUse", "CreatedOn");
                    else
                        sqlCmd.Parameters.AddWithValue("DateToUse", requestParamSet.DateToUse);
                    if (requestParamSet.FillingPharmacyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", requestParamSet.FillingPharmacyId);
                    if (requestParamSet.RegranexTubeQty == null)
                        sqlCmd.Parameters.AddWithValue("RegranexTubeQuantity", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("RegranexTubeQuantity", requestParamSet.RegranexTubeQty);
                    if (requestParamSet.ReportsTo == null)
                        sqlCmd.Parameters.AddWithValue("ReportsTo", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ReportsTo", requestParamSet.ReportsTo);
                    if (requestParamSet.SalesReferralUser == null)
                        sqlCmd.Parameters.AddWithValue("SalesReferral", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("SalesReferral", requestParamSet.SalesReferralUser);
                    if (requestParamSet.FillingCompanyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", requestParamSet.FillingCompanyId);
                    if (requestParamSet.PriorAuth == null)
                        sqlCmd.Parameters.AddWithValue("PriorAuth", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PriorAuth", requestParamSet.PriorAuth);
                    if (requestParamSet.ExcludeNonWorkDays == null)
                        sqlCmd.Parameters.AddWithValue("ExcludeNonWorkDays", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ExcludeNonWorkDays", requestParamSet.ExcludeNonWorkDays);

                    sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", requestParamSet.ProgramId == -1 ? false : requestParamSet.IsArmadaEmployee);
                    if (requestParamSet.UserId == null)
                        sqlCmd.Parameters.AddWithValue("UserID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("UserID", requestParamSet.UserId);
                    if (requestParamSet.UserType == null)
                        sqlCmd.Parameters.AddWithValue("UserType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("UserType", requestParamSet.UserType);
                    if (requestParamSet.ReferralCode == null)
                        sqlCmd.Parameters.AddWithValue("ReferralCode", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ReferralCode", requestParamSet.ReferralCode);
                    sqlCmd.Parameters.AddWithValue("SummarySubstatus", "status");
                    if (requestParamSet.DaysToFill == null)
                        sqlCmd.Parameters.AddWithValue("DaysToFill", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DaysToFill", requestParamSet.DaysToFill);
                    if (requestParamSet.PatientState == null)
                        sqlCmd.Parameters.AddWithValue("PatientState", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PatientState", requestParamSet.PatientState);
                    if (requestParamSet.PatientLastName == null)
                        sqlCmd.Parameters.AddWithValue("PatientLastName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PatientLastName", requestParamSet.PatientLastName);
                    if (requestParamSet.PhysicianLastName == null)
                        sqlCmd.Parameters.AddWithValue("PhysicianLastName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PhysicianLastName", requestParamSet.PhysicianLastName);
                    if (requestParamSet.MeasureId == null)
                        sqlCmd.Parameters.AddWithValue("MeasureID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("MeasureID", requestParamSet.MeasureId);
                    if (requestParamSet.InpTreatment == null)
                        sqlCmd.Parameters.AddWithValue("inpTreatment ", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("inpTreatment ", requestParamSet.InpTreatment);
                    if (requestParamSet.AvgDays == null)
                        sqlCmd.Parameters.AddWithValue("AvgDays", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AvgDays", requestParamSet.AvgDays);


                    if (requestParamSet.InsType == null || requestParamSet.InsType == -1)
                        sqlCmd.Parameters.AddWithValue("InsType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("InsType", requestParamSet.InsType);
                    if (requestParamSet.StatProc == null)
                        sqlCmd.Parameters.AddWithValue("StatProc", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("StatProc", requestParamSet.StatProc);
                    if (requestParamSet.AuthCode == null)
                        sqlCmd.Parameters.AddWithValue("AuthCode", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AuthCode", requestParamSet.AuthCode);
                    if (requestParamSet.Category == null)
                        sqlCmd.Parameters.AddWithValue("Category", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Category", requestParamSet.Category);
                    if (requestParamSet.PharmacyReferral == null)
                        sqlCmd.Parameters.AddWithValue("PharmacyReferral", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PharmacyReferral", requestParamSet.PharmacyReferral);
                    if (requestParamSet.Registry == null)
                        sqlCmd.Parameters.AddWithValue("Registry", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Registry", requestParamSet.Registry);
                    if (requestParamSet.OnLabel == null)
                        sqlCmd.Parameters.AddWithValue("OnLabel", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("OnLabel", requestParamSet.OnLabel);
                    if (requestParamSet.Source == null)
                        sqlCmd.Parameters.AddWithValue("Source", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Source", requestParamSet.Source);
                    if (requestParamSet.TimeToProcess == null)
                        sqlCmd.Parameters.AddWithValue("TimeToProcess", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("TimeToProcess", requestParamSet.TimeToProcess);
                    if (requestParamSet.Location == null)
                        sqlCmd.Parameters.AddWithValue("location", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("location", requestParamSet.Location);
                    if (requestParamSet.DateType == null)
                        sqlCmd.Parameters.AddWithValue("dateType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("dateType", requestParamSet.DateType);
                    if (requestParamSet.InsuranceType == null)
                        sqlCmd.Parameters.AddWithValue("insuranceType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("insuranceType", requestParamSet.InsuranceType);
                    if (requestParamSet.DistrictManager == null)
                        sqlCmd.Parameters.AddWithValue("districtManager", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("districtManager", requestParamSet.DistrictManager);
                    if (requestParamSet.RefInProcess == null)
                        sqlCmd.Parameters.AddWithValue("RefInProcess", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("RefInProcess", requestParamSet.RefInProcess);
                    if (requestParamSet.Strength == null || requestParamSet.Strength == "All")
                        sqlCmd.Parameters.AddWithValue("Strength", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Strength", requestParamSet.Strength);
                    if (requestParamSet.Consignment == null)
                        sqlCmd.Parameters.AddWithValue("consignment", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("consignment", requestParamSet.Consignment);
                    if (requestParamSet.Ndc == null)
                        sqlCmd.Parameters.AddWithValue("Ndc", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Ndc", requestParamSet.Ndc);
                    if (requestParamSet.ReferralType == null)
                        sqlCmd.Parameters.AddWithValue("ReferralType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ReferralType", requestParamSet.ReferralType);
                    if (requestParamSet.PrescriberLastName == null)
                        sqlCmd.Parameters.AddWithValue("PrescriberLastName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PrescriberLastName", requestParamSet.PrescriberLastName);
                    if (requestParamSet.PrescriberFirstName == null)
                        sqlCmd.Parameters.AddWithValue("PrescriberFirstName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PrescriberFirstName", requestParamSet.PrescriberFirstName);
                    if (requestParamSet.DrugName == null)
                        sqlCmd.Parameters.AddWithValue("DrugName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DrugName", requestParamSet.DrugName);
                    if (requestParamSet.Reason == null)
                        sqlCmd.Parameters.AddWithValue("RxcReason", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("RxcReason", requestParamSet.Reason);

                    sqlCmd.Parameters.AddWithValue("Offset", requestParamSet.Offset);
                    sqlCmd.Parameters.AddWithValue("IsExport", requestParamSet.IsExport);

                    sqlCmd.CommandTimeout = 100000;
                    var cp = 0.0;
                    if (requestParamSet.IsService)
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before exec msp at " + DateTime.Now.ToLongTimeString());
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        if (requestParamSet.IsService)
                        {
                            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After exec msp at " + DateTime.Now.ToLongTimeString());
                            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before Creating Details Model List at " + DateTime.Now.ToLongTimeString());
                        }
                        while (sqlReader.Read())
                        {
                            details.Add(new Details
                            {
                                AspnRxId_4_ = sqlReader["AspnRxID"] == null ? "" : sqlReader["AspnRxID"].ToString(),//1
                                DoctorFlag_70_ = sqlReader["DoctorFlag"] == null ? "" : sqlReader["DoctorFlag"].ToString(),//2
                                ReferralCode_55_ = sqlReader["ReferralCode"] == null ? "" : sqlReader["ReferralCode"].ToString(),//3
                                DoctorId = sqlReader["DoctorID"] == null ? "" : sqlReader["DoctorID"].ToString(),//4
                                ProgramId = sqlReader["ProgramID"] == null ? "" : sqlReader["ProgramID"].ToString(),//5
                                PrescriptionId = sqlReader["PrescriptionID"] == null ? "" : sqlReader["PrescriptionID"].ToString(),//6
                                PhysicianFirstName_42_43_ = sqlReader["PhysicianFirstName"] == null ? "" : sqlReader["PhysicianFirstName"].ToString(),//7
                                PhysicianLastName_42_44_ = sqlReader["PhysicianLastName"] == null ? "" : sqlReader["PhysicianLastName"].ToString(),//8
                                Address1_1__47_ = sqlReader["Address1"] == null ? "" : sqlReader["Address1"].ToString(),//9
                                Address2_1_47_ = sqlReader["Address2"] == null ? "" : sqlReader["Address2"].ToString(),//10
                                City_48_ = sqlReader["City"] == null ? "" : sqlReader["City"].ToString(),//11
                                State_50_ = sqlReader["State"] == null ? "" : sqlReader["State"].ToString(),//12
                                PostalCode_51_ = sqlReader["PostalCode"] == null ? "" : sqlReader["PostalCode"].ToString(),//13
                                Phone = sqlReader["Phone"] == null ? "" : sqlReader["Phone"].ToString(),//14
                                Npi_34_45_ = sqlReader["NPI"] == null ? "" : sqlReader["NPI"].ToString(),//15
                                LastFillDate__ = sqlReader["LastFillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["LastFillDate"].ToString(), "MM/dd/yyyy"),//16
                                InsuranceType_31_ = sqlReader["InsuranceType"] == null ? "" : sqlReader["InsuranceType"].ToString(),//17
                                InsuranceTypeId = sqlReader["InsuranceTypeId"] == null ? "" : sqlReader["InsuranceTypeId"].ToString(),//18
                                InsuranceName_38_87_88_ = sqlReader["InsuranceName"] == null ? "" : sqlReader["InsuranceName"].ToString(),//19
                                BinNumber_7_ = sqlReader["BinNumber"] == null ? "" : sqlReader["BinNumber"].ToString(),//20
                                PcnNumber = sqlReader["PCNNumber"] == null ? "" : sqlReader["PCNNumber"].ToString(),//21
                                ReferralDate = sqlReader["ReferralDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReferralDate"].ToString(), "MM/dd/yyyy"),//22
                                PrescriptionShipDate = sqlReader["PrescriptionShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["PrescriptionShipDate"].ToString(), "MM/dd/yyyy"),//23
                                DrugName_115_ = sqlReader["DrugName"] == null ? "" : sqlReader["DrugName"].ToString(),//24
                                Strength_76_ = sqlReader["Strength"] == null ? "" : sqlReader["Strength"].ToString(),//25
                                Refills_58_ = sqlReader["Refills"] == null ? "" : sqlReader["Refills"].ToString(),//26
                                DaysSupply_17_ = sqlReader["DaysSupply"] == null ? "" : sqlReader["DaysSupply"].ToString(),//27
                                RegranexTubesFilled_68_ = sqlReader["RegranexTubesFilled"] == null ? "" : sqlReader["RegranexTubesFilled"].ToString(),//28
                                FillQty_21_ = sqlReader["FillQuantity"] == null ? "" : sqlReader["FillQuantity"].ToString(),//29
                                OrderQty_35_ = sqlReader["OrderQuantity"] == null ? "" : sqlReader["OrderQuantity"].ToString(),//30
                                ReferringPharmacyContact = sqlReader["ReferringPharmacyContact"] == null ? "" : sqlReader["ReferringPharmacyContact"].ToString(),//31
                                ReferralPharmacyEmail = sqlReader["ReferringPharmacyEmail"] == null ? "" : sqlReader["ReferringPharmacyEmail"].ToString(),//32
                                PrescriptionNumber = sqlReader["PrescriptionNumber"] == null ? "" : sqlReader["PrescriptionNumber"].ToString(),//33
                                AspnStatus_63_ = sqlReader["AspnStatus"] == null ? "" : sqlReader["AspnStatus"].ToString(),//34
                                ProgramStatus_53_ = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString(),//35
                                ProgramSubStatus_65_ = sqlReader["ProgramSubstatus"] == null ? "" : sqlReader["ProgramSubstatus"].ToString(),//36
                                ReferralType_69_ = sqlReader["ReferralType"] == null ? "" : sqlReader["ReferralType"].ToString(),//37
                                HubPatientId_27_ = sqlReader["HubPatientID"] == null ? "" : sqlReader["HubPatientID"].ToString(),//38
                                HubNumber_8_ = sqlReader["HubNumber"] == null ? "" : sqlReader["HubNumber"].ToString(),//39
                                FinalCopay_24_127_ = sqlReader["FinalCopay"] != null && double.TryParse(sqlReader["FinalCopay"].ToString(), out cp) ? "$" + double.Parse(sqlReader["FinalCopay"].ToString()).ToString("#,##0.00") : "",//40
                                Copay_10_126_ = sqlReader["Copay"] != null && double.TryParse(sqlReader["Copay"].ToString(), out cp) ? "$" + double.Parse(sqlReader["Copay"].ToString()).ToString("#,##0.00") : "",//41
                                CopayType = sqlReader["CopayType"] == null ? "" : sqlReader["CopayType"].ToString(),//42
                                CptCode = sqlReader["CPTCode"] == null ? "" : sqlReader["CPTCode"].ToString(),//43
                                CptCopayType = sqlReader["CPTCopayType"] == null ? "" : sqlReader["CPTCopayType"].ToString(),//44
                                CopayCardOffered = sqlReader["CopayCardOffered"] == null ? "" : sqlReader["CopayCardOffered"].ToString(),//45
                                CopayCardUsed = sqlReader["CopayCardUsed"] == null ? "" : sqlReader["CopayCardUsed"].ToString(),//46
                                CopayInsPctg = sqlReader["CopayInsPctg"] == null ? "" : sqlReader["CopayInsPctg"].ToString(),//47
                                CptCopayAmount = sqlReader["CPTCopayAmount"] == null ? "" : sqlReader["CPTCopayAmount"].ToString(),//48
                                CptCopayInsPctg = sqlReader["CPTCopayInsPctg"] == null ? "" : sqlReader["CPTCopayInsPctg"].ToString(),//49
                                PriorAuthRequired_36_ = sqlReader["PriorAuthRequired"] == null ? "" : sqlReader["PriorAuthRequired"].ToString(),//50
                                PatientCity = sqlReader["PatientCity"] == null ? "" : sqlReader["PatientCity"].ToString(),//51
                                PatientState_62_ = sqlReader["PatientState"] == null ? "" : sqlReader["PatientState"].ToString(),//52
                                PatientId_37_ = sqlReader["PatientID"] == null ? "" : sqlReader["PatientID"].ToString(),//53
                                PatientZip = sqlReader["PatientZip"] == null ? "" : sqlReader["PatientZip"].ToString(),//54
                                Pcn_39_ = sqlReader["PCN"] == null ? "" : sqlReader["PCN"].ToString(),//55
                                GroupId_25_ = sqlReader["GroupID"] == null ? "" : sqlReader["GroupID"].ToString(),//56
                                CreatedDate_16_ = sqlReader["CreateDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CreateDate"].ToString(), "MM/dd/yyyy"),//57
                                ReceiveDate = sqlReader["ReceiveDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceiveDate"].ToString(), "MM/dd/yyyy"),//58
                                ModifyDate = sqlReader["ModifyDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ModifyDate"].ToString(), "MM/dd/yyyy"),//59
                                AssignDate_5_ = sqlReader["AssignDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AssignDate"].ToString(), "MM/dd/yyyy"),//60
                                AcceptDate = sqlReader["AcceptDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AcceptDate"].ToString(), "MM/dd/yyyy"),//61
                                CompleteDate = sqlReader["CompleteDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CompleteDate"].ToString(), "MM/dd/yyyy"),//62
                                CancelDate = sqlReader["CancelDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CancelDate"].ToString(), "MM/dd/yyyy"),//63
                                ShipDate_61_ = sqlReader["ShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ShipDate"].ToString(), "MM/dd/yyyy"),//64
                                FillDate_20_ = sqlReader["FillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["FillDate"].ToString(), "MM/dd/yyyy"),//65
                                CreatedUserName = sqlReader["CreateUserName"] == null ? "" : sqlReader["CreateUserName"].ToString(),//66
                                ModifyUserName = sqlReader["ModifyUserName"] == null ? "" : sqlReader["ModifyUserName"].ToString(),//67
                                AssignUserName = sqlReader["AssignUserName"] == null ? "" : sqlReader["AssignUserName"].ToString(),//68
                                AcceptUserName = sqlReader["AcceptUserName"] == null ? "" : sqlReader["AcceptUserName"].ToString(),//69
                                CompleteUserName = sqlReader["CompleteUserName"] == null ? "" : sqlReader["CompleteUserName"].ToString(),//70
                                CancelUserName = sqlReader["CancelUserName"] == null ? "" : sqlReader["CancelUserName"].ToString(),//71
                                ProgramName_52_ = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),//72
                                DaysToFill_19_ = sqlReader["DaysToFill"] == null ? "" : sqlReader["DaysToFill"].ToString(),//73
                                ReferrerName_60_ = sqlReader["ReferrerName"] == null ? "" : sqlReader["ReferrerName"].ToString(),//74
                                ReportsToName_59_ = sqlReader["ReportsToName"] == null ? "" : sqlReader["ReportsToName"].ToString(),//75
                                StepTherapy_64_ = sqlReader["StepTherapy"] == null ? "" : sqlReader["StepTherapy"].ToString(),//76
                                TrialCard_67_46_ = sqlReader["TrialCard"] == null ? "" : sqlReader["TrialCard"].ToString(),//77
                                Indicator_66_ = sqlReader["Indicator"] == null ? "" : sqlReader["Indicator"].ToString(),//78
                                Icd10Code_28_ = sqlReader["ICD10Code"] == null ? "" : sqlReader["ICD10Code"].ToString(),//79
                                Icd10LongDesc_29_ = sqlReader["ICD10LongDesc"] == null ? "" : sqlReader["ICD10LongDesc"].ToString(),//80
                                Nabp_23_ = sqlReader["NABP"] == null ? "" : sqlReader["NABP"].ToString(),//81
                                InNetwork_30_ = sqlReader["InNetwork"] == null ? "" : sqlReader["InNetwork"].ToString(),//82
                                CopayCardActivation_11_ = sqlReader["CopayCardActivation"] == null ? "" : sqlReader["CopayCardActivation"].ToString(),//83
                                CopayCardNumber_14_ = sqlReader["CopayCardNumber"] == null ? "" : sqlReader["CopayCardNumber"].ToString(),//84
                                CopayCardGroupId_13_ = sqlReader["CopayCardGroupID"] == null ? "" : sqlReader["CopayCardGroupID"].ToString(),//85
                                CopayCardBin_12_ = sqlReader["CopayCardBIN"] == null ? "" : sqlReader["CopayCardBIN"].ToString(),//86
                                CopayCardPcn_15_ = sqlReader["CopayCardPCN"] == null ? "" : sqlReader["CopayCardPCN"].ToString(),//87
                                ReceivedOnDate_54_ = sqlReader["ReceivedOnDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceivedOnDate"].ToString(), "MM/dd/yyyy"),//88
                                Specialty_49_ = sqlReader["Specialty"] == null ? "" : sqlReader["Specialty"].ToString(),//89
                                RefillCalcDate_57_ = sqlReader["RefillCalcDate"] == null ? "" : DateUtility.FormatDate(sqlReader["RefillCalcDate"].ToString(), "MM/dd/yyyy"),//90
                                RefillCount_56_ = sqlReader["RefillCount"] == null ? "" : sqlReader["RefillCount"].ToString(),//91
                                RxAutoFill_6_ = sqlReader["RxAutoFill"] == null ? "" : sqlReader["RxAutoFill"].ToString(),//92
                                Category = sqlReader["Category"] == null ? "" : sqlReader["Category"].ToString(),//93
                                AuthCode_32_ = sqlReader["AuthCode"] == null ? "" : sqlReader["AuthCode"].ToString(),//94
                                ProdForm = sqlReader["ProdForm"] == null ? "" : sqlReader["ProdForm"].ToString(),//95
                                ShipQty = sqlReader["ShipQty"] == null ? "" : sqlReader["ShipQty"].ToString(),//96
                                DispenseDate = sqlReader["DispenseDate"] == null ? "" : DateUtility.FormatDate(sqlReader["DispenseDate"].ToString(), "MM/dd/yyyy"),//97
                                NcpDp_82_ = sqlReader["NCPDP"] == null ? "" : sqlReader["NCPDP"].ToString(),//98
                                PharmacyAddress1 = sqlReader["PharmacyAddress1"] == null ? "" : sqlReader["PharmacyAddress1"].ToString(),//99
                                PharmacyCity = sqlReader["PharmacyCity"] == null ? "" : sqlReader["PharmacyCity"].ToString(),//100
                                PharmacyState = sqlReader["PharamcyState"] == null ? "" : sqlReader["PharamcyState"].ToString(),//101
                                PharmacyZip = sqlReader["PharamacyZip"] == null ? "" : sqlReader["PharamacyZip"].ToString(),//102
                                FillingPharmacyName_22_ = sqlReader["FillingPharmacyName"] == null ? "" : sqlReader["FillingPharmacyName"].ToString(),//103
                                HasNoMemberName = sqlReader["HasNonMemberName"] == null ? "" : sqlReader["HasNonMemberName"].ToString(),//104
                                NDC_33_ = sqlReader["NDC"] == null ? "" : sqlReader["NDC"].ToString(),//105
                                PdrpFlag_40_ = sqlReader["PDRPFlag"] == null ? "" : sqlReader["PDRPFlag"].ToString(),//106
                                PharmacyNpi_41_ = sqlReader["PharmacyNPI"] == null ? "" : sqlReader["PharmacyNPI"].ToString(),//107
                                TriageLite_74_ = sqlReader["TriageLite"] == null ? "" : sqlReader["TriageLite"].ToString(),//108
                                Source_75_ = sqlReader["Source"] == null ? "" : sqlReader["Source"].ToString(),//109
                                ReportToId = sqlReader["ReportsToId"] == null ? "" : sqlReader["ReportsToId"].ToString(),//110
                                SalesReferralId = sqlReader["ReferrerId"] == null ? "" : sqlReader["ReferrerId"].ToString(),//111
                                RxNumber_77_ = sqlReader["RxNumber"] == null ? "" : sqlReader["RxNumber"].ToString(),//112
                                MrnNumber_78_ = sqlReader["MrnNumber"] == null ? "" : sqlReader["MrnNumber"].ToString(),//113
                                HomeHealthAgency_80_ = sqlReader["HomeHealthAgency"] == null ? "" : sqlReader["HomeHealthAgency"].ToString(),//114
                                DistrictManager_81_ = sqlReader["ReportsToName"] == null ? "" : sqlReader["ReportsToName"].ToString(),//115
                                AfrezzaASPNID_83_ = sqlReader["AfrezzaASPNID"] == null ? "" : sqlReader["AfrezzaASPNID"].ToString(),//116
                                RegistryPatient_85_ = sqlReader["RegistryPatient"] == null ? "" : sqlReader["RegistryPatient"].ToString(),//117
                                OnLabel_86_ = sqlReader["OnLabel"] == null ? "" : sqlReader["OnLabel"].ToString(),//118
                                MedicalInsurancePlan_89_ = sqlReader["MedicalInsurancePlan"] == null ? "" : sqlReader["MedicalInsurancePlan"].ToString(),//119
                                CoverageType_90_ = sqlReader["CoverageType"] == null ? "" : sqlReader["CoverageType"].ToString(),//120
                                DaysToProcess_91_ = sqlReader["DaysToProcess"] == null ? "" : sqlReader["DaysToProcess"].ToString(),//121
                                Category_92_ = sqlReader["LNoteCategory"] == null ? "" : sqlReader["LNoteCategory"].ToString(),//122
                                Subcategory_93_ = sqlReader["LNoteSubCategory"] == null ? "" : sqlReader["LNoteSubCategory"].ToString(),//123
                                TimetoFill_94_ = sqlReader["TimetoFill"] == null ? "" : sqlReader["TimetoFill"].ToString(),//124
                                TimetoShip_95_ = sqlReader["TimetoShip"] == null ? "" : sqlReader["TimetoShip"].ToString(),//125
                                IndicationClass_96_ = sqlReader["IndicationClass"] == null ? "" : sqlReader["IndicationClass"].ToString(),//126
                                OriginalAspnId_97_ = sqlReader["OriginalAspnId"] == null ? "" : sqlReader["OriginalAspnId"].ToString(),//127
                                GprSite_98_ = sqlReader["GprSite"] == null ? "" : sqlReader["GprSite"].ToString(),//128
                                BridgeProgram_99_ = sqlReader["BridgeProgram"] == null ? "" : sqlReader["BridgeProgram"].ToString(),//129
                                ExternalPatientID_100_ = sqlReader["ExternalPatientID"] == null ? "" : sqlReader["ExternalPatientID"].ToString(),//130
                                PAAppealRequired_101_ = sqlReader["PAAppealRequired"] == null ? "" : sqlReader["PAAppealRequired"].ToString(),//131
                                VoucherFlag_102_ = sqlReader["VoucherFlag"] == null ? "" : sqlReader["VoucherFlag"].ToString(),//132
                                RefillNumber_103_ = sqlReader["RefillNumber"] == null ? "" : sqlReader["RefillNumber"].ToString(),//133
                                BenefitTypeUsed_104_ = sqlReader["BenefitTypeUsed"] == null ? "" : sqlReader["BenefitTypeUsed"].ToString(),//134
                                PatientConsentName_105_ = sqlReader["PatientConsentName"] == null ? "" : sqlReader["PatientConsentName"].ToString(),//135
                                PatientConsentDOB_106_ = sqlReader["PatientConsentDOB"] == null ? "" : sqlReader.GetString("PatientConsentDOB"),//136
                                CurrentStatusDate_107_ = sqlReader["CurrentStatusDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CurrentStatusDate"].ToString(), "MM/dd/yyyy"),//137
                                BVOutcome_108_ = sqlReader["BVOutcome"] == null ? "" : sqlReader["BVOutcome"].ToString(),//138
                                ReferringPharmacyName_109_ = sqlReader["ReferringPharmacyName"] == null ? "" : sqlReader["ReferringPharmacyName"].ToString(),//139
                                PatientConsent_110_ = sqlReader["PatientConsent"] == null ? "" : sqlReader["PatientConsent"].ToString(),//140
                                PatientServicesOptin_111_ = sqlReader["PatientServicesOptin"] == null ? "" : sqlReader["PatientServicesOptin"].ToString(),//141
                                PatientTrainingOptin_112_ = sqlReader["PatientTrainingOptin"] == null ? "" : sqlReader["PatientTrainingOptin"].ToString(),//142
                                VoucherId_114_ = sqlReader["VoucherId"] == null ? "" : sqlReader["VoucherId"].ToString(),//143
                                PharmacyInsurancePlan = sqlReader["PharmacyInsurancePlan"] == null ? "" : sqlReader["PharmacyInsurancePlan"].ToString(),//144
                                SecondaryMedicalInsurance_84_ = sqlReader["SecondaryMedicalInsuranceName"] == null ? "" : sqlReader["SecondaryMedicalInsuranceName"].ToString(),//145
                                PrimaryMedicalInsurance_79_ = sqlReader["MedicalInsuranceName"] == null ? "" : sqlReader["MedicalInsuranceName"].ToString(),//146
                                LastFillDatePopup = sqlReader["LastFillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["LastFillDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//147
                                ReferralDatePopup = sqlReader["ReferralDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReferralDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//148
                                PrescriptionShipDatePopup = sqlReader["PrescriptionShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["PrescriptionShipDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//149
                                CreatedDatePopup = sqlReader["CreateDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CreateDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//150
                                ReceiveDatePopup = sqlReader["ReceiveDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceiveDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//151
                                ModifyDatePopup = sqlReader["ModifyDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ModifyDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//152
                                AssignDatePopup = sqlReader["AssignDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AssignDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//153
                                AcceptDatePopup = sqlReader["AcceptDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AcceptDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//154
                                CompleteDatePopup = sqlReader["CompleteDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CompleteDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//155
                                CancelDatePopup = sqlReader["CancelDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CancelDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//156
                                ShipDatePopup = sqlReader["ShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ShipDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//157
                                FillDatePopup = sqlReader["FillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["FillDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//158
                                ReceivedOnDatePopup = sqlReader["ReceivedOnDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceivedOnDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//159
                                RefillCalcDatePopup = sqlReader["RefillCalcDate"] == null ? "" : DateUtility.FormatDate(sqlReader["RefillCalcDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//160
                                DispenseDatePopup = sqlReader["DispenseDate"] == null ? "" : DateUtility.FormatDate(sqlReader["DispenseDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),//161
                                CaseManager_116_ = sqlReader["CaseManager"] == null ? "" : sqlReader["CaseManager"].ToString(),//162
                                SubHubCaseManager_117_ = sqlReader["SubhubManager"] == null ? "" : sqlReader["SubhubManager"].ToString(),//163
                                SecondaryPharmacyInsurancePlan_118_ = sqlReader["SecondaryPharmacyInsurancePlan"] == null ? "" : sqlReader["SecondaryPharmacyInsurancePlan"].ToString(),//164
                                AssignmentReason_119_ = sqlReader["AssignmentReason"] == null ? "" : sqlReader["AssignmentReason"].ToString(),//165
                                AssignedUser_120_ = sqlReader["AssignUserName"] == null ? "" : sqlReader["AssignUserName"].ToString(),//166
                                CreatedOn = sqlReader.GetDate("CreateDate"),//167
                                PlateletCount_121_ = sqlReader["PlateletCount"] == null ? "" : sqlReader["PlateletCount"].ToString(),//168
                                ProcedureDate_122_ = sqlReader["ProcedureDate"] == null ? "" : sqlReader["ProcedureDate"].ToString(),//169
                                FirstDosingDate_123_ = sqlReader["FirstDosingDate"] == null ? "" : sqlReader["FirstDosingDate"].ToString(),//170
                                PAType_124_ = sqlReader["PAType"] == null ? "" : sqlReader["PAType"].ToString(),//171
                                DeliverTo_125_ = sqlReader["DeliverTo"] == null ? "" : sqlReader["DeliverTo"].ToString(),//172
                                AspnrRxInternalId = sqlReader["AspnrRxInternalId"] == null ? "" : sqlReader["AspnrRxInternalId"].ToString(),//173
                                PAStatus_129_ = sqlReader["PAStatus"] == null ? "" : sqlReader["PAStatus"].ToString(),//174
                                PriorAuthorizationType_130_ = sqlReader["PriorAuthorizationType"] == null ? "" : sqlReader["PriorAuthorizationType"].ToString(),//130
                                BenefitInsuranceType_131_ = sqlReader["BenefitInsuranceType"] == null ? "" : sqlReader["BenefitInsuranceType"].ToString(),
                                BenefitInsuranceName_132_ = sqlReader["BenefitInsuranceName"] == null ? "" : sqlReader["BenefitInsuranceName"].ToString(),
                                PhoneNumber_133_ = sqlReader["PhoneNumber"] == null ? "" : sqlReader["PhoneNumber"].ToString(),
                                GroupNumber_134_ = sqlReader["GroupNumber"] == null ? "" : sqlReader["GroupNumber"].ToString(),
                                DeductibleAmount_135_ = sqlReader["DeductibleAmount"] != null && double.TryParse(sqlReader["DeductibleAmount"].ToString(), out cp) ? "$" + double.Parse(sqlReader["DeductibleAmount"].ToString()).ToString("#,##0.00") : "",
                                TotalDeductibleMet_136_ = sqlReader["TotalDeductibleMet"] != null && double.TryParse(sqlReader["TotalDeductibleMet"].ToString(), out cp) ? "$" + double.Parse(sqlReader["TotalDeductibleMet"].ToString()).ToString("#,##0.00") : "",
                                CanOfficeBuyBill_137_ = sqlReader["CanOfficeBuyBill"] == null ? "" : sqlReader["CanOfficeBuyBill"].ToString(),
                                PreferredSPP_138_ = sqlReader["PreferredSPP"] == null ? "" : sqlReader["PreferredSPP"].ToString(),
                                DiagnosisCode_139_ = sqlReader["DiagnosisCode"] == null ? "" : sqlReader["DiagnosisCode"].ToString(),
                                CodeBasedOnMedNecessity_140_ = sqlReader["CodeBasedOnMedNecessity"] == null ? "" : sqlReader["CodeBasedOnMedNecessity"].ToString(),
                                DoctorInNetwork_141_ = sqlReader["DoctorInNetwork"] == null ? "" : sqlReader["DoctorInNetwork"].ToString(),
                                EffectiveDateOnPlan_142_ = sqlReader["EffectiveDateOnPlan"] == null ? "" : DateUtility.FormatDate(sqlReader["EffectiveDateOnPlan"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                OOPMaxAmount_143_ = sqlReader["OOPMaxAmount"] != null && double.TryParse(sqlReader["OOPMaxAmount"].ToString(), out cp) ? "$" + double.Parse(sqlReader["OOPMaxAmount"].ToString()).ToString("#,##0.00") : "" ,
                                OOPMetToDate_144_ = sqlReader["OOPMetToDate"]!= null && double.TryParse(sqlReader["OOPMetToDate"].ToString(), out cp) ? "$" + double.Parse(sqlReader["OOPMetToDate"].ToString()).ToString("#,##0.00") : "",
                                HCPCSCodeFields_145_ = sqlReader["HCPCSCodeFields"] == null ? "" : sqlReader["HCPCSCodeFields"].ToString(),
                                Coinsurance_146_ = sqlReader["Coinsurance"] != null && double.TryParse(sqlReader["Coinsurance"].ToString(), out cp) ? "$" + double.Parse(sqlReader["Coinsurance"].ToString()).ToString("#,##0.00") : "",
                                CoinsuranceType_147_ = sqlReader["CoinsuranceType"] == null ? "" : sqlReader["CoinsuranceType"].ToString(),
                                PARequired_148_ = sqlReader["PARequired"] == null ? "" : sqlReader["PARequired"].ToString(),
                                PAReqType_149_ = sqlReader["PAReqType"] == null ? "" : sqlReader["PAReqType"].ToString(),
                                TerritoryName_150_ = sqlReader["TerritoryName"] == null ? "" : sqlReader["TerritoryName"].ToString(),
                                HospitalDischarge_151_ = sqlReader["HospitalDischarge"] == null ? "" : sqlReader["HospitalDischarge"].ToString(),
                                SbsShortBowelSyndrom_152_ = sqlReader["SbsShortBowelSyndrom"] == null ? "" : sqlReader["SbsShortBowelSyndrom"].ToString(),
                                Internalid_153_ = sqlReader["InternalID"] == null ? "" : sqlReader["InternalID"].ToString(),
                                Placeholder_154_= sqlReader["Placeholder"] == null ? "" : sqlReader["Placeholder"].ToString()
                            });
                        }
                        if (requestParamSet.IsService)
                            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After Creating Details Model List at " + DateTime.Now.ToLongTimeString());

                        connection.Close();
                    }
                }
                if (requestParamSet.IsService)
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before Get Config Values at " + DateTime.Now.ToLongTimeString());
                var config = GetDetailsField(requestParamSet.ProgramId, requestParamSet.UserId, userType, requestParamSet.IsService);
                if (requestParamSet.IsService)
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Got Config Values at " + DateTime.Now.ToLongTimeString());
                var dataConfig = new DetailsDataConfig
                {
                    Config = config,
                    Data = requestParamSet.IsExport ?? false ? details.OrderByDescending(d => d.CreatedOn).ToList() : details
                };
                if(!config.Any())
                    new LoggerService().LogInfo("No details field configuration present for Program ID = " + requestParamSet.ProgramId);
                return dataConfig;
            }
            catch (Exception exception)
            {
                new LoggerService().LogError("Error while generating details report for " + requestParamSet.ReportName + 
                    " with Progra-m ID =" + requestParamSet.ProgramId + ", Error: " + exception.Message, exception);
                File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Exception Occured. Message : " + exception.Message+" at "+ DateTime.Now.ToLongTimeString());
                return new DetailsDataConfig() { Config = new List<DetailsField>(), Data = new List<Details>() };
            }
        }

        public List<PAActivity> GetPAActivity(int aspnrxId)
        {
            var values = new List<PAActivity>();
            using(var connection=new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[analytics].[GetPAActivityStatus]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("aspnRxId", aspnrxId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        values.Add(new PAActivity
                        {
                            PAStatus = sqlReader["PAStatus"] == null ? "" : sqlReader["PAStatus"].ToString(),
                            InitiationDate = sqlReader["InitiationDate"] == null ? "" : DateUtility.FormatDate(sqlReader["InitiationDate"].ToString(), "MM/dd/yyyy"),
                            ApprovalDate = sqlReader["ApprovalDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ApprovalDate"].ToString(), "MM/dd/yyyy"),
                            ExpirationDate = sqlReader["ExpirationDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ExpirationDate"].ToString(), "MM/dd/yyyy")
                        });
                    }
                    connection.Close();
                }
            }
            return values;
        }

        public List<DetailsField> GetDetailsField(int programId, string userId,string userType, bool isService=false)
        {
            try
            {
                var vlues = new List<DetailsField>();
                using (var connection = new SqlConnection(_connectionString))
                {
                    var sqlCmd = new SqlCommand(@"[config].[GetProgramDetailsFieldById]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                    if (userId == null)
                        sqlCmd.Parameters.AddWithValue("UserID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("UserID", userId);
                    sqlCmd.Parameters.AddWithValue("UserType", userType);
                    sqlCmd.CommandTimeout = 500;
                    if(isService)
                    File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before open connectin (GPDF) at " + DateTime.Now.ToLongTimeString());
                    connection.Open();
                    if (isService)
                    {
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After open connectin (GPDF) at " + DateTime.Now.ToLongTimeString());
                        File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before exec (GPDF) at " + DateTime.Now.ToLongTimeString());
                    }
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        if (isService)
                        {
                            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After exec (GPDF) at " + DateTime.Now.ToLongTimeString());
                            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "Before Create DetailsField List at " + DateTime.Now.ToLongTimeString());
                        }
                        while (sqlReader.Read())
                        {
                            vlues.Add(new DetailsField
                            {
                                Id = sqlReader["ID"] == null ? -1 : int.Parse(sqlReader["ID"].ToString()),
                                Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                                CustomName = sqlReader["CustomName"]?.ToString() ?? string.Empty,
                                Order = sqlReader["Order"] == null ? -1 : int.Parse(sqlReader["Order"].ToString()),
                                ForDistrctMgr = sqlReader["ForDistrictMgr"] == null ? true : bool.Parse(sqlReader["ForDistrictMgr"].ToString()),
                                HiddenForPrograms = sqlReader["HiddenForPrograms"]?.ToString() ?? "-1",
                                ProgramId = programId.ToString()
                            });
                        }
                        if (isService)
                            File.AppendAllText(@"" + ConfigurationManager.AppSettings["reportlogfile"], Environment.NewLine + "After Create DetailsField List at " + DateTime.Now.ToLongTimeString());
                        connection.Close();
                    }
                }
                return vlues;
            }
            catch { return null; }
        }
        public List<ReferralTimeToProcessDetails> GetDetailsReferralTimeToProcess(int programId, string location, string pa, string dateType, bool includeWeekends, int year, int month)
        {
            var vlues = new List<ReferralTimeToProcessDetails>();
            var dates = DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-11), DateTime.Now);
            dates.RemoveAt(dates.Count - 1);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetDetailsReferralTimeToProcess]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("includeWeekends", includeWeekends);
                sqlCmd.Parameters.AddWithValue("startDate", dates.First().ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("endDate", dates.Last().ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("location", location);
                sqlCmd.Parameters.AddWithValue("dateType", dateType);
                sqlCmd.Parameters.AddWithValue("pa", pa);
                sqlCmd.Parameters.AddWithValue("month", month);
                sqlCmd.Parameters.AddWithValue("year", year);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ReferralTimeToProcessDetails
                        {
                            AspnRxID = sqlReader.GetInt("AspnRxID"),
                            DaysToProcess = sqlReader.GetInt("DaysToProcess"),
                            PriorAuthRequired = sqlReader.GetString("PriorAuthRequired"),
                            Status = sqlReader.GetString("Status"),
                            CreatedDate = sqlReader.GetDate("CreatedDate"),
                            AssignedDate = sqlReader.GetDate("AssignedDate"),
                            FillDate = sqlReader.GetDate("FillDate"),
                            ShipDate = sqlReader.GetDate("ShipDate")
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }
        public List<ConsignmentDetails> GetConsignmentDetails(int programId, string startDate, string endDate, bool isConsignment)
        {
            var data = new List<ConsignmentDetails>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetMnfDetailsConsignmentHubStatictics]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("startDate", startDate);
                sqlCmd.Parameters.AddWithValue("endDate", endDate);
                sqlCmd.Parameters.AddWithValue("excludeNonWorkingDays", false);
                sqlCmd.Parameters.AddWithValue("IsConsignment", isConsignment);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        data.Add(new ConsignmentDetails
                        {
                            AssignedPharmacy = sqlReader.GetString("AssignedPharmacy"),
                            AspnrxID = sqlReader.GetInt("AspnrxID"),
                            ProgramStatus = sqlReader.GetString("ProgramStatus"),
                            BinNumber = sqlReader.GetString("BinNumber"),
                            PcnNumber = sqlReader.GetString("PcnNumber"),
                            NeedsByDatePassed = sqlReader.GetString("NeedsByDatePassed"),
                            FillType = sqlReader.GetString("FillType"),
                            ReferralType = sqlReader.GetString("ReferralType"),
                            FillNo = sqlReader.GetString("FillNo"),
                        });
                    }

                    connection.Close();
                }
            }
            return data;
        }
        public List<Program> GetPrograms(string userId, string appId)
        {
            var vlues = new List<Program>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPrograms]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("ApplicationID", appId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new Program
                        {
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Id = sqlReader["Id"] == null ? -1 : int.Parse(sqlReader["Id"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            return vlues.OrderByDescending(v => v.Name).ToList();
        }


        private string GetDetailsAppSpByUserType(string userType, bool isExport)
        {
            if (!isExport && userType.Equals("PROGRAMMGR"))
                return "[analytics].[ProgramReferralsDetailsProgramMgrForApp]";
            if (!isExport && userType.Equals("DISTRICTMGR"))
                return "[analytics].[ProgramReferralsDetailsDistrictMgrForApp]";
            if (!isExport && userType.Equals("SALESREP"))
                return "[analytics].[ProgramReferralsDetailsSalesRepForApp]";

            if (isExport && userType.Equals("PROGRAMMGR"))
                return "[analytics].[ProgramReferralsDetailsProgramMgrForExport]";
            if (isExport && userType.Equals("DISTRICTMGR"))
                return "[analytics].[ProgramReferralsDetailsDistrictMgrForExport]";
            if (isExport && userType.Equals("SALESREP"))
                return "[analytics].[ProgramReferralsDetailsSalesRepForExport]";

            if (!isExport)
                return "[analytics].[ProgramReferralsDetailsProgramMgrForApp]";

            return "[analytics].[ProgramReferralsDetailsProgramMgrForExport]";
        }

    }
}
