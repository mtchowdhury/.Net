using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Models.Admin;

namespace ArmadaReports.Web.Repository
{
    public class ConfigRepository
    {
        private readonly string _connectionString;
        public ConfigRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<ProgramPanel> GetPanels(int reportId, int programId, string userId, string userType)
        {
            var vlues = new List<ProgramPanel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetPanels]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ReportID", reportId);
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ProgramPanel
                        {
                            PanelId = sqlReader["PanelID"] == null ? -1 : int.Parse(sqlReader["PanelID"].ToString()),
                            PanelName = sqlReader["PanelName"] == null ? string.Empty : sqlReader["PanelName"].ToString(),
                            PanelOrder = sqlReader["PanelOrder"] == null ? -1 : int.Parse(sqlReader["PanelOrder"].ToString()),
                            PanelSpace = sqlReader["PanelSpace"] == null ? -1 : int.Parse(sqlReader["PanelSpace"].ToString()),
                            IsKaleo = sqlReader["IsKaleo"] != null && bool.Parse(sqlReader["IsKaleo"].ToString()),
                            IsApproved = sqlReader["IsApproaved"] != null && bool.Parse(sqlReader["IsApproaved"].ToString())
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<ReportMenuLink> GetReportMenuLinks(string userId, string userType, int programId)
        {
            var vlues = new List<ReportMenuLink>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetReportMenuLinks]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ReportMenuLink
                        {
                            LinkId = sqlReader.GetInt("ReportId"),
                            LinkName = sqlReader.GetString("ReportName"),
                            ParentId = sqlReader.GetInt("ParentId")
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<DetailsField> GetDetailsField(int programId, string userId)
        {
            var vlues = new List<DetailsField>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetProgramDetailsFieldById]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new DetailsField
                        {
                            Id = sqlReader["ID"] == null ? -1 : int.Parse(sqlReader["ID"].ToString()),
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Order = sqlReader["Order"] == null ? -1 : int.Parse(sqlReader["Order"].ToString()),
                            ForDistrctMgr = sqlReader["ForDistrictMgr"] == null ? true : bool.Parse(sqlReader["ForDistrictMgr"].ToString()),
                            HiddenForPrograms = sqlReader["HiddenForPrograms"]?.ToString() ?? "-1",
                            ProgramId = programId.ToString()
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public void LogPageAccess(string host, string url, string userId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[LogPageAccess]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("host", host);
                sqlCmd.Parameters.AddWithValue("url", url);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                sqlCmd.ExecuteNonQuery();
                connection.Close();
            }
        }

        public bool SaveProgramPreference(string applicationId, string userId, int programId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var sqlCmd = new SqlCommand(@"[config].[SaveProgramPreference]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("applicationId", applicationId);
                    sqlCmd.Parameters.AddWithValue("programId", programId);
                    sqlCmd.Parameters.AddWithValue("userId", userId);
                    sqlCmd.CommandTimeout = 500;
                    connection.Open();
                    sqlCmd.ExecuteNonQuery();
                    connection.Close();
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public string GetProgramPreference(string applicationId, string userId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetProgramPreference]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("applicationId", applicationId);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                var programId = sqlCmd.ExecuteScalar();
                connection.Close();
                return programId == null ? "-1" : programId.ToString();
            }
        }

        public bool CopyProgramPreference(int sourceProgramId, int targetProgramId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    var sqlCmd = new SqlCommand(@"[config].[CopyProgramConfig]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("sourceProgramId", sourceProgramId);
                    sqlCmd.Parameters.AddWithValue("targetProgramId", targetProgramId);
                    sqlCmd.CommandTimeout = 500;
                    connection.Open();
                    var result =sqlCmd.ExecuteScalar();
                    connection.Close();
                    return result.Equals("1");
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public MailConfig GetMailConfig(int programId)
        {
            var vlues = new MailConfig();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetMailConfig]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramId", programId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        vlues = new MailConfig
                        {
                            ProgramId = programId,
                            To = sqlReader["To"]?.ToString() ?? string.Empty,
                            Cc = sqlReader["CC"]?.ToString() ?? string.Empty,
                            Subject = sqlReader["Subject"]?.ToString() ?? string.Empty,
                            Enabled = sqlReader["Enabled"] == null ? true : bool.Parse(sqlReader["Enabled"].ToString()),
                            
                        };
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public KaleoUser CheckKaleo(string userId)
        {
            var vlues = new KaleoUser();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[CheckKaleoUser]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        vlues = new KaleoUser
                        {
                            IsKaleo = sqlReader["IsKaleo"] != null && bool.Parse(sqlReader["IsKaleo"].ToString()),
                            UserType = sqlReader["UserType"] == null ? 0 : int.Parse(sqlReader["UserType"].ToString())
                        };
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public string GetUserEmail(string userId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetUserEmail]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                var email = sqlCmd.ExecuteScalar();
                connection.Close();
                return email?.ToString() ?? "";
            }
        }

        public MenuList GetMenuList(string userType, string role)
        {
            var menus = new List<Menu>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetMnfMenus]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        menus.Add(new Menu
                        {
                            ID = sqlReader.GetInt("ID"),
                            Parent = sqlReader.GetInt("Parent"),
                            Name = sqlReader.GetString("Name"),
                            Link = sqlReader.GetString("Link"),
                            Action = sqlReader.GetString("Action"),
                            IsLink = sqlReader.GetBool("IsLink"),
                            IsHome = sqlReader.GetBool("IsHome"),
                            Role = sqlReader.GetString("RoleAccess"),
                            UserType = sqlReader.GetString("UserTypeAccess"),
                            Level = sqlReader.GetInt("Level"),
                            Order = sqlReader.GetInt("Order")
                        });
                    }

                    connection.Close();
                }
            }

            var home = menus.FirstOrDefault(m => m.IsHome && m.Role.Contains(role) && (m.UserType.Equals("ALL") || m.UserType.Contains(userType)));
            var mainManus = menus.Where(m => m.Level == 0 && m.Role.Contains(role) && (m.UserType.Equals("ALL") || m.UserType.Contains(userType)))
                                 .OrderBy(m => m.Order).ToList();
            mainManus.ForEach(m =>
            {
                var subMenus = menus.Where(sm => sm.Parent == m.ID && sm.Role.Contains(role) && (sm.UserType.Equals("ALL") || sm.UserType.Contains(userType)))
                                 .OrderBy(sm => sm.Order).ToList();
                m.Children = subMenus;
            });

            return new MenuList {Home = home, Menus = menus};
        }

        public bool IsExportDenied(int programId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[IsExportDenied]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                var denied = sqlCmd.ExecuteScalar();
                connection.Close();
                return bool.Parse(denied?.ToString()?? "True");
            }
        }
    }
}