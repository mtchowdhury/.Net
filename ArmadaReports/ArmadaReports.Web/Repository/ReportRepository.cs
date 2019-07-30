using ArmadaReports.Web.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Extension;

namespace ArmadaReports.Web.Repository
{
    public class ReportRepository
    {
        private readonly string _connectionString;
        public ReportRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<ReportRegistrationModel> GetRegistrationReportData(string applicationId)
        {
            var data = new List<ReportRegistrationModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCommand = new SqlCommand(@"[analytics].[GetProgramRegistrationReport]", connection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddWithValue("ApplicationNameID", applicationId);
                sqlCommand.CommandTimeout = 500;
                connection.Open();

                using (var sqlReader = sqlCommand.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        data.Add(new ReportRegistrationModel
                        {
                            Organization = ((IDataRecord)sqlReader).HasColumn("Organization") && sqlReader["Organization"] != null ? sqlReader["Organization"].ToString() : string.Empty,
                            CreateDate = ((IDataRecord)sqlReader).HasColumn("CreateDate") && sqlReader["CreateDate"] != null ? DateUtility.FormatDate(sqlReader["CreateDate"].ToString(), "yyyy-MM-dd") : string.Empty,
                            PhoneNumber = ((IDataRecord)sqlReader).HasColumn("PhoneNumber") && sqlReader["PhoneNumber"] != null ? sqlReader["PhoneNumber"].ToString() : string.Empty,
                            ApplicationName = ((IDataRecord)sqlReader).HasColumn("ApplicationName") && sqlReader["ApplicationName"] != null ? sqlReader["ApplicationName"].ToString() : string.Empty,
                            FirstName = ((IDataRecord)sqlReader).HasColumn("FirstName") && sqlReader["FirstName"] != null ? sqlReader["FirstName"].ToString() : string.Empty,
                            LastName = ((IDataRecord)sqlReader).HasColumn("LastName") && sqlReader["LastName"] != null ? sqlReader["LastName"].ToString() : string.Empty,
                            Address1 = ((IDataRecord)sqlReader).HasColumn("Address1") && sqlReader["Address1"] != null ? sqlReader["Address1"].ToString() : string.Empty,
                            City = ((IDataRecord)sqlReader).HasColumn("city") && sqlReader["city"] != null ? sqlReader["city"].ToString() : string.Empty,
                            State = ((IDataRecord)sqlReader).HasColumn("State") && sqlReader["State"] != null ? sqlReader["State"].ToString() : string.Empty,
                            Zip = ((IDataRecord)sqlReader).HasColumn("Zip") && sqlReader["Zip"] != null ? sqlReader["Zip"].ToString() : string.Empty,
                            NPI = ((IDataRecord)sqlReader).HasColumn("npi") && sqlReader["npi"] != null ? sqlReader["npi"].ToString() : string.Empty,
                            Phone = ((IDataRecord)sqlReader).HasColumn("Phone") && sqlReader["Phone"] != null ? sqlReader["Phone"].ToString() : string.Empty,
                        });
                    }
                }
                connection.Close();
            }

            return data;
        }

        public List<SalesRepActivityModel> GetSalesRepActivity(string programName)
        {
            var data = new List<SalesRepActivityModel>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCommand = new SqlCommand(@"[analytics].[GetSalesRepActivity]", connection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddWithValue("programName", programName);
                sqlCommand.CommandTimeout = 500;
                connection.Open();

                using (var sqlReader = sqlCommand.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        data.Add(new SalesRepActivityModel
                        {
                            UserName = ((IDataRecord)sqlReader).HasColumn("UserName") && sqlReader["UserName"] != null ? sqlReader["UserName"].ToString() : string.Empty,
                            LastLoginDate = ((IDataRecord)sqlReader).HasColumn("LastLoginDate") && sqlReader["LastLoginDate"] != null ? DateUtility.FormatDate(sqlReader["LastLoginDate"].ToString(), "yyyy-MM-dd") : string.Empty,
                            AccessedOn = ((IDataRecord)sqlReader).HasColumn("Accessedon") && sqlReader["Accessedon"] != null ? DateUtility.FormatDate(sqlReader["Accessedon"].ToString(), "yyyy-MM-dd") : string.Empty,
                            Email = ((IDataRecord)sqlReader).HasColumn("email") && sqlReader["email"] != null ? sqlReader["email"].ToString() : string.Empty,
                            UserType = ((IDataRecord)sqlReader).HasColumn("usertype") && sqlReader["usertype"] != null ? sqlReader["usertype"].ToString() : string.Empty,
                            ProgramName = ((IDataRecord)sqlReader).HasColumn("ProgramName") && sqlReader["ProgramName"] != null ? sqlReader["ProgramName"].ToString() : string.Empty,
                            AccessedCount = ((IDataRecord)sqlReader).HasColumn("AccessCount") && sqlReader["AccessCount"] != null ? int.Parse(sqlReader["AccessCount"].ToString()) : 0
                        });
                    }
                }
                connection.Close();
            }

            return data;
        }

        public NewRxByPhysicianData GetNewRxByPhysician(int programId, string userId, string userType)
        {
            var data = new List<NewRxByPhysician>();
            var columns = new List<string>();
            for (var i = 0; i <= 20; i++)
            {
                columns.Add(DateTime.Today.AddDays(-i).ToString("MM-dd-yyyy"));
            }
            using (var connection = new SqlConnection(_connectionString))
            {
                var sqlCommand = new SqlCommand(@"[analytics].[GetNewRxByPhysician]", connection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddWithValue("programId", programId);
                sqlCommand.Parameters.AddWithValue("userID ", userId);
                sqlCommand.Parameters.AddWithValue("userType", userType);
                sqlCommand.CommandTimeout = 500;
                connection.Open();

                using (var sqlReader = sqlCommand.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        var datesCount = columns.Select(column => sqlReader.GetInt(column)).ToList();
                        data.Add(new NewRxByPhysician
                        {
                            PhysicianFirstName = sqlReader.GetString("PhysicianFirstName"),
                            PhysicianLastName = sqlReader.GetString("PhysicianLastName"),
                            PhysicianNPI = sqlReader.GetString("PhysicianNPI"),
                            DrugName = sqlReader.GetString("DrugName"),
                            Strength = sqlReader.GetString("Strength"),
                            DatesCount = datesCount
                        });
                    }
                }
                connection.Close();
            }

            var npis = data.Select(d => d.PhysicianNPI).Distinct().ToList();
            var revisedData = new List<NewRxByPhysician>();

            foreach (var npi in npis)
            {
                var physicianWiseData = data.Where(d => d.PhysicianNPI.Equals(npi)).ToList();
                var dateWiseTotal = new List<int>();
                for (int i = 0; i < columns.Count; i++)
                {
                    dateWiseTotal.Add(physicianWiseData.Sum(p => p.DatesCount[i]));
                }
                revisedData.AddRange(physicianWiseData);
                revisedData.Add(new NewRxByPhysician
                {
                    PhysicianFirstName = "",
                    PhysicianLastName = "",
                    PhysicianNPI = "",
                    DrugName = "",
                    Strength = "Total",
                    DatesCount = dateWiseTotal
                });
            }

            var dateWiseGTotal = new List<int>();
            for (int i = 0; i < columns.Count; i++)
            {
                dateWiseGTotal.Add(data.Sum(p => p.DatesCount[i]));
            }
            revisedData.Add(new NewRxByPhysician
            {
                PhysicianFirstName = "",
                PhysicianLastName = "",
                PhysicianNPI = "",
                DrugName = "",
                Strength = "Grand Total",
                DatesCount = dateWiseGTotal
            });

            return new NewRxByPhysicianData {Columns = columns, Rows = revisedData};
        }
    }
}