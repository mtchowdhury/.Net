using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using AMMS.Common.Model;
using AMMS.HRMS.Api.Common;
using AMMS.HRMS.Api.Extensions;
using AMMS.HRMS.Service.Interfaces.Employee;
using AMMS.HRMS.Service.Models.Employee;
using AMMS.Model.DfEntities;
using AMMS.Service.Models;
using AMMS.Service.Models.Filter;
using Newtonsoft.Json;

namespace AMMS.HRMS.Api.Controllers.Employee
{
    [RoutePrefix("hrms/employee/employee")]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeService _employeeService;
        private readonly string _workingFolder = HttpRuntime.AppDomainAppPath + @"\Uploads";


        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [Route("add")]
        [HttpPost]
        public CrudResult Add([FromBody] AmmsEmployee employee)
        {
            var user = Helper.GetUser(Request.Headers);
            employee.User = user;
            return _employeeService.Add(employee);
        }

        [Route("update")]
        [HttpPost]
        public CrudResult Update([FromBody] AmmsEmployee employee)
        {
            var user = Helper.GetUser(Request.Headers);
            employee.User = user;
            return _employeeService.Edit(employee);

        }

        [Route("accountTypeConfig")]
        public Dictionary<string, IEnumerable<AmmsIntFilter>> GetAcountTypeConfig()
        {
            return _employeeService.GetAcountTypeFilters();
        }

        [Route("getAccountTypes")]
        public List<AmmsEmployeeAccountType> GetAcountTypes(int role, int branch)
        {
            return _employeeService.GetAcountTypes(role, branch);
        }
        [Route("getAccountTypeById")]
        public AmmsEmployeeAccountType GetAcountTypeById(int accountTypeId)
        {
            return _employeeService.GetAcountTypeById(accountTypeId);
        }

        [Route("addAccountType")]
        [HttpPost]
        public CrudResult AddAccountType(AmmsEmployeeAccountType accountType)
        {
            return _employeeService.AddAcountType(accountType);
        }
        [Route("editAccountType")]
        [HttpPost]
        public CrudResult EditAccountType(AmmsEmployeeAccountType accountType)
        {
            accountType.User = Convert.ToInt32(Helper.GetUser(Request.Headers));
            return _employeeService.EditAcountType(accountType);
        }
        [Route("deleteAccountType")]
        [HttpDelete]
        public CrudResult DeleteAccountTypeById(int accounTypeId)
        {
            return _employeeService.DeleteAccountTypeById(accounTypeId);

        }

        [Route("delete")]
        [HttpDelete]
        public CrudResult Delete(int employeeId)
        {
            return _employeeService.Delete(employeeId);

        }

        [Route("")]
        [HttpGet]
        public List<GetEmployees_Result> GetAll()
        {
            return _employeeService.GetAll();
        }

        [Route("getByBranchId")]
        [HttpGet]
        public List<GetEmployeesByBranchId_Result> GetByBranchId(int branchId)
        {
            return _employeeService.GetByBranchId(branchId);
        }

        [Route("get")]
        [HttpGet]
        public Model.DfEntities.Employee Get(int employeeId)
        {
            return _employeeService.Get(employeeId);
        }

        [HttpGet]
        [Route("details")]
        public AmmsEmployee GetEmployeeDetails(int employeeId)
        {
            return _employeeService.GetWithDetails(employeeId);
        }

        [HttpGet]
        [Route("advancedsearch")]
        public List<AmmsEmployeeShort> GetEmployeeListByAdvanceSearch(string filterColumn1, string filterComparator1, string filterValue1, string filterColumn2, string filterComparator2,
            string filterValue2, string filterColumn3, string filterComparator3, string filterValue3, string andOr1, string andOr2 ,int fromInit=-1)
        {
          var ss=  _employeeService.GetEmployeeListByAdvanceSearch(filterColumn1,
                    filterComparator1, filterValue1, filterColumn2, filterComparator2,
                    filterValue2, filterColumn3, filterComparator3, filterValue3, andOr1,
                    andOr2 ,fromInit);
            return  ss;
                
        }

        [HttpPost]
        [Route("advancedsearchexport")]
        public AmmsTable GetEmployeeListByAdvanceSearchExport(AmmsEmployeeFilterParams filterParams )
        {
            return _employeeService.GetEmployeeListByAdvanceSearchExport(filterParams.filterColumn1,
                      filterParams.filterComparator1, filterParams.filterValue1, filterParams.filterColumn2, filterParams.filterComparator2,
                      filterParams.filterValue2, filterParams.filterColumn3, filterParams.filterComparator3, filterParams.filterValue3, filterParams.andOr1,
                      filterParams.andOr2, filterParams.fromInit);          

        }
        //[HttpGet]
        //[Route("advancedsearch")]
        //public List<GetEmployeesByBranchId_Result> GetEmployeeListByAdvanceSearch(string searchArray)
        //{
        //    var whatever = JsonConvert.DeserializeObject(searchArray);
        //    var another = JsonConvert.SerializeObject(whatever);

        //   // var dict = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(searchArray);
        //    var dict = new JavaScriptSerializer().Deserialize<Dictionary<string, object >>(searchArray);
        //    var postalCode = dict["postalcode"];

        //    //Array is also possible
        //    string[] result = dict.Select(kv => kv.Value.ToString()).ToArray();
        //    //whatever[0].
        //    return _employeeService.GetEmployeeListByAdvanceSearch(searchArray);

        //}

        [Route("detailsShort")]
        public string GetEmployeeDetailsShort(int employeeId)
        {
            //return _employeeService.GetWithDetails(employeeId);
            return _employeeService.GetWithDetailsShort(employeeId);
        }

        [Route("upload")]
        public IHttpActionResult Upload()
        {
            if (!Request.Content.IsMimeMultipartContent("form-data"))
            {
                return BadRequest("Unsupported media type");
            }
            try
            {
                var provider = new CustomMultipartFormDataStreamProvider(_workingFolder);
                Request.Content.ReadAsMultipartAsync(provider);

                foreach (var file in provider.FileData)
                {
                    var fileInfo = new FileInfo(file.LocalFileName);
                }
                return Ok(new { Message = "Photos uploaded ok" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.GetBaseException().Message);
            }
        }
        [HttpGet]
        [Route("employeeEmailInfo")]
        public AmmsEmployee GetEmployeeEmailInfo(int employeeId)
        {
            return _employeeService.GetEmployeeEmailInfo(employeeId);
        }
    }
}