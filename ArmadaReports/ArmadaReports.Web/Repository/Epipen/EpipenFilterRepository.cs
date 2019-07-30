using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models;

namespace ArmadaReports.Web.Repository.Epipen
{
    public class EpipenFilterRepository
    {
        private readonly string _connectionString;
        public EpipenFilterRepository(string connectionString)
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

        public List<FilterValue> GetSchoolZips(string inpCustomerCategory, string state)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenSchoolZip]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("State", state);
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
            var newVals = new List<FilterValue> {new FilterValue {Value = "All", Name = "All"} };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetSchoolNames(string inpCustomerCategory, string state, string zip)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenSchoolName]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("Zip", zip);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetSchoolNamesStr(string inpCustomerCategory, string state, string zip, string schoolNameStr)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenSchoolNameStr]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("Zip", zip);
                sqlCmd.Parameters.AddWithValue("SchoolNameStr", schoolNameStr);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetBatchIds(string state, string zip)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenBatchId]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("Zip", zip);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetOrderIds(string state, string zip, string batchId)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenOrderId]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("Zip", zip);
                if(batchId.Equals("All"))
                    sqlCmd.Parameters.AddWithValue("BatchId", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("BatchId", batchId);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetOrderIdsStr(string state, string zip, string batchId, string orderId)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenOrderIdStr]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("Zip", zip);
                sqlCmd.Parameters.AddWithValue("OrderId", orderId);
                if (batchId.Equals("All"))
                    sqlCmd.Parameters.AddWithValue("BatchId", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("BatchId", batchId);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetPharmacies(string batchId)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenPharmacy]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                if (batchId.Equals("All"))
                    sqlCmd.Parameters.AddWithValue("BatchId", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("BatchId", batchId);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetDoctors(string orderId)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenDoctor]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                if (orderId.Equals("All"))
                    sqlCmd.Parameters.AddWithValue("OrderId", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("OrderId", orderId);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }

        public List<FilterValue> GetContacts(string state, string zip, string orderId)
        {
            var vlues = new List<FilterValue>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenContact]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("Zip", zip);
                if (orderId.Equals("All"))
                    sqlCmd.Parameters.AddWithValue("OrderId", DBNull.Value);
                else
                    sqlCmd.Parameters.AddWithValue("OrderId", orderId);
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
            var newVals = new List<FilterValue> { new FilterValue { Value = "All", Name = "All" } };
            newVals.AddRange(vlues);
            return newVals;
        }
    }
}