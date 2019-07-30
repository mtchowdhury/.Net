using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Models.Admin;

namespace ArmadaReports.Web.Repository.Admin
{
    public class AdminRepository
    {
        private readonly string _connectionString;

        public AdminRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<Program> GetPrograms()
        {
            var vlues = new List<Program>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[admin].[GetPrograms]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
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
            return vlues;
        }

        public List<AdminPanel> GetPanelInfo(int programId)
        {
            var vlues = new List<AdminPanel>();
            var n = 0;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[admin].[GetPanelInfo]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("repotId", 1); // hard coded for now
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new AdminPanel
                        {
                            Name = sqlReader["PanelName"]?.ToString() ?? string.Empty,
                            Id = sqlReader["PanelID"] == null || !int.TryParse(sqlReader["PanelID"].ToString(), out n) ? -1 : int.Parse(sqlReader["PanelID"].ToString()),
                            Order = sqlReader["PanelOrder"] == null || !int.TryParse(sqlReader["PanelOrder"].ToString(), out n) ? -1 : int.Parse(sqlReader["PanelOrder"].ToString()),
                            AllowDistirctMgr = sqlReader.GetBool("AllowDistirctMgr"),
                            AllowProgramMgr = sqlReader.GetBool("AllowProgramMgr"),
                            AllowSalesRep = sqlReader.GetBool("AllowSalesRep")
                        });
                    }

                    connection.Close();
                }
            }
            return vlues.OrderBy(v=>v.Name).ToList();
        }

        public List<AdminDetailsField> GetDetailsFieldInfo(int programId)
        {
            var vlues = new List<AdminDetailsField>();
            var n = 0;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[admin].[GetDetailsFieldlInfo]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new AdminDetailsField
                        {
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Id = sqlReader["ID"] == null || !int.TryParse(sqlReader["ID"].ToString(), out n) ? -1 : int.Parse(sqlReader["ID"].ToString()),
                            Order = sqlReader["Order"] == null || !int.TryParse(sqlReader["Order"].ToString(), out n) ? -1 : int.Parse(sqlReader["Order"].ToString()),
                            CustomName = sqlReader["CustomName"]?.ToString() ?? string.Empty,
                            AllowDistirctMgr = sqlReader.GetBool("AllowDistrictMgr"),
                            AllowProgramMgr = sqlReader.GetBool("AllowProgramMgr"),
                            AllowSalesRep = sqlReader.GetBool("AllowSalesRep")
                        });
                    }

                    connection.Close();
                }
            }
            return vlues.OrderBy(v=>v.Name).ToList();
        }

        public List<AdminReport> GetReportInfo(int programId, string userId)
        {
            var vlues = new List<AdminReport>();
            var n = 0;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[admin].[GetReportInfo]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new AdminReport
                        {
                            Name = String.IsNullOrEmpty(sqlReader.GetString("ParentName")) ? sqlReader.GetString("ReportName") : String.Format("{0} >> {1}", sqlReader.GetString("ParentName"), sqlReader.GetString("ReportName")),
                            Id = sqlReader["ReportId"] == null || !int.TryParse(sqlReader["ReportId"].ToString(), out n) ? -1 : int.Parse(sqlReader["ReportId"].ToString()),
                            Order = sqlReader["ReportOrder"] == null || !int.TryParse(sqlReader["ReportOrder"].ToString(), out n) ? -1 : int.Parse(sqlReader["ReportOrder"].ToString()),
                            AllowDistirctMgr = sqlReader.GetBool("AllowDistirctMgr"),
                            AllowProgramMgr = sqlReader.GetBool("AllowProgramMgr"),
                            AllowSalesRep = sqlReader.GetBool("AllowSalesRep")
                        });
                    }

                    connection.Close();
                }
            }
            return vlues.OrderBy(v => v.Name).ToList();
        }

        public bool SavePanels(List<PanelInsertModel> panels)
        {
            if(panels.Count ==0)
                return false;
            var programId = panels.First().ProgramId;
            var reportId = panels.First().ReportId;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                //var transaction = connection.BeginTransaction();
                try
                {
                    var sqlCmd = new SqlCommand(@"[admin].[DeletePanelsByProgram]", connection);
                    sqlCmd.CommandTimeout = 500;
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("reportId", reportId);
                    sqlCmd.Parameters.AddWithValue("programId", programId);
                    sqlCmd.ExecuteNonQuery();

                    foreach (var panel in panels)
                    {
                        sqlCmd = new SqlCommand(@"[admin].[InsertProgramPanel]", connection);
                        sqlCmd.CommandTimeout = 500;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("userId", panel.UserId);
                        sqlCmd.Parameters.AddWithValue("reportId", panel.ReportId);
                        sqlCmd.Parameters.AddWithValue("programId", panel.ProgramId);
                        sqlCmd.Parameters.AddWithValue("panelId", panel.PanelId);
                        sqlCmd.Parameters.AddWithValue("panelOrder", panel.PanelOrder);
                        sqlCmd.Parameters.AddWithValue("allowDmgr", panel.AllowDmgr);
                        sqlCmd.Parameters.AddWithValue("allowPmgr", panel.AllowPmgr);
                        sqlCmd.Parameters.AddWithValue("allowSrep", panel.AllowSrep);
                        sqlCmd.ExecuteNonQuery();
                    }
                    //transaction.Commit();
                    return true;
                }
                catch
                {
                    //transaction.Rollback();
                    return false;
                }
                finally
                {
                    //transaction.Dispose();
                    connection.Close();
                }
            }
        }

        public bool SaveReports(List<ReportInsertModel> reports, string userType)
        {
            if (reports.Count == 0)
                return false;
            var programId = reports.First().ProgramId;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                try
                {
                    var sqlCmd = new SqlCommand(@"[admin].[DeleteReportsByProgram]", connection);
                    sqlCmd.CommandTimeout = 500;
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("userType", userType);
                    sqlCmd.Parameters.AddWithValue("programId", programId);
                    sqlCmd.ExecuteNonQuery();

                    foreach (var report in reports)
                    {
                        sqlCmd = new SqlCommand(@"[admin].[InsertProgramReport]", connection);
                        sqlCmd.CommandTimeout = 500;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("userId", report.UserId);
                        sqlCmd.Parameters.AddWithValue("reportId", report.ReportId);
                        sqlCmd.Parameters.AddWithValue("programId", report.ProgramId);
                        sqlCmd.Parameters.AddWithValue("reportOrder", report.ReportOrder);
                        sqlCmd.Parameters.AddWithValue("allowDmgr", report.AllowDmgr);
                        sqlCmd.Parameters.AddWithValue("allowPmgr", report.AllowPmgr);
                        sqlCmd.Parameters.AddWithValue("allowSrep", report.AllowSrep);
                        sqlCmd.ExecuteNonQuery();
                    }

                    return true;
                }
                catch(Exception ex)
                {
                    return false;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        public bool SaveFields(List<FieldInsertModel> fields)
        {
            if (fields.Count == 0)
                return false;
            var programId = fields.First().ProgramId;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                //var transaction = connection.BeginTransaction();
                try
                {
                    var sqlCmd = new SqlCommand(@"[admin].[DeleteFieldsByProgram]", connection);
                    sqlCmd.CommandTimeout = 500;
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("programId", programId);
                    sqlCmd.ExecuteNonQuery();

                    foreach (var panel in fields)
                    {
                        sqlCmd = new SqlCommand(@"[admin].[InsertProgramDetailsField]", connection);
                        sqlCmd.CommandTimeout = 500;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.AddWithValue("programId", panel.ProgramId);
                        sqlCmd.Parameters.AddWithValue("fieldId", panel.FieldId);
                        sqlCmd.Parameters.AddWithValue("order", panel.Order);
                        sqlCmd.Parameters.AddWithValue("customName", panel.CustomName);
                        sqlCmd.Parameters.AddWithValue("allowProgramMgr", panel.AllowPmgr);
                        sqlCmd.Parameters.AddWithValue("allowDistrictMgr", panel.AllowDmgr);
                        sqlCmd.Parameters.AddWithValue("allowSalesRep", panel.AllowSrep);
                        sqlCmd.ExecuteNonQuery();
                    }
                    //transaction.Commit();
                    return true;
                }
                catch(Exception ex)
                {
                    //transaction.Rollback();
                    return false;
                }
                finally
                {
                    //transaction.Dispose();
                    connection.Close();
                }
            }
        }

        public bool RefreshPrograms(string userId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[admin].[RefreshPrograms]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("userId", userId);
                    sqlCmd.CommandTimeout = 500;
                    sqlCmd.ExecuteNonQuery();
                }
                return true;

            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}