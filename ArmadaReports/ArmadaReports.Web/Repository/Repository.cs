using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Hosting;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Models.Informix;
using ArmadaReports.Web.Models.NetworkCapacity;

namespace ArmadaReports.Web.Repository
{
    public class Repository
    {
        private readonly string _connectionString;

        public Repository(string connectionString)
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

        private int GetProgramCount(string userId)
        {
            var applicationId = ConfigurationManager.AppSettings["ApplicationId"];
            var programs = GetPrograms(userId, applicationId);
            return programs.Count < 1 ? 1 : programs.Count - 1;
        }

        public DateTime GetProgramStartDate(int programId)
        {
            var startdate = new DateTime(1910, 1, 1);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetProgramStartDate]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        startdate = sqlReader["StartDate"] != null && DateTime.TryParse(sqlReader["StartDate"].ToString(), out startdate)
                            ? DateTime.Parse(sqlReader["StartDate"].ToString())
                            : new DateTime(1990, 1, 1);
                    }

                    connection.Close();
                }
            }
            return startdate;
        }

        public List<FilterValue> GetFilterValues(string sp)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(sp, connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new FilterValue
                        {
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Value = sqlReader["Value"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            var newVals = vlues.Take(1).ToList();
            newVals.AddRange(vlues.Skip(1).OrderBy(v => v.Name).ToList());
            return newVals;
        }

        public List<FilterValue> GetFilterValuesWithoutOrdering(string sp, string spId)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(sp, connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                if (!string.IsNullOrEmpty(spId))
                    sqlCmd.Parameters.AddWithValue("Id", spId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new FilterValue
                        {
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Value = sqlReader["Value"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<FilterValue> GetFilterValuesById(string sp, int spid)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(sp, connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("Id", spid);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new FilterValue
                        {
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Value = sqlReader["Value"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            var newVals = vlues.Take(1).ToList();
            newVals.AddRange(vlues.Skip(1).OrderBy(v => v.Name).ToList());
            return newVals;
        }

        public List<FilterValue> GetFilterValuesByStrId(string sp, string spid)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(sp, connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("Id", spid);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new FilterValue
                        {
                            Name = sqlReader["Name"]?.ToString() ?? string.Empty,
                            Value = sqlReader["Value"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            var newVals = vlues.Take(1).ToList();
            newVals.AddRange(vlues.Skip(1).OrderBy(v => v.Name).ToList());
            return newVals;
        }

        public List<FilterValue> GetFilterValuesByParam(string sp, string param)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(sp, connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("param", param);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new FilterValue
                        {
                            Name = sqlReader["Name"].ToString() ?? string.Empty,
                            Value = sqlReader["Value"].ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public string GetProgramName(int programId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetProgramById]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.CommandTimeout = 500;
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
            return vlues.OrderByDescending(v=>v.Name).ToList();
        }

        public List<Pharmacy> GetPharmacies(int programId, string userId)
        {
            var vlues = new List<Pharmacy>();
            vlues.Add(new Pharmacy { Id = -1, Name = "All Pharmacies" });
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPharmacy]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new Pharmacy
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

        public ProgramStatus GetProgramStatus(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, string dateType)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var status = new List<Status>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetCommonProgramsStatus]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 5000;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        status.Add(new Status
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? -1 : double.Parse(sqlReader["TotalCount"].ToString()),
                            NewRxCount = sqlReader["NewRxCount"] == null ? -1 : double.Parse(sqlReader["NewRxCount"].ToString()),
                            RefillCount = sqlReader["RefillCount"] == null ? -1 : double.Parse(sqlReader["RefillCount"].ToString()),
                            ProgramId = sqlReader["ProgramID"] == null ? "" : sqlReader["ProgramID"].ToString(),
                            ProgramStatus = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString()
                        });
                    }

                    connection.Close();
                }
            }
            var revisedStatus = new List<Status>();
            if (programId == -1)
            {
                //var programCount = GetProgramCount(userId);
                //programCount = programCount == 0 ? 1 : programCount;
                var disStatuses = status.Select(s => s.ProgramStatus).Distinct();
                foreach (var sts in disStatuses)
                {
                    var tempStats = status.Where(s => s.ProgramStatus.Equals(sts)).ToList();
                    revisedStatus.Add(new Status
                    {
                        TotalCount = Math.Round(tempStats.Sum(s => s.TotalCount), 0),
                        NewRxCount = Math.Round(tempStats.Sum(s => s.NewRxCount), 0),
                        RefillCount = Math.Round(tempStats.Sum(s => s.RefillCount), 0),
                        ProgramId = programId.ToString(),
                        ProgramStatus = sts
                    });
                }
            }
            else
                revisedStatus = status;

            var programStatus = new ProgramStatus();
            programStatus.RxCount = revisedStatus.Sum(s => s.NewRxCount);
            programStatus.RefillCount = revisedStatus.Sum(s => s.RefillCount);
            programStatus.TotalCount = revisedStatus.Sum(s => s.TotalCount);
            foreach (var s in revisedStatus)
            {
                s.TotalCountPercent = s.TotalCount/programStatus.TotalCount;
            }
            programStatus.Statuses = revisedStatus.Where(x => x.TotalCountPercent > 0 && !x.ProgramStatus.ToLower().Equals("cancelled")).ToList();
            var cancl = revisedStatus.FirstOrDefault(x => x.TotalCountPercent > 0 && x.ProgramStatus.ToLower().Equals("cancelled"));
            if(cancl != null) programStatus.Statuses.Add(cancl);
            programStatus.DateString = DateUtility.GetDateString(dateType);

            revisedStatus = revisedStatus.Where(x => x.TotalCountPercent > 0).ToList();
            var cancelledStatus = revisedStatus.FirstOrDefault(r => r.ProgramStatus.ToLower().Equals("cancelled"));
            var numerator = revisedStatus.Where(r => !r.ProgramStatus.ToLower().Equals("cancelled")).Sum(r => r.TotalCount);
            var ptNumerator = revisedStatus.Where(r => r.ProgramStatus.ToLower().Equals("complete") || r.ProgramStatus.ToLower().Equals("in process - pharmacy")).Sum(r => r.TotalCount);
            var statusStats = new List<StatusStat> {new StatusStat {Column1 = Math.Round(((double)ptNumerator / programStatus.TotalCount)*100, 0) + "%", Column2 = "- Pull-Through Ratio", Type = 0} };
            statusStats.AddRange(revisedStatus.Where(r => !r.ProgramStatus.ToLower().Equals("cancelled")).Select(r=>new StatusStat {Column1 = r.TotalCount.ToString(), Column2 = "- " + r.ProgramStatus, Type = 1}));
            statusStats.Add(new StatusStat { Column1 = numerator.ToString(), Column2 = "- Total", Type = 2 });
            statusStats.Add(cancelledStatus == null ? new StatusStat {Column1 = "0", Column2 = "- Cancelled", Type = 3} : new StatusStat { Column1 = cancelledStatus.TotalCount.ToString(), Column2 = "- Cancelled", Type = 3 });
            programStatus.StatusStats = statusStats;

            //programStatus.Statuses = programStatus.Statuses.OrderBy(s => s.ProgramStatus).ToList();
            return programStatus;
        }

        public ProgramDistricts GetProgramDistricts(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, string dateType, string aspnrxId, string reportsTo, string strength)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var districts = new List<ProgramDistrict>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetProgramDistrictManager]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                //sqlCmd.Parameters.AddWithValue("AspnRxID", aspnrxId);
                if(string.IsNullOrEmpty(reportsTo))
                    sqlCmd.Parameters.AddWithValue("ReportsTo", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("ReportsTo", reportsTo);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("strength", strength);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 50000;                
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        districts.Add(new ProgramDistrict
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? -1 : double.Parse(sqlReader["TotalCount"].ToString()),
                            ProgramId = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                            UserId = sqlReader["ReportsToUserID"] == null ? "" : sqlReader["ReportsToUserID"].ToString(),
                            UserName = sqlReader["ReportsToUserName"] == null ? "" : System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo
                                                                                        .ToTitleCase(sqlReader["ReportsToUserName"].ToString()),
                            DisplayName = sqlReader["DispName"] == null ? "" : System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo
                                                                                        .ToTitleCase(sqlReader["DispName"].ToString())
                        });
                    }

                    connection.Close();
                }
            }
            var revisedDistricts = new List<ProgramDistrict>();
            if (programId == -1)
            {
                //var programCount = GetProgramCount(userId);
                //programCount = programCount == 0 ? 1 : programCount;
                var disDisplayName = districts.Select(s => s.DisplayName).Distinct();
                foreach (var name in disDisplayName)
                {
                    var tempNames = districts.Where(s => s.DisplayName.Equals(name)).ToList();
                    revisedDistricts.Add(new ProgramDistrict
                    {
                        TotalCount = Math.Round(tempNames.Sum(s => s.TotalCount), 0),
                        ProgramId = programId,
                        UserId = tempNames.First().UserId,
                        UserName = tempNames.First().UserName,
                        DisplayName = name
                    });
                }
            }
            else
                revisedDistricts = districts;

            revisedDistricts = revisedDistricts.OrderByDescending(d => d.TotalCount).ToList();
            var programDistricts = new ProgramDistricts();
            programDistricts.TotalCount = revisedDistricts.Sum(s => s.TotalCount);
            foreach (var s in revisedDistricts)
            {
                s.TotalCountPercent = s.TotalCount / programDistricts.TotalCount;
            }
            programDistricts.Districts = revisedDistricts;
            programDistricts.Managers = revisedDistricts.Where(d=>!d.DisplayName.ToLower().Contains("(unknown)")).OrderBy(d=>d.DisplayName).ToList();
            programDistricts.Managers.AddRange(revisedDistricts.Where(d => d.DisplayName.ToLower().Contains("(unknown)")).OrderBy(d => d.DisplayName).ToList());
            programDistricts.DateString = DateUtility.GetDateString(dateType);
            programDistricts.IsDrilldown = false;//!string.IsNullOrEmpty(reportsTo);
            programDistricts.ReportsTo = reportsTo;
            return programDistricts;
        }


        public ProgramDistricts GetProgramSalesRep(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, string dateType, string reportsTo, string strength)
        {
            try
            {
                var dates = DateUtility.GetDates(dateType, programId, _connectionString);
                var districts = new List<ProgramDistrict>();
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    SetArithAbortCommand(connection);
                    var sqlCmd = new SqlCommand(@"[analytics].[GetProgramSalesRepPie]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                    if (string.IsNullOrEmpty(reportsTo))
                        sqlCmd.Parameters.AddWithValue("ReportsTo", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ReportsTo", reportsTo);
                    sqlCmd.Parameters.AddWithValue("UserID", userId);
                    sqlCmd.Parameters.AddWithValue("UserType", userType);
                    sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                    sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                    sqlCmd.Parameters.AddWithValue("strength", strength);
                    sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                    sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                    sqlCmd.CommandTimeout = 500;
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        while (sqlReader.Read())
                        {
                            districts.Add(new ProgramDistrict
                            {
                                TotalCount = sqlReader["TotalCount"] == null ? -1 : double.Parse(sqlReader["TotalCount"].ToString()),
                                ProgramId = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                                UserId = sqlReader["SalesRepUserID"] == null ? "" : sqlReader["SalesRepUserID"].ToString(),
                                UserName = sqlReader["SalesRepUserName"] == null ? "" : System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo
                                                                                        .ToTitleCase(sqlReader["SalesRepUserName"].ToString()),
                                DisplayName = sqlReader["DispName"] == null ? "" : System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo
                                                                                        .ToTitleCase(sqlReader["DispName"].ToString()),
                                ReferralCode = sqlReader["SalesRepReferralCode"] == null ? "" : sqlReader["SalesRepReferralCode"].ToString()
                            });
                        }

                        connection.Close();
                    }
                }
                var revisedDistricts = new List<ProgramDistrict>();
                if (programId == -1)
                {
                    //var programCount = GetProgramCount(userId);
                    //programCount = programCount == 0 ? 1 : programCount;
                    var disDisplayName = districts.Select(s => s.DisplayName).Distinct();
                    foreach (var name in disDisplayName)
                    {
                        var tempNames = districts.Where(s => s.DisplayName.Equals(name)).ToList();
                        revisedDistricts.Add(new ProgramDistrict
                        {
                            TotalCount = Math.Round(tempNames.Sum(s => s.TotalCount), 0),
                            ProgramId = programId,
                            UserId = tempNames.First().UserId,
                            UserName = tempNames.First().UserName,
                            DisplayName = name,
                            ReferralCode = tempNames.First().ReferralCode
                        });
                    }
                }
                else
                    revisedDistricts = districts;

                var programDistricts = new ProgramDistricts();
                programDistricts.TotalCount = revisedDistricts.Sum(s => s.TotalCount);
                foreach (var s in revisedDistricts)
                {
                    s.TotalCountPercent = s.TotalCount / programDistricts.TotalCount;
                }
                programDistricts.Districts = revisedDistricts;
                programDistricts.Managers = revisedDistricts.Where(d => !d.DisplayName.ToLower().Contains("(unknown)")).OrderBy(d => d.DisplayName).ToList();
                programDistricts.Managers.AddRange(revisedDistricts.Where(d => d.DisplayName.ToLower().Contains("(unknown)")).OrderBy(d => d.DisplayName).ToList());
                programDistricts.DateString = DateUtility.GetDateString(dateType);
                programDistricts.IsDrilldown = true;//!string.IsNullOrEmpty(reportsTo);
                programDistricts.ReportsTo = reportsTo;
                return programDistricts;
            }
            catch
            {
                return new ProgramDistricts();
            }
        }


        public List<ProgramDaysToFill> GetDaysToFill(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, int companyId, int priorAuth)
        {
            var programs = new List<ProgramDaysToFill>();
            var dates = DateUtility.GetDates("lastthirtyday", programId, _connectionString);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetCommonProgramsDaysToFill]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                if(companyId == -1)
                    sqlCmd.Parameters.AddWithValue("FillingCompanyID", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("FillingCompanyID", companyId);
                sqlCmd.Parameters.AddWithValue("ExcludeNonWorkDays", true);
                sqlCmd.Parameters.AddWithValue("ExcludeHoliday", true);
                if(priorAuth == -1)
                    sqlCmd.Parameters.AddWithValue("PriorAuth", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("PriorAuth", priorAuth == 1);
                sqlCmd.Parameters.AddWithValue("StartDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        programs.Add(new ProgramDaysToFill
                        {
                            PrescriptionCount = sqlReader["PrescriptionCount"] == null ? -1 : double.Parse(sqlReader["PrescriptionCount"].ToString()),
                            Fill = sqlReader["DaysToFill"] == null ? -1 : double.Parse(sqlReader["DaysToFill"].ToString()),
                            WeightedFill = sqlReader["WeightedDaysToFill"] == null ? -1 : double.Parse(sqlReader["WeightedDaysToFill"].ToString()),
                            Program = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),
                            IsAllPharmacy = companyId == -1
                        });
                    }

                    connection.Close();
                }
            }

            if (programs.Count == 0) return programs;

            var programCount = programId != -1 ? 1 : GetProgramCount(userId);

            var refinedDays = new List<ProgramDaysToFill>();
            var min = (int)programs.Min(p => p.Fill);
            var max = (int)programs.Max(p => p.Fill);
            for (int i = min; i <= max; i++)
            {
                var days = programs.Where(p => (int) p.Fill == i).ToList();
                if (programId == -1)
                {
                    if(days.Count > 0)
                        refinedDays.Add(new ProgramDaysToFill
                        {
                            Program = "All",
                            Fill = i,
                            PrescriptionCount = Math.Round(days.Sum(d => d.PrescriptionCount) / programCount, 0),
                            WeightedFill = Math.Round(days.Sum(d => d.WeightedFill) / programCount, 0),
                            IsAllPharmacy = companyId == -1
                        });
                    else
                        refinedDays.Add(new ProgramDaysToFill
                        {
                            Program = "",
                            Fill = i,
                            IsAllPharmacy = companyId == -1,
                            WeightedFill = 0,
                            PrescriptionCount = 0
                        });
                }
                else
                {
                    if (days.Count == 1) refinedDays.Add(days[0]);
                    else
                        refinedDays.Add(new ProgramDaysToFill
                        {
                            Program = "",
                            Fill = i,
                            IsAllPharmacy = companyId == -1,
                            WeightedFill = 0,
                            PrescriptionCount = 0
                        });
                }
            }

            return refinedDays;
        }

        public List<Workflow> GetWorkflow(string sp, int programId, string userId, string userType, bool isArmadaEmployee)
        {
            var workflows = new List<Workflow>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(sp, connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee); 
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        workflows.Add(new Workflow
                        {
                            Value = sqlReader["ValueNumber"] == null ? -1 : int.Parse(sqlReader["ValueNumber"].ToString()),
                            Caption = sqlReader["Caption"] == null ? "" : sqlReader["Caption"].ToString(),
                            Report = sqlReader["Report"] == null ? "" : sqlReader["Report"].ToString(),
                            Measure = sqlReader["MeasureID"] == null ? -1 : int.Parse(sqlReader["MeasureID"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            return workflows;
        }

        public PharmacyReferrals GetPharmacyReferrals(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, string dateType, bool includeAllStatuses, string referral, string pharmacy)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var referrals = new List<Referrals>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPharmacyReferrals]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.Parameters.AddWithValue("IncludeAllStatuses", includeAllStatuses);
                sqlCmd.Parameters.AddWithValue("Referral", referral);
                sqlCmd.Parameters.AddWithValue("Pharmacy", pharmacy);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        referrals.Add(new Referrals
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? 0 : int.Parse(sqlReader["TotalCount"].ToString()),
                            PharmacyId = sqlReader["FillingPharmacyID"] == null ? -1 : int.Parse(sqlReader["FillingPharmacyID"].ToString()),
                            ProgramId = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                            PharmacyName = sqlReader["FillingPharmacyName"] == null ? "" : sqlReader["FillingPharmacyName"].ToString(),
                            Referral = referral
                        });
                    }

                    connection.Close();
                }
            }
            var revisedReferrals = new List<Referrals>();
            if (programId == -1)
            {
                //var programCount = GetProgramCount(userId);
                //programCount = programCount == 0 ? 1 : programCount;
                var disPharmacies = referrals.Select(s => s.PharmacyId).Distinct();
                foreach (var pId in disPharmacies)
                {
                    var tempReferrals = referrals.Where(s => s.PharmacyId == pId).ToList();
                    revisedReferrals.Add(new Referrals
                    {
                        TotalCount = tempReferrals.Sum(s => s.TotalCount),
                        ProgramId = programId,
                        PharmacyId = pId,
                        PharmacyName = tempReferrals.First().PharmacyName,
                        Referral = referral
                    });
                }
            }
            else
                revisedReferrals = referrals;

            var pharmacyReferrals = new PharmacyReferrals();
            pharmacyReferrals.TotalCount = revisedReferrals.Sum(s => s.TotalCount);
            foreach (var s in revisedReferrals)
            {
                s.TotalCountPercent = (double)s.TotalCount / pharmacyReferrals.TotalCount;
            }
            pharmacyReferrals.Referrals = revisedReferrals.OrderBy(r => r.TotalCount).ToList();
            //pharmacyReferrals.Referrals = revisedReferrals;
            pharmacyReferrals.DateString = DateUtility.GetDateString(dateType);
            return pharmacyReferrals;
        }

        public List<ProgramMap> GetProgramMaps(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, string dateType)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var maps = new List<ProgramMap>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetProgramMap]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        maps.Add(new ProgramMap
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? 0 : int.Parse(sqlReader["TotalCount"].ToString()),
                            State = sqlReader["DoctorState"] == null ? "" : sqlReader["DoctorState"].ToString().Trim(),
                            //R1LLimit = sqlReader["Range1LowerLimit"] == null ? 1 : int.Parse(sqlReader["Range1LowerLimit"].ToString()),
                            //R2LLimit = sqlReader["Range2LowerLimit"] == null ? 1 : int.Parse(sqlReader["Range2LowerLimit"].ToString()),
                            //R3LLimit = sqlReader["Range3LowerLimit"] == null ? 1 : int.Parse(sqlReader["Range3LowerLimit"].ToString()),
                            //R4LLimit = sqlReader["Range4LowerLimit"] == null ? 1 : int.Parse(sqlReader["Range4LowerLimit"].ToString()),
                            //R5LLimit = sqlReader["Range5LowerLimit"] == null ? 1 : int.Parse(sqlReader["Range5LowerLimit"].ToString()),
                            //R6LLimit = sqlReader["Range6LowerLimit"] == null ? 1 : int.Parse(sqlReader["Range6LowerLimit"].ToString()),
                            //R1ULimit = sqlReader["Range1UpperLimit"] == null ? 1 : int.Parse(sqlReader["Range1UpperLimit"].ToString()),
                            //R2ULimit = sqlReader["Range2UpperLimit"] == null ? 1 : int.Parse(sqlReader["Range2UpperLimit"].ToString()),
                            //R3ULimit = sqlReader["Range3UpperLimit"] == null ? 1 : int.Parse(sqlReader["Range3UpperLimit"].ToString()),
                            //R4ULimit = sqlReader["Range4UpperLimit"] == null ? 1 : int.Parse(sqlReader["Range4UpperLimit"].ToString()),
                            //R5ULimit = sqlReader["Range5UpperLimit"] == null ? 1 : int.Parse(sqlReader["Range5UpperLimit"].ToString()),
                            //R6ULimit = sqlReader["Range6UpperLimit"] == null ? 1 : int.Parse(sqlReader["Range6UpperLimit"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            if (maps.Count > 0 && programId == -1)
            {
                var revisedMaps = new List<ProgramMap>();
                var states = maps.Select(m => m.State).Distinct();
                foreach (var state in states)
                {
                    var totalCount = maps.Where(m => m.State.Equals(state)).Sum(m => m.TotalCount);
                    var first = maps.FirstOrDefault(m => m.State.Equals(state));
                    if (first != null)
                    {
                        first.TotalCount = totalCount;
                        revisedMaps.Add(first);
                    }
                }
                maps = revisedMaps;
            }
            if(maps.Count > 0)
            { 
                maps[0].DateString = DateUtility.GetDateString(dateType);
                maps = SetRange(maps);
            }
            Utility.AssignColors(maps);
            return maps;
        }

        public List<ReferralSammary> GetReferralSummaryByWeek(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, bool includeAllStatuses,int insuranceType)
        {
            var cipher = new UserRepository(_connectionString).IsCipherUser(userId);
            var role = new UserRepository(_connectionString).GetRoleByUser(userId);
            var productBridge = string.Empty;
            var thisweek = DateUtility.ThisWeek(DateTime.Today);
            var lastweek = DateUtility.LastWeek(DateTime.Today);
            var twoweek = DateUtility.TwoWeek(DateTime.Today);
            var threeweek = DateUtility.ThreeWeek(DateTime.Today);
            var fourweek = cipher.Equals("1") ? DateUtility.FourWeek(DateTime.Today) : DateUtility.FourOrMoreWeek(DateTime.Today);
            //var fourweek = DateUtility.FourOrMoreWeek(DateTime.Today);
            var ytd = DateUtility.Ytd(DateTime.Today);
            var qtd = DateUtility.Qtd(DateTime.Today);
            var referrals = new List<ReferralSammary>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetReferralSummaryByWeek]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("IncludeAllStatuses", includeAllStatuses);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("ThisWeekStartDate", thisweek.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("ThisWeekEndDate", thisweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("LastWeekStartDate", lastweek.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("LastWeekEndDate", lastweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("TwoWeekStartDate", twoweek.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("TwoWeekEndDate", twoweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("ThreeWeekStartDate", threeweek.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("ThreeWeekEndDate", threeweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("FourWeekStartDate", fourweek.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("FourWeekEndDate", fourweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("YearStartDate", ytd.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("YearEndDate", ytd.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("QtdStartDate", qtd.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("QtdEndDate", qtd.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("InsuranceType", insuranceType);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        var status = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString();
                        //if (role.UserType != null && (role.UserType.Equals("DISTRICTMGR") || role.UserType.Equals("SALESREP") || 
                        //    role.UserType.Equals("SALES REP")) && (programId == 53 || programId == 92) && status.ToLower().Equals("consignment"))
                        //{
                        //    continue;
                        //}
                        var referral = new ReferralSammary
                        {
                            ProgramID = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                            ProgramStatus = status,
                            ProgramName = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),
                            GrandTotalCount = sqlReader["GrandTotalCount"] == null ? -1 : int.Parse(sqlReader["GrandTotalCount"].ToString()),
                            ThisWeekCount = sqlReader["ThisWeekCount"] == null ? -1 : int.Parse(sqlReader["ThisWeekCount"].ToString()),
                            TwoWeekCount = sqlReader["TwoWeeksAgoCount"] == null ? -1 : int.Parse(sqlReader["TwoWeeksAgoCount"].ToString()),
                            ThreeWeekCount = sqlReader["ThreeWeeksAgoCount"] == null ? -1 : int.Parse(sqlReader["ThreeWeeksAgoCount"].ToString()),
                            LastWeekCount = sqlReader["LastWeekCount"] == null ? -1 : int.Parse(sqlReader["LastWeekCount"].ToString()),
                            FourWeekCount = sqlReader["FourMoreWeeksAgoCount"] == null ? -1 : int.Parse(sqlReader["FourMoreWeeksAgoCount"].ToString()),
                            YtdCount = sqlReader["YTDCount"] == null ? -1 : int.Parse(sqlReader["YTDCount"].ToString()),
                            QtdCount = sqlReader["QtdCount"] == null ? -1 : int.Parse(sqlReader["QtdCount"].ToString()),
                        };
                        if (status != "")
                            referral.SubSummary = GetReferralSubSummaryByWeek(programId, status, userId, userType, inpTreatment, isArmadaEmployee, insuranceType);
                        else
                            referral.SubSummary = new List<ReferralSubSummary>();
                        referrals.Add(referral);
                        if (programId == 63 && referral.SubSummary.Count > 0 && !string.IsNullOrEmpty(referral.SubSummary[0].ProductBridge))
                            productBridge = referral.SubSummary[0].ProductBridge;
                    }

                    connection.Close();
                }
            }

            var refinedReferrals = new List<ReferralSammary>();
            var statuses = programId == 62 || programId == 63 || programId == 64 || programId == 83 || programId == 84 || programId == 91 || programId == -1
                ? referrals.Where(r => !r.ProgramStatus.ToLower().Equals("cancelled - copay card"))
                    .Select(r => r.ProgramStatus).Distinct()
                : referrals.Select(r => r.ProgramStatus).Distinct();

            foreach (var status in statuses)
            {
                var sts = status;
                var first = referrals.FirstOrDefault(r => r.ProgramStatus.Equals(sts));
                if(first == null) continue;
                refinedReferrals.Add(new ReferralSammary
                {
                    ProgramID = first.ProgramID,
                    ProgramName = first.ProgramName,
                    ProgramStatus = sts,
                    GrandTotalCount = referrals.Where(r=>r.ProgramStatus.Equals(sts)).Sum(r=>r.GrandTotalCount),
                    ThisWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.ThisWeekCount),
                    TwoWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.TwoWeekCount),
                    ThreeWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.ThreeWeekCount),
                    LastWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.LastWeekCount),
                    FourWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.FourWeekCount),
                    YtdCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.YtdCount),
                    QtdCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.QtdCount),
                    SubSummary = first.SubSummary
                });
            }

            var grandGrandTotal = refinedReferrals.Sum(r => r.GrandTotalCount);
            var thisWeekTotal = refinedReferrals.Sum(r => r.ThisWeekCount);
            var lastWeekTotal = refinedReferrals.Sum(r => r.LastWeekCount);
            var twoWeekTotal = refinedReferrals.Sum(r => r.TwoWeekCount);
            var threeWeekTotal = refinedReferrals.Sum(r => r.ThreeWeekCount);
            var fourWeekTotal = refinedReferrals.Sum(r => r.FourWeekCount);
            var ytdTotal = refinedReferrals.Sum(r => r.YtdCount);
            var qtdTotal = refinedReferrals.Sum(r => r.QtdCount);

            foreach (var referral in refinedReferrals)
            {
                referral.ThisWeekCountPercent = thisWeekTotal == 0 ? 0 : Math.Round((((double)referral.ThisWeekCount / (double)thisWeekTotal) * 100), 0);
                referral.LastWeekCountPercent = lastWeekTotal == 0 ? 0 : Math.Round((((double)referral.LastWeekCount / (double)lastWeekTotal) * 100), 0);
                referral.TwoWeekCountPercent = twoWeekTotal == 0 ? 0 : Math.Round((((double)referral.TwoWeekCount / (double)twoWeekTotal) * 100), 0);
                referral.ThreeWeekCountPercent = threeWeekTotal == 0 ? 0 : Math.Round((((double)referral.ThreeWeekCount / (double)threeWeekTotal) * 100), 0);
                referral.FourWeekCountPercent = fourWeekTotal == 0 ? 0 : Math.Round((((double)referral.FourWeekCount / (double)fourWeekTotal) * 100), 0);
                referral.YtdCountPercent = ytdTotal == 0 ? 0 : Math.Round((((double)referral.YtdCount / (double)ytdTotal) * 100), 0);
                referral.QtdCountPercent = qtdTotal == 0 ? 0 : Math.Round((((double)referral.QtdCount / (double)qtdTotal) * 100), 0);
                referral.GrandTotalCountPercent = grandGrandTotal == 0 ? 0 : Math.Round((((double)referral.GrandTotalCount / (double)grandGrandTotal) * 100), 0);
            }

            refinedReferrals.Add(new ReferralSammary {
                GrandTotalCount = grandGrandTotal, ThisWeekCount = thisWeekTotal, LastWeekCount = lastWeekTotal, TwoWeekCount = twoWeekTotal,
                ThreeWeekCount = threeWeekTotal, FourWeekCount = fourWeekTotal, YtdCount = ytdTotal, QtdCount = qtdTotal ,ProgramStatus = "Grand Total"
            });

            if ((programId == 62 || programId == 63 || programId == 64 || programId == 83 || programId == 84 || programId == 91 || programId == -1) &&
                referrals.Count > 0)
            {
                var ccc = referrals.Where(r => r.ProgramStatus.ToLower().Equals("cancelled - copay card")).ToList();
                if (ccc.Count > 0)
                    refinedReferrals[0].CancelledCopayCard = ccc.First().ProgramStatus + ": " + ccc.Sum(c=>c.GrandTotalCount).ToString("##,###");
            }

            if (programId == 63)
            {
                refinedReferrals[0].ProductBridge = productBridge;
            }

            return refinedReferrals;
        }

        public List<ReferralSubSummary> GetReferralSubSummaryByWeek(int programId, string programStatus, string userId, string userType, string inpTreatment, bool isArmadaEmployee,int insuranceType)
        {
            var cipher = new UserRepository(_connectionString).IsCipherUser(userId);
            var thisweek = DateUtility.ThisWeek(DateTime.Today);
            var lastweek = DateUtility.LastWeek(DateTime.Today);
            var twoweek = DateUtility.TwoWeek(DateTime.Today);
            var threeweek = DateUtility.ThreeWeek(DateTime.Today);
            var fourweek = cipher.Equals("1") ? DateUtility.FourWeek(DateTime.Today) : DateUtility.FourOrMoreWeek(DateTime.Today);
            //var fourweek = DateUtility.FourWeek(DateTime.Today);
            var ytd = DateUtility.Ytd(DateTime.Today);
            var qtd = DateUtility.Qtd(DateTime.Today);
            var referrals = new List<ReferralSubSummary>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetReferralSubSummaryByWeek]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("ProgramStatus", programStatus);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("ThisWeekStartDate", thisweek.Start.ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("ThisWeekEndDate", thisweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("LastWeekStartDate", lastweek.Start.ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("LastWeekEndDate", lastweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("TwoWeekStartDate", twoweek.Start.ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("TwoWeekEndDate", twoweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("ThreeWeekStartDate", threeweek.Start.ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("ThreeWeekEndDate", threeweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("FourWeekStartDate", fourweek.Start.ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("FourWeekEndDate", fourweek.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("YearStartDate", ytd.Start.ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("YearEndDate", ytd.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("QtdStartDate", qtd.Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("QtdEndDate", qtd.End.ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("InsuranceType", insuranceType);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        referrals.Add(new ReferralSubSummary
                        {
                            ProgramID = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                            ProgramStatus = sqlReader["ProgramSubstatus"] == null ? "" : sqlReader["ProgramSubstatus"].ToString(),
                            ProgramName = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),
                            GrandTotalCount = sqlReader["GrandTotalCount"] == null ? -1 : int.Parse(sqlReader["GrandTotalCount"].ToString()),
                            ThisWeekCount = sqlReader["ThisWeekCount"] == null ? -1 : int.Parse(sqlReader["ThisWeekCount"].ToString()),
                            TwoWeekCount = sqlReader["TwoWeeksAgoCount"] == null ? -1 : int.Parse(sqlReader["TwoWeeksAgoCount"].ToString()),
                            ThreeWeekCount = sqlReader["ThreeWeeksAgoCount"] == null ? -1 : int.Parse(sqlReader["ThreeWeeksAgoCount"].ToString()),
                            LastWeekCount = sqlReader["LastWeekCount"] == null ? -1 : int.Parse(sqlReader["LastWeekCount"].ToString()),
                            FourWeekCount = sqlReader["FourMoreWeeksAgoCount"] == null ? -1 : int.Parse(sqlReader["FourMoreWeeksAgoCount"].ToString()),
                            YtdCount = sqlReader["YTDCount"] == null ? -1 : int.Parse(sqlReader["YTDCount"].ToString()),
                            QtdCount = sqlReader["QtdCount"] == null ? -1 : int.Parse(sqlReader["QtdCount"].ToString()),
                        });
                    }
                    connection.Close();
                }
            }

            var refinedReferrals = new List<ReferralSubSummary>();
            var statuses = programId == 63
                ? referrals.Where(r =>!r.ProgramStatus.ToLower().Equals("triaged to network pharmacy - product bridge") &&
                        programStatus.ToLower().Equals("in process - pharmacy")).Select(r => r.ProgramStatus).Distinct()
                : referrals.Select(r => r.ProgramStatus).Distinct();

            foreach (var status in statuses)
            {
                var sts = status;
                var first = referrals.FirstOrDefault(r => r.ProgramStatus.Equals(sts));
                if (first == null) continue;
                refinedReferrals.Add(new ReferralSubSummary
                {
                    ProgramID = first.ProgramID,
                    ProgramName = first.ProgramName,
                    ProgramStatus = sts,
                    GrandTotalCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.GrandTotalCount),
                    ThisWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.ThisWeekCount),
                    TwoWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.TwoWeekCount),
                    ThreeWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.ThreeWeekCount),
                    LastWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.LastWeekCount),
                    FourWeekCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.FourWeekCount),
                    YtdCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.YtdCount),
                    QtdCount = referrals.Where(r => r.ProgramStatus.Equals(sts)).Sum(r => r.QtdCount)
                });
            }

            var grandGrandTotal = refinedReferrals.Sum(r => r.GrandTotalCount);
            var thisWeekTotal = refinedReferrals.Sum(r => r.ThisWeekCount);
            var lastWeekTotal = refinedReferrals.Sum(r => r.LastWeekCount);
            var twoWeekTotal = refinedReferrals.Sum(r => r.TwoWeekCount);
            var threeWeekTotal = refinedReferrals.Sum(r => r.ThreeWeekCount);
            var fourWeekTotal = refinedReferrals.Sum(r => r.FourWeekCount);
            var ytdTotal = refinedReferrals.Sum(r => r.YtdCount);
            var qtdTotal = refinedReferrals.Sum(r => r.QtdCount);

            refinedReferrals.Add(new ReferralSubSummary
            {
                GrandTotalCount = grandGrandTotal,
                ThisWeekCount = thisWeekTotal,
                LastWeekCount = lastWeekTotal,
                TwoWeekCount = twoWeekTotal,
                ThreeWeekCount = threeWeekTotal,
                FourWeekCount = fourWeekTotal,
                YtdCount = ytdTotal,
                QtdCount = qtdTotal,
                ProgramStatus = ""
            });

            if (refinedReferrals.Count > 0 && programId == 63)
            {
                var pb = referrals.FirstOrDefault(r => r.ProgramStatus.ToLower().Equals("triaged to network pharmacy - product bridge") &&
                             programStatus.ToLower().Equals("in process - pharmacy"));
                if (pb != null)
                {
                    refinedReferrals[0].ProductBridge = pb.ProgramStatus + ": " + pb.GrandTotalCount.ToString("##,###");
                }
            }

            return refinedReferrals;
        }



        public DetailsDataConfig GetDetails(int programId, string aspnxId, string programStatus, string programSubStatus, string state, string dateRangeType, string patientLastNameSrcQry, string physicianLastNameSrcQry,
            string dateToUse, int? fillingPharmacyId, int? regranexTubeQty, string reportsTo, int? fillingCompanyId, bool? priorAuth, bool excludeNonWorkDays, string from, string to, bool isArmadaEmployee,
            string userId, string userType, string referralCode, string summarySubStatus, int? daysToFill, string patientState, string patientLastName, string physicianLastName, int? measureId, 
            string inpTreatment, string avgDays, int? insType, string statProc, string authCode, string category, string salesReferral, string insuranceType, 
            string pharmacyReferral, string registry, string onLabel, string source, string timeToProcess, string location, string dateType, string districtManager, 
            string refInProcess, string strength, string consignment, int offset, bool isExport)
        {
            try
            {
                var dates = DateUtility.GetDates(dateRangeType ?? "allreferrals", programId, _connectionString);
                if (measureId == 100)
                {
                    var dts = DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-11), DateTime.Now);
                    dts.RemoveAt(dates.Count - 1);
                    dates = new List<string> { dts.First().ToString("yyyy-MM-dd") + " 00:00:00", dts.Last().ToString("yyyy-MM-dd") + " 23:59:59" };
                }
                var details = new List<Details>();
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    SetArithAbortCommand(connection);
                    var sqlCmd = new SqlCommand(@"[analytics].[ProgramReferralsDetailsV3Offset]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    //if(programId == -1)
                    //    sqlCmd.Parameters.AddWithValue("ProgramID", DBNull.Value);
                    //else
                    sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                    if (aspnxId == null)
                        sqlCmd.Parameters.AddWithValue("AspnRxID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AspnRxID", aspnxId);
                    if (programStatus == null)
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ProgramStatus", programStatus);
                    if (state == null)
                        sqlCmd.Parameters.AddWithValue("State", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("State", state);
                    if (programSubStatus == null)
                        sqlCmd.Parameters.AddWithValue("ProgramSubstatus", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ProgramSubstatus", programSubStatus);
                    sqlCmd.Parameters.AddWithValue("BegDate", from ?? dates[0]);
                    sqlCmd.Parameters.AddWithValue("EndDate", to == null ? dates[1] : to.Contains(" ") ? to : to + " 23:59:59");
                    sqlCmd.Parameters.AddWithValue("PatientLastNameSearchQry", patientLastNameSrcQry);
                    sqlCmd.Parameters.AddWithValue("PhysicianLastNameSearchQry", physicianLastNameSrcQry);
                    sqlCmd.Parameters.AddWithValue("DateToUse", dateToUse);
                    if (fillingPharmacyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingPharmacyID", fillingPharmacyId);
                    if (regranexTubeQty == null)
                        sqlCmd.Parameters.AddWithValue("RegranexTubeQuantity", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("RegranexTubeQuantity", regranexTubeQty);
                    if (reportsTo == null)
                        sqlCmd.Parameters.AddWithValue("ReportsTo", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ReportsTo", reportsTo);
                    if (salesReferral == null)
                        sqlCmd.Parameters.AddWithValue("SalesReferral", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("SalesReferral", salesReferral);
                    if (fillingCompanyId == null)
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("FillingCompanyID", fillingCompanyId);
                    if(priorAuth == null)
                        sqlCmd.Parameters.AddWithValue("PriorAuth", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PriorAuth", priorAuth);
                    sqlCmd.Parameters.AddWithValue("ExcludeNonWorkDays", excludeNonWorkDays);
                    sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", programId == -1 ? false : isArmadaEmployee);
                    sqlCmd.Parameters.AddWithValue("UserID", userId);
                    sqlCmd.Parameters.AddWithValue("UserType", userType);
                    if (referralCode == null)
                        sqlCmd.Parameters.AddWithValue("ReferralCode", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("ReferralCode", referralCode);
                    sqlCmd.Parameters.AddWithValue("SummarySubstatus", "status");
                    if (daysToFill == null)
                        sqlCmd.Parameters.AddWithValue("DaysToFill", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("DaysToFill", daysToFill);
                    if (patientState == null)
                        sqlCmd.Parameters.AddWithValue("PatientState", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PatientState", patientState);
                    if (patientLastName == null)
                        sqlCmd.Parameters.AddWithValue("PatientLastName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PatientLastName", patientLastName);
                    if (physicianLastName == null)
                        sqlCmd.Parameters.AddWithValue("PhysicianLastName", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PhysicianLastName", physicianLastName);
                    if (measureId == null)
                        sqlCmd.Parameters.AddWithValue("MeasureID", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("MeasureID", measureId);
                    sqlCmd.Parameters.AddWithValue("inpTreatment ", inpTreatment);
                    if (avgDays == null)
                        sqlCmd.Parameters.AddWithValue("AvgDays", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AvgDays", avgDays);


                    if (insType == null)
                        sqlCmd.Parameters.AddWithValue("InsType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("InsType", insType);
                    if (statProc == null)
                        sqlCmd.Parameters.AddWithValue("StatProc", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("StatProc", statProc);
                    if (authCode == null)
                        sqlCmd.Parameters.AddWithValue("AuthCode", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("AuthCode", authCode);
                    if (category == null)
                        sqlCmd.Parameters.AddWithValue("Category", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Category", category);
                    if (pharmacyReferral == null)
                        sqlCmd.Parameters.AddWithValue("PharmacyReferral", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("PharmacyReferral", pharmacyReferral);
                    if (registry == null)
                        sqlCmd.Parameters.AddWithValue("Registry", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Registry", registry);
                    if (onLabel == null)
                        sqlCmd.Parameters.AddWithValue("OnLabel", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("OnLabel", onLabel);
                    if (source == null)
                        sqlCmd.Parameters.AddWithValue("Source", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Source", source);
                    if (timeToProcess == null)
                        sqlCmd.Parameters.AddWithValue("TimeToProcess", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("TimeToProcess", timeToProcess);
                    if (location == null)
                        sqlCmd.Parameters.AddWithValue("location", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("location", location);
                    if (dateType == null)
                        sqlCmd.Parameters.AddWithValue("dateType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("dateType", dateType);
                    if (insuranceType == null)
                        sqlCmd.Parameters.AddWithValue("insuranceType", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("insuranceType", insuranceType);
                    if (districtManager == null)
                        sqlCmd.Parameters.AddWithValue("districtManager", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("districtManager", districtManager);
                    if (refInProcess == null)
                        sqlCmd.Parameters.AddWithValue("RefInProcess", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("RefInProcess", refInProcess);
                    if (strength == null || strength == "All")
                        sqlCmd.Parameters.AddWithValue("Strength", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("Strength", strength);
                    if (consignment == null)
                        sqlCmd.Parameters.AddWithValue("consignment", DBNull.Value);
                    else
                        sqlCmd.Parameters.AddWithValue("consignment", consignment);

                    sqlCmd.Parameters.AddWithValue("Offset", offset);
                    sqlCmd.Parameters.AddWithValue("IsExport", isExport);

                    sqlCmd.CommandTimeout = 500;
                    var cp = 0.0;
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        while (sqlReader.Read())
                        {
                            details.Add(new Details
                            {
                                AspnRxId_4_ = sqlReader["AspnRxID"] == null ? "" : sqlReader["AspnRxID"].ToString(),
                                DoctorFlag_70_ = sqlReader["DoctorFlag"] == null ? "" : sqlReader["DoctorFlag"].ToString(),
                                ReferralCode_55_ = sqlReader["ReferralCode"] == null ? "" : sqlReader["ReferralCode"].ToString(),
                                DoctorId = sqlReader["DoctorID"] == null ? "" : sqlReader["DoctorID"].ToString(),
                                ProgramId = sqlReader["ProgramID"] == null ? "" : sqlReader["ProgramID"].ToString(),
                                PrescriptionId = sqlReader["PrescriptionID"] == null ? "" : sqlReader["PrescriptionID"].ToString(),
                                PhysicianFirstName_42_43_ = sqlReader["PhysicianFirstName"] == null ? "" : sqlReader["PhysicianFirstName"].ToString(),
                                PhysicianLastName_42_44_ = sqlReader["PhysicianLastName"] == null ? "" : sqlReader["PhysicianLastName"].ToString(),
                                Address1_1__47_ = sqlReader["Address1"] == null ? "" : sqlReader["Address1"].ToString(),
                                Address2_1_47_ = sqlReader["Address2"] == null ? "" : sqlReader["Address2"].ToString(),
                                City_48_ = sqlReader["City"] == null ? "" : sqlReader["City"].ToString(),
                                State_50_ = sqlReader["State"] == null ? "" : sqlReader["State"].ToString(),
                                PostalCode_51_ = sqlReader["PostalCode"] == null ? "" : sqlReader["PostalCode"].ToString(),
                                Phone = sqlReader["Phone"] == null ? "" : sqlReader["Phone"].ToString(),
                                Npi_34_45_ = sqlReader["NPI"] == null ? "" : sqlReader["NPI"].ToString(),
                                LastFillDate__ = sqlReader["LastFillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["LastFillDate"].ToString(), "MM/dd/yyyy"),
                                InsuranceType_31_ = sqlReader["InsuranceType"] == null ? "" : sqlReader["InsuranceType"].ToString(),
                                InsuranceTypeId = sqlReader["InsuranceTypeId"] == null ? "" : sqlReader["InsuranceTypeId"].ToString(),
                                InsuranceName_38_87_88_ = sqlReader["InsuranceName"] == null ? "" : sqlReader["InsuranceName"].ToString(),
                                BinNumber_7_ = sqlReader["BinNumber"] == null ? "" : sqlReader["BinNumber"].ToString(),
                                PcnNumber = sqlReader["PCNNumber"] == null ? "" : sqlReader["PCNNumber"].ToString(),
                                ReferralDate = sqlReader["ReferralDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReferralDate"].ToString(), "MM/dd/yyyy"),
                                PrescriptionShipDate = sqlReader["PrescriptionShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["PrescriptionShipDate"].ToString(), "MM/dd/yyyy"),
                                DrugName = sqlReader["DrugName"] == null ? "" : sqlReader["DrugName"].ToString(),
                                Strength_76_ = sqlReader["Strength"] == null ? "" : sqlReader["Strength"].ToString(),
                                Refills_58_ = sqlReader["Refills"] == null ? "" : sqlReader["Refills"].ToString(),
                                DaysSupply_17_ = sqlReader["DaysSupply"] == null ? "" : sqlReader["DaysSupply"].ToString(),
                                RegranexTubesFilled_68_ = sqlReader["RegranexTubesFilled"] == null ? "" : sqlReader["RegranexTubesFilled"].ToString(),
                                FillQty_21_ = sqlReader["FillQuantity"] == null ? "" : sqlReader["FillQuantity"].ToString(),
                                OrderQty_35_ = sqlReader["OrderQuantity"] == null ? "" : sqlReader["OrderQuantity"].ToString(),
                                ReferringPharmacyContact = sqlReader["ReferringPharmacyContact"] == null ? "" : sqlReader["ReferringPharmacyContact"].ToString(),
                                ReferralPharmacyEmail = sqlReader["ReferringPharmacyEmail"] == null ? "" : sqlReader["ReferringPharmacyEmail"].ToString(),
                                PrescriptionNumber = sqlReader["PrescriptionNumber"] == null ? "" : sqlReader["PrescriptionNumber"].ToString(),
                                AspnStatus_63_ = sqlReader["AspnStatus"] == null ? "" : sqlReader["AspnStatus"].ToString(),
                                ProgramStatus_53_ = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString(),
                                ProgramSubStatus_65_ = sqlReader["ProgramSubstatus"] == null ? "" : sqlReader["ProgramSubstatus"].ToString(),
                                ReferralType_69_ = sqlReader["ReferralType"] == null ? "" : sqlReader["ReferralType"].ToString(),
                                HubPatientId_27_ = sqlReader["HubPatientID"] == null ? "" : sqlReader["HubPatientID"].ToString(),
                                HubNumber_8_ = sqlReader["HubNumber"] == null ? "" : sqlReader["HubNumber"].ToString(),
                                FinalCopay_24_ = sqlReader["FinalCopay"] != null && double.TryParse(sqlReader["FinalCopay"].ToString(), out cp) ? "$" + double.Parse(sqlReader["FinalCopay"].ToString()).ToString("#,##0.00") : "",
                                Copay_10_ = sqlReader["Copay"] != null && double.TryParse(sqlReader["Copay"].ToString(), out cp) ? "$" + double.Parse(sqlReader["Copay"].ToString()).ToString("#,##0.00") : "",
                                CopayType = sqlReader["CopayType"] == null ? "" : sqlReader["CopayType"].ToString(),
                                CptCode = sqlReader["CPTCode"] == null ? "" : sqlReader["CPTCode"].ToString(),
                                CptCopayType = sqlReader["CPTCopayType"] == null ? "" : sqlReader["CPTCopayType"].ToString(),
                                CopayCardOffered = sqlReader["CopayCardOffered"] == null ? "" : sqlReader["CopayCardOffered"].ToString(),
                                CopayCardUsed = sqlReader["CopayCardUsed"] == null ? "" : sqlReader["CopayCardUsed"].ToString(),
                                CopayInsPctg = sqlReader["CopayInsPctg"] == null ? "" : sqlReader["CopayInsPctg"].ToString(),
                                CptCopayAmount = sqlReader["CPTCopayAmount"] == null ? "" : sqlReader["CPTCopayAmount"].ToString(),
                                CptCopayInsPctg = sqlReader["CPTCopayInsPctg"] == null ? "" : sqlReader["CPTCopayInsPctg"].ToString(),
                                PriorAuthRequired_36_ = sqlReader["PriorAuthRequired"] == null ? "" : sqlReader["PriorAuthRequired"].ToString(),
                                PatientCity = sqlReader["PatientCity"] == null ? "" : sqlReader["PatientCity"].ToString(),
                                PatientState_62_ = sqlReader["PatientState"] == null ? "" : sqlReader["PatientState"].ToString(),
                                PatientId_37_ = sqlReader["PatientID"] == null ? "" : sqlReader["PatientID"].ToString(),
                                PatientZip = sqlReader["PatientZip"] == null ? "" : sqlReader["PatientZip"].ToString(),
                                Pcn_39_ = sqlReader["PCN"] == null ? "" : sqlReader["PCN"].ToString(),
                                GroupId_25_ = sqlReader["GroupID"] == null ? "" : sqlReader["GroupID"].ToString(),
                                CreatedDate_16_ = sqlReader["CreateDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CreateDate"].ToString(), "MM/dd/yyyy"),
                                ReceiveDate = sqlReader["ReceiveDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceiveDate"].ToString(), "MM/dd/yyyy"),
                                ModifyDate = sqlReader["ModifyDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ModifyDate"].ToString(), "MM/dd/yyyy"),
                                AssignDate_5_ = sqlReader["AssignDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AssignDate"].ToString(), "MM/dd/yyyy"),
                                AcceptDate = sqlReader["AcceptDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AcceptDate"].ToString(), "MM/dd/yyyy"),
                                CompleteDate = sqlReader["CompleteDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CompleteDate"].ToString(), "MM/dd/yyyy"),
                                CancelDate = sqlReader["CancelDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CancelDate"].ToString(), "MM/dd/yyyy"),
                                ShipDate_61_ = sqlReader["ShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ShipDate"].ToString(), "MM/dd/yyyy"),
                                FillDate_20_ = sqlReader["FillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["FillDate"].ToString(), "MM/dd/yyyy"),
                                CreatedUserName = sqlReader["CreateUserName"] == null ? "" : sqlReader["CreateUserName"].ToString(),
                                ModifyUserName = sqlReader["ModifyUserName"] == null ? "" : sqlReader["ModifyUserName"].ToString(),
                                AssignUserName = sqlReader["AssignUserName"] == null ? "" : sqlReader["AssignUserName"].ToString(),
                                AcceptUserName = sqlReader["AcceptUserName"] == null ? "" : sqlReader["AcceptUserName"].ToString(),
                                CompleteUserName = sqlReader["CompleteUserName"] == null ? "" : sqlReader["CompleteUserName"].ToString(),
                                CancelUserName = sqlReader["CancelUserName"] == null ? "" : sqlReader["CancelUserName"].ToString(),
                                ProgramName_52_ = sqlReader["ProgramName"] == null ? "" : sqlReader["ProgramName"].ToString(),
                                DaysToFill_19_ = sqlReader["DaysToFill"] == null ? "" : sqlReader["DaysToFill"].ToString(),
                                ReferrerName_60_ = sqlReader["ReferrerName"] == null ? "" : sqlReader["ReferrerName"].ToString(),
                                ReportsToName_59_ = sqlReader["ReportsToName"] == null ? "" : sqlReader["ReportsToName"].ToString(),
                                StepTherapy_64_ = sqlReader["StepTherapy"] == null ? "" : sqlReader["StepTherapy"].ToString(),
                                TrialCard_67_46_ = sqlReader["TrialCard"] == null ? "" : sqlReader["TrialCard"].ToString(),
                                Indicator_66_ = sqlReader["Indicator"] == null ? "" : sqlReader["Indicator"].ToString(),
                                Icd10Code_28_ = sqlReader["ICD10Code"] == null ? "" : sqlReader["ICD10Code"].ToString(),
                                Icd10LongDesc_29_ = sqlReader["ICD10LongDesc"] == null ? "" : sqlReader["ICD10LongDesc"].ToString(),
                                Nabp_23_ = sqlReader["NABP"] == null ? "" : sqlReader["NABP"].ToString(),
                                InNetwork_30_ = sqlReader["InNetwork"] == null ? "" : sqlReader["InNetwork"].ToString(),
                                CopayCardActivation_11_ = sqlReader["CopayCardActivation"] == null ? "" : sqlReader["CopayCardActivation"].ToString(),
                                CopayCardNumber_14_ = sqlReader["CopayCardNumber"] == null ? "" : sqlReader["CopayCardNumber"].ToString(),
                                CopayCardGroupId_13_ = sqlReader["CopayCardGroupID"] == null ? "" : sqlReader["CopayCardGroupID"].ToString(),
                                CopayCardBin_12_ = sqlReader["CopayCardBIN"] == null ? "" : sqlReader["CopayCardBIN"].ToString(),
                                CopayCardPcn_15_ = sqlReader["CopayCardPCN"] == null ? "" : sqlReader["CopayCardPCN"].ToString(),
                                ReceivedOnDate_54_ = sqlReader["ReceivedOnDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceivedOnDate"].ToString(), "MM/dd/yyyy"),
                                Specialty_49_ = sqlReader["Specialty"] == null ? "" : sqlReader["Specialty"].ToString(),
                                RefillCalcDate_57_ = sqlReader["RefillCalcDate"] == null ? "" : DateUtility.FormatDate(sqlReader["RefillCalcDate"].ToString(), "MM/dd/yyyy"),
                                RefillCount_56_ = sqlReader["RefillCount"] == null ? "" : sqlReader["RefillCount"].ToString(),
                                RxAutoFill_6_ = sqlReader["RxAutoFill"] == null ? "" : sqlReader["RxAutoFill"].ToString(),
                                Category = sqlReader["Category"] == null ? "" : sqlReader["Category"].ToString(),
                                AuthCode_32_ = sqlReader["AuthCode"] == null ? "" : sqlReader["AuthCode"].ToString(),
                                ProdForm = sqlReader["ProdForm"] == null ? "" : sqlReader["ProdForm"].ToString(),
                                ShipQty = sqlReader["ShipQty"] == null ? "" : sqlReader["ShipQty"].ToString(),
                                DispenseDate = sqlReader["DispenseDate"] == null ? "" : DateUtility.FormatDate(sqlReader["DispenseDate"].ToString(), "MM/dd/yyyy"),
                                NcpDp_82_ = sqlReader["NCPDP"] == null ? "" : sqlReader["NCPDP"].ToString(),
                                PharmacyAddress1 = sqlReader["PharmacyAddress1"] == null ? "" : sqlReader["PharmacyAddress1"].ToString(),
                                PharmacyCity = sqlReader["PharmacyCity"] == null ? "" : sqlReader["PharmacyCity"].ToString(),
                                PharmacyState = sqlReader["PharamcyState"] == null ? "" : sqlReader["PharamcyState"].ToString(),
                                PharmacyZip = sqlReader["PharamacyZip"] == null ? "" : sqlReader["PharamacyZip"].ToString(),
                                FillingPharmacyName_22_ = sqlReader["FillingPharmacyName"] == null ? "" : sqlReader["FillingPharmacyName"].ToString(),
                                HasNoMemberName = sqlReader["HasNonMemberName"] == null ? "" : sqlReader["HasNonMemberName"].ToString(),
                                NDC_33_ = sqlReader["NDC"] == null ? "" : sqlReader["NDC"].ToString(),
                                PdrpFlag_40_ = sqlReader["PDRPFlag"] == null ? "" : sqlReader["PDRPFlag"].ToString(),
                                PharmacyNpi_41_ = sqlReader["PharmacyNPI"] == null ? "" : sqlReader["PharmacyNPI"].ToString(),
                                TriageLite_74_ = sqlReader["TriageLite"] == null ? "" : sqlReader["TriageLite"].ToString(),
                                Source_75_ = sqlReader["Source"] == null ? "" : sqlReader["Source"].ToString(),
                                ReportToId = sqlReader["ReportsToId"] == null ? "" : sqlReader["ReportsToId"].ToString(),
                                SalesReferralId = sqlReader["ReferrerId"] == null ? "" : sqlReader["ReferrerId"].ToString(),
                                RxNumber_77_ = sqlReader["RxNumber"] == null ? "" : sqlReader["RxNumber"].ToString(),
                                MrnNumber_78_ = sqlReader["MrnNumber"] == null ? "" : sqlReader["MrnNumber"].ToString(),
                                HomeHealthAgency_80_ = sqlReader["HomeHealthAgency"] == null ? "" : sqlReader["HomeHealthAgency"].ToString(),
                                DistrictManager_81_ = sqlReader["ReportsToName"] == null ? "" : sqlReader["ReportsToName"].ToString(),
                                AfrezzaASPNID_83_ = sqlReader["AfrezzaASPNID"] == null ? "" : sqlReader["AfrezzaASPNID"].ToString(),
                                RegistryPatient_85_ = sqlReader["RegistryPatient"] == null ? "" : sqlReader["RegistryPatient"].ToString(),
                                OnLabel_86_ = sqlReader["OnLabel"] == null ? "" : sqlReader["OnLabel"].ToString(),
                                MedicalInsurancePlan_89_ = sqlReader["MedicalInsurancePlan"] == null ? "" : sqlReader["MedicalInsurancePlan"].ToString(),
                                CoverageType_90_ = sqlReader["CoverageType"] == null ? "" : sqlReader["CoverageType"].ToString(),
                                DaysToProcess_91_ = sqlReader["DaysToProcess"] == null ? "" : sqlReader["DaysToProcess"].ToString(),
                                Category_92_ = sqlReader["LNoteCategory"] == null ? "" : sqlReader["LNoteCategory"].ToString(),
                                Subcategory_93_ = sqlReader["LNoteSubCategory"] == null ? "" : sqlReader["LNoteSubCategory"].ToString(),
                                TimetoFill_94_ = sqlReader["TimetoFill"] == null ? "" : sqlReader["TimetoFill"].ToString(),
                                TimetoShip_95_ = sqlReader["TimetoShip"] == null ? "" : sqlReader["TimetoShip"].ToString(),
                                IndicationClass_96_ = sqlReader["IndicationClass"] == null ? "" : sqlReader["IndicationClass"].ToString(),
                                OriginalAspnId_97_ = sqlReader["OriginalAspnId"] == null ? "" : sqlReader["OriginalAspnId"].ToString(),
                                GprSite_98_ = sqlReader["GprSite"] == null ? "" : sqlReader["GprSite"].ToString(),
                                BridgeProgram_99_ = sqlReader["BridgeProgram"] == null ? "" : sqlReader["BridgeProgram"].ToString(),
                                ExternalPatientID_100_ = sqlReader["ExternalPatientID"] == null ? "" : sqlReader["ExternalPatientID"].ToString(),
                                PAAppealRequired_101_ = sqlReader["PAAppealRequired"] == null ? "" : sqlReader["PAAppealRequired"].ToString(),
                                VoucherFlag_102_ = sqlReader["VoucherFlag"] == null ? "" : sqlReader["VoucherFlag"].ToString(),
                                RefillNumber_103_ = sqlReader["RefillNumber"] == null ? "" : sqlReader["RefillNumber"].ToString(),
                                BenefitTypeUsed_104_ = sqlReader["BenefitTypeUsed"] == null ? "" : sqlReader["BenefitTypeUsed"].ToString(),
                                PatientConsentName_105_ = sqlReader["PatientConsentName"] == null ? "" : sqlReader["PatientConsentName"].ToString(),
                                PatientConsentDOB_106_ = sqlReader["PatientConsentDOB"] == null ? "" : DateUtility.FormatDate(sqlReader["PatientConsentDOB"].ToString(), "MM/dd/yyyy"),
                                CurrentStatusDate_107_ = sqlReader["CurrentStatusDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CurrentStatusDate"].ToString(), "MM/dd/yyyy"),
                                BVOutcome_108_ = sqlReader["BVOutcome"] == null ? "" : DateUtility.FormatDate(sqlReader["BVOutcome"].ToString(), "MM/dd/yyyy"),
                                PharmacyInsurancePlan = sqlReader["PharmacyInsurancePlan"] == null ? "" : sqlReader["PharmacyInsurancePlan"].ToString(),
                                SecondaryMedicalInsurance_84_ = sqlReader["SecondaryMedicalInsuranceName"] == null ? "" : sqlReader["SecondaryMedicalInsuranceName"].ToString(),
                                PrimaryMedicalInsurance_79_ = sqlReader["MedicalInsuranceName"] == null ? "" : sqlReader["MedicalInsuranceName"].ToString(),
                                LastFillDatePopup = sqlReader["LastFillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["LastFillDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                ReferralDatePopup = sqlReader["ReferralDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReferralDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                PrescriptionShipDatePopup = sqlReader["PrescriptionShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["PrescriptionShipDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                CreatedDatePopup = sqlReader["CreateDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CreateDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                ReceiveDatePopup = sqlReader["ReceiveDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceiveDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                ModifyDatePopup = sqlReader["ModifyDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ModifyDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                AssignDatePopup = sqlReader["AssignDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AssignDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                AcceptDatePopup = sqlReader["AcceptDate"] == null ? "" : DateUtility.FormatDate(sqlReader["AcceptDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                CompleteDatePopup = sqlReader["CompleteDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CompleteDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                CancelDatePopup = sqlReader["CancelDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CancelDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                ShipDatePopup = sqlReader["ShipDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ShipDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                FillDatePopup = sqlReader["FillDate"] == null ? "" : DateUtility.FormatDate(sqlReader["FillDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                ReceivedOnDatePopup = sqlReader["ReceivedOnDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReceivedOnDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                RefillCalcDatePopup = sqlReader["RefillCalcDate"] == null ? "" : DateUtility.FormatDate(sqlReader["RefillCalcDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                                DispenseDatePopup = sqlReader["DispenseDate"] == null ? "" : DateUtility.FormatDate(sqlReader["DispenseDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt")
                            });
                        }

                        connection.Close();
                    }
                }
                var config = new ConfigRepository(_connectionString).GetDetailsField(programId, userId);
                var dataConfig = new DetailsDataConfig {Config = config, Data = details};
                File.AppendAllText(HostingEnvironment.ApplicationPhysicalPath + "\\details_report.txt", Environment.NewLine + "---------------------------------------------------" + Environment.NewLine +
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " - Success: " + "Report created successfully" + Environment.NewLine);
                return dataConfig;
            }
            catch (Exception exception)
            {
                File.AppendAllText(HostingEnvironment.ApplicationPhysicalPath + "\\details_report.txt", Environment.NewLine + "---------------------------------------------------" + Environment.NewLine + 
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " - Error: " + exception.Message + Environment.NewLine);
                return new DetailsDataConfig() { Config = new List<DetailsField>(), Data = new List<Details>()};
            }
        }

        public List<AspnNote> GetAspnNotes(int aspnrxId, string userId, string userType, bool isArmadaEmployee)
        {
            var vlues = new List<AspnNote>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetAspnNotes]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("AspnRxID", aspnrxId);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new AspnNote
                        {
                            Id = sqlReader["AspnRxNotesID"]?.ToString() ?? string.Empty,
                            CreatedBy = sqlReader["CreatedBy"]?.ToString() ?? string.Empty,
                            CreatedOn = sqlReader["CreatedOn"] == null ? "" : DateUtility.FormatDate(sqlReader["CreatedOn"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                            ModifiedBy = sqlReader["ModifiedBy"]?.ToString() ?? string.Empty,
                            ModifiedOn = sqlReader["ModifiedOn"] == null ? "" : DateUtility.FormatDate(sqlReader["ModifiedOn"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                            PharmacyId = sqlReader["PharmacyID"]?.ToString() ?? string.Empty,
                            UserName = sqlReader["CreateUserName"]?.ToString() ?? string.Empty,
                            Category = sqlReader["Category"]?.ToString() ?? string.Empty,
                            AspnrxId = sqlReader["AspnRxID"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<AspnHistory> GetAspnHistory(int aspnrxId, string userId, string userType, int programId, string uiSearch)
        {
            var vlues = new List<AspnHistory>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetAspnHistory]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("AspnRxID", aspnrxId);
                sqlCmd.Parameters.AddWithValue("ProgramId", programId);
                sqlCmd.Parameters.AddWithValue("UiSearch", uiSearch);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new AspnHistory
                        {
                            Status = sqlReader["Status"]?.ToString() ?? string.Empty,
                            CreateDate = sqlReader["CreateDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CreateDate"].ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                            CreateUserName = sqlReader["CreateUserName"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<StatusNotes> GetAspnStatusNotes(int aspnrxId, string userId, string userType, int programId, string uiSearch, bool isArmadaEmployee)
        {
            var vlues = new List<StatusNotes>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetAspnNoteStatusHistory]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("AspnRxID", aspnrxId);
                sqlCmd.Parameters.AddWithValue("ProgramId", programId);
                sqlCmd.Parameters.AddWithValue("UiSearch", uiSearch);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new StatusNotes
                        {
                            StatusNote = sqlReader["CombinedText"]?.ToString() ?? string.Empty,
                            ChangedBy = sqlReader["CombinedUserName"]?.ToString() ?? string.Empty,
                            ChangedOn = sqlReader["CombinedDate"] == null ? "" : DateUtility.FormatDate(sqlReader["CombinedDate"]?.ToString(), "MM/dd/yyyy hh:mm:ss tt"),
                            Source = sqlReader["CombinedSource"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public TubesFilled GetProgramTubesFilled(int programId, string userId, string userType, bool isArmadaEmployee, string dateType)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var tubes = new List<Tube>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetProgramsTubesFilled]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        tubes.Add(new Tube
                        {
                            TubeQty = sqlReader["TubesQuantity"] == null ? -1 : int.Parse(sqlReader["TubesQuantity"].ToString()),
                            TubeQtyCount = sqlReader["TubesQuantityCount"] == null ? -1 : int.Parse(sqlReader["TubesQuantityCount"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            var revisedTubes = new List<Tube>();
            if (programId == -1)
            {
                //var programCount = GetProgramCount(userId);
                //programCount = programCount == 0 ? 1 : programCount;
                var disTubes = tubes.Select(s => s.TubeQty).Distinct();
                foreach (var tube in disTubes)
                {
                    var tempStats = tubes.Where(s => s.TubeQty.Equals(tube)).ToList();
                    revisedTubes.Add(new Tube
                    {
                        TubeQtyCount = tempStats.Sum(s => s.TubeQtyCount),
                        TubeQty = tube
                    });
                }
            }
            else
                revisedTubes = tubes;

            var tubesFilled = new TubesFilled();
            tubesFilled.Tubes = revisedTubes;
            tubesFilled.TotalCount = revisedTubes.Sum(s => s.TubeQtyCount);
            tubesFilled.DateString = DateUtility.GetDateString(dateType);
            return tubesFilled;
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
                sqlCmd.CommandTimeout = 500;
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
                foreach (var sale in salesAnalysis.Where(s=>s.DistrictManagerId == m))
                {
                    sale.PercentageDistrict = Math.Round(((double) sale.TotalCount/mTotal)*100, 2);
                    sale.AvgPerRep = Math.Round(((double)mTotal/mCount), 0);
                    revisedSalesAnalysis.Add(new SalesAnalysis
                    {
                        ProgramId = sale.ProgramId, TotalCount = sale.TotalCount, AvgPerRep = sale.AvgPerRep, DistrictManagerId = sale.DistrictManagerId,
                        DistrictManagerName = sale.DistrictManagerName, PercentageDistrict = sale.PercentageDistrict, RegionName = sale.RegionName, PercentageTotal = sale.PercentageTotal,
                        Referrals = sale.Referrals, SalesRepAreaName = sale.SalesRepAreaName, SalesRepId = sale.SalesRepId, SalesRepName = sale.SalesRepName
                    });
                }
                revisedSalesAnalysis.Add(new SalesAnalysis
                {
                    RegionName = "Total for " + districtManagerName, TotalCount = mTotal, PercentageDistrict = 100.00, DistrictManagerId = "-1000",
                    PercentageTotal = Math.Round(salesAnalysis.Where(s => s.DistrictManagerId == m).Sum(s => s.PercentageTotal), 2), AvgPerRep = Math.Round(((double)mTotal / mCount), 0)
                });
                revisedSalesAnalysis.Add(new SalesAnalysis {DistrictManagerId = "-5000"});
            }
            
            return revisedSalesAnalysis;
        }

        public UniquePatientList GetUniquePatients(int programId, string userId, string userType, bool isArmadaEmployee)
        {
            var vlues = new List<UniquePatient>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetPAUniquePatientAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("ProgramId", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new UniquePatient
                        {
                            ChartDate = sqlReader.GetFormattedDateString("ChartDate"),
                            MonthName = sqlReader["MonthName"]?.ToString() ?? string.Empty,
                            Year = sqlReader["Year"] == null ? -1 : int.Parse(sqlReader["Year"].ToString()),
                            Month = sqlReader["Month"] == null ? -1 : int.Parse(sqlReader["Month"].ToString()),
                            Day = sqlReader["Day"] == null ? -1 : int.Parse(sqlReader["Day"].ToString()),
                            ChartEndDate = sqlReader["ChartEndDay"] == null ? -1 : int.Parse(sqlReader["ChartEndDay"].ToString()),
                            PatientCount = sqlReader["PatientCount"] == null ? -1 : int.Parse(sqlReader["PatientCount"].ToString()),
                            EndDate = new DateTime(sqlReader["Year"] == null ? 2100 : int.Parse(sqlReader["Year"].ToString()), sqlReader["Month"] == null ? 1 : int.Parse(sqlReader["Month"].ToString()), 
                                        sqlReader["ChartEndDay"] == null ? 30 : int.Parse(sqlReader["ChartEndDay"].ToString())).ToString("yyyy-MM-dd")
                        });
                    }

                    connection.Close();
                }
            }

            var uniqueList = new UniquePatientList();
            var years = vlues.Select(u => u.Year).Distinct().ToList();
            if (years.Count > 0)
                uniqueList.Current = vlues.Where(u => u.Year == years[0]).ToList();
            else
                uniqueList.Current = new List<UniquePatient>();
            if (years.Count > 1)
                uniqueList.Previous = vlues.Where(u => u.Year == years[1]).ToList();
            else
                uniqueList.Previous = new List<UniquePatient>();

            uniqueList.BegDate = DateUtility.LastYear(DateTime.Today).Start.ToString("yyyy-MM-dd");
            uniqueList.EndDate = DateTime.Today.ToString("yyyy-MM-dd");
            return uniqueList;
        }

        public OrderAnalysisList GetOrderAnalysis(int programId, string userId, string userType, bool isArmadaEmployee)
        {
            var vlues = new List<OrderAnalysis>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetPAOrderAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("ProgramId", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new OrderAnalysis
                        {
                            CreatedOnDate = sqlReader["CreatedOnEndDate"]?.ToString() ?? string.Empty,
                            EnrollmentDate = sqlReader["EnrollmentDate"] == null ? "" : Convert.ToDateTime(sqlReader["EnrollmentDate"].ToString()).ToString("MMMM") + ", " + Convert.ToDateTime(sqlReader["EnrollmentDate"].ToString()).Year,
                            ShipEndDate = sqlReader["ShipEndDate"]?.ToString() ?? string.Empty,
                            MonthName = sqlReader["MonthName"]?.ToString() ?? string.Empty,
                            Year = sqlReader["Year"] == null ? -1 : int.Parse(sqlReader["Year"].ToString()),
                            Month = sqlReader["Month"] == null ? -1 : int.Parse(sqlReader["Month"].ToString()),
                            Day = sqlReader["Day"] == null ? -1 : int.Parse(sqlReader["Day"].ToString()),
                            PrescriptionCount = sqlReader["PrescriptionCount"] == null ? -1 : int.Parse(sqlReader["PrescriptionCount"].ToString()),
                            BegDate = DateUtility.GetFirstDate(sqlReader["Month"] == null ? 1 : int.Parse(sqlReader["Month"].ToString()), 
                                        sqlReader["Year"] == null ? 1 : int.Parse(sqlReader["Year"].ToString()))
                        });
                    }

                    connection.Close();
                }
            }

            var uniqueList = new OrderAnalysisList();
            var years = vlues.Select(u => u.Year).Distinct().ToList();
            uniqueList.Current = years.Count > 0 ? vlues.Where(u => u.Year == years[0]).ToList() : new List<OrderAnalysis>();
            uniqueList.Previous = years.Count > 1 ? vlues.Where(u => u.Year == years[1]).ToList() : new List<OrderAnalysis>();

            uniqueList.BegDate = DateUtility.LastYear(DateTime.Today).Start.ToString("yyyy-MM-dd");
            uniqueList.EndDate = DateTime.Today.ToString("yyyy-MM-dd");

            return uniqueList;
        }

        public List<RankAndAddress> GetRandAndAddress(int programId, string userId, string userType, string dateType, bool isArmadaEmployee)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var rnas = new List<RankAndAddress>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPAPractitionerRandAndAddress]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        rnas.Add(new RankAndAddress
                        {
                            PrescriptionCount = sqlReader["PrescriptionCount"] == null ? -1 : int.Parse(sqlReader["PrescriptionCount"].ToString()),
                            PatientCount = sqlReader["PatientCount"] == null ? -1 : int.Parse(sqlReader["PatientCount"].ToString()),
                            DoctorId = sqlReader["DoctorID"] == null ? "" : sqlReader["DoctorID"].ToString(),
                            Practitioner = sqlReader["Practitioner"] == null ? "" : sqlReader["Practitioner"].ToString(),
                            Address1 = sqlReader["Address1"] == null ? "" : sqlReader["Address1"].ToString(),
                            ProductName = sqlReader["ProductName"] == null ? "" : sqlReader["ProductName"].ToString(),
                            City = sqlReader["City"] == null ? "" : sqlReader["City"].ToString(),
                            State = sqlReader["State"] == null ? "" : sqlReader["State"].ToString(),
                            PostalCode = sqlReader["PostalCode"] == null ? "" : sqlReader["PostalCode"].ToString(),
                            Dea = sqlReader["DEA"] == null ? "" : sqlReader["DEA"].ToString(),
                            Ndc = sqlReader["NDC"] == null ? "" : sqlReader["NDC"].ToString(),
                            ShipDate = sqlReader["ShipDate"] == null ? "" : sqlReader["ShipDate"].ToString(),
                            LicenseNumber = sqlReader["StateLicenseNumber"] == null ? "" : sqlReader["StateLicenseNumber"].ToString()
                        });
                    }

                    connection.Close();
                }
            }
            return rnas;
        }


        public ProgramStatus GetPAProgramStatus(int programId, string userId, string userType, bool isArmadaEmployee, string dateType)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var status = new List<Status>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPAProgramsStatus]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        status.Add(new Status
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? -1 : double.Parse(sqlReader["TotalCount"].ToString()),
                            ProgramId = sqlReader["ProgramID"] == null ? "" : sqlReader["ProgramID"].ToString(),
                            ProgramStatus = sqlReader["ProgramStatus"] == null ? "" : sqlReader["ProgramStatus"].ToString()
                        });
                    }

                    connection.Close();
                }
            }
            var revisedStatus = new List<Status>();
            if (programId == -1)
            {
                //var programCount = GetProgramCount(userId);
                //programCount = programCount == 0 ? 1 : programCount;
                var disStatuses = status.Select(s => s.ProgramStatus).Distinct();
                foreach (var sts in disStatuses)
                {
                    var tempStats = status.Where(s => s.ProgramStatus.Equals(sts)).ToList();
                    revisedStatus.Add(new Status
                    {
                        TotalCount = Math.Round(tempStats.Sum(s => s.TotalCount), 0),
                        ProgramId = programId.ToString(),
                        ProgramStatus = sts
                    });
                }
            }
            else
                revisedStatus = status;

            var programStatus = new ProgramStatus();
            programStatus.TotalCount = revisedStatus.Sum(s => s.TotalCount);
            foreach (var s in revisedStatus)
            {
                s.TotalCountPercent = s.TotalCount / programStatus.TotalCount;
            }
            programStatus.Statuses = revisedStatus;
            programStatus.DateString = DateUtility.GetDateString(dateType);
            return programStatus;
        }

        public List<PAProgramMap> GetPAProgramMaps(int programId, string userId, string userType, bool isArmadaEmployee, string dateType)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var maps = new List<PAProgramMap>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetPAProgramMap]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        maps.Add(new PAProgramMap
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? -1 : int.Parse(sqlReader["TotalCount"].ToString()),
                            InProcess = sqlReader["InProcess"] == null ? -1 : int.Parse(sqlReader["InProcess"].ToString()),
                            Approved = sqlReader["Approved"] == null ? -1 : int.Parse(sqlReader["Approved"].ToString()),
                            Denied = sqlReader["Denied"] == null ? -1 : int.Parse(sqlReader["Denied"].ToString()),
                            InProcessPercent = sqlReader["InProcessPercent"] == null ? -1 : double.Parse(sqlReader["InProcessPercent"].ToString()),
                            ApprovedPercent = sqlReader["ApprovedPercent"] == null ? -1 : double.Parse(sqlReader["ApprovedPercent"].ToString()),
                            DeniedPercent = sqlReader["DeniedPercent"] == null ? -1 : double.Parse(sqlReader["DeniedPercent"].ToString()),
                            State = sqlReader["StateName"] == null ? "" : sqlReader["StateName"].ToString().Trim(),
                            //R1LLimit = sqlReader["Range1LowerLimit"] == null ? -1 : int.Parse(sqlReader["Range1LowerLimit"].ToString()),
                            //R2LLimit = sqlReader["Range2LowerLimit"] == null ? -1 : int.Parse(sqlReader["Range2LowerLimit"].ToString()),
                            //R3LLimit = sqlReader["Range3LowerLimit"] == null ? -1 : int.Parse(sqlReader["Range3LowerLimit"].ToString()),
                            //R4LLimit = sqlReader["Range4LowerLimit"] == null ? -1 : int.Parse(sqlReader["Range4LowerLimit"].ToString()),
                            //R5LLimit = sqlReader["Range5LowerLimit"] == null ? -1 : int.Parse(sqlReader["Range5LowerLimit"].ToString()),
                            //R6LLimit = sqlReader["Range6LowerLimit"] == null ? -1 : int.Parse(sqlReader["Range6LowerLimit"].ToString()),
                            //R1ULimit = sqlReader["Range1UpperLimit"] == null ? -1 : int.Parse(sqlReader["Range1UpperLimit"].ToString()),
                            //R2ULimit = sqlReader["Range2UpperLimit"] == null ? -1 : int.Parse(sqlReader["Range2UpperLimit"].ToString()),
                            //R3ULimit = sqlReader["Range3UpperLimit"] == null ? -1 : int.Parse(sqlReader["Range3UpperLimit"].ToString()),
                            //R4ULimit = sqlReader["Range4UpperLimit"] == null ? -1 : int.Parse(sqlReader["Range4UpperLimit"].ToString()),
                            //R5ULimit = sqlReader["Range5UpperLimit"] == null ? -1 : int.Parse(sqlReader["Range5UpperLimit"].ToString()),
                            //R6ULimit = sqlReader["Range6UpperLimit"] == null ? -1 : int.Parse(sqlReader["Range6UpperLimit"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            if (maps.Count > 0)
            {
                maps[0].DateString = DateUtility.GetDateString(dateType);
                maps = SetPaRange(maps);
            }
            Utility.AssignColors(maps);
            return maps;
        }

        public OrderAnalysisList GetPROrderAnalysis(int programId, string userId, string userType, bool isArmadaEmployee)
        {
            var dates = DateUtility.GetDates("today", programId, _connectionString);
            var vlues = new List<OrderAnalysis>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[analytics].[GetPROrdersAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("ProgramId", programId);
                sqlCmd.Parameters.AddWithValue("BegDate", DateUtility.LastYear(DateTime.Today).Start.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.Parameters.AddWithValue("EndDate", DateTime.Today.ToString("yyyy-MM-dd") + " 00:00:00");
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new OrderAnalysis
                        {
                            CreatedOnDate = sqlReader["ChartDate"]?.ToString() ?? string.Empty,
                            MonthName = sqlReader["MonthName"]?.ToString() ?? string.Empty,
                            Year = sqlReader["Year"] == null ? -1 : int.Parse(sqlReader["Year"].ToString()),
                            Month = sqlReader["Month"] == null ? -1 : int.Parse(sqlReader["Month"].ToString()),
                            Day = sqlReader["Day"] == null ? -1 : int.Parse(sqlReader["Day"].ToString()),
                            PrescriptionCount = sqlReader["OrderCount"] == null ? -1 : int.Parse(sqlReader["OrderCount"].ToString())
                        });
                    }

                    connection.Close();
                }
            }

            var uniqueList = new OrderAnalysisList();
            var years = vlues.Select(u => u.Year).Distinct().ToList();
            if (years.Count > 0)
                uniqueList.Current = vlues.Where(u => u.Year == years[0]).ToList();
            else
                uniqueList.Current = new List<OrderAnalysis>();
            if (years.Count > 1)
                uniqueList.Previous = vlues.Where(u => u.Year == years[1]).ToList();
            else
                uniqueList.Previous = new List<OrderAnalysis>();
            return uniqueList;
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
                    var sqlCmd = new SqlCommand(@"[analytics].[GetPAOrdersDetails]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
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
                    if(physicianLastNameSrcQry == null)
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
            int? fillingPharmacyId, int? fillingCompanyId, string from, string to, bool isArmadaEmployee, int? patientId, int? ndc, string userId, string userType,
            string patientLastNameSrcQry)
        {
            try
            {
                var dates = DateUtility.GetDates(dateType ?? "allreferrals", programId, _connectionString);
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
                    sqlCmd.Parameters.AddWithValue("BegDate", from ?? dates[0]);
                    sqlCmd.Parameters.AddWithValue("EndDate", to ?? dates[1]);
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
            catch
            {
                return new List<UniquePatientDetails>();
            }
        }

        public List<PatientEnrollment> GetPatientEnrollment(int programId, int begYear, string userType, string userId)
        {
            var vlues = new List<PatientEnrollment>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPatientEnrollmentsByPhysicianReport]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("BegYear", begYear.ToString());
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new PatientEnrollment
                        {
                            NPI = sqlReader["NPI"] == null ? string.Empty : sqlReader["NPI"].ToString(),
                            ReferrerName = sqlReader["ReferrerName"] == null ? string.Empty : sqlReader["ReferrerName"].ToString(),
                            DoctorID = sqlReader["DoctorID"] == null ? string.Empty : sqlReader["DoctorID"].ToString(),
                            LastName = sqlReader["LastName"] == null ? string.Empty : sqlReader["LastName"].ToString(),
                            FirstName = sqlReader["FirstName"] == null ? string.Empty : sqlReader["FirstName"].ToString(),
                            Address1 = sqlReader["Address1"] == null ? string.Empty : sqlReader["Address1"].ToString(),
                            City = sqlReader["City"] == null ? string.Empty : sqlReader["City"].ToString(),
                            State = sqlReader["State"] == null ? string.Empty : sqlReader["State"].ToString(),
                            PostalCode = sqlReader["PostalCode"] == null ? string.Empty : sqlReader["PostalCode"].ToString(),
                            YearTotal = sqlReader["YearTotal"] == null ? string.Empty : sqlReader["YearTotal"].ToString(),
                            January = sqlReader["January"] == null ? string.Empty : sqlReader["January"].ToString(),
                            February = sqlReader["February"] == null ? string.Empty : sqlReader["February"].ToString(),
                            March = sqlReader["March"] == null ? string.Empty : sqlReader["March"].ToString(),
                            April = sqlReader["April"] == null ? string.Empty : sqlReader["April"].ToString(),
                            May = sqlReader["May"] == null ? string.Empty : sqlReader["May"].ToString(),
                            June = sqlReader["June"] == null ? string.Empty : sqlReader["June"].ToString(),
                            July = sqlReader["July"] == null ? string.Empty : sqlReader["July"].ToString(),
                            August = sqlReader["August"] == null ? string.Empty : sqlReader["August"].ToString(),
                            September = sqlReader["September"] == null ? string.Empty : sqlReader["September"].ToString(),
                            October = sqlReader["October"] == null ? string.Empty : sqlReader["October"].ToString(),
                            November = sqlReader["November"] == null ? string.Empty : sqlReader["November"].ToString(),
                            December = sqlReader["December"] == null ? string.Empty : sqlReader["December"].ToString()
                        });
                    }

                    connection.Close();
                }
            }

            var total=new PatientEnrollment
            {
                NPI = "", ReferrerName = "Total: ", DoctorID = "", LastName = "", FirstName = "", State = "", PostalCode = "", Address1 = "", City = "",
                January = vlues.Sum(i => int.Parse(i.January)).ToString("##,##0"),
                February = vlues.Sum(i => int.Parse(i.February)).ToString("##,##0"),
                March = vlues.Sum(i => int.Parse(i.March)).ToString("##,##0"),
                April = vlues.Sum(i => int.Parse(i.April)).ToString("##,##0"),
                May = vlues.Sum(i => int.Parse(i.May)).ToString("##,##0"),
                June = vlues.Sum(i => int.Parse(i.June)).ToString("##,##0"),
                July = vlues.Sum(i => int.Parse(i.July)).ToString("##,##0"),
                August = vlues.Sum(i => int.Parse(i.August)).ToString("##,##0"),
                September = vlues.Sum(i => int.Parse(i.September)).ToString("##,##0"),
                October = vlues.Sum(i => int.Parse(i.October)).ToString("##,##0"),
                November = vlues.Sum(i => int.Parse(i.November)).ToString("##,##0"),
                December = vlues.Sum(i => int.Parse(i.December)).ToString("##,##0"),
                YearTotal = vlues.Sum(i => int.Parse(i.YearTotal)).ToString("##,##0")
            };
            vlues.Add(total);

            return vlues;
        }

        public List<CipherPriorAuth> GetCipherPriorAuth(int programId, string datetType, string insType, string statProcess, string userId)
        {
            var vlues = new List<CipherPriorAuth>();
            var dates = DateUtility.GetDates(datetType);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetCIPHERPriorAuthPieReport]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.Parameters.AddWithValue("InsType", insType);
                sqlCmd.Parameters.AddWithValue("IslStatProcess", statProcess);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new CipherPriorAuth
                        {
                            Category = sqlReader["Category"] == null ? string.Empty : sqlReader["Category"].ToString(),
                            CtCategory = sqlReader["CtCategory"] == null ? 0 : int.Parse(sqlReader["CtCategory"].ToString()),
                            ProgramStatus = sqlReader["ProgramStatus"] == null ? string.Empty : sqlReader["ProgramStatus"].ToString(),
                            ProgramSubStatus = sqlReader["programsubstatus"] == null ? string.Empty : sqlReader["programsubstatus"].ToString(),
                            BegDate = sqlReader["BegDate"] == null ? string.Empty : sqlReader["BegDate"].ToString(),
                            EndDate = sqlReader["EndDate"] == null ? string.Empty : sqlReader["EndDate"].ToString(),
                            PriorAuthRequired = sqlReader["PriorAuthRequired"] == null ? string.Empty : sqlReader["PriorAuthRequired"].ToString(),
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<InformixConfigModel> GetInformixConfig()
        {
            var vlues = new List<InformixConfigModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetInformixPanel]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new InformixConfigModel
                        {
                            Name = sqlReader["Name"].ToString(),
                            Visibility = bool.Parse(sqlReader["Visibility"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public int GetInformixIdByProgramId(int programId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCmd = new SqlCommand(@"[config].[GetInformixIdByProgramId]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programID", programId);
                sqlCmd.CommandTimeout = 500;
                connection.Open();
                var id = sqlCmd.ExecuteScalar();
                connection.Close();
                return id == null || string.IsNullOrEmpty(id.ToString()) ? -1 : int.Parse(id.ToString());
            }
        }

        //public CallCenterStatCharts GetCallCenterStatictics(string programName, string dateFrequency, bool isWorkingDays)
        //{
        //    var vlues = new List<CallCenterStat>();
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        connection.Open();
        //        SetArithAbortCommand(connection);
        //        var sqlCmd = new SqlCommand("[kaleo].[GetCallCenterStatictics]", connection);
        //        sqlCmd.CommandType = CommandType.StoredProcedure;
        //        sqlCmd.Parameters.AddWithValue("programName", programName.Replace("-", ""));
        //        sqlCmd.Parameters.AddWithValue("dateFrequency", dateFrequency);
        //        sqlCmd.CommandTimeout = 500;
        //        using (var reader = sqlCmd.ExecuteReader())
        //        {
        //            while (reader.Read())
        //            {
        //                var i = 0;
        //                decimal d;
        //                vlues.Add(new CallCenterStat
        //                {
        //                    Id = reader["Id"] == null || !int.TryParse(reader["Id"].ToString(), out i) ? -1 : int.Parse(reader["Id"].ToString()),
        //                    csq_name = reader["csq_name"] == null ? "" : reader["csq_name"].ToString(),
        //                    call_skills = reader["call_skills"] == null || !decimal.TryParse(reader["call_skills"].ToString(), out d) ? 0 : decimal.Parse(reader["call_skills"].ToString()),
        //                    calls_presented = reader["calls_presented"] == null || !decimal.TryParse(reader["calls_presented"].ToString(), out d) ? 0 : decimal.Parse(reader["calls_presented"].ToString()),
        //                    avg_queue_time = reader["avg_queue_time"] == null || !decimal.TryParse(reader["avg_queue_time"].ToString(), out d) ? 0 : decimal.Parse(reader["avg_queue_time"].ToString()),
        //                    max_queue_time = reader["max_queue_time"] == null || !decimal.TryParse(reader["max_queue_time"].ToString(), out d) ? 0 : decimal.Parse(reader["max_queue_time"].ToString()),
        //                    calls_handled = reader["calls_handled"] == null || !decimal.TryParse(reader["calls_handled"].ToString(), out d) ? 0 : decimal.Parse(reader["calls_handled"].ToString()),
        //                    avg_speed_answer = reader["avg_speed_answer"] == null || !decimal.TryParse(reader["avg_speed_answer"].ToString(), out d) ? 0 : decimal.Parse(reader["avg_speed_answer"].ToString()),
        //                    avg_handle_time = reader["avg_handle_time"] == null || !decimal.TryParse(reader["avg_handle_time"].ToString(), out d) ? 0 : decimal.Parse(reader["avg_handle_time"].ToString()),
        //                    max_handle_time = reader["max_handle_time"] == null || !decimal.TryParse(reader["max_handle_time"].ToString(), out d) ? 0 : decimal.Parse(reader["max_handle_time"].ToString()),
        //                    calls_abandoned = reader["calls_abandoned"] == null || !decimal.TryParse(reader["calls_abandoned"].ToString(), out d) ? 0 : decimal.Parse(reader["calls_abandoned"].ToString()),
        //                    avg_time_abandon = reader["avg_time_abandon"] == null || !decimal.TryParse(reader["avg_time_abandon"].ToString(), out d) ? 0 : decimal.Parse(reader["avg_time_abandon"].ToString()),
        //                    max_time_abandon = reader["max_time_abandon"] == null || !decimal.TryParse(reader["max_time_abandon"].ToString(), out d) ? 0 : decimal.Parse(reader["max_time_abandon"].ToString()),
        //                    avg_calls_abandoned = reader["avg_calls_abandoned"] == null || !decimal.TryParse(reader["avg_calls_abandoned"].ToString(), out d) ? 0 : decimal.Parse(reader["avg_calls_abandoned"].ToString()),
        //                    max_calls_abandoned = reader["max_calls_abandoned"] == null || !decimal.TryParse(reader["max_calls_abandoned"].ToString(), out d) ? 0 : decimal.Parse(reader["max_calls_abandoned"].ToString()),
        //                    calls_dequeued = reader["calls_dequeued"] == null || !decimal.TryParse(reader["calls_dequeued"].ToString(), out d) ? 0 : decimal.Parse(reader["calls_dequeued"].ToString()),
        //                    avg_time_dequeue = reader["avg_time_dequeue"] == null || !decimal.TryParse(reader["avg_time_dequeue"].ToString(), out d) ? 0 : decimal.Parse(reader["avg_time_dequeue"].ToString()),
        //                    max_time_dequeue = reader["max_time_dequeue"] == null || !decimal.TryParse(reader["max_time_dequeue"].ToString(), out d) ? 0 : decimal.Parse(reader["max_time_dequeue"].ToString()),
        //                    calls_handled_by_other = reader["calls_handled_by_other"] == null || !decimal.TryParse(reader["calls_handled_by_other"].ToString(), out d) ? 0 : decimal.Parse(reader["calls_handled_by_other"].ToString()),
        //                    latestsynchtime = reader["latestsynchtime"] == null || !decimal.TryParse(reader["latestsynchtime"].ToString(), out d) ? 0 : decimal.Parse(reader["latestsynchtime"].ToString()),
        //                    stat_date = reader["stat_date"] == null ? "" : reader["stat_date"].ToString(),
        //                    date_frequency = reader["date_frequency"] == null ? "" : reader["date_frequency"].ToString(),
        //                    date_type = reader["date_type"] == null ? "" : reader["date_type"].ToString(),
        //                });
        //            }

        //            connection.Close();
        //        }
        //    }

        //    var dates = DateRangeUtility.GetDateRange(dateFrequency);
        //    var asa = new List<CallCenterStatChart>();
        //    var aht = new List<CallCenterStatChart>();
        //    var ar = new List<CallCenterStatChart>();
        //    var ach = new List<CallCenterStatChart>();
        //    foreach (var d in dates)
        //    {
        //        if (isWorkingDays && (d.StartDate.DayOfWeek == DayOfWeek.Saturday || d.StartDate.DayOfWeek == DayOfWeek.Sunday))
        //            continue;
        //        var matchingDate = dateFrequency.Equals("Week") ? d.EndDate.AddDays(1).ToString("ddd, MMM d") : d.StartFormatted;
        //        var item = vlues.FirstOrDefault(i => i.stat_date.Equals(matchingDate));
        //        asa.Add(new CallCenterStatChart {X = d.StartFormatted, Y = (item == null ? 0 : item.avg_speed_answer)});
        //        aht.Add(new CallCenterStatChart {X = d.StartFormatted, Y = (item == null ? 0 : item.avg_handle_time)});
        //        ar.Add(new CallCenterStatChart
        //        {
        //            X = d.StartFormatted,
        //            Y = (item == null ? 0 : (item.calls_presented == 0 ? 0 : item.calls_abandoned/item.calls_presented)),
        //            Presented = (item == null ? 0 : item.calls_presented),
        //            Abandoned = (item == null ? 0 : item.calls_abandoned)
        //        });
        //        ach.Add(new CallCenterStatChart { X = d.StartFormatted, Y = (item == null ? 0 : item.calls_handled) });
        //    }

        //    if (isWorkingDays)
        //    {
        //        asa = asa.Take(7).ToList();
        //        aht = aht.Take(7).ToList();
        //        ar = ar.Take(7).ToList();
        //        ach = ach.Take(7).ToList();
        //    }

        //    var charts = new CallCenterStatCharts
        //    {
        //        AvgSpeedAnswer = asa,
        //        AvgHandleTime = aht,
        //        AbandonmentRate = ar,
        //        CallsHandled = ach
        //    };

        //    charts.AvgSpeedAnswer.Reverse();
        //    charts.AvgHandleTime.Reverse();
        //    charts.AbandonmentRate.Reverse();
        //    charts.CallsHandled.Reverse();

        //    return charts;
        //}

        public NetworkCapacity GetNetworkCapacity(int programId, string dateFrequency)
        {
            return new NetworkCapacity
            {
                Chart = GetNetworkCapacityChart(programId, dateFrequency),
                Table = GetNetworkCapacityTable(programId, dateFrequency)
            };
        }

        public List<NetworkCapacityChart> GetNetworkCapacityChart(int programId, string dateFrequency)
        {
            var vlues = new List<NetworkCapacityData>();
            var dates = DateRangeUtility.GetDateRange(dateFrequency);
            dates.Reverse();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[kaleo].[GetNetworkCapacity]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("startDate", dates.First().Start);
                sqlCmd.Parameters.AddWithValue("endDate", dates.Last().End);
                sqlCmd.CommandTimeout = 500;
                using (var reader = sqlCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var i = 0;
                        DateTime d;
                        vlues.Add(new NetworkCapacityData
                        {
                            TotalCapacity = reader["TotalCapacity"] == null || !int.TryParse(reader["TotalCapacity"].ToString(), out i) 
                                            ? 0 : int.Parse(reader["TotalCapacity"].ToString()),
                            RemainingCapacity = reader["RemainingCapacity"] == null || !int.TryParse(reader["RemainingCapacity"].ToString(), out i)
                                            ? 0 : int.Parse(reader["RemainingCapacity"].ToString()),
                            AssignedCapacity = reader["AssignedCapacity"] == null || !int.TryParse(reader["AssignedCapacity"].ToString(), out i)
                                            ? 0 : int.Parse(reader["AssignedCapacity"].ToString()),
                            Createdon = reader["Createdon"] == null || !DateTime.TryParse(reader["Createdon"].ToString(), out d)
                                            ? new DateTime(1901, 1, 1) : DateTime.Parse(reader["Createdon"].ToString()),
                            EffectiveDate = reader["EffectiveDate"] == null || !DateTime.TryParse(reader["EffectiveDate"].ToString(), out d)
                                            ? new DateTime(1901, 1, 1) : DateTime.Parse(reader["EffectiveDate"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }

            var ncChart = new List<NetworkCapacityChart>();
            foreach (var date in dates)
            {
                var data = vlues.Where(d => d.Createdon >= date.StartDate && d.Createdon <= date.EndDate).ToList();
                var first = data.FirstOrDefault();
                ncChart.Add(new NetworkCapacityChart
                {
                    TotalCapacity = data.Sum(d=>d.TotalCapacity),
                    RemainingCapacity = first == null 
                                        ? 0 
                                        : dateFrequency == "Day" 
                                            ?
                                            first.TotalCapacity - data.Sum(d => d.AssignedCapacity)
                                            : (first.TotalCapacity * (date.EndDate.AddSeconds(1) - date.StartDate).Days) - 
                                                data.Sum(d => d.AssignedCapacity),
                    AssignedCapacity = data.Sum(d=>d.AssignedCapacity),
                    Date = date.StartFormattedForChart
                });
            }

            return ncChart;
        }

        public NetworkCapacityTable GetNetworkCapacityTable(int programId, string dateFrequency)
        {
            var vlues = new List<NetworkCapacityData>();
            var dates = DateRangeUtility.GetDateRange(dateFrequency);
            dates.Reverse();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[kaleo].[GetNetworkCapacityByPharmacy]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("startDate", dates.First().Start);
                sqlCmd.Parameters.AddWithValue("endDate", dates.Last().End);
                sqlCmd.CommandTimeout = 500;
                using (var reader = sqlCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var i = 0;
                        DateTime d;
                        vlues.Add(new NetworkCapacityData
                        {
                            TotalCapacity = reader["TotalCapacity"] == null || !int.TryParse(reader["TotalCapacity"].ToString(), out i)
                                            ? 0 : int.Parse(reader["TotalCapacity"].ToString()),
                            RemainingCapacity = reader["RemainingCapacity"] == null || !int.TryParse(reader["RemainingCapacity"].ToString(), out i)
                                            ? 0 : int.Parse(reader["RemainingCapacity"].ToString()),
                            AssignedCapacity = reader["AssignedCapacity"] == null || !int.TryParse(reader["AssignedCapacity"].ToString(), out i)
                                            ? 0 : int.Parse(reader["AssignedCapacity"].ToString()),
                            ProgramPharmacyCapacityID = reader["ProgramPharmacyCapacityID"] == null || !int.TryParse(reader["ProgramPharmacyCapacityID"].ToString(), out i)
                                            ? 0 : int.Parse(reader["ProgramPharmacyCapacityID"].ToString()),
                            Createdon = reader["Createdon"] == null || !DateTime.TryParse(reader["Createdon"].ToString(), out d)
                                            ? new DateTime(1901, 1, 1) : DateTime.Parse(reader["Createdon"].ToString()),
                            EffectiveDate = reader["EffectiveDate"] == null || !DateTime.TryParse(reader["EffectiveDate"].ToString(), out d)
                                            ? new DateTime(1901, 1, 1) : DateTime.Parse(reader["EffectiveDate"].ToString()),
                            PharmacyName = reader["PharmacyName"] == null ? "" : reader["PharmacyName"].ToString(),
                            Capacity = reader["Capacity"] == null || !int.TryParse(reader["Capacity"].ToString(), out i)
                                            ? 0 : int.Parse(reader["Capacity"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }

            var table = new NetworkCapacityTable();
            var pharmacies = vlues.Select(v => v.PharmacyName).Distinct().ToList();
            var columns = new List<string> {"Pharmacy", "Capacity"};
            columns.AddRange(dates.Select(d=>d.StartFormatted));
            table.Columns = columns;
            table.Data = new List<List<string>>();
            foreach (var pharmacy in pharmacies)
            {
                var data = new List<string> {pharmacy, ""};
                foreach (var date in dates)
                {
                    var sum = vlues.Where( v => v.PharmacyName == pharmacy &&
                                    (v.Createdon >= date.StartDate && v.Createdon <= date.EndDate))
                                   .Sum(v => v.AssignedCapacity);
                    data.Add(sum.ToString("##,###"));
                }
                var c = vlues.FirstOrDefault(v => v.PharmacyName == pharmacy);
                data[1] = c == null ? "" : c.Capacity.ToString("##,###");
                table.Data.Add(data);
            }

            return table;
        }

        public List<IncomingReferralByHour> GetIncomingReferralByHour(int programId, string dateType, string physicianFName, string physicianLName)
        {
            var dates = DateUtility.GetDates(dateType);
            var vlues = new List<IncomingReferralByHour>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[kaleo].[GetIncomingReferralsByHour]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("startDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("endDate", dates[1]);
                //sqlCmd.Parameters.AddWithValue("startDate", "2017-03-10");
                //sqlCmd.Parameters.AddWithValue("endDate", "2017-03-10 23:59:59");
                sqlCmd.Parameters.AddWithValue("physicianFirst", physicianFName == null ? DBNull.Value : (object)physicianFName);
                sqlCmd.Parameters.AddWithValue("physicianLast", physicianLName == null ? DBNull.Value : (object)physicianLName);
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new IncomingReferralByHour
                        {
                            Date = sqlReader["Date"]?.ToString() ?? string.Empty,
                            Prescriber = sqlReader["Prescriber"]?.ToString() ?? string.Empty,
                            ReferralCount = sqlReader["ReferralCount"] == null ? 0 : int.Parse(sqlReader["ReferralCount"].ToString()),
                            Hour = sqlReader["Hour"] == null ? 0 : int.Parse(sqlReader["Hour"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }

            var allValues = new List<IncomingReferralByHour>();
            for (int i = 0; i < 24; i++)
            {
                var items = vlues.Where(v => v.Hour == i).ToList();
                allValues.Add(items.Count == 0
                    ? new IncomingReferralByHour {Hour = i, ReferralCount = 0}
                    : new IncomingReferralByHour
                    {
                        Hour = items.First().Hour,
                        ReferralCount = items.Sum(it => it.ReferralCount)
                    });
            }

            var totalReferralCount = allValues.Sum(v => v.ReferralCount);
            allValues.ForEach(v =>
            {
                v.ReferralCountPercent = totalReferralCount == 0
                    ? 0
                    : Math.Round((((double)v.ReferralCount / (double)totalReferralCount) * 100), 2);
                v.HourStr = new DateTime(1990, 1, 1, v.Hour, 1, 1).ToString("h tt");
            });

            if (allValues.Count > 0)
            {
                allValues[0].TotalReferralCount = totalReferralCount;
                allValues[0].DateString = DateUtility.GetDateString(dateType);
            }

            return allValues;
        }

        public List<string> SearchPhysician(int programId, string searchTerm, string sp)
        {
            var vlues = new List<string>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[kaleo].[" + sp +"]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("searchTerm", searchTerm);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(sqlReader["Name"]?.ToString() ?? string.Empty);
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<TwoHoursCallKpiChart> Get2HoursCallKpi(int programId, string dateType, bool fullDay, bool excludeNonWorkingDays)
        {
            var vlues = new List<TwoHoursCallKpi>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[kaleo].[Get2HourCallKpiPercent]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("fullDay", fullDay);
                sqlCmd.Parameters.AddWithValue("excludeNonWorkingDays", excludeNonWorkingDays);
                sqlCmd.Parameters.AddWithValue("startDate",
                    dateType.Equals("daily")
                        ? DateTime.Today.AddDays(-8).ToString("yyyy-MM-dd")
                        : dateType.Equals("monthly")
                            ? new DateTime(DateTime.Today.AddMonths(-6).Year, DateTime.Today.AddMonths(-6).Month, 1).ToString("yyyy-MM-dd")
                            : dateType.Equals("weekly")
                            ? DateTime.Today.AddDays(-42).ToString("yyyy-MM-dd")
                            : new DateTime(DateTime.Today.AddMonths(-18).Year, DateTime.Today.AddMonths(-18).Month, 1).ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("endDate", DateTime.Today.ToString("yyyy-MM-dd"));

                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new TwoHoursCallKpi
                        {
                            CreatedOn = sqlReader["CreatedOn"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["CreatedOn"].ToString()),
                            AspnRxId = sqlReader["aspnrxid"]?.ToString() ?? string.Empty,
                            Kpi = sqlReader["KPI"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }

            if(vlues.Count == 0)
                return new List<TwoHoursCallKpiChart>();

            var minDate = vlues.Min(v => v.CreatedOn);
            var maxDate = vlues.Max(v => v.CreatedOn);

            var dates = dateType.Equals("daily")
                ? DateUtility.GetDaysBetweenRange(minDate, DateTime.Now, excludeNonWorkingDays)
                : dateType.Equals("weekly")
                    ? DateUtility.GetWeeksBetweenRange(minDate, DateTime.Now) 
                    : dateType.Equals("monthly")
                        ? DateUtility.GetMonthsBetweenRange(minDate, DateTime.Now)
                        : DateUtility.GetQuartersBetweenRange(minDate, DateTime.Now);
            dates = Enumerable.Reverse(dates).Take(6).Reverse().ToList();

            var kpis = new List<TwoHoursCallKpiChart>();
            for (int i = 0; i < dates.Count; i++)
            {
                var lowerRange = dates[i];
                var upperRange = dateType.Equals("daily")
                    ? dates[i].AddHours(23).AddMinutes(59).AddSeconds(59)
                    : dateType.Equals("monthly") ? dates[i].AddMonths(1).AddSeconds(-1) 
                    : dateType.Equals("weekly") ? dates[i].AddDays(7).AddSeconds(-1)
                    : dates[i].AddMonths(3).AddSeconds(-1);

                var numerator = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange && v.Kpi.Equals("Y"));
                var denominator = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange);

                kpis.Add(new TwoHoursCallKpiChart
                {
                    DateStr = DateUtility.GetDateStringFromType(upperRange, dateType),
                    KpiPercent = denominator == 0 ? 0.0 : Math.Round(((double)numerator / (double)denominator) * 100, 2)
                });
            }

            return kpis;
        }

        public List<TwoHoursCallKpiVolumeChart> Get2HoursCallVolume(int programId, string dateType, bool excludeNonWorkingDays)
        {
            var vlues = new List<TwoHoursCallKpi>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[kaleo].[Get2HourCallVolume]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("excludeNonWorkingDays", excludeNonWorkingDays);
                sqlCmd.Parameters.AddWithValue("startDate",
                    dateType.Equals("daily")
                        ? DateTime.Today.AddDays(-8).ToString("yyyy-MM-dd")
                        : dateType.Equals("monthly")
                            ? new DateTime(DateTime.Today.AddMonths(-6).Year, DateTime.Today.AddMonths(-6).Month, 1).ToString("yyyy-MM-dd")
                            : dateType.Equals("weekly")
                            ? DateTime.Today.AddDays(-42).ToString("yyyy-MM-dd")
                            : new DateTime(DateTime.Today.AddMonths(-18).Year, DateTime.Today.AddMonths(-18).Month, 1).ToString("yyyy-MM-dd"));
                sqlCmd.Parameters.AddWithValue("endDate", DateTime.Today.ToString("yyyy-MM-dd"));

                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new TwoHoursCallKpi
                        {
                            CreatedOn = sqlReader["CreatedOn"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["CreatedOn"].ToString()),
                            AspnRxId = sqlReader["aspnrxid"]?.ToString() ?? string.Empty,
                            Window = sqlReader["Window"]?.ToString() ?? string.Empty
                        });
                    }

                    connection.Close();
                }
            }

            if (vlues.Count == 0)
                return new List<TwoHoursCallKpiVolumeChart>();

            var minDate = vlues.Min(v => v.CreatedOn);
            var maxDate = vlues.Max(v => v.CreatedOn);

            var dates = dateType.Equals("daily")
                ? DateUtility.GetDaysBetweenRange(minDate, DateTime.Now, excludeNonWorkingDays)
                : dateType.Equals("weekly")
                    ? DateUtility.GetWeeksBetweenRange(minDate, DateTime.Now)
                    : dateType.Equals("monthly")
                        ? DateUtility.GetMonthsBetweenRange(minDate, DateTime.Now)
                        : DateUtility.GetQuartersBetweenRange(minDate, DateTime.Now);
            dates = Enumerable.Reverse(dates).Take(6).Reverse().ToList();

            var volume = new List<TwoHoursCallKpiVolumeChart>();
            for (int i = 0; i < dates.Count; i++)
            {
                var lowerRange = dates[i];
                var upperRange = dateType.Equals("daily")
                    ? dates[i].AddHours(23).AddMinutes(59).AddSeconds(59)
                    : dateType.Equals("monthly") ? dates[i].AddMonths(1).AddSeconds(-1)
                    : dateType.Equals("weekly") ? dates[i].AddDays(7).AddSeconds(-1)
                    : dates[i].AddMonths(3).AddSeconds(-1);

                volume.Add(new TwoHoursCallKpiVolumeChart
                {
                    DateStr = DateUtility.GetDateStringFromType(upperRange, dateType),
                    Successful = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange && v.Window.Equals("Y")),
                    Unsuccessful = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange && v.Window.Equals("N"))
                });
            }

            return volume;
        }

        //public OutboundCharts GetHubStatisticsOutboundCallStatistics(int programId, string dateType, bool excludeNonWorkingDays)
        //{
        //    var vlues = new List<OutboundCallModel>();
        //    var dates = dateType.Equals("daily")
        //        ? DateUtility.GetDaysBetweenRange(DateTime.Today.AddDays(-7), DateTime.Today.AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59), excludeNonWorkingDays)
        //        : dateType.Equals("weekly")
        //            ? DateUtility.GetWeeksBetweenRange(DateTime.Today.AddDays(-49), DateTime.Now)
        //            : dateType.Equals("monthly")
        //                ? DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-6), DateTime.Now)
        //                : DateUtility.GetQuartersBetweenRange(DateTime.Today.AddMonths(-24), DateTime.Now);

        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        connection.Open();
        //        SetArithAbortCommand(connection);
        //        var sqlCmd = new SqlCommand(@"[kaleo].[GetOutboundCallStatistics]", connection);
        //        sqlCmd.CommandType = CommandType.StoredProcedure;
        //        sqlCmd.CommandTimeout = 500;
        //        sqlCmd.Parameters.AddWithValue("programId", programId);
        //        sqlCmd.Parameters.AddWithValue("dateType", dateType);
        //        //sqlCmd.Parameters.AddWithValue("excludeNonWorkingDays", excludeNonWorkingDays);
        //        //sqlCmd.Parameters.AddWithValue("startDate", dates.First().AddHours(4).ToString("yyyy-MM-dd HH:mm:ss"));
        //        //sqlCmd.Parameters.AddWithValue("endDate", dates.Last().AddDays(1).AddHours(4).ToString("yyyy-MM-dd HH:mm:ss"));

        //        using (var sqlReader = sqlCmd.ExecuteReader())
        //        {
        //            while (sqlReader.Read())
        //            {
        //                vlues.Add(new OutboundCallModel
        //                {
        //                    //DateTimeOriginal = sqlReader["datetimeorigination"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["datetimeorigination"].ToString()),
        //                    //DateTimeConnect = sqlReader["datetimeconnect"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["datetimeconnect"].ToString()),
        //                    //DateTimeDisconnect = sqlReader["datetimedisconnect"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["datetimedisconnect"].ToString()),
        //                    //Duration = sqlReader["duration"] != null ? int.Parse(sqlReader["duration"].ToString()) : 0,
        //                    //CauseValue = sqlReader["origCause_value"] != null ? long.Parse(sqlReader["origCause_value"].ToString()) : 0,
        //                    //PartyPattern = sqlReader["originalcalledpartypattern"] != null ? sqlReader["originalcalledpartypattern"].ToString() : string.Empty
        //                    TotalCalls = sqlReader["TotalCalls"] != null ? long.Parse(sqlReader["TotalCalls"].ToString()) : 0,
        //                    DurationCause = sqlReader["DurationCause"] != null ? long.Parse(sqlReader["DurationCause"].ToString()) : 0,
        //                    CauseValue = sqlReader["CauseValue"] != null ? long.Parse(sqlReader["CauseValue"].ToString()) : 0,
        //                    Date = sqlReader.GetDate("Date"),
        //                    WeekNumber = sqlReader["WeekNumber"] != null ? int.Parse(sqlReader["WeekNumber"].ToString()) : 0,
        //                    MonthNumber = sqlReader["MonthNumber"] != null ? int.Parse(sqlReader["MonthNumber"].ToString()) : 0,
        //                    Year = sqlReader["Year"] != null ? int.Parse(sqlReader["Year"].ToString()) : 0,
        //                });
        //            }

        //            connection.Close();
        //        }
        //    }

        //    if (vlues.Count == 0)
        //        return new OutboundCharts();

        //    vlues = dateType.Equals("daily")
        //        ? vlues.OrderBy(d => d.Date).ToList()
        //        : dateType.Equals("weekly")
        //            ? vlues.OrderBy(d => d.Year).ThenBy(d => d.WeekNumber).ToList()
        //            : vlues.OrderBy(d => d.Year).ThenBy(d => d.MonthNumber).ToList();

        //    var holidays = GetHolidays();
        //    //dates = RemoveHolidays(dateType, dates, holidays);
        //    vlues = RemoveHolidays(dateType, vlues, holidays);

        //    if (dateType.Equals("monthly"))
        //    {
        //        //dates.RemoveAll(d => d.Equals(new DateTime(2017, 1, 1)));
        //        vlues.RemoveAll(d => d.MonthNumber == 1 && d.Year == 2017);
        //    }

        //    var totalCalls = new List<OutboundTotalCallsChart>();
        //    var avgCallLengths = new List<OutboundAvgCallLengthChart>();
        //    //for (int i = 0; i < dates.Count; i++)
        //    //{
        //    //    var lowerRange = dates[i].AddHours(4);
        //    //    var upperRange = dateType.Equals("daily")
        //    //        ? dates[i].AddHours(23).AddMinutes(59).AddSeconds(59).AddHours(4)
        //    //        : dateType.Equals("monthly") ? dates[i].AddMonths(1).AddSeconds(-1).AddHours(4)
        //    //        : dateType.Equals("weekly") ? dates[i].AddDays(7).AddSeconds(-1).AddHours(4)
        //    //        : dates[i].AddMonths(3).AddSeconds(-1).AddHours(4);

        //    //    totalCalls.Add(new OutboundTotalCallsChart
        //    //    {
        //    //        Date = DateUtility.GetDateStringFromType(upperRange.AddHours(-4), dateType),
        //    //        TotalCalls = vlues.Count(v => v.DateTimeOriginal >= lowerRange && v.DateTimeOriginal <= upperRange)
        //    //    });

        //    //    var count = vlues.Where(v => v.DateTimeOriginal >= lowerRange && v.DateTimeOriginal <= upperRange).Sum(v => v.CauseValue);
        //    //    var sum = vlues.Where(v => v.DateTimeOriginal >= lowerRange && v.DateTimeOriginal <= upperRange).Sum(v => v.Duration * v.CauseValue);
        //    //    avgCallLengths.Add(new OutboundAvgCallLengthChart
        //    //    {
        //    //        Date = DateUtility.GetDateStringFromType(upperRange.AddHours(-4), dateType),
        //    //        AvgCallLength = count == 0 ? 0 : Math.Round((double)sum / (double)count, 2)
        //    //    });
        //    //}

        //    foreach (var v in vlues)
        //    {
        //        totalCalls.Add(new OutboundTotalCallsChart
        //        {
        //            Date = DateUtility.GetDateStringFromType(
        //                    dateType.Equals("daily")
        //                        ? v.Date
        //                        : dateType.Equals("weekly")
        //                            ? ExtensionMethods.DateFromWeekNumber(v.Year, v.WeekNumber)
        //                            : new DateTime(v.Year, v.MonthNumber, 1), dateType),
        //            TotalCalls = v.TotalCalls
        //        });

        //        avgCallLengths.Add(new OutboundAvgCallLengthChart
        //        {
        //            Date = DateUtility.GetDateStringFromType(
        //                    dateType.Equals("daily")
        //                        ? v.Date
        //                        : dateType.Equals("weekly")
        //                            ? ExtensionMethods.DateFromWeekNumber(v.Year, v.WeekNumber)
        //                            : new DateTime(v.Year, v.MonthNumber, 1), dateType),
        //            AvgCallLength = v.CauseValue == 0 ? 0 : Math.Round((double)v.DurationCause / (double)v.CauseValue, 2)
        //        });
        //    }

        //    return new OutboundCharts
        //    {
        //        TotalCallsChart = totalCalls,
        //        AvgCallLengthChart = avgCallLengths
        //    };
        //}

        //public OutboundCharts GetConcentrixOutboundCallStatistics(int programId, string dateType, bool excludeNonWorkingDays)
        //{
        //    var vlues = new List<OutboundCallModel>();

        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        connection.Open();
        //        SetArithAbortCommand(connection);
        //        var sqlCmd = new SqlCommand(@"[kaleo].[GetConcentrixOutboundCallStatistics]", connection);
        //        sqlCmd.CommandType = CommandType.StoredProcedure;
        //        sqlCmd.CommandTimeout = 500;
        //        sqlCmd.Parameters.AddWithValue("dateType", dateType);

        //        using (var sqlReader = sqlCmd.ExecuteReader())
        //        {
        //            while (sqlReader.Read())
        //            {
        //                vlues.Add(new OutboundCallModel
        //                {
        //                    TotalCalls = sqlReader["TotalCalls"] != null ? long.Parse(sqlReader["TotalCalls"].ToString()) : 0,
        //                    DurationCause = sqlReader["Duration"] != null ? long.Parse(sqlReader["Duration"].ToString()) : 0,
        //                    Date = sqlReader.GetDate("Date"),
        //                    WeekNumber = sqlReader["WeekNumber"] != null ? int.Parse(sqlReader["WeekNumber"].ToString()) : 0,
        //                    MonthNumber = sqlReader["MonthNumber"] != null ? int.Parse(sqlReader["MonthNumber"].ToString()) : 0,
        //                    Year = sqlReader["Year"] != null ? int.Parse(sqlReader["Year"].ToString()) : 0,
        //                });
        //            }

        //            connection.Close();
        //        }
        //    }

        //    if (vlues.Count == 0)
        //        return new OutboundCharts();

        //    vlues = dateType.Equals("daily")
        //        ? vlues.OrderBy(d => d.Date).ToList()
        //        : dateType.Equals("weekly")
        //            ? vlues.OrderBy(d => d.Year).ThenBy(d => d.WeekNumber).ToList()
        //            : vlues.OrderBy(d => d.Year).ThenBy(d => d.MonthNumber).ToList();

        //    var holidays = GetHolidays();
        //    vlues = RemoveHolidays(dateType, vlues, holidays);

        //    if (dateType.Equals("monthly"))
        //    {
        //        vlues.RemoveAll(d => d.MonthNumber == 1 && d.Year == 2017);
        //    }

        //    var totalCalls = new List<OutboundTotalCallsChart>();
        //    var avgCallLengths = new List<OutboundAvgCallLengthChart>();

        //    foreach (var v in vlues)
        //    {
        //        totalCalls.Add(new OutboundTotalCallsChart
        //        {
        //            Date = DateUtility.GetDateStringFromType(
        //                    dateType.Equals("daily")
        //                        ? v.Date
        //                        : dateType.Equals("weekly")
        //                            ? ExtensionMethods.DateFromWeekNumber(v.Year, v.WeekNumber)
        //                            : new DateTime(v.Year, v.MonthNumber, 1), dateType),
        //            TotalCalls = v.TotalCalls
        //        });

        //        avgCallLengths.Add(new OutboundAvgCallLengthChart
        //        {
        //            Date = DateUtility.GetDateStringFromType(
        //                    dateType.Equals("daily")
        //                        ? v.Date
        //                        : dateType.Equals("weekly")
        //                            ? ExtensionMethods.DateFromWeekNumber(v.Year, v.WeekNumber)
        //                            : new DateTime(v.Year, v.MonthNumber, 1), dateType),
        //            AvgCallLength = v.TotalCalls == 0 ? 0 : Math.Round((double)v.DurationCause / (double)v.TotalCalls, 2)
        //        });
        //    }

        //    return new OutboundCharts
        //    {
        //        TotalCallsChart = totalCalls,
        //        AvgCallLengthChart = avgCallLengths
        //    };
        //}

        public List<ReferralTimeToProcess> GetReferralTimeToProcess(int programId, string location, string pa, string dateType, bool includeWeekends,
            bool isArmadaEmployee, string userId, string userType)
        {
            var vlues = new List<ReferralTimeToProcess>();
            var dates = DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-11), DateTime.Now);
            dates.RemoveAt(dates.Count - 1);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetReferralTimeToProcess]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("includeWeekends", includeWeekends);
                //sqlCmd.Parameters.AddWithValue("startDate", dates.First().ToString("yyyy-MM-dd"));
                //sqlCmd.Parameters.AddWithValue("endDate", dates.Last().ToString("yyyy-MM-dd") + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("location", location);
                sqlCmd.Parameters.AddWithValue("dateType", dateType);
                sqlCmd.Parameters.AddWithValue("pa", pa);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ReferralTimeToProcess
                        {
                            ReferralCount = sqlReader.GetInt("Referrals"),
                            AvgDays = Math.Round(sqlReader.GetDouble("AvgDays"), 1),
                            YearMonth = sqlReader.GetInt("YearMonth"),
                            MonthYear = sqlReader.GetString("MonthYear")
                        });
                    }

                    connection.Close();
                }
            }

            //var charts = new List<ReferralTimeToProcessChart>();
            //foreach (var date in dates)
            //{
            //    charts.Add(new ReferralTimeToProcessChart
            //    {
            //        ReferralCount = vlues.Where(v=>v.Year == date.Year && v.Month == date.Month && (pa.Equals("All") || v.PriorAuthRequired.Equals(pa)))
            //                             .Sum(v=>v.ReferralCount),
            //        DaysToProcess = Math.Round(vlues.Where(v => v.Year == date.Year && v.Month == date.Month && (pa.Equals("All") || v.PriorAuthRequired.Equals(pa)))
            //                             .Sum(v => v.DaysToProcess), 2),
            //        MonthString = DateUtility.GetDateStringFromType(date, "monthly"),
            //        Year = date.Year,
            //        Month = date.Month
            //    });
            //}

            //return charts;
            return vlues;
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

        public List<BenefitsInvestigation> GetBenfitsInvestigations(int programId, string dateType, int insuranceType, int ageLowerRange, int ageUpperRange, string drugName)
        {
            var vlues = new List<BenefitsInvestigation>();
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetBenefitsInvestigation]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("startDate", dates.First());
                sqlCmd.Parameters.AddWithValue("endDate", dates.Last());
                sqlCmd.Parameters.AddWithValue("insuranceTypeId", insuranceType);
                sqlCmd.Parameters.AddWithValue("ageLowerRange", ageLowerRange);
                sqlCmd.Parameters.AddWithValue("ageUpperRange", ageUpperRange);
                sqlCmd.Parameters.AddWithValue("drugName", drugName);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new BenefitsInvestigation
                        {
                            PrescriptionCount = sqlReader.GetInt("PrescriptionCount"),
                            BIStartYearMonth = sqlReader.GetInt("BIStartYearMonth"),
                            BICompleteYearMonth = sqlReader.GetInt("BICompleteYearMonth"),
                            BICompleteDate = sqlReader.GetString("BICompleteDate"),
                            BIStartDate = sqlReader.GetString("BIStartDate")
                        });
                    }

                    connection.Close();
                }
            }

            if(vlues.Count == 0)
                return new List<BenefitsInvestigation>();

            var dateStrings = vlues.Select(v => v.BIStartDate).ToList();
            dateStrings.AddRange(vlues.Select(v => v.BICompleteDate).ToList());
            dateStrings = dateStrings.Select(d => d).Distinct().ToList();

            var aggregatedList = new List<BenefitsInvestigation>();
            foreach (var date in dateStrings)
            {
                var item1 = vlues.FirstOrDefault(v => v.BIStartDate.Equals(date));
                var item2 = vlues.FirstOrDefault(v => v.BICompleteDate.Equals(date));
                aggregatedList.Add(new BenefitsInvestigation
                {
                    Date = date,
                    YearMonth = item1 != null ? item1.BIStartYearMonth : item2 != null ? item2.BICompleteYearMonth : 0,
                    BiStartCount = vlues.Where(v=> v.BIStartDate.Equals(date)).Sum(v=>v.PrescriptionCount),
                    BiCompleteCount = vlues.Where(v => v.BICompleteDate.Equals(date)).Sum(v => v.PrescriptionCount),
                });
            }
            return aggregatedList.OrderBy(a=>a.YearMonth).ToList();
        }

        public List<CashOption> GetCashOptions(int programId, string dateType, string userId)
        {
            var vlues = new List<CashOption>();
            var dates = DateUtility.GetDates(dateType);
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetCashOptionReferrals]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("startDate", dates.First());
                sqlCmd.Parameters.AddWithValue("endDate", dates.Last());
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new CashOption
                        {
                            ReferralCount = sqlReader.GetDouble("ReferralCount"),
                            InsurnaceType = sqlReader.GetString("InsurnaceType")
                        });
                    }

                    connection.Close();
                }
            }

            var total = vlues.Sum(v => v.ReferralCount);
            foreach (var v in vlues)
            {
                v.ReferralCountPercent = Math.Round(v.ReferralCount/total, 2);
            }
            return vlues;
        }

        public List<InProcessReferrallModel> GetSantylData(int programId, string userId, string userType)
        {
            var vlues = new List<InProcessReferrallModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetInProcessReferralTwoDaysOrMore]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("userType", userType);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new InProcessReferrallModel
                        {
                            ReferralCount = sqlReader.GetDouble("ReferralCount"),
                            ProgramStatus = sqlReader.GetString("ProgramStatus")
                        });
                    }

                    connection.Close();
                }
            }

            var total = vlues.Sum(v => v.ReferralCount);
            foreach (var v in vlues)
            {
                v.ReferralCountPercent = Math.Round(v.ReferralCount / total, 2);
            }
            return vlues;
        }

        public List<InProcessReferrallModel> GetRegranexData(int programId, string userId, string userType)
        {
            var vlues = new List<InProcessReferrallModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetInProcessReferralFiveDaysOrMore]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("userType", userType);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new InProcessReferrallModel
                        {
                            ReferralCount = sqlReader.GetDouble("ReferralCount"),
                            ProgramStatus = sqlReader.GetString("ProgramStatus"),
                            PAProgramStatus = sqlReader.GetString("PAProgramStatus"),
                            PARequired = sqlReader.GetBool("PARequired"),
                        });
                    }

                    connection.Close();
                }
            }

            var total = vlues.Sum(v => v.ReferralCount);
            foreach (var v in vlues)
            {
                v.ReferralCountPercent = Math.Round(v.ReferralCount / total, 2);
            }
            return vlues;
        }

        public List<InProcessReferrallModel> GetReferralsWithCopayGt75(int programId, string userId, string userType)
        {
            var vlues = new List<InProcessReferrallModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetReferralsWithCopayGt75]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("userType", userType);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new InProcessReferrallModel
                        {
                            ReferralCount = sqlReader.GetDouble("ReferralCount"),
                            ProgramStatus = sqlReader.GetString("ProgramStatus")
                            //ProgramSubStatus = sqlReader.GetString("ProgramSubstatus"),
                            //Status = sqlReader.GetString("Status")
                        });
                    }

                    connection.Close();
                }
            }

            var total = vlues.Sum(v => v.ReferralCount);
            foreach (var v in vlues)
            {
                v.ReferralCountPercent = Math.Round(v.ReferralCount / total, 2);
            }
            return vlues;
        }

        public List<ConsignmentRollingHubStatisticsChartModel> GetHubStatisticsConsignmentRollingData(int programId, string dateType, bool isWorkingDays)
        {
            var vlues = new List<ConsignmentHubStatisticsModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetMnfRollingConsignmentHubStatictics]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("excludeNonWorkingDays", isWorkingDays);
                sqlCmd.Parameters.AddWithValue("dateType", dateType);

                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ConsignmentHubStatisticsModel
                        {
                            CreatedOn = sqlReader["Date"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["Date"].ToString()),
                            AspnRxId = sqlReader["aspnrxid"] != null ? sqlReader["aspnrxid"].ToString() : string.Empty,
                            Consignment = sqlReader["Consignment"] != null ? sqlReader["Consignment"].ToString() : string.Empty
                        });
                    }

                    connection.Close();
                }
            }

            if (vlues.Count == 0)
                return new List<ConsignmentRollingHubStatisticsChartModel>();
            var holidays = GetHolidays();
            vlues = vlues.Where(v => holidays.All(h => !h.Equals(v.CreatedOn))).ToList();

            var dates = dateType.Equals("daily")
                ? DateUtility.GetDaysBetweenRange(DateTime.Today.AddDays(-9), DateTime.Today.AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59), isWorkingDays)
                : dateType.Equals("weekly")
                    ? DateUtility.GetWeeksBetweenRange(DateTime.Today.AddDays(-49), DateTime.Now)
                    : dateType.Equals("monthly")
                        ? DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-6), DateTime.Now)
                        : DateUtility.GetQuartersBetweenRange(DateTime.Today.AddMonths(-24), DateTime.Now);

            dates = RemoveHolidays(dateType, dates, holidays);

            //var dates = dateType.Equals("daily")
            //    ? DateUtility.GetDaysBetweenRange(minDate.Date, DateTime.Now, isWorkingDays)
            //    : dateType.Equals("weekly")
            //        ? DateUtility.GetWeeksBetweenRange(minDate.Date, DateTime.Now)
            //        : dateType.Equals("monthly")
            //            ? DateUtility.GetMonthsBetweenRange(minDate.Date, DateTime.Now)
            //            : DateUtility.GetQuartersBetweenRange(minDate.Date, DateTime.Now);

            var kpis = new List<ConsignmentRollingHubStatisticsChartModel>();
            for (int i = 0; i < dates.Count; i++)
            {
                var lowerRange = dates[i];
                var upperRange = dateType.Equals("daily")
                    ? dates[i].AddHours(23).AddMinutes(59).AddSeconds(59)
                    : dateType.Equals("monthly") ? dates[i].AddMonths(1).AddSeconds(-1)
                    : dateType.Equals("weekly") ? dates[i].AddDays(7).AddSeconds(-1)
                    : dates[i].AddMonths(3).AddSeconds(-1);

                var numerator = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange && v.Consignment.Equals("No"));
                var denominator = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange);

                kpis.Add(new ConsignmentRollingHubStatisticsChartModel
                {
                    DateStr = DateUtility.GetDateStringFromType(upperRange, dateType),
                    ConsignmentPercent = denominator == 0 ? 0.0 : Math.Round(((double)numerator / (double)denominator) * 100, 2)
                });
            }

            return kpis;
        }

        public List<ConsignmentHubStatisticsChartModel> GetHubStatisticsConsignmentData(int programId, string dateType, bool isWorkingDays)
        {
            var vlues = new List<ConsignmentHubStatisticsModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetMnfConsignmentHubStatictics]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("excludeNonWorkingDays", isWorkingDays);
                sqlCmd.Parameters.AddWithValue("dateType", dateType);

                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ConsignmentHubStatisticsModel
                        {
                            CreatedOn = sqlReader["Date"] == null ? new DateTime(1901, 1, 1) : Convert.ToDateTime(sqlReader["Date"].ToString()),
                            AspnRxId = sqlReader["aspnrxid"] != null ? sqlReader["aspnrxid"].ToString() : string.Empty,
                            Consignment = sqlReader["Consignment"] != null ? sqlReader["Consignment"].ToString() : string.Empty
                        });
                    }

                    connection.Close();
                }
            }

            if (vlues.Count == 0)
                return new List<ConsignmentHubStatisticsChartModel>();
            var holidays = GetHolidays();
            vlues = vlues.Where(v => holidays.All(h => !h.Equals(v.CreatedOn))).ToList();

            var dates = dateType.Equals("daily")
                ? DateUtility.GetDaysBetweenRange(DateTime.Today.AddDays(-9), DateTime.Today.AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59), isWorkingDays)
                : dateType.Equals("weekly")
                    ? DateUtility.GetWeeksBetweenRange(DateTime.Today.AddDays(-49), DateTime.Now)
                    : dateType.Equals("monthly")
                        ? DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-6), DateTime.Now)
                        : DateUtility.GetQuartersBetweenRange(DateTime.Today.AddMonths(-24), DateTime.Now);

            dates = RemoveHolidays(dateType, dates, holidays);

            //var dates = dateType.Equals("daily")
            //    ? DateUtility.GetDaysBetweenRange(minDate.Date, DateTime.Now, isWorkingDays)
            //    : dateType.Equals("weekly")
            //        ? DateUtility.GetWeeksBetweenRange(minDate.Date, DateTime.Now)
            //        : dateType.Equals("monthly")
            //            ? DateUtility.GetMonthsBetweenRange(minDate.Date, DateTime.Now)
            //            : DateUtility.GetQuartersBetweenRange(minDate.Date, DateTime.Now);

            var volume = new List<ConsignmentHubStatisticsChartModel>();
            for (int i = 0; i < dates.Count; i++)
            {
                var lowerRange = dates[i];
                var upperRange = dateType.Equals("daily")
                    ? dates[i].AddHours(23).AddMinutes(59).AddSeconds(59)
                    : dateType.Equals("monthly") ? dates[i].AddMonths(1).AddSeconds(-1)
                    : dateType.Equals("weekly") ? dates[i].AddDays(7).AddSeconds(-1)
                    : dates[i].AddMonths(3).AddSeconds(-1);

                volume.Add(new ConsignmentHubStatisticsChartModel
                {
                    DateStr = DateUtility.GetDateStringFromType(upperRange, dateType),
                    StartDate = lowerRange.ToString("yyyy-MM-dd"),
                    EndDate = upperRange.ToString("yyyy-MM-dd HH:mm:ss"),
                    Consignment = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange && v.Consignment.Equals("Yes")),
                    NoConsignment = vlues.Count(v => v.CreatedOn >= lowerRange && v.CreatedOn <= upperRange && v.Consignment.Equals("No"))
                });
            }

            return volume;
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

        public PaStatusUpdateChart GetPaStatusUpdateChart(int programId)
        {
            var vlues = new PaStatusUpdateChart();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPAStatusUpdates]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        vlues.InProcessCount = sqlReader.GetInt("InProcessCount");
                        vlues.DeniedCount = sqlReader.GetInt("DeniedCount");
                        vlues.ApprovedPasCount = sqlReader.GetInt("ApprovedPAsCount");
                    }

                    connection.Close();
                }
            }
            vlues.TotalCount = vlues.InProcessCount + vlues.DeniedCount + vlues.ApprovedPasCount;
            vlues.InProcessCountPercent = (vlues.TotalCount == 0
                ? 0
                : Math.Round(((double) vlues.InProcessCount/(double) vlues.TotalCount)*100, 2));
            vlues.DeniedCountPercent = (vlues.TotalCount == 0
                ? 0
                : Math.Round(((double) vlues.DeniedCount/(double) vlues.TotalCount)*100, 2));
            vlues.ApprovedPasCountPercent = (vlues.TotalCount == 0
                ? 0
                : Math.Round(((double) vlues.ApprovedPasCount/(double) vlues.TotalCount)*100, 2));
            return vlues;
        }

        public List<DateTime> GetHolidays()
        {
            var data = new List<DateTime>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[kaleo].[GetPublicHolidays]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        data.Add(sqlReader.GetDate("Date").Date);
                    }

                    connection.Close();
                }
            }
            return data;
        }

        public CallCenterStatCharts GetCallCenterStatictics(int programId, string programName, string dateFrequency, bool isWorkingDays, string callType)
        {
            var vlues = new List<CallCenterStat>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand("[kaleo].[GetMnfCallCenterStatictics]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("programName", programName);
                sqlCmd.Parameters.AddWithValue("dateFrequency", dateFrequency);
                sqlCmd.Parameters.AddWithValue("callType", callType);
                sqlCmd.CommandTimeout = 500;
                using (var reader = sqlCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var i = 0;
                        decimal d;
                        vlues.Add(new CallCenterStat
                        {
                            AdCallsPresented = reader.GetDouble("AdCallsPresented"),
                            AdCallsHandled = reader.GetDouble("AdCallsHandled"),
                            AdAvgSpeedAnswer = reader.GetDouble("AdAvgSpeedAnswer"),
                            AdAvgHandledTime = reader.GetDouble("AdAvgHandledTime"),
                            AdCallsAbandoned = reader.GetDouble("AdCallsAbandoned"),
                            HlCallsPresented = reader.GetDouble("HlCallsPresented"),
                            HlCallsHandled = reader.GetDouble("HlCallsHandled"),
                            HlAvgSpeedAnswer = reader.GetDouble("HlAvgSpeedAnswer"),
                            HlAvgHandledTime = reader.GetDouble("HlAvgHandledTime"),
                            HlCallsAbandoned = reader.GetDouble("HlCallsAbandoned"),
                            StateDate = reader.GetString("StateDate"),
                            DateType = reader.GetString("DateType"),
                            DateFrequency = reader.GetString("DateFrequency")
                        });
                    }

                    connection.Close();
                }
            }
            var dates = DateRangeUtility.GetDateRange(dateFrequency);
            if (dateFrequency.Equals("Day"))
            {
                var holidays = GetHolidays();
                foreach (var hd in holidays)
                {
                    var hds = hd.ToString("ddd, MMM d");
                    if (dates.Any(d => d.StartFormatted.Equals(hds)))
                        dates.RemoveAll(d => d.StartFormatted.Equals(hds));
                }
            }
            if (dateFrequency.Equals("Month"))
            {
                //var curr = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
                //dates.RemoveAll(d => d.StartDate.Equals(new DateTime(DateTime.Today.Year, 1, 1)));
                //dates.RemoveAll(d => d.StartDate >= curr);
            }

            var asa = new List<CallCenterStatChart>();
            var aht = new List<CallCenterStatChart>();
            var ar = new List<CallCenterStatChart>();
            var ach = new List<CallCenterStatChart>();
            foreach (var d in dates)
            {
                if (isWorkingDays && (d.StartDate.DayOfWeek == DayOfWeek.Saturday || d.StartDate.DayOfWeek == DayOfWeek.Sunday))
                    continue;
                var matchingDate = dateFrequency.Equals("Week") ? d.EndDate.AddDays(1).ToString("ddd, MMM d") : d.StartFormatted;
                var item = vlues.FirstOrDefault(i => i.StateDate.Equals(matchingDate));
                ach.Add(new CallCenterStatChart
                {
                    X = d.StartFormattedForChart,
                    Y = item == null ? 0 : (item.AdCallsHandled + item.HlCallsHandled),
                    AdY = (item?.AdCallsHandled ?? 0),
                    HlY = (item?.HlCallsHandled ?? 0)
                });
                asa.Add(new CallCenterStatChart
                {
                    X = d.StartFormattedForChart,
                    Y = item == null ? 0 : callType.Equals("all")
                        ? GetWeightedAvg(item.AdCallsHandled, item.HlCallsHandled, item.AdAvgSpeedAnswer, item.HlAvgSpeedAnswer, programId)
                        : (item.AdAvgSpeedAnswer + item.HlAvgSpeedAnswer) / (programId == 158 ? 2 : 1),
                    AdY = (item?.AdAvgSpeedAnswer ?? 0) / (programId == 158 ? 2 : 1),
                    HlY = (item?.HlAvgSpeedAnswer ?? 0) / (programId == 158 ? 2 : 1)
                });
                aht.Add(new CallCenterStatChart
                {
                    X = d.StartFormattedForChart,
                    Y = item == null ? 0 : callType.Equals("all")
                        ? GetWeightedAvg(item.AdCallsHandled, item.HlCallsHandled, item.AdAvgHandledTime, item.HlAvgHandledTime, programId)
                        : (item.AdAvgHandledTime + item.HlAvgHandledTime) / (programId == 158 ? 2 : 1),
                    AdY = (item?.AdAvgHandledTime ?? 0) / (programId == 158 ? 2 : 1),
                    HlY = (item?.HlAvgHandledTime ?? 0) / (programId == 158 ? 2 : 1)
                });
                ar.Add(new CallCenterStatChart
                {
                    X = d.StartFormattedForChart,
                    Y = (item == null ? 0 : (item.AdCallsPresented + item.HlCallsPresented == 0 ? 0 : (item.AdCallsAbandoned + item.HlCallsAbandoned) / (item.AdCallsPresented + item.HlCallsPresented))),
                    AdY = (item == null ? 0 : (item.AdCallsPresented == 0 ? 0 : item.AdCallsAbandoned / item.AdCallsPresented)),
                    HlY = (item == null ? 0 : (item.HlCallsPresented == 0 ? 0 : item.HlCallsAbandoned / item.HlCallsPresented)),
                    AdPresented = item?.AdCallsPresented ?? 0,
                    HlPresented = item?.HlCallsPresented ?? 0,
                    AdAbandoned = item?.AdCallsAbandoned ?? 0,
                    HlAbandoned = item?.HlCallsAbandoned ?? 0,
                    AdHandled = item?.AdCallsHandled ?? 0,
                    HlHandled = item?.HlCallsHandled ?? 0,
                });
            }

            //if (isWorkingDays)
            {
                asa = asa.Take(6).ToList();
                aht = aht.Take(6).ToList();
                ar = ar.Take(6).ToList();
                ach = ach.Take(6).ToList();
            }

            var charts = new CallCenterStatCharts
            {
                AvgSpeedAnswer = asa,
                AvgHandleTime = aht,
                AbandonmentRate = ar,
                CallsHandled = ach
            };

            charts.AvgSpeedAnswer.Reverse();
            charts.AvgHandleTime.Reverse();
            charts.AbandonmentRate.Reverse();
            charts.CallsHandled.Reverse();

            return charts;
        }

        public OutboundCharts GetHubStatisticsOutboundCallStatistics(int programId, string dateType, bool excludeNonWorkingDays, string callType)
        {
            var vlues = new List<OutboundCallModel>();
            var dates = dateType.Equals("daily")
                ? DateUtility.GetDaysBetweenRange(DateTime.Today.AddDays(-7), DateTime.Today.AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59), excludeNonWorkingDays)
                : dateType.Equals("weekly")
                    ? DateUtility.GetWeeksBetweenRange(DateTime.Today.AddDays(-42), DateTime.Now)
                    : dateType.Equals("monthly")
                        ? DateUtility.GetMonthsBetweenRange(DateTime.Today.AddMonths(-6), DateTime.Now)
                        : DateUtility.GetQuartersBetweenRange(DateTime.Today.AddMonths(-24), DateTime.Now);

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[kaleo].[GetMnfOutboundCallStatistics]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.CommandTimeout = 500;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("dateType", dateType);
                sqlCmd.Parameters.AddWithValue("callType", callType);

                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new OutboundCallModel
                        {
                            AcTotalCalls = sqlReader["AcTotalCalls"] != null ? long.Parse(sqlReader["AcTotalCalls"].ToString()) : 0,
                            AcDurationCause = sqlReader["AcDurationCause"] != null ? long.Parse(sqlReader["AcDurationCause"].ToString()) : 0,
                            AcCauseValue = sqlReader["AcCauseValue"] != null ? long.Parse(sqlReader["AcCauseValue"].ToString()) : 0,
                            McTotalCalls = sqlReader["McTotalCalls"] != null ? long.Parse(sqlReader["McTotalCalls"].ToString()) : 0,
                            McDurationCause = sqlReader["McDurationCause"] != null ? long.Parse(sqlReader["McDurationCause"].ToString()) : 0,
                            McCauseValue = sqlReader["McCauseValue"] != null ? long.Parse(sqlReader["McCauseValue"].ToString()) : 0,
                            Date = sqlReader.GetDate("Date"),
                            WeekNumber = sqlReader["WeekNumber"] != null ? int.Parse(sqlReader["WeekNumber"].ToString()) : 0,
                            MonthNumber = sqlReader["MonthNumber"] != null ? int.Parse(sqlReader["MonthNumber"].ToString()) : 0,
                            Year = sqlReader["Year"] != null ? int.Parse(sqlReader["Year"].ToString()) : 0,
                        });
                    }

                    connection.Close();
                }
            }

            if (vlues.Count == 0)
                return new OutboundCharts();

            vlues = dateType.Equals("daily")
                ? vlues.OrderBy(d => d.Date).ToList()
                : dateType.Equals("weekly")
                    ? vlues.OrderBy(d => d.Year).ThenBy(d => d.WeekNumber).ToList()
                    : vlues.OrderBy(d => d.Year).ThenBy(d => d.MonthNumber).ToList();

            var holidays = GetHolidays();
            //dates = RemoveHolidays(dateType, dates, holidays);
            vlues = RemoveHolidays(dateType, vlues, holidays);

            if (dateType.Equals("monthly"))
            {
                //dates.RemoveAll(d => d.Equals(new DateTime(2017, 1, 1)));
                //vlues.RemoveAll(d => d.MonthNumber == 1 && d.Year == DateTime.Today.Year);
            }

            var totalCalls = new List<OutboundTotalCallsChart>();
            var avgCallLengths = new List<OutboundAvgCallLengthChart>();
            //for (int i = 0; i < dates.Count; i++)
            //{
            //    var lowerRange = dates[i].AddHours(4);
            //    var upperRange = dateType.Equals("daily")
            //        ? dates[i].AddHours(23).AddMinutes(59).AddSeconds(59).AddHours(4)
            //        : dateType.Equals("monthly") ? dates[i].AddMonths(1).AddSeconds(-1).AddHours(4)
            //        : dateType.Equals("weekly") ? dates[i].AddDays(7).AddSeconds(-1).AddHours(4)
            //        : dates[i].AddMonths(3).AddSeconds(-1).AddHours(4);

            //    totalCalls.Add(new OutboundTotalCallsChart
            //    {
            //        Date = DateUtility.GetDateStringFromType(upperRange.AddHours(-4), dateType),
            //        TotalCalls = vlues.Count(v => v.DateTimeOriginal >= lowerRange && v.DateTimeOriginal <= upperRange)
            //    });

            //    var count = vlues.Where(v => v.DateTimeOriginal >= lowerRange && v.DateTimeOriginal <= upperRange).Sum(v=>v.CauseValue);
            //    var sum = vlues.Where(v => v.DateTimeOriginal >= lowerRange && v.DateTimeOriginal <= upperRange).Sum(v=>v.Duration * v.CauseValue);
            //    avgCallLengths.Add(new OutboundAvgCallLengthChart
            //    {
            //        Date = DateUtility.GetDateStringFromType(upperRange.AddHours(-4), dateType),
            //        AvgCallLength = count == 0 ? 0 : Math.Round((double)sum / (double)count, 2)
            //    });
            //}

            foreach (var v in vlues)
            {
                totalCalls.Add(new OutboundTotalCallsChart
                {
                    Date = DateUtility.GetDateStringFromType(
                            dateType.Equals("daily")
                                ? v.Date
                                : dateType.Equals("weekly")
                                    ? ExtensionMethods.DateFromWeekNumber(v.Year, v.WeekNumber)
                                    : new DateTime(v.Year, v.MonthNumber, 1), dateType),
                    AcTotalCalls = v.AcTotalCalls,
                    McTotalCalls = v.McTotalCalls
                });

                avgCallLengths.Add(new OutboundAvgCallLengthChart
                {
                    Date = DateUtility.GetDateStringFromType(
                            dateType.Equals("daily")
                                ? v.Date
                                : dateType.Equals("weekly")
                                    ? ExtensionMethods.DateFromWeekNumber(v.Year, v.WeekNumber)
                                    : new DateTime(v.Year, v.MonthNumber, 1), dateType),
                    AvgCallLength = v.AcCauseValue + v.McCauseValue == 0 ? 0 : Math.Round((double)(v.AcDurationCause + v.McDurationCause) / (double)(v.AcCauseValue + v.McCauseValue), 2),
                    AcAvgCallLength = v.AcCauseValue == 0 ? 0 : Math.Round((double)v.AcDurationCause / (double)v.AcCauseValue, 2),
                    McAvgCallLength = v.McCauseValue == 0 ? 0 : Math.Round((double)v.McDurationCause / (double)v.McCauseValue, 2)
                });
            }

            return new OutboundCharts
            {
                TotalCallsChart = Enumerable.Reverse(totalCalls).Take(6).Reverse().ToList(),
                AvgCallLengthChart = Enumerable.Reverse(avgCallLengths).Take(6).Reverse().ToList()
            };
        }

        public List<ReferralStatus> GetReferralStatusChart(int programId,string userType,string userId)
        {
            var vlues = new List<ReferralStatus>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetReferralsStatus]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("userType", userType);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ReferralStatus
                        {
                            ProgramSubstatus = sqlReader.GetString("ProgramSubstatus"),
                            ReferralCount = sqlReader.GetInt("ReferralCount")
                        });
                    }

                    connection.Close();
                }

                var total = vlues.Sum(v => v.ReferralCount);
                vlues.ForEach(v=>{ v.TotalReferralCount = total; });
            }
            return vlues;
        }

        public PharmacyReferrals GetPharmacyReferralsByAssignedOn(int programId, string userId, string userType, string inpTreatment, bool isArmadaEmployee, string dateType, bool includeAllStatuses, string referral, string pharmacy)
        {
            var dates = DateUtility.GetDates(dateType, programId, _connectionString);
            var referrals = new List<Referrals>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetPharmacyReferralsByAssignedOn]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("ProgramID", programId);
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.Parameters.AddWithValue("UserType", userType);
                sqlCmd.Parameters.AddWithValue("InpTreatment", inpTreatment);
                sqlCmd.Parameters.AddWithValue("IsArmadaEmployee", isArmadaEmployee);
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.Parameters.AddWithValue("IncludeAllStatuses", includeAllStatuses);
                sqlCmd.Parameters.AddWithValue("Referral", referral);
                sqlCmd.Parameters.AddWithValue("Pharmacy", pharmacy);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        referrals.Add(new Referrals
                        {
                            TotalCount = sqlReader["TotalCount"] == null ? 0 : int.Parse(sqlReader["TotalCount"].ToString()),
                            PharmacyId = sqlReader["FillingPharmacyID"] == null ? -1 : int.Parse(sqlReader["FillingPharmacyID"].ToString()),
                            ProgramId = sqlReader["ProgramID"] == null ? -1 : int.Parse(sqlReader["ProgramID"].ToString()),
                            PharmacyName = sqlReader["FillingPharmacyName"] == null ? "" : sqlReader["FillingPharmacyName"].ToString(),
                            Referral = referral
                        });
                    }

                    connection.Close();
                }
            }
            var revisedReferrals = new List<Referrals>();
            if (programId == -1)
            {
                //var programCount = GetProgramCount(userId);
                //programCount = programCount == 0 ? 1 : programCount;
                var disPharmacies = referrals.Select(s => s.PharmacyId).Distinct();
                foreach (var pId in disPharmacies)
                {
                    var tempReferrals = referrals.Where(s => s.PharmacyId == pId).ToList();
                    revisedReferrals.Add(new Referrals
                    {
                        TotalCount = tempReferrals.Sum(s => s.TotalCount),
                        ProgramId = programId,
                        PharmacyId = pId,
                        PharmacyName = tempReferrals.First().PharmacyName,
                        Referral = referral
                    });
                }
            }
            else
                revisedReferrals = referrals;

            var pharmacyReferrals = new PharmacyReferrals();
            pharmacyReferrals.TotalCount = revisedReferrals.Sum(s => s.TotalCount);
            foreach (var s in revisedReferrals)
            {
                s.TotalCountPercent = (double)s.TotalCount / pharmacyReferrals.TotalCount;
            }
            pharmacyReferrals.Referrals = revisedReferrals;
            pharmacyReferrals.DateString = DateUtility.GetDateString(dateType);
            return pharmacyReferrals;
        }

        public List<RxcReason> GetRxcReasonByPrescriber(int programId, string userId, string userType, string firstName, string lastName)
        {
            var reasons = new List<RxcReason>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetRxcReasonByPrescriber]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("programId", programId);
                sqlCmd.Parameters.AddWithValue("userId", userId);
                sqlCmd.Parameters.AddWithValue("userType", userType);
                sqlCmd.Parameters.AddWithValue("prescriberFirstName", string.IsNullOrEmpty(firstName) || firstName == "-1" || firstName == "null" ? DBNull.Value : (object)firstName);
                sqlCmd.Parameters.AddWithValue("prescriberLastName", string.IsNullOrEmpty(lastName) || lastName == "-1" || lastName == "null" ? DBNull.Value : (object)lastName);
                sqlCmd.CommandTimeout = 5000;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        reasons.Add(new RxcReason
                        {
                            Reason = sqlReader.GetString("Reason"),
                            RxcReasonCount = sqlReader.GetInt("RxcReasonCount")
                        });
                    }

                    connection.Close();
                }
            }

            var total = reasons.Sum(r => r.RxcReasonCount);
            reasons.ForEach(r =>
            {
                r.TotalCount = total;
                r.RxcReasonCountPercent = total == 0 ? 0 : Math.Round(((double)r.RxcReasonCount / total) * 100, 2);
            });

            return reasons.OrderBy(r=>r.RxcReasonCount).ToList();
        }

        public int GetWaitedRequests()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"select count(*) from [report].[ReportRequestQueue] where StatusString = 'REQUESTED'", connection);
                sqlCmd.CommandTimeout = 500;
                var rows = sqlCmd.ExecuteScalar();
                return int.Parse(rows.ToString());
            }
            return 0;
        }

        private double GetWeightedAvg(double val1, double val2, double weight1, double weight2, int programId)
        {
            if (val2 + val2 == 0) return 0;
            return ((val1 / (val1 + val2)) * weight1 + (val2 / (val1 + val2)) * weight2) / (programId == 158 ? 2: 1);
        }

        private List<DateTime> RemoveHolidays(string dateType, List<DateTime> dates, List<DateTime> holidays)
        {
            return dateType.Equals("daily") ? dates.Where(v => holidays.All(h => !h.Equals(v))).ToList() : dates;
        }

        private List<OutboundCallModel> RemoveHolidays(string dateType, List<OutboundCallModel> dates, List<DateTime> holidays)
        {
            return dateType.Equals("daily") ? dates.Where(v => holidays.All(h => !h.Equals(v.Date))).ToList() : dates;
        }

        private List<ProgramMap> SetRange(List<ProgramMap> maps)
        {
            var max = maps.Max(m => m.TotalCount);
            var part = (double)max/6;
            var range = (int)Math.Ceiling(part);
            foreach (var map in maps)
            {
                map.R1LLimit = (range * 0) + 1; ;
                map.R1ULimit = range * 1;
                map.R2LLimit = (range * 1) + 1;
                map.R2ULimit = range * 2;

                map.R3LLimit = (range * 2) + 1;
                map.R3ULimit = range * 3;
                map.R4LLimit = (range * 3) + 1;
                map.R4ULimit = range * 4;
                map.R5LLimit = (range * 4) + 1;
                map.R5ULimit = range * 5;
                map.R6LLimit = (range * 5) + 1;
                map.R6ULimit = range * 6;
            }

            return maps;
        }

        private List<PAProgramMap> SetPaRange(List<PAProgramMap> maps)
        {
            var max = maps.Max(m => m.TotalCount);
            var part = (double)max / 6;
            var range = (int)Math.Ceiling(part);
            foreach (var map in maps)
            {
                map.R1LLimit = (range * 0) + 1; ;
                map.R1ULimit = range * 1;
                map.R2LLimit = (range * 1) + 1;
                map.R2ULimit = range * 2;

                map.R3LLimit = (range * 2) + 1;
                map.R3ULimit = range * 3;
                map.R4LLimit = (range * 3) + 1;
                map.R4ULimit = range * 4;
                map.R5LLimit = (range * 4) + 1;
                map.R5ULimit = range * 5;
                map.R6LLimit = (range * 5) + 1;
                map.R6ULimit = range * 6;
            }

            return maps;
        }
    }
}