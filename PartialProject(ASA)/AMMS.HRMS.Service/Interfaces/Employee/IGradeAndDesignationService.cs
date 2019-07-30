using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMMS.HRMS.Service.Models;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;

namespace AMMS.HRMS.Service.Interfaces.Employee
{
   public interface IGradeAndDesignationService
   {
       List<AmmsDesignation> GetAllDesignations();
       List<AmmsGrade> GetAllGrades();
       Dictionary<string, List<AmmsIntFilter>> GetAllDesignationFIlterData();
       CrudResult AddDesignation(AmmsDesignation designation);
       AmmsDesignation GetDesignationById(int designationId);
       CrudResult EditDesignation(AmmsDesignation designation);
       CrudResult DeleteDesignationById(int designationId);
       CrudResult AddGrade(AmmsGrade grade);
       CrudResult EditGrade(AmmsGrade grade);
       AmmsGrade GetGradeById(int gradeId);
       CrudResult DeleteGradeById(int gradeId);
       Dictionary<string, List<AmmsIntFilter>> GetAllGradeFIlterData();
   }
}
