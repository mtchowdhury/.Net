using ArmadaReports.Web.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ArmadaReports.Web.Repository
{
    public class UserRepository
    {
        private readonly string _connectionString;
        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public AnalyticUser GetUserById(string userId)
        {
            try
            {
                var user = new AnalyticUser();
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[analytics].[GetUserById]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("UserID", userId);
                    sqlCmd.CommandTimeout = 500;
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        if (sqlReader.Read())
                        {
                            user.UserId = sqlReader["UserID"] == null ? string.Empty : sqlReader["UserID"].ToString();
                            user.UserType = sqlReader["UserType"] == null ? string.Empty : sqlReader["UserType"].ToString();
                            user.FullName = sqlReader["FullName"] == null ? string.Empty : sqlReader["FullName"].ToString();
                        }

                        connection.Close();
                    }
                }
                return user;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public AnalyticUser GetUserByName(string userName)
        {
            try
            {
                var user = new AnalyticUser();
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var sqlCmd = new SqlCommand(@"[analytics].[GetUserByName]", connection);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCmd.Parameters.AddWithValue("UserName", userName);
                    sqlCmd.CommandTimeout = 500;
                    using (var sqlReader = sqlCmd.ExecuteReader())
                    {
                        if (sqlReader.Read())
                        {
                            user.UserId = sqlReader["UserID"] == null ? string.Empty : sqlReader["UserID"].ToString();
                            user.UserType = sqlReader["UserType"] == null ? string.Empty : sqlReader["UserType"].ToString();
                            user.FullName = sqlReader["FullName"] == null ? string.Empty : sqlReader["FullName"].ToString();
                        }

                        connection.Close();
                    }
                }
                return user;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string GetUserPrivilege(string userId)
        {
            var privilege = "";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenPrivilege]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        privilege = (sqlReader["RoleName"]?.ToString() ?? "");
                    }

                    connection.Close();
                }
            }
            return privilege;
        }

        public UserRole GetRoleByUser(string userId)
        {
            var role = new UserRole();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[analytics].[GetRoleByUser]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserID", userId);
                sqlCmd.CommandTimeout = 500;
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

        public string IsCipherUser(string userId)
        {
            var exists = "";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sqlCmd = new SqlCommand(@"[config].[IsCipherUser]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("UserId", userId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    if (sqlReader.Read())
                    {
                        exists = (sqlReader["Exists"]?.ToString() ?? "");
                    }

                    connection.Close();
                }
            }
            return exists;
        }       
    }
}