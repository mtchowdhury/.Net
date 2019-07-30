USE [ArmadaRX]
GO
/****** Object:  Table [aspn].[ProgramPharmacyCapacity]    Script Date: 2/17/2017 10:55:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aspn].[ProgramPharmacyCapacity](
	[ProgramPharmacyCapacityID] [bigint] IDENTITY(1,1) NOT NULL,
	[ProgramID] [int] NOT NULL,
	[MemberID] [bigint] NOT NULL,
	[Capacity] [int] NULL,
	[EffectiveDate] [datetime] NULL,
	[DateUpdated] [datetime] NULL DEFAULT (getdate()),
	[UpdatedBy] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProgramPharmacyCapacityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 95) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [aspn].[ProgramPharmacyCapacity] ON 

GO
INSERT [aspn].[ProgramPharmacyCapacity] ([ProgramPharmacyCapacityID], [ProgramID], [MemberID], [Capacity], [EffectiveDate], [DateUpdated], [UpdatedBy]) VALUES (1, 92, 34172, 150, CAST(N'2017-02-03 00:00:00.000' AS DateTime), CAST(N'2017-02-13 18:14:02.067' AS DateTime), N'c654836f-0215-482d-8be0-fbd8e17a0a16')
GO
INSERT [aspn].[ProgramPharmacyCapacity] ([ProgramPharmacyCapacityID], [ProgramID], [MemberID], [Capacity], [EffectiveDate], [DateUpdated], [UpdatedBy]) VALUES (2, 92, 38945, 150, CAST(N'2017-02-03 00:00:00.000' AS DateTime), CAST(N'2017-02-13 18:14:02.067' AS DateTime), N'c654836f-0215-482d-8be0-fbd8e17a0a16')
GO
INSERT [aspn].[ProgramPharmacyCapacity] ([ProgramPharmacyCapacityID], [ProgramID], [MemberID], [Capacity], [EffectiveDate], [DateUpdated], [UpdatedBy]) VALUES (3, 92, 3265, 200, CAST(N'2017-02-03 00:00:00.000' AS DateTime), CAST(N'2017-02-13 18:14:02.067' AS DateTime), N'c654836f-0215-482d-8be0-fbd8e17a0a16')
GO
SET IDENTITY_INSERT [aspn].[ProgramPharmacyCapacity] OFF
GO
