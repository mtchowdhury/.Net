using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ArmadaReports.Web.SurveyMonkey
{
    public class StoredProcedureService
    {
        private readonly string _connectionString;

        public StoredProcedureService(string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException(connectionString);

            _connectionString = connectionString;
        }

        public IEnumerable<T> GetData<T>(string storedProcedureName, SqlParameter[] storedProcedureParameters = null) where T : new()
        {
            var data = new List<T>();

            using (SqlConnection sqlConnection = new SqlConnection(_connectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand(storedProcedureName, sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    if (storedProcedureParameters != null)
                        sqlCommand.Parameters.AddRange(storedProcedureParameters);

                    sqlConnection.Open();

                    using (SqlDataReader reader = sqlCommand.ExecuteReader(CommandBehavior.CloseConnection))
                    {
                        var columnNames = Enumerable.Range(0, reader.FieldCount).Select(reader.GetName).ToList();
                        while (reader.Read())
                        {
                            var entity = new T();
                            foreach (string columnName in columnNames)
                            {
                                string propertyName = columnName.Replace(" ", "_");

                                PropertyInfo property = entity.GetType().GetProperty(propertyName);

                                if (property == null)
                                    throw new ArgumentException($"Property with the name {propertyName} is not found");

                                try
                                {
                                    property.SetValue(entity, reader[columnName] == DBNull.Value ? null : reader[columnName]);
                                }
                                catch (ArgumentException ex)
                                {
                                    throw new ArgumentException($"{columnName}: {ex.Message}");
                                }
                            }

                            data.Add(entity);
                        }
                    }
                }
            }

            return data;
        }
    }
}