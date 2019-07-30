USE [Analytics]
GO
/****** Object:  StoredProcedure [analytics].[GetNetworkCapacityByPharmacy]    Script Date: 2/17/2017 10:54:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER Procedure [analytics].[GetNetworkCapacityByPharmacy]
(
	@programId int,
	@startDate datetime,
	@endDate datetime
)
As
Begin
	select sum(pp.capacity) as TotalCapacity , effectivedate, 
			programid
    into #TotalCapacity
    from ArmadaRX.aspn.programpharmacycapacity pp
    where pp.ProgramID = @programId
    group by programid,effectivedate

	select distinct 
			count(a.AspnRxID) [AssignedCapacity]
		  , convert(date,a.CreatedOn) [Createdon] 
		  , tc.EffectiveDate 
		  , tc.TotalCapacity 
		  , ppc.ProgramPharmacyCapacityID
		  , (tc.totalcapacity - count(a.AspnRxID)) [RemainingCapacity]
    from ArmadaRX.aspn.aspnrx a
    inner join #TotalCapacity tc on tc.programid = a.programid
    inner join ArmadaRX.aspn.programpharmacycapacity ppc on (ppc.programid = a.programid and a.fillingpharmacyid = ppc.memberid)
    inner join ArmadaRX.common.vMember vm on vm.MemberID = a.FillingPharmacyID
    where a.programid = @programId and (a.CreatedOn >= @startDate and a.CreatedOn <= @endDate) 
    group by convert(date,a.CreatedOn)   
	, tc.EffectiveDate  
	, a.programid 
	, ppc.ProgramPharmacyCapacityID
	, tc.TotalCapacity
	order by ppc.ProgramPharmacyCapacityID
End