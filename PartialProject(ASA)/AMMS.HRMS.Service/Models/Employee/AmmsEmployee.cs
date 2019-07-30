using System;
using System.Collections.Generic;

namespace AMMS.HRMS.Service.Models.Employee
{
    public class AmmsEmployee
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string SpouseName { get; set; }
        public int BloodGroup { get; set; }
        public string NameInBangla { get; set; }
        public string FatherNameInBangla { get; set; }
        public string MotherNameInBangla { get; set; }
        public string SpouseNameInBangla { get; set; }
        public string NationalId { get; set; }
        public int? PresentAddressId { get; set; }
        public int? PermanentAddressId { get; set; }
        public string PermanentVillage { get; set; }
        public int PermanentPostCode { get; set; }
        public string PermanentVillageInBangla { get; set; }
        public string PresentVillage { get; set; }
        public string PresentPostOffice { get; set; }
        public int PresentPostCode { get; set; }
        public string PresentVillageInBangla { get; set; }
        public string PresentPostOfficeInBangla { get; set; }
        public string PermanentPostOffice { get; set; }
        public string PermanentPostOfficeInBangla { get; set; }
        public string Etin { get; set; }
        public int TaxCircleZoneId { get; set; }
        public string TaxCircleNumber { get; set; }
        public string TaxCircleName { get; set; }
        public string ResidencePhoneNo { get; set; }
        public string WorkPhoneNo { get; set; }
        public string MobilePhoneNo { get; set; }
        public string Email { get; set; }
        public DateTime AppLetterDate { get; set; }
        public string AppLetterNo { get; set; }
        public DateTime JoiningDate { get; set; }
        public DateTime? JoiningLetterDate { get; set; }
        public string PermanentLetterNo { get; set; }
        public DateTime? PermanentDate { get; set; }
        public DateTime? PermanentLetterDate { get; set; }

        public int Status { get; set; }
        public int MaritalStatus { get; set; }
        public int Sex { get; set; }
        public int Religion { get; set; }
        public int PermanentThanaId { get; set; }
        public int PermanentGovtDistrict { get; set; }
        public int PresentThanaId { get; set; }
        public int PresentGovtDistrict { get; set; }
        public int JoiningBranchId { get; set; }
        public int GradeId { get; set; }
        public int CurrentDesignation { get; set; }
        public int CurrentDepartment { get; set; }
        public int DepartmentId { get; set; } // joining department
                                              // public int CurrentDepartment { get; set; }
        public int RegionId { get; set; }
        public int DistrictId { get; set; } // joining district
        public int CurrentDistrict { get; set; }
        public int CurrentRegion { get; set; }
        public int ZoneId { get; set; }
        public int EmpId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string User { get; set; }
        public List<AmmsEmployeeAcademicQualification> AcademicQualification { get; set; }
        public List<AmmsEmployeeProfessionalQualification> ProfessionalQualification { get; set; }
        public List<AmmsEmployeeTraining> Training { get; set; }
        public List<AmmsEmployeeExperience> Experience { get; set; }
        public int Nationality { get; set; }
        public int JoiningOfficeType { get; set; }
        public int? JoiningFaOffice { get; set; }
        public int JoiningGrade { get; set; }
        public int JoiningDesignation { get; set; }
        public int JoiningEmploymentType { get; set; }
        public DateTime CurrentBranchJoiningDate { get; set; }
        public int CurrentOfficeType { get; set; }
        public int? CurrentFaOffice { get; set; }
        public int? CurrentGrade { get; set; }
        public int? CurrentEmploymentType { get; set; }
        public int SubStatus { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int CurrentBranchId { get; set; }
        public int ReleasedAccountId { get; set; }
        public string ReleasedAccountName { get; set; }
        public double? OutstandingAmount { get; set; }
        public int SalaryStructureId { get; set; }
        public bool? IsProgramOfficer { get; set; }
        public string ReleaseLetterNo { get; set; }
        public string ReleaseReason { get; set; }
        public string BranchName { get; set; }
        public int EmpbranchCount { get; set; }
    }

    
    public class AmmsEmployeeFilterParams
    {
        public string filterColumn1 { get; set; }
        public string filterComparator1 { get; set; }
        public string filterValue1 { get; set; }
        public string filterColumn2 { get; set; }
        public string filterComparator2 { get; set; }
        public string filterValue2 { get; set; }
        public string filterColumn3 { get; set; }
        public string filterComparator3 { get; set; }
        public string filterValue3 { get; set; }
        public string andOr1 { get; set; }
        public string andOr2 { get; set; }
        public int fromInit { get; set; } 
    }
    public class AmmsAddress
    {
        public int? PostCode { get; set; }
        public string PostOfficeInBangla { get; set; }
        public string PostOffice { get; set; }
        public string Village { get; set; }
        public string VillageInBangla { get; set; }
        public int ThanaId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
    public class AmmsEmployeeDepartment
    {
        public int EmployeeId { get; set; }
        public int DepartmentId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
    public class AmmsEmployeeDesignation
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int AmmsEmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int DesignationId { get; set; }
        public string DesignationName { get; set; }
        public string Description { get; set; }
        public string GradeName { get; set; }
        public int GradeId { get; set; }
        public int PurposeId { get; set; }
        public string LetterNo { get; set; }
        public DateTime? LetterDate { get; set; }
        public int OfficeTypeId { get; set; }
        public int OfficeId { get; set; }
        public int Status { get; set; }
        public bool IsAmended { get; set; }
        public int? InactiveReasonId { get; set; }
        public string InactiveReasonRemark { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
    }

    public class AmmsEmployeeAcademicQualification
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int ExamType { get; set; }
        public int ExamTitle { get; set; }
        public int Group { get; set; }
        public string Institution { get; set; }
        public int Board { get; set; }
        public int? Grade { get; set; }
        public int? Class { get; set; }
        public double? Cgpa { get; set; }
        public int? CgpaScale { get; set; }
        public int PassingYear { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

    }

    public class AmmsEmployeeProfessionalQualification
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string Certification { get; set; }
        public string Institute { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    public class AmmsEmployeeTraining
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string TrainingTitle { get; set; }
        public string TopicsCovered { get; set; }
        public string InstituteName { get; set; }
        public string Country { get; set; }
        public string Location { get; set; }
        public string Duration { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
    }

    public class AmmsEmployeeExperience
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyBusiness { get; set; }
        public string CompanyLocation { get; set; }
        public string PositionHeld { get; set; }
        public string Department { get; set; }
        public string Responsibilities { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    public class AmmsEmployeeBankAccount
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int EmpId { get; set; }
        public string EmployeeName { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string AccountNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int OfficeType { get; set; }
        public int OfficeCode { get; set; }
        public int BankId { get; set; }

        public int Status { get; set; }
        public long CreatedBranchDate { get; set; }
        public long ModifiedBranchDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; }
    }

    public class AmmsReleasedEmployee
    {
        public DateTime ReleaseDate { get; set; }
        public long BranchWorkingDate { get; set; }
        public DateTime SystemDate { get; set; }
        public int CurrentOfficeType { get; set; }
        public int CurrentBranchId { get; set; }
        public string OfiiceName { get; set; }
        public string LetterNo { get; set; }
        public DateTime? LetterDate { get; set; }
        public int EmployeeId { get; set; }
        public int ReleaseBy { get; set; }
        public int EmpId { get; set; }
        public int Status { get; set; }
        public int ReleaseReason { get; set; }
        public int ReleasedBy { get; set; }
        public int CancelledBy { get; set; }
        public string Email { get; set; }
    }

    public class AmmsEmployeeAccounttype
    {
        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public string AccountTypeName { get; set; }
        public int Type { get; set; }
        public int Category { get; set; }
        public Nullable<double> InterestRate { get; set; }
        public string DurationInMonth { get; set; }
        public int SortOrder { get; set; }
        public string PermittedOfficeLevel { get; set; }
        public bool RecurringInPayroll { get; set; }
        public bool RecurringInSalaryStructure { get; set; }
        public bool CreateBlankAccount { get; set; }
        public bool IsBallanceCarryforward { get; set; }
        public bool IsMultiple { get; set; }
        public long EffectiveDateFrom { get; set; }
        public Nullable<long> EffectiveDateTo { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdaedOn { get; set; }
    }

    public class AmmsEmployeeSalaryStructure
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int EmpId { get; set; }
        public System.DateTime StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string Description { get; set; }
        public int ReasonId { get; set; }
        public string Reason { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public string EmployeeGrade { get; set; }
        public string EmployeeDesignation { get; set; }
        public Nullable<int> OfficeCode { get; set; }
        public Nullable<int> OfficeType { get; set; }
        public string OfficeName { get; set; }
        public int Status { get; set; }
        public string PayrollId { get; set; }
    }

    public class AmmsEmployeeSalaryStructureViewModel
    {
        public AmmsEmployeeSalaryStructure SalaryStructure { get; set; }
        public List<AmmsEmployeeAccount> EmployeeAccounts { get; set; } 
    }

   
}
