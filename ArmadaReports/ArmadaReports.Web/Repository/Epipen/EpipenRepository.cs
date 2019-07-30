using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models;
using ArmadaReports.Web.Models.Epipen;

namespace ArmadaReports.Web.Repository.Epipen
{
    public class EpipenRepository
    {
        private readonly string _connectionString;
        public EpipenRepository(string connectionString)
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

        public List<SchoolCount> GetSchoolCounts(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, int totalAt)
        {
            var vlues = new List<SchoolCount>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenSchoolByStateAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate);
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("InpStateReleaseDate", inpStateReleaseDate);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new SchoolCount
                        {
                            DistinctSchoolCount = sqlReader["DistinctSchoolCount"] == null ? 0 : int.Parse(sqlReader["DistinctSchoolCount"].ToString()),
                            SchoolDiff = sqlReader["SchoolDiff"] == null ? 0 : int.Parse(sqlReader["SchoolDiff"].ToString()),
                            SchoolState = !inpStateReleaseDate.Equals("ReleaseDate") ? (sqlReader["SchoolState"]?.ToString() ?? "") : (sqlReader["SchoolState"] == null ? "" : DateTime.Parse(sqlReader["SchoolState"].ToString()).ToString("MM/dd/yyyy")),
                            TotalSchoolCount = sqlReader["TotalSchoolCount"] == null ? 0 : int.Parse(sqlReader["TotalSchoolCount"].ToString()),
                            DdlBegDate = begDate.Split(' ').First(),
                            DdlEndDate = endDate.Split(' ').First()
                        });
                    }

                    connection.Close();
                }
            }
            var totalSchoolCount = vlues.Sum(s => s.TotalSchoolCount);
            var totalDiff = vlues.Sum(s => s.SchoolDiff);
            var totalDistinctSchoolCount = vlues.Sum(s => s.DistinctSchoolCount);
            vlues = vlues.OrderBy(v => v.SchoolState).ToList();
            var total = new SchoolCount
            {
                SchoolState = "Grand Total:",
                SchoolDiff = totalDiff,
                TotalSchoolCount = totalSchoolCount,
                DistinctSchoolCount = totalDistinctSchoolCount,
                DdlBegDate = begDate.Split(' ').First(),
                DdlEndDate = endDate.Split(' ').First()
            };
            var t= totalAt- 1;
            while(t<vlues.Count){
                vlues.Insert(t,total);
                t+= totalAt;
            }
            vlues.Add(total);
            return vlues;
        }






        public List<SchoolCount> GetDetailsSchoolCounts(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, string date, string state, int totalAt)
        {
            var vlues = new List<SchoolCount>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenSchoolByStateAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate.Contains(" ") ? endDate : endDate + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("InpStateReleaseDate", inpStateReleaseDate);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new SchoolCount
                        {
                            DistinctSchoolCount = sqlReader["DistinctSchoolCount"] == null ? 0 : int.Parse(sqlReader["DistinctSchoolCount"].ToString()),
                            SchoolDiff = sqlReader["SchoolDiff"] == null ? 0 : int.Parse(sqlReader["SchoolDiff"].ToString()),
                            SchoolState = sqlReader["SchoolState"]?.ToString() ?? "",
                            TotalSchoolCount = sqlReader["TotalSchoolCount"] == null ? 0 : int.Parse(sqlReader["TotalSchoolCount"].ToString())
                        });
                    }

                    connection.Close();
                }
            }
            if (inpStateReleaseDate.Equals("ReleaseDate"))
                vlues = vlues.Where(v => v.SchoolState.Equals(date)).ToList();
            else if (!state.Equals("All"))
                vlues = vlues.Where(v => v.SchoolState.Equals(state)).ToList();
            var totalSchoolCount = vlues.Sum(s => s.TotalSchoolCount);
            var totalDiff = vlues.Sum(s => s.SchoolDiff);
            var totalDistinctSchoolCount = vlues.Sum(s => s.DistinctSchoolCount);
            vlues = vlues.OrderBy(v => v.SchoolState).ToList();
            if (inpStateReleaseDate.Equals("ReleaseDate"))
            {
                vlues.ForEach(v =>
                {
                    v.SchoolState = DateTime.Parse(v.SchoolState).ToString("MM/dd/yyyy");
                });
            }
            var total = new SchoolCount { SchoolState = "Grand Total:", SchoolDiff = totalDiff, TotalSchoolCount = totalSchoolCount, DistinctSchoolCount = totalDistinctSchoolCount };
            var t= totalAt - 1;
            while(t<vlues.Count){
                vlues.Insert(t,total);
                t+= totalAt;
            }
            vlues.Add(total);
            return vlues;
        }

        public List<NewRepeatCust> GetNewRepeatCustomers(string inpCustomerCategory, string disneySchoolId, string state, int year, int totalAt)
        {
            var vlues = new List<NewRepeatCustomer>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenNewRepeatCustomerAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new NewRepeatCustomer
                        {
                            EnrollmentSchool = sqlReader["EnrollmentSchool"] == null ? 0 : int.Parse(sqlReader["EnrollmentSchool"].ToString()),
                            AllSchoolIDs = sqlReader["AllSchoolIDs"] == null ? 0 : int.Parse(sqlReader["AllSchoolIDs"].ToString()),
                            SchoolState = sqlReader["SchoolState"]?.ToString() ?? "",
                            Customer2012 = sqlReader["Customer2012"] == null ? 0 : int.Parse(sqlReader["Customer2012"].ToString()),
                            Customer2013 = sqlReader["Customer2013"] == null ? 0 : int.Parse(sqlReader["Customer2013"].ToString()),
                            Customer2014 = sqlReader["Customer2014"] == null ? 0 : int.Parse(sqlReader["Customer2014"].ToString()),
                            Customer2015 = sqlReader["Customer2015"] == null ? 0 : int.Parse(sqlReader["Customer2015"].ToString()),
                            Customer2016 = sqlReader["Customer2016"] == null ? 0 : int.Parse(sqlReader["Customer2016"].ToString()),
                            Customer2017 = sqlReader["Customer2017"] == null ? 0 : int.Parse(sqlReader["Customer2017"].ToString()),
                            Customer2018 = sqlReader["Customer2018"] == null ? 0 : int.Parse(sqlReader["Customer2018"].ToString()),
                            New2012 = 0,
                            New2013 = sqlReader["New2013"] == null ? 0 : int.Parse(sqlReader["New2013"].ToString()),
                            New2014 = sqlReader["New2014"] == null ? 0 : int.Parse(sqlReader["New2014"].ToString()),
                            New2015 = sqlReader["New2015"] == null ? 0 : int.Parse(sqlReader["New2015"].ToString()),
                            New2016 = sqlReader["New2016"] == null ? 0 : int.Parse(sqlReader["New2016"].ToString()),
                            New2017 = sqlReader["New2017"] == null ? 0 : int.Parse(sqlReader["New2017"].ToString()),
                            New2018 = sqlReader["New2018"] == null ? 0 : int.Parse(sqlReader["New2018"].ToString()),
                            Repeat2012 = 0,
                            Repeat2013 = sqlReader["Repeat2013"] == null ? 0 : int.Parse(sqlReader["Repeat2013"].ToString()),
                            Repeat2014 = sqlReader["Repeat2014"] == null ? 0 : int.Parse(sqlReader["Repeat2014"].ToString()),
                            Repeat2015 = sqlReader["Repeat2015"] == null ? 0 : int.Parse(sqlReader["Repeat2015"].ToString()),
                            Repeat2016 = sqlReader["Repeat2016"] == null ? 0 : int.Parse(sqlReader["Repeat2016"].ToString()),
                            Repeat2017 = sqlReader["Repeat2017"] == null ? 0 : int.Parse(sqlReader["Repeat2017"].ToString()),
                            Repeat2018 = sqlReader["Repeat2018"] == null ? 0 : int.Parse(sqlReader["Repeat2018"].ToString()),
                            CustomerAllYears = sqlReader["CustomerAllYears"] == null ? 0 : int.Parse(sqlReader["CustomerAllYears"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }
            vlues = state.Equals("All") ? vlues : vlues.Where(c => c.SchoolState.Equals(state)).ToList();
            var customers = new List<NewRepeatCust>();
            if (year == 2018)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2018,
                        Repeat = c.Repeat2018,
                        Customer = c.Customer2018,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2018 / c.CustomerAllYears) * 100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2018 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            else if (year == 2017)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2017,
                        Repeat = c.Repeat2017,
                        Customer = c.Customer2017,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2017 / c.CustomerAllYears) * 100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2017 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            else if (year == 2016)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2016,
                        Repeat = c.Repeat2016,
                        Customer = c.Customer2016,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2016/ c.CustomerAllYears)*100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2016 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            else if (year == 2015)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2015,
                        Repeat = c.Repeat2015,
                        Customer = c.Customer2015,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2015 / c.CustomerAllYears) * 100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2015 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            else if (year == 2014)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2014,
                        Repeat = c.Repeat2014,
                        Customer = c.Customer2014,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2014 / c.CustomerAllYears) * 100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2014 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            else if (year == 2013)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2013,
                        Repeat = c.Repeat2013,
                        Customer = c.Customer2013,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2013 / c.CustomerAllYears) * 100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2013 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            else if (year == 2012)
            {
                foreach (var c in vlues)
                {
                    customers.Add(new NewRepeatCust
                    {
                        State = c.SchoolState,
                        New = c.New2012,
                        Repeat = c.Repeat2012,
                        Customer = c.Customer2012,
                        TotalCustomer = c.CustomerAllYears,
                        PerticipatedSchoolPecnt = Math.Round(((double)c.Customer2012 / c.CustomerAllYears) * 100, 1),
                        EnrollmentSchoolPecnt = Math.Round(((double)c.Customer2012 / c.EnrollmentSchool) * 100, 1),
                        TotalEnrollmentSchoolPecnt = Math.Round(((double)c.CustomerAllYears / c.EnrollmentSchool) * 100, 1),
                        Enrollment = c.EnrollmentSchool
                    });
                }
            }
            var total = new NewRepeatCust
            {
                State = "Grand Total:",
                New = customers.Sum(c=>c.New),
                Repeat = customers.Sum(c => c.Repeat),
                Customer = customers.Sum(c => c.Customer),
                TotalCustomer = customers.Sum(c => c.TotalCustomer),
                PerticipatedSchoolPecnt = customers.Count == 0 ? 0 : Math.Round(((double)customers.Sum(c => c.Customer) / customers.Sum(c => c.TotalCustomer)) * 100, 1),
                EnrollmentSchoolPecnt = customers.Count == 0 ? 0 : Math.Round(((double)customers.Sum(c => c.Customer) / customers.Sum(c => c.Enrollment)) * 100, 1),
                TotalEnrollmentSchoolPecnt = customers.Count == 0 ? 0 : Math.Round(((double)customers.Sum(c => c.TotalCustomer) / customers.Sum(c => c.Enrollment)) * 100, 1),
                Enrollment = customers.Sum(c => c.Enrollment)
            };
            var t= totalAt - 1;
            while(t<customers.Count){
                customers.Insert(t,total);
                t+= totalAt;
            }
            customers.Add(total);
            return customers;
        }

        public List<ProductMix> GetProductMix(string dateType, string inpCustomerCategory, string disneySchoolId)
        {
            var dates = DateUtility.GetDates(dateType);
            var vlues = new List<ProductMix>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenProductMixChart]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", dates[0]);
                sqlCmd.Parameters.AddWithValue("EndDate", dates[1]);
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new ProductMix
                        {
                            TotalSelectedState = sqlReader["TotalSelectedState"]?.ToString() ?? "",
                            OrderDateBeg = sqlReader["OrderDateBeg"] == null ? "" : DateUtility.FormatDate(sqlReader["OrderDateBeg"].ToString(), "yyyy-MM-dd"),
                            OrderDateEnd = sqlReader["OrderDateEnd"] == null ? "" : DateUtility.FormatDate(sqlReader["OrderDateEnd"].ToString(), "yyyy-MM-dd"),
                            RegFree = sqlReader["Reg Free"] == null || sqlReader["Reg Free"].ToString() == "" ? 0 : int.Parse(sqlReader["Reg Free"].ToString()),
                            ReqRepl = sqlReader["Req Repl"] == null || sqlReader["Req Repl"].ToString() == "" ? 0 : int.Parse(sqlReader["Req Repl"].ToString()),
                            ReqDisc = sqlReader["Req Disc"] == null || sqlReader["Req Disc"].ToString() == "" ? 0 : int.Parse(sqlReader["Req Disc"].ToString()),
                            OtherFree = sqlReader["Other Free"] == null || sqlReader["Other Free"].ToString() == "" ? 0 : int.Parse(sqlReader["Other Free"].ToString()),
                            JrFree = sqlReader["Jr Free"] == null || sqlReader["Jr Free"].ToString() == "" ? 0 : int.Parse(sqlReader["Jr Free"].ToString()),
                            JrRepl = sqlReader["Jr Repl"] == null || sqlReader["Jr Repl"].ToString() == "" ? 0 : int.Parse(sqlReader["Jr Repl"].ToString()),
                            JrDisc = sqlReader["Jr Disc"] == null || sqlReader["Jr Disc"].ToString() == "" ? 0 : int.Parse(sqlReader["Jr Disc"].ToString()),
                            Box = sqlReader["Box"] == null || sqlReader["Box"].ToString() == "" ? 0 : int.Parse(sqlReader["Box"].ToString()),
                            Videos = sqlReader["Videos"] == null || sqlReader["Videos"].ToString() == "" ? 0 : int.Parse(sqlReader["Videos"].ToString()),
                            TotalUnits = sqlReader["TotalUnits"] == null || sqlReader["TotalUnits"].ToString() == "" ? 0 : int.Parse(sqlReader["TotalUnits"].ToString()),
                            DateString = DateUtility.GetDateString(dateType)
                        });
                    }

                    connection.Close();
                }
            }
            foreach (var pm in vlues)
            {
                var total = Convert.ToDouble((pm.RegFree + pm.ReqDisc + pm.ReqRepl + pm.JrDisc + pm.JrFree + pm.JrRepl + pm.OtherFree + pm.Videos + pm.Box));
                pm.RegFreePrcnt = total == 0 ? 0 : Math.Round(((double) pm.RegFree/total)*100, 2);
                pm.ReqReplPrcnt = total == 0 ? 0 : Math.Round(((double)pm.ReqRepl / total) * 100, 2);
                pm.ReqDiscPrcnt = total == 0 ? 0 : Math.Round(((double)pm.ReqDisc / total) * 100, 2);
                pm.OtherFreePrcnt = total == 0 ? 0 : Math.Round(((double)pm.OtherFree / total) * 100, 2);
                pm.JrFreePrcnt = total == 0 ? 0 : Math.Round(((double)pm.JrFree / total) * 100, 2);
                pm.JrDiscPrcnt = total == 0 ? 0 : Math.Round(((double)pm.JrDisc / total) * 100, 2);
                pm.JrReplPrcnt = total == 0 ? 0 : Math.Round(((double)pm.JrRepl / total) * 100, 2);
                pm.BoxPrcnt = total == 0 ? 0 : Math.Round(((double)pm.Box / total) * 100, 2);
                pm.VideosPrcnt = total == 0 ? 0 : Math.Round(((double)pm.Videos / total) * 100, 2);
            }
            return vlues;
        }

        public List<OrderQuantity> GetOrderQtys(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, int totalAt)
        {
            var vlues = new List<OrderQuantity>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenOrderQtyAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate);
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("InpStateReleaseDate", inpStateReleaseDate);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new OrderQuantity
                        {
                            NcesSchoolId = sqlReader["NCESSchoolID"]?.ToString() ?? "",
                            SchoolName = sqlReader["SchoolName"]?.ToString() ?? "",
                            SchoolState = sqlReader["SchoolState"]?.ToString() ?? "",
                            SchoolZip = sqlReader["SchoolZip"]?.ToString() ?? "",
                            ReleaseDate = sqlReader["ReleaseDate"] == null ? "" : DateTime.Parse(sqlReader["ReleaseDate"].ToString()).ToString("MM/dd/yyyy"),
                            OrderDateBeg = sqlReader["OrderDateBeg"]?.ToString() ?? "",
                            OrderDateEnd = sqlReader["OrderDateEnd"]?.ToString() ?? "",
                            DistinctSchoolCount = sqlReader["DistinctSchoolCount"] == null ? 0 : int.Parse(sqlReader["DistinctSchoolCount"].ToString()),
                            RegFreeQty = sqlReader["RegFreeQty"] == null ? 0 : int.Parse(sqlReader["RegFreeQty"].ToString()),
                            RegReplQty = sqlReader["RegReplQty"] == null ? 0 : int.Parse(sqlReader["RegReplQty"].ToString()),
                            RegDiscQty = sqlReader["RegDiscQty"] == null ? 0 : int.Parse(sqlReader["RegDiscQty"].ToString()),
                            JrFreeQty = sqlReader["JrFreeQty"] == null ? 0 : int.Parse(sqlReader["JrFreeQty"].ToString()),
                            JrReplQty = sqlReader["JrReplQty"] == null ? 0 : int.Parse(sqlReader["JrReplQty"].ToString()),
                            JrDiscQty = sqlReader["JrDiscQty"] == null ? 0 : int.Parse(sqlReader["JrDiscQty"].ToString()),
                            OtherFreeQty = sqlReader["OtherFreeQty"] == null ? 0 : int.Parse(sqlReader["OtherFreeQty"].ToString()),
                            BoxQty = sqlReader["BoxQty"] == null ? 0 : int.Parse(sqlReader["BoxQty"].ToString()),
                            VideosQty = sqlReader["VideosQty"] == null ? 0 : int.Parse(sqlReader["VideosQty"].ToString()),
                            TotalUnits = sqlReader["TotalUnits"] == null ? 0 : int.Parse(sqlReader["TotalUnits"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }

            var refinedValues = new List<OrderQuantity>();
            if (string.IsNullOrEmpty(inpStateReleaseDate))
            {
                var states = vlues.Select(o => o.SchoolState).Distinct();
                foreach (var state in states)
                {
                    var tmptotalUnits = vlues.Where(s=>s.SchoolState.Equals(state)).Sum(s => s.TotalUnits);
                    var tmptotalRegFreeQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.RegFreeQty);
                    var tmptotalRegReplQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.RegReplQty);
                    var tmptotalRegDiscQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.RegDiscQty);
                    var tmptotalJrFreeQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.JrFreeQty);
                    var tmptotalJrReplQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.JrReplQty);
                    var tmptotalJrDiscQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.JrDiscQty);
                    var tmptotalOtherFreeQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.OtherFreeQty);
                    var tmptotalBoxQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.BoxQty);
                    var tmptotalVideosQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.VideosQty);
                    var tmptotalDistinctSchoolCount = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.DistinctSchoolCount);
                    refinedValues.Add(new OrderQuantity
                    {
                        PrimaryColumn = state,
                        TotalUnits = tmptotalUnits,
                        RegFreeQty = tmptotalRegFreeQty,
                        RegDiscQty = tmptotalRegDiscQty,
                        RegReplQty = tmptotalRegReplQty,
                        JrDiscQty = tmptotalJrDiscQty,
                        JrFreeQty = tmptotalJrFreeQty,
                        JrReplQty = tmptotalJrReplQty,
                        OtherFreeQty = tmptotalOtherFreeQty,
                        BoxQty = tmptotalBoxQty,
                        VideosQty = tmptotalVideosQty,
                        DistinctSchoolCount = tmptotalDistinctSchoolCount,
                        DdlBegDate = begDate.Split(' ').First(),
                        DdlEndDate = endDate.Split(' ').First()
                    });
                }
            }
            else
            {
                var dates = vlues.Select(o => o.ReleaseDate).Distinct();
                foreach (var date in dates)
                {
                    var tmptotalUnits = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.TotalUnits);
                    var tmptotalRegFreeQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.RegFreeQty);
                    var tmptotalRegReplQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.RegReplQty);
                    var tmptotalRegDiscQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.RegDiscQty);
                    var tmptotalJrFreeQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.JrFreeQty);
                    var tmptotalJrReplQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.JrReplQty);
                    var tmptotalJrDiscQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.JrDiscQty);
                    var tmptotalOtherFreeQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.OtherFreeQty);
                    var tmptotalBoxQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.BoxQty);
                    var tmptotalVideosQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.VideosQty);
                    var tmptotalDistinctSchoolCount = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.DistinctSchoolCount);
                    refinedValues.Add(new OrderQuantity
                    {
                        PrimaryColumn = date,
                        TotalUnits = tmptotalUnits,
                        RegFreeQty = tmptotalRegFreeQty,
                        RegDiscQty = tmptotalRegDiscQty,
                        RegReplQty = tmptotalRegReplQty,
                        JrDiscQty = tmptotalJrDiscQty,
                        JrFreeQty = tmptotalJrFreeQty,
                        JrReplQty = tmptotalJrReplQty,
                        OtherFreeQty = tmptotalOtherFreeQty,
                        BoxQty = tmptotalBoxQty,
                        VideosQty = tmptotalVideosQty,
                        DistinctSchoolCount = tmptotalDistinctSchoolCount,
                        DdlBegDate = begDate.Split(' ').First(),
                        DdlEndDate = endDate.Split(' ').First()
                    });
                }
            }
            

            var totalUnits = refinedValues.Sum(s => s.TotalUnits);
            var totalRegFreeQty = refinedValues.Sum(s => s.RegFreeQty);
            var totalRegReplQty = refinedValues.Sum(s => s.RegReplQty);
            var totalRegDiscQty = refinedValues.Sum(s => s.RegDiscQty);
            var totalJrFreeQty = refinedValues.Sum(s => s.JrFreeQty);
            var totalJrReplQty = refinedValues.Sum(s => s.JrReplQty);
            var totalJrDiscQty = refinedValues.Sum(s => s.JrDiscQty);
            var totalOtherFreeQty = refinedValues.Sum(s => s.OtherFreeQty);
            var totalBoxQty = refinedValues.Sum(s => s.BoxQty);
            var totalVideosQty = refinedValues.Sum(s => s.VideosQty);
            var totalDistinctSchoolCount = refinedValues.Sum(s => s.DistinctSchoolCount);
            refinedValues = refinedValues.OrderBy(r => r.PrimaryColumn).ToList();
            var total = new OrderQuantity
            {
                PrimaryColumn = "Grand Total:",
                TotalUnits = totalUnits,
                RegFreeQty = totalRegFreeQty,
                RegDiscQty = totalRegDiscQty,
                RegReplQty = totalRegReplQty,
                JrDiscQty = totalJrDiscQty,
                JrFreeQty = totalJrFreeQty,
                JrReplQty = totalJrReplQty,
                OtherFreeQty = totalOtherFreeQty,
                BoxQty = totalBoxQty,
                VideosQty = totalVideosQty,
                DistinctSchoolCount = totalDistinctSchoolCount,
                DdlBegDate = begDate.Split(' ').First(),
                DdlEndDate = endDate.Split(' ').First()
            };
            var t= totalAt - 1;
            while(t<refinedValues.Count){
                refinedValues.Insert(t,total);
                t+= totalAt;
            }
            refinedValues.Add(total);
            return refinedValues;
        }

        public List<OrderQuantity> GetDetailsOrderQtys(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string inpStateReleaseDate, string sstate, string ddate, int totalAt)
        {
            var vlues = new List<OrderQuantity>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenOrderQtyAnalysis]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate.Contains(" ") ? endDate : endDate + " 23:59:59");
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("InpStateReleaseDate", inpStateReleaseDate);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new OrderQuantity
                        {
                            NcesSchoolId = sqlReader["NCESSchoolID"]?.ToString() ?? "",
                            SchoolName = sqlReader["SchoolName"]?.ToString() ?? "",
                            SchoolState = sqlReader["SchoolState"]?.ToString() ?? "",
                            SchoolZip = sqlReader["SchoolZip"]?.ToString() ?? "",
                            ReleaseDate = sqlReader["ReleaseDate"] == null ? "" : DateTime.Parse(sqlReader["ReleaseDate"].ToString()).ToString("yyyy-MM-dd"),
                            OrderDateBeg = sqlReader["OrderDateBeg"]?.ToString() ?? "",
                            OrderDateEnd = sqlReader["OrderDateEnd"]?.ToString() ?? "",
                            DistinctSchoolCount = sqlReader["DistinctSchoolCount"] == null ? 0 : int.Parse(sqlReader["DistinctSchoolCount"].ToString()),
                            RegFreeQty = sqlReader["RegFreeQty"] == null ? 0 : int.Parse(sqlReader["RegFreeQty"].ToString()),
                            RegReplQty = sqlReader["RegReplQty"] == null ? 0 : int.Parse(sqlReader["RegReplQty"].ToString()),
                            RegDiscQty = sqlReader["RegDiscQty"] == null ? 0 : int.Parse(sqlReader["RegDiscQty"].ToString()),
                            JrFreeQty = sqlReader["JrFreeQty"] == null ? 0 : int.Parse(sqlReader["JrFreeQty"].ToString()),
                            JrReplQty = sqlReader["JrReplQty"] == null ? 0 : int.Parse(sqlReader["JrReplQty"].ToString()),
                            JrDiscQty = sqlReader["JrDiscQty"] == null ? 0 : int.Parse(sqlReader["JrDiscQty"].ToString()),
                            OtherFreeQty = sqlReader["OtherFreeQty"] == null ? 0 : int.Parse(sqlReader["OtherFreeQty"].ToString()),
                            BoxQty = sqlReader["BoxQty"] == null ? 0 : int.Parse(sqlReader["BoxQty"].ToString()),
                            VideosQty = sqlReader["VideosQty"] == null ? 0 : int.Parse(sqlReader["VideosQty"].ToString()),
                            TotalUnits = sqlReader["TotalUnits"] == null ? 0 : int.Parse(sqlReader["TotalUnits"].ToString()),
                        });
                    }

                    connection.Close();
                }
            }

            if (inpStateReleaseDate.Equals("ReleaseDate"))
                vlues = vlues.Where(v => v.ReleaseDate.Equals(ddate)).ToList();
            else if (!sstate.Equals("All"))
                vlues = vlues.Where(v => v.SchoolState.Equals(sstate)).ToList();

            var refinedValues = new List<OrderQuantity>();
            if (string.IsNullOrEmpty(inpStateReleaseDate))
            {
                var states = vlues.Select(o => o.SchoolState).Distinct();
                foreach (var state in states)
                {
                    var tmptotalUnits = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.TotalUnits);
                    var tmptotalRegFreeQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.RegFreeQty);
                    var tmptotalRegReplQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.RegReplQty);
                    var tmptotalRegDiscQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.RegDiscQty);
                    var tmptotalJrFreeQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.JrFreeQty);
                    var tmptotalJrReplQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.JrReplQty);
                    var tmptotalJrDiscQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.JrDiscQty);
                    var tmptotalOtherFreeQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.OtherFreeQty);
                    var tmptotalBoxQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.BoxQty);
                    var tmptotalVideosQty = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.VideosQty);
                    var tmptotalDistinctSchoolCount = vlues.Where(s => s.SchoolState.Equals(state)).Sum(s => s.DistinctSchoolCount);
                    refinedValues.Add(new OrderQuantity
                    {
                        PrimaryColumn = state,
                        TotalUnits = tmptotalUnits,
                        RegFreeQty = tmptotalRegFreeQty,
                        RegDiscQty = tmptotalRegDiscQty,
                        RegReplQty = tmptotalRegReplQty,
                        JrDiscQty = tmptotalJrDiscQty,
                        JrFreeQty = tmptotalJrFreeQty,
                        JrReplQty = tmptotalJrReplQty,
                        OtherFreeQty = tmptotalOtherFreeQty,
                        BoxQty = tmptotalBoxQty,
                        VideosQty = tmptotalVideosQty,
                        DistinctSchoolCount = tmptotalDistinctSchoolCount
                    });
                }
            }
            else
            {
                var dates = vlues.Select(o => o.ReleaseDate).Distinct();
                foreach (var date in dates)
                {
                    var tmptotalUnits = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.TotalUnits);
                    var tmptotalRegFreeQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.RegFreeQty);
                    var tmptotalRegReplQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.RegReplQty);
                    var tmptotalRegDiscQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.RegDiscQty);
                    var tmptotalJrFreeQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.JrFreeQty);
                    var tmptotalJrReplQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.JrReplQty);
                    var tmptotalJrDiscQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.JrDiscQty);
                    var tmptotalOtherFreeQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.OtherFreeQty);
                    var tmptotalBoxQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.BoxQty);
                    var tmptotalVideosQty = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.VideosQty);
                    var tmptotalDistinctSchoolCount = vlues.Where(s => s.ReleaseDate.Equals(date)).Sum(s => s.DistinctSchoolCount);
                    refinedValues.Add(new OrderQuantity
                    {
                        PrimaryColumn = DateUtility.FormatDate(date, "MM/dd/yyyy"),
                        TotalUnits = tmptotalUnits,
                        RegFreeQty = tmptotalRegFreeQty,
                        RegDiscQty = tmptotalRegDiscQty,
                        RegReplQty = tmptotalRegReplQty,
                        JrDiscQty = tmptotalJrDiscQty,
                        JrFreeQty = tmptotalJrFreeQty,
                        JrReplQty = tmptotalJrReplQty,
                        OtherFreeQty = tmptotalOtherFreeQty,
                        BoxQty = tmptotalBoxQty,
                        VideosQty = tmptotalVideosQty,
                        DistinctSchoolCount = tmptotalDistinctSchoolCount
                    });
                }
            }


            var totalUnits = refinedValues.Sum(s => s.TotalUnits);
            var totalRegFreeQty = refinedValues.Sum(s => s.RegFreeQty);
            var totalRegReplQty = refinedValues.Sum(s => s.RegReplQty);
            var totalRegDiscQty = refinedValues.Sum(s => s.RegDiscQty);
            var totalJrFreeQty = refinedValues.Sum(s => s.JrFreeQty);
            var totalJrReplQty = refinedValues.Sum(s => s.JrReplQty);
            var totalJrDiscQty = refinedValues.Sum(s => s.JrDiscQty);
            var totalOtherFreeQty = refinedValues.Sum(s => s.OtherFreeQty);
            var totalBoxQty = refinedValues.Sum(s => s.BoxQty);
            var totalVideosQty = refinedValues.Sum(s => s.VideosQty);
            var totalDistinctSchoolCount = refinedValues.Sum(s => s.DistinctSchoolCount);

            var total =new OrderQuantity
            {
                PrimaryColumn = "Grand Total:",
                TotalUnits = totalUnits,
                RegFreeQty = totalRegFreeQty,
                RegDiscQty = totalRegDiscQty,
                RegReplQty = totalRegReplQty,
                JrDiscQty = totalJrDiscQty,
                JrFreeQty = totalJrFreeQty,
                JrReplQty = totalJrReplQty,
                OtherFreeQty = totalOtherFreeQty,
                BoxQty = totalBoxQty,
                VideosQty = totalVideosQty,
                DistinctSchoolCount = totalDistinctSchoolCount
            };
            var t= totalAt - 1;
            while(t<refinedValues.Count){
                refinedValues.Insert(t,total);
                t+= totalAt;
            }
            refinedValues.Add(total);
            return refinedValues;
        }

        public List<OrderMap> GetOrderMaps(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId)
        {
            var vlues = new List<OrderMap>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenOrdersMap]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate);
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new OrderMap
                        {
                            TotalUnits = sqlReader["TotalUnits"] == null || sqlReader["TotalUnits"].ToString() == "" ? 0 : int.Parse(sqlReader["TotalUnits"].ToString()),
                            State = sqlReader["SchoolState"]?.ToString().Trim() ?? "",
                            OrderDateBeg = sqlReader["OrderDateBeg"]?.ToString() ?? "",
                            OrderDateEnd = sqlReader["OrderDateEnd"]?.ToString() ?? "",
                            TotalSelectedState = sqlReader["TotalSelectedState"]?.ToString() ?? "",
                            R1LLimit = sqlReader["Range1LowerLimit"] == null || sqlReader["Range1LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range1LowerLimit"].ToString()),
                            R2LLimit = sqlReader["Range2LowerLimit"] == null || sqlReader["Range2LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range2LowerLimit"].ToString()),
                            R3LLimit = sqlReader["Range3LowerLimit"] == null || sqlReader["Range3LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range3LowerLimit"].ToString()),
                            R4LLimit = sqlReader["Range4LowerLimit"] == null || sqlReader["Range4LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range4LowerLimit"].ToString()),
                            R5LLimit = sqlReader["Range5LowerLimit"] == null || sqlReader["Range5LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range5LowerLimit"].ToString()),
                            R6LLimit = sqlReader["Range6LowerLimit"] == null || sqlReader["Range6LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range6LowerLimit"].ToString()),
                            R1ULimit = sqlReader["Range1UpperLimit"] == null || sqlReader["Range1UpperLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range1UpperLimit"].ToString()),
                            R2ULimit = sqlReader["Range2UpperLimit"] == null || sqlReader["Range2UpperLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range2UpperLimit"].ToString()),
                            R3ULimit = sqlReader["Range3UpperLimit"] == null || sqlReader["Range3UpperLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range3UpperLimit"].ToString()),
                            R4ULimit = sqlReader["Range4UpperLimit"] == null || sqlReader["Range4UpperLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range4UpperLimit"].ToString()),
                            R5ULimit = sqlReader["Range5UpperLimit"] == null || sqlReader["Range5UpperLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range5UpperLimit"].ToString()),
                            R6ULimit = sqlReader["Range6LowerLimit"] == null || sqlReader["Range6LowerLimit"].ToString() == "" ? 1 : int.Parse(sqlReader["Range6LowerLimit"].ToString()) + 10, // just a constant value
                            //to make the upper limit higher than the lower limit
                            DdlBegDate = begDate.Split(' ').First(),
                            DdlEndDate = endDate.Split(' ').First()
                        });
                    }

                    connection.Close();
                }
            }
            Utility.AssignColors(vlues);
            return vlues;
        }

        public List<NewRepeatCustomerDetails> GetNewRepeatCustomerDetails(string inpCustomerCategory, string disneySchoolId, string state, int year, string zip, string schoolName, string schoolId, string releaseDate)
        {
            var vlues = new List<NewRepeatCustomerDetails>();
            int customer = 0, news = 0, repeat = 0;
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenNewRepeatCustomerDetails]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("InpStateReleaseDate", releaseDate);
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("InpSchoolZip", zip);
                sqlCmd.Parameters.AddWithValue("InpSearchSchoolName", schoolName);
                sqlCmd.Parameters.AddWithValue("InpSchoolID", schoolId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        customer += (sqlReader["Customer" + year] == null? 0 : int.Parse(sqlReader["Customer" + year].ToString()));
                        news += (year == 2012 ? 0 : (sqlReader["New" + year] == null ? 0 : int.Parse(sqlReader["New" + year].ToString())));
                        repeat += (year == 2012 ? 0 : (sqlReader["Repeat" + year] == null ? 0 : int.Parse(sqlReader["Repeat" + year].ToString())));
                        vlues.Add(new NewRepeatCustomerDetails
                        {
                            SchoolState = sqlReader["SchoolState"]?.ToString() ?? "",
                            SchoolId = sqlReader["NCESSchoolID"]?.ToString() ?? "",
                            SchoolName = sqlReader["SchoolName"]?.ToString() ?? "",
                            SchoolZip = sqlReader["SchoolZip"]?.ToString() ?? "",
                            Customer2012 = sqlReader["Customer2012"] == null ? "0" : int.Parse(sqlReader["Customer2012"].ToString()).ToString("##,##0"),
                            Customer2013 = sqlReader["Customer2013"] == null ? "0" : int.Parse(sqlReader["Customer2013"].ToString()).ToString("##,##0"),
                            Customer2014 = sqlReader["Customer2014"] == null ? "0" : int.Parse(sqlReader["Customer2014"].ToString()).ToString("##,##0"),
                            Customer2015 = sqlReader["Customer2015"] == null ? "0" : int.Parse(sqlReader["Customer2015"].ToString()).ToString("##,##0"),
                            Customer2016 = sqlReader["Customer2016"] == null ? "0" : int.Parse(sqlReader["Customer2016"].ToString()).ToString("##,##0"),
                            Customer2017 = sqlReader["Customer2017"] == null ? "0" : int.Parse(sqlReader["Customer2017"].ToString()).ToString("##,##0"),
                            Customer2018 = sqlReader["Customer2018"] == null ? "0" : int.Parse(sqlReader["Customer2018"].ToString()).ToString("##,##0"),
                            New2012 = "0",
                            New2013 = sqlReader["New2013"] == null ? "0" : int.Parse(sqlReader["New2013"].ToString()).ToString("##,##0"),
                            New2014 = sqlReader["New2014"] == null ? "0" : int.Parse(sqlReader["New2014"].ToString()).ToString("##,##0"),
                            New2015 = sqlReader["New2015"] == null ? "0" : int.Parse(sqlReader["New2015"].ToString()).ToString("##,##0"),
                            New2016 = sqlReader["New2016"] == null ? "0" : int.Parse(sqlReader["New2016"].ToString()).ToString("##,##0"),
                            New2017 = sqlReader["New2017"] == null ? "0" : int.Parse(sqlReader["New2017"].ToString()).ToString("##,##0"),
                            New2018 = sqlReader["New2018"] == null ? "0" : int.Parse(sqlReader["New2018"].ToString()).ToString("##,##0"),
                            Repeat2012 = "0",
                            Repeat2013 = sqlReader["Repeat2013"] == null ? "0" : int.Parse(sqlReader["Repeat2013"].ToString()).ToString("##,##0"),
                            Repeat2014 = sqlReader["Repeat2014"] == null ? "0" : int.Parse(sqlReader["Repeat2014"].ToString()).ToString("##,##0"),
                            Repeat2015 = sqlReader["Repeat2015"] == null ? "0" : int.Parse(sqlReader["Repeat2015"].ToString()).ToString("##,##0"),
                            Repeat2016 = sqlReader["Repeat2016"] == null ? "0" : int.Parse(sqlReader["Repeat2016"].ToString()).ToString("##,##0"),
                            Repeat2017 = sqlReader["Repeat2017"] == null ? "0" : int.Parse(sqlReader["Repeat2017"].ToString()).ToString("##,##0"),
                            Repeat2018 = sqlReader["Repeat2018"] == null ? "0" : int.Parse(sqlReader["Repeat2018"].ToString()).ToString("##,##0")
                            //AllYears = sqlReader["CustomerAllYears"] == null ? "0" : int.Parse(sqlReader["CustomerAllYears"].ToString()).ToString("##,###"),
                        });
                    }

                    connection.Close();
                }
            }
            vlues.Add(new NewRepeatCustomerDetails
            {
                SchoolName = "",
                SchoolState = "",
                SchoolId = "",
                SchoolZip = "Grand Total:",
                Customer2012 = customer.ToString("##,##0"),
                Customer2013 = customer.ToString("##,##0"),
                Customer2014 = customer.ToString("##,##0"),
                Customer2015 = customer.ToString("##,##0"),
                Customer2016 = customer.ToString("##,##0"),
                Customer2017 = customer.ToString("##,##0"),
                New2012 = news.ToString("##,##0"),
                New2013 = news.ToString("##,##0"),
                New2014 = news.ToString("##,##0"),
                New2015 = news.ToString("##,##0"),
                New2016 = news.ToString("##,##0"),
                New2017 = news.ToString("##,##0"),
                Repeat2012 = repeat.ToString("##,##0"),
                Repeat2013 = repeat.ToString("##,##0"),
                Repeat2014 = repeat.ToString("##,##0"),
                Repeat2015 = repeat.ToString("##,##0"),
                Repeat2016 = repeat.ToString("##,##0"),
                Repeat2017 = repeat.ToString("##,##0")
            });
            return vlues;
        }

        public List<SchoolStateDetails> GetSchoolByStateDetails(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId)
        {
            var vlues = new List<SchoolStateDetails>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenSchoolByStateDetails]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate);
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("InpSchoolZip", schoolZip);
                sqlCmd.Parameters.AddWithValue("InpSchoolID", schoolId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        vlues.Add(new SchoolStateDetails
                        {
                            SchoolState = sqlReader["SchoolState"] == null ? "" : DateUtility.FormatDate(sqlReader["SchoolState"].ToString(), "MM/dd/yyyy"),
                            SchoolId = sqlReader["NCESSchoolID"]?.ToString() ?? "",
                            SchoolName = sqlReader["SchoolName"]?.ToString() ?? "",
                            SchoolZip = sqlReader["SchoolZip"]?.ToString() ?? "",
                            SchoolCount = sqlReader["DistinctSchoolCount"] == null ? "0" : int.Parse(sqlReader["DistinctSchoolCount"].ToString()).ToString("##,##0"),
                            TotalSchoolCount = sqlReader["TotalSchoolCount"] == null ? "0" : int.Parse(sqlReader["TotalSchoolCount"].ToString()).ToString("##,##0"),
                            SchoolDiff = sqlReader["SchoolDiff"] == null ? "0" : int.Parse(sqlReader["SchoolDiff"].ToString()).ToString("##,##0"),
                            ContactName = sqlReader["ContactName"]?.ToString() ?? "",
                            ContactTitle = sqlReader["ContactTitle"]?.ToString() ?? "",
                            ContactAddress1 = sqlReader["ContactAddress1"]?.ToString() ?? "",
                            ContactAddress2 = sqlReader["ContactAddress2"]?.ToString() ?? "",
                            ContactCity = sqlReader["ContactCity"]?.ToString() ?? "",
                            ContactZip = sqlReader["ContactZip"]?.ToString() ?? "",
                            ContactState = sqlReader["ContactState"]?.ToString() ?? "",
                            ContactEmailAddress = sqlReader["ContactEmailAddress"]?.ToString() ?? "",
                            ContactPhone = sqlReader["ContactPhone"]?.ToString() ?? "",
                            ReleaseDate = sqlReader["ReleaseDate"] == null ? "" : DateUtility.FormatDate(sqlReader["ReleaseDate"].ToString(), "MM/dd/yyyy")
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }

        public List<EpipenOrderDetails> GetEpipenOrderDetails(string begDate, string endDate, string inpCustomerCategory, string disneySchoolId, string state, string schoolZip, string schoolId, string schoolName, int orderId, int batchId, string inpPharmacy, string inpDoctor, string inpContactName, string inpSearchOrderId)
        {
            var vlues = new List<EpipenOrderDetails>();
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SetArithAbortCommand(connection);
                var sqlCmd = new SqlCommand(@"[analytics].[GetEpipenOrderDetails]", connection);
                sqlCmd.CommandType = CommandType.StoredProcedure;
                sqlCmd.Parameters.AddWithValue("BegDate", begDate);
                sqlCmd.Parameters.AddWithValue("EndDate", endDate);
                sqlCmd.Parameters.AddWithValue("InpCustomerCategory", inpCustomerCategory);
                sqlCmd.Parameters.AddWithValue("DisneySchoolID", disneySchoolId);
                sqlCmd.Parameters.AddWithValue("State", state);
                sqlCmd.Parameters.AddWithValue("InpSearchSchoolName", schoolName);
                sqlCmd.Parameters.AddWithValue("OrderID", orderId);
                sqlCmd.Parameters.AddWithValue("BatchID", batchId);
                sqlCmd.Parameters.AddWithValue("InpPharmacy", inpPharmacy);
                sqlCmd.Parameters.AddWithValue("InpDoctor", inpDoctor);
                sqlCmd.Parameters.AddWithValue("InpContactName", inpContactName);
                sqlCmd.Parameters.AddWithValue("InpSearchOrderID", inpSearchOrderId);
                sqlCmd.Parameters.AddWithValue("InpSchoolZip", schoolZip);
                sqlCmd.Parameters.AddWithValue("InpSchoolID", schoolId);
                sqlCmd.CommandTimeout = 500;
                using (var sqlReader = sqlCmd.ExecuteReader())
                {
                    while (sqlReader.Read())
                    {
                        var n = 0;
                        vlues.Add(new EpipenOrderDetails
                        {
                            SchoolState = sqlReader["SchoolState"]?.ToString() ?? "",
                            SchoolId = sqlReader["NCESSchoolID"]?.ToString() ?? "",
                            SchoolName = sqlReader["SchoolName"]?.ToString() ?? "",
                            SchoolZip = sqlReader["SchoolZip"]?.ToString() ?? "",
                            SchoolCount = sqlReader["DistinctSchoolCount"] == null || !int.TryParse(sqlReader["DistinctSchoolCount"].ToString(), out n) ? "0" : int.Parse(sqlReader["DistinctSchoolCount"].ToString()).ToString("##,##0"),
                            ContactName = sqlReader["ContactName"]?.ToString() ?? "",
                            //ContactTitle = sqlReader["ContactTitle"]?.ToString() ?? "",
                            ContactAddress1 = sqlReader["ContactAddress1"]?.ToString() ?? "",
                            ContactAddress2 = sqlReader["ContactAddress2"]?.ToString() ?? "",
                            ContactCity = sqlReader["ContactCity"]?.ToString() ?? "",
                            ContactZip = sqlReader["ContactZip"]?.ToString() ?? "",
                            ContactState = sqlReader["ContactState"]?.ToString() ?? "",
                            ContactEmailAddress = sqlReader["ContactEmailAddress"]?.ToString() ?? "",
                            ContactPhone = sqlReader["ContactPhone"]?.ToString() ?? "",
                            ReleaseDate = sqlReader["ReleaseDate"]?.ToString() ?? "",
                            RegFreeQty = sqlReader["RegFreeQty"] == null || !int.TryParse(sqlReader["RegFreeQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["RegFreeQty"].ToString()).ToString("##,##0"),
                            RegReplQty = sqlReader["RegReplQty"] == null || !int.TryParse(sqlReader["RegReplQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["RegReplQty"].ToString()).ToString("##,##0"),
                            RegDiscQty = sqlReader["RegDiscQty"] == null || !int.TryParse(sqlReader["RegDiscQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["RegDiscQty"].ToString()).ToString("##,##0"),
                            JrFreeQty = sqlReader["JrFreeQty"] == null || !int.TryParse(sqlReader["JrFreeQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["JrFreeQty"].ToString()).ToString("##,##0"),
                            JrReplQty = sqlReader["JrReplQty"] == null || !int.TryParse(sqlReader["JrReplQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["JrReplQty"].ToString()).ToString("##,##0"),
                            JrDiscQty = sqlReader["JrDiscQty"] == null || !int.TryParse(sqlReader["JrDiscQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["JrDiscQty"].ToString()).ToString("##,##0"),
                            OtherFreeQty = sqlReader["OtherFreeQty"] == null || !int.TryParse(sqlReader["OtherFreeQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["OtherFreeQty"].ToString()).ToString("##,##0"),
                            TotalUnits = sqlReader["TotalUnits"] == null || !int.TryParse(sqlReader["TotalUnits"].ToString(), out n) ? "0" : int.Parse(sqlReader["TotalUnits"].ToString()).ToString("##,##0"),
                            BoxQty = sqlReader["BoxQty"] == null || !int.TryParse(sqlReader["BoxQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["BoxQty"].ToString()).ToString("##,##0"),
                            VideosQty = sqlReader["VideosQty"] == null || !int.TryParse(sqlReader["VideosQty"].ToString(), out n) ? "0" : int.Parse(sqlReader["VideosQty"].ToString()).ToString("##,##0"),
                            OrderID = sqlReader["OrderID"]?.ToString() ?? "",
                            OrderDate = sqlReader["OrderDate"] == null ? "" : DateUtility.FormatDate(sqlReader["OrderDate"].ToString(), "MM/dd/yyyy"),
                            OrderDateBeg = sqlReader["OrderDateBeg"] == null ? "" : DateUtility.FormatDate(sqlReader["OrderDateBeg"].ToString(), "yyyy-MM-dd"),
                            OrderDateEnd = sqlReader["OrderDateEnd"] == null ? "" : DateUtility.FormatDate(sqlReader["OrderDateEnd"].ToString(), "yyyy-MM-dd"),
                            BatchID = sqlReader["BatchID"]?.ToString() ?? "",
                            PharmacyName = sqlReader["PharmacyName"]?.ToString() ?? "",
                            DoctorName = sqlReader["DoctorName"]?.ToString() ?? "",
                        });
                    }

                    connection.Close();
                }
            }
            return vlues;
        }
    }
}