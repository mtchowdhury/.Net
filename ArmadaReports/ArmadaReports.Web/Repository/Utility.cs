using ArmadaReports.Web.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ArmadaReports.Web.Models.Epipen;

namespace ArmadaReports.Web.Repository
{
    public static class Utility
    {
        //public static List<string> Colors = new List<string> { "#A6CFE5", "#1F78B4", "#B2DF8A", "#33A02D", "#FC9A99", "#E4191C" };
        public static List<string> Colors = new List<string> { "#ed1e79", "#f15a24", "#93278f", "#29abe2", "#0071bc", "#009245" };

        public static void AssignColors(List<ProgramMap> maps)
        {
            foreach (var map in maps)
            {
                if (map.TotalCount >= map.R1LLimit && map.TotalCount <= map.R1ULimit)
                    map.Color = Colors[0];
                else if (map.TotalCount >= map.R2LLimit && map.TotalCount <= map.R2ULimit)
                    map.Color = Colors[1];
                else if (map.TotalCount >= map.R3LLimit && map.TotalCount <= map.R3ULimit)
                    map.Color = Colors[2];
                else if (map.TotalCount >= map.R4LLimit && map.TotalCount <= map.R4ULimit)
                    map.Color = Colors[3];
                else if (map.TotalCount >= map.R5LLimit && map.TotalCount <= map.R5ULimit)
                    map.Color = Colors[4];
                else if (map.TotalCount >= map.R6LLimit)
                    map.Color = Colors[5];
            }
        }

        public static void AssignColors(List<PAProgramMap> maps)
        {
            foreach (var map in maps)
            {
                if (map.TotalCount >= map.R1LLimit && map.TotalCount <= map.R1ULimit)
                    map.Color = Colors[0];
                else if (map.TotalCount >= map.R2LLimit && map.TotalCount <= map.R2ULimit)
                    map.Color = Colors[1];
                else if (map.TotalCount >= map.R3LLimit && map.TotalCount <= map.R3ULimit)
                    map.Color = Colors[2];
                else if (map.TotalCount >= map.R4LLimit && map.TotalCount <= map.R4ULimit)
                    map.Color = Colors[3];
                else if (map.TotalCount >= map.R5LLimit && map.TotalCount <= map.R5ULimit)
                    map.Color = Colors[4];
                else if (map.TotalCount >= map.R6LLimit)
                    map.Color = Colors[5];
            }
        }

        public static void AssignColors(List<OrderMap> maps)
        {
            foreach (var map in maps)
            {
                if (map.TotalUnits >= map.R1LLimit && map.TotalUnits <= map.R1ULimit)
                    map.Color = Colors[0];
                else if (map.TotalUnits >= map.R2LLimit && map.TotalUnits <= map.R2ULimit)
                    map.Color = Colors[1];
                else if (map.TotalUnits >= map.R3LLimit && map.TotalUnits <= map.R3ULimit)
                    map.Color = Colors[2];
                else if (map.TotalUnits >= map.R4LLimit && map.TotalUnits <= map.R4ULimit)
                    map.Color = Colors[3];
                else if (map.TotalUnits >= map.R5LLimit && map.TotalUnits <= map.R5ULimit)
                    map.Color = Colors[4];
                else if (map.TotalUnits >= map.R6LLimit)
                    map.Color = Colors[5];
            }
        }

        public static DateTime GetDate(this SqlDataReader reader, string name)
        {
            DateTime d;
            if (reader[name] == null)
                return new DateTime(1901, 1, 1);
            return !DateTime.TryParse(reader[name].ToString(), out d)
                    ? new DateTime(1901, 1, 1)
                    : DateTime.Parse(reader[name].ToString());
        }
    }
}