using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Product.Infrastructure.Migrations
{
    public partial class initialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "common");

            migrationBuilder.EnsureSchema(
                name: "config");

            migrationBuilder.EnsureSchema(
                name: "product");

            migrationBuilder.CreateTable(
                name: "Branch",
                schema: "common",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    code = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branch", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Duration",
                schema: "config",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<short>(type: "smallint", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Duration", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fund",
                schema: "config",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Amount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fund", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InstallmentType",
                schema: "config",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Installment = table.Column<short>(type: "smallint", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallmentType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lookup",
                schema: "common",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lookup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductHouseholdSurplusConfiguration",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstCycleSurplusPercentage = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    SecondCycleSurplusPercentage = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    ThirdCycleSurplusPercentage = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    AboveThirdCycleSurplusPercentage = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    OverwriteExistingLoanRangePolicy = table.Column<bool>(type: "bit", nullable: false),
                    OnlyForSurvey = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductHouseholdSurplusConfiguration", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductType",
                schema: "config",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", maxLength: 100, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", maxLength: 100, nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", maxLength: 100, nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Scheme",
                schema: "config",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "Date", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scheme", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupType",
                schema: "config",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DefaultIntallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AllowNew = table.Column<bool>(type: "bit", nullable: false),
                    IsVisible = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupType_InstallmentType_DefaultIntallmentTypeId",
                        column: x => x.DefaultIntallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Product",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProdutTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    Code = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EffectiveTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_Lookup_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Product_ProductType_ProdutTypeId",
                        column: x => x.ProdutTypeId,
                        principalSchema: "config",
                        principalTable: "ProductType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OfficeMapping",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BranchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfficeMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OfficeMapping_Branch_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "common",
                        principalTable: "Branch",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OfficeMapping_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductCharge",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TransactionType = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    IsWhileAdmission = table.Column<bool>(type: "bit", nullable: false),
                    IsWhileDisburse = table.Column<bool>(type: "bit", nullable: false),
                    IsFixed = table.Column<bool>(type: "bit", nullable: false),
                    Condition = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConditionAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    IsVatable = table.Column<bool>(type: "bit", nullable: false),
                    VatPercentage = table.Column<decimal>(type: "Decimal(18,4)", nullable: true),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCharge", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductCharge_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductCharge_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductCharge_Lookup_Condition",
                        column: x => x.Condition,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductCharge_Lookup_TransactionType",
                        column: x => x.TransactionType,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductCharge_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductDuration",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductDuration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductDuration_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductDuration_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductFund",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FundId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductFund", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductFund_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductFund_Fund_FundId",
                        column: x => x.FundId,
                        principalSchema: "config",
                        principalTable: "Fund",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductFund_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductFund_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductGracePeriod",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GracePeriod = table.Column<int>(type: "int", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductGracePeriod", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductGracePeriod_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGracePeriod_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGracePeriod_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductGroup",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductGroupProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DefaultInstallmentType = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DefaultDuration = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductGroup_Duration_DefaultDuration",
                        column: x => x.DefaultDuration,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGroup_GroupType_GroupTypeId",
                        column: x => x.GroupTypeId,
                        principalSchema: "config",
                        principalTable: "GroupType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGroup_InstallmentType_DefaultInstallmentType",
                        column: x => x.DefaultInstallmentType,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGroup_Product_ProductGroupProductId",
                        column: x => x.ProductGroupProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGroup_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductGroupType",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductGroupType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductGroupType_GroupType_GroupTypeId",
                        column: x => x.GroupTypeId,
                        principalSchema: "config",
                        principalTable: "GroupType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductGroupType_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductInstallmentType",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    SortOrder = table.Column<int>(type: "int", maxLength: 2, nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductInstallmentType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductInstallmentType_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInstallmentType_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInstallmentType_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductInterestRate",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FlatInterestRate = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    DecliningInterestRate = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    APR = table.Column<decimal>(type: "Decimal(18,4)", nullable: true),
                    FlatInterestRateDisplay = table.Column<decimal>(type: "Decimal(18,4)", nullable: true),
                    DecliningInterestRateDisplay = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductInterestRate", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductInterestRate_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInterestRate_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInterestRate_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductMinimumDepositConfiguration",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MimimumAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    IsPartialAllowed = table.Column<bool>(type: "bit", nullable: false),
                    MaximumOfWithdrawal = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    LookupId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductMinimumDepositConfiguration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductMinimumDepositConfiguration_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductMinimumDepositConfiguration_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductMinimumDepositConfiguration_Lookup_LookupId",
                        column: x => x.LookupId,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductMinimumDepositConfiguration_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductModeOfPayment",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModeOfDisbursement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModeOfCollection = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductModeOfPayment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductModeOfPayment_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicyAdvanceCollection",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsAdvanceInstallmentAllowed = table.Column<bool>(type: "bit", nullable: false),
                    MaximumNumberOfInstallmentAllowed = table.Column<decimal>(type: "Decimal(18,4)", nullable: true),
                    MinimumNumberOfAdvanceCollectionAllowedPerDay = table.Column<decimal>(type: "Decimal(18,4)", nullable: true),
                    MaximumNumberOfAdvanceCollectionAllowedPerLoan = table.Column<decimal>(type: "Decimal(18,4)", nullable: true),
                    IsAdvanceAllowedWithFullOutstanding = table.Column<bool>(type: "bit", nullable: false),
                    AdvanceAllowedInstallmentNo = table.Column<int>(type: "int", nullable: true),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicyAdvanceCollection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicyAdvanceCollection_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicyAdvanceCollection_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicyAdvanceCollection_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicyLoan",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaximumLoanAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    MinimumLoanAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    MaximumLoanAmountForFirstCycle = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    MaximumIncrementAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    MinimumIncrementAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicyLoan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicyLoan_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicyLoan_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicyLoan_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicyLoanApprovalLimit",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoanCycle = table.Column<int>(type: "int", nullable: false),
                    LimitFrom = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    LimitTo = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicyLoanApprovalLimit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicyLoanApprovalLimit_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicyLoanApprovalLimit_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicyLoanApprovalLimit_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicySavings",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Cycle = table.Column<int>(type: "int", nullable: false),
                    IsPercentage = table.Column<bool>(type: "bit", nullable: false),
                    Amount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicySavings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicySavings_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicySavings_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicySecurity",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Cycle = table.Column<int>(type: "int", nullable: false),
                    IsPercentage = table.Column<bool>(type: "bit", nullable: false),
                    Amount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicySecurity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicySecurity_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicySecurity_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicySetup",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsParallelLoanAllowed = table.Column<bool>(type: "bit", nullable: false),
                    IsMultipleInstallmentCollectionAllowed = table.Column<bool>(type: "bit", nullable: false),
                    IsPartialCollectionAllowed = table.Column<bool>(type: "bit", nullable: false),
                    IsApplicableGender = table.Column<bool>(type: "bit", nullable: false),
                    Gender = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsAgeRangeApplied = table.Column<bool>(type: "bit", nullable: false),
                    FromAgeRange = table.Column<int>(type: "int", nullable: true),
                    ToAgeRange = table.Column<int>(type: "int", nullable: true),
                    IsAdjustSavingsDuringWriteOff = table.Column<bool>(type: "bit", nullable: false),
                    HasSavings = table.Column<bool>(type: "bit", nullable: false),
                    HasSecurity = table.Column<bool>(type: "bit", nullable: false),
                    HasMutilpurposeRisk = table.Column<bool>(type: "bit", nullable: false),
                    IsDaysBetweenTwoLoanCycles = table.Column<bool>(type: "bit", nullable: false),
                    DaysBetweenTwoLoanCycles = table.Column<int>(type: "int", nullable: true),
                    IsWeeksRequiredToDisburse = table.Column<bool>(type: "bit", nullable: false),
                    WeeksRequiredToDisburse = table.Column<int>(type: "int", nullable: true),
                    IsNoOfMemberAllowed = table.Column<bool>(type: "bit", nullable: false),
                    NoOfMemberAllowed = table.Column<int>(type: "int", nullable: true),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicySetup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicySetup_Lookup_Gender",
                        column: x => x.Gender,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductPolicySetup_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductPolicyUpdateMember",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsInActivemMember = table.Column<bool>(type: "bit", nullable: false),
                    IsNoActiveLoanAccount = table.Column<bool>(type: "bit", nullable: false),
                    HasSavingsReturned = table.Column<bool>(type: "bit", nullable: false),
                    IsDormentMember = table.Column<bool>(type: "bit", nullable: false),
                    IsNoActiveSavingsAccount = table.Column<bool>(type: "bit", nullable: false),
                    IsNoTransaction = table.Column<bool>(type: "bit", nullable: false),
                    NoTransactionForLastMonth = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPolicyUpdateMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPolicyUpdateMember_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductScheme",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchemeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductScheme", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductScheme_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductScheme_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductScheme_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductScheme_Scheme_SchemeId",
                        column: x => x.SchemeId,
                        principalSchema: "config",
                        principalTable: "Scheme",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SavingsSecurityConfiguration",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsSecurityLapseDetails = table.Column<bool>(type: "bit", nullable: false),
                    NoOfTransactions = table.Column<int>(type: "int", nullable: false),
                    IsPostSavingsInterest = table.Column<bool>(type: "bit", nullable: false),
                    Frequency = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DayDifference = table.Column<int>(type: "int", nullable: false),
                    IsAdjustwithLoan = table.Column<bool>(type: "bit", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavingsSecurityConfiguration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavingsSecurityConfiguration_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SavingsSecurityConfiguration_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SavingsSecurityConfiguration_Lookup_Frequency",
                        column: x => x.Frequency,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SavingsSecurityConfiguration_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SavingsSecurityConfiguration_ProductType_ProductTypeId",
                        column: x => x.ProductTypeId,
                        principalSchema: "config",
                        principalTable: "ProductType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductInstallmentCount",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GracePeriodId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentCount = table.Column<int>(type: "int", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductInstallmentCount", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductInstallmentCount_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInstallmentCount_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInstallmentCount_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductInstallmentCount_ProductGracePeriod_GracePeriodId",
                        column: x => x.GracePeriodId,
                        principalSchema: "product",
                        principalTable: "ProductGracePeriod",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductTenure",
                schema: "product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DurationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstallmentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GracePeriodId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CalculationMode = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BaseAmount = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    AmountPerBase = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    StartingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    EndingDate = table.Column<DateTime>(type: "Date", nullable: false),
                    CellingOrRound = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CellingOrRoundValue = table.Column<decimal>(type: "Decimal(18,4)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AuthorizeStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    AuthorizedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorizedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTenure", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductTenure_Duration_DurationId",
                        column: x => x.DurationId,
                        principalSchema: "config",
                        principalTable: "Duration",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductTenure_InstallmentType_InstallmentTypeId",
                        column: x => x.InstallmentTypeId,
                        principalSchema: "config",
                        principalTable: "InstallmentType",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductTenure_Lookup_CalculationMode",
                        column: x => x.CalculationMode,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductTenure_Lookup_CellingOrRound",
                        column: x => x.CellingOrRound,
                        principalSchema: "common",
                        principalTable: "Lookup",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductTenure_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "product",
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductTenure_ProductGracePeriod_GracePeriodId",
                        column: x => x.GracePeriodId,
                        principalSchema: "product",
                        principalTable: "ProductGracePeriod",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupType_DefaultIntallmentTypeId",
                schema: "config",
                table: "GroupType",
                column: "DefaultIntallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OfficeMapping_BranchId",
                schema: "product",
                table: "OfficeMapping",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_OfficeMapping_ProductId",
                schema: "product",
                table: "OfficeMapping",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_CategoryId",
                schema: "product",
                table: "Product",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_ProdutTypeId",
                schema: "product",
                table: "Product",
                column: "ProdutTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCharge_Condition",
                schema: "product",
                table: "ProductCharge",
                column: "Condition");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCharge_DurationId",
                schema: "product",
                table: "ProductCharge",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCharge_InstallmentTypeId",
                schema: "product",
                table: "ProductCharge",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCharge_ProductId",
                schema: "product",
                table: "ProductCharge",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCharge_TransactionType",
                schema: "product",
                table: "ProductCharge",
                column: "TransactionType");

            migrationBuilder.CreateIndex(
                name: "IX_ProductDuration_DurationId",
                schema: "product",
                table: "ProductDuration",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductDuration_ProductId",
                schema: "product",
                table: "ProductDuration",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFund_DurationId",
                schema: "product",
                table: "ProductFund",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFund_FundId",
                schema: "product",
                table: "ProductFund",
                column: "FundId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFund_InstallmentTypeId",
                schema: "product",
                table: "ProductFund",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFund_ProductId",
                schema: "product",
                table: "ProductFund",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGracePeriod_DurationId",
                schema: "product",
                table: "ProductGracePeriod",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGracePeriod_InstallmentTypeId",
                schema: "product",
                table: "ProductGracePeriod",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGracePeriod_ProductId",
                schema: "product",
                table: "ProductGracePeriod",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroup_DefaultDuration",
                schema: "product",
                table: "ProductGroup",
                column: "DefaultDuration");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroup_DefaultInstallmentType",
                schema: "product",
                table: "ProductGroup",
                column: "DefaultInstallmentType");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroup_GroupTypeId",
                schema: "product",
                table: "ProductGroup",
                column: "GroupTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroup_ProductGroupProductId",
                schema: "product",
                table: "ProductGroup",
                column: "ProductGroupProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroup_ProductId",
                schema: "product",
                table: "ProductGroup",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroupType_GroupTypeId",
                schema: "product",
                table: "ProductGroupType",
                column: "GroupTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductGroupType_ProductId",
                schema: "product",
                table: "ProductGroupType",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentCount_DurationId",
                schema: "product",
                table: "ProductInstallmentCount",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentCount_GracePeriodId",
                schema: "product",
                table: "ProductInstallmentCount",
                column: "GracePeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentCount_InstallmentTypeId",
                schema: "product",
                table: "ProductInstallmentCount",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentCount_ProductId",
                schema: "product",
                table: "ProductInstallmentCount",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentType_DurationId",
                schema: "product",
                table: "ProductInstallmentType",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentType_InstallmentTypeId",
                schema: "product",
                table: "ProductInstallmentType",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstallmentType_ProductId",
                schema: "product",
                table: "ProductInstallmentType",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInterestRate_DurationId",
                schema: "product",
                table: "ProductInterestRate",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInterestRate_InstallmentTypeId",
                schema: "product",
                table: "ProductInterestRate",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInterestRate_ProductId",
                schema: "product",
                table: "ProductInterestRate",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMinimumDepositConfiguration_DurationId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMinimumDepositConfiguration_InstallmentTypeId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMinimumDepositConfiguration_LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                column: "LookupId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMinimumDepositConfiguration_ProductId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductModeOfPayment_ProductId",
                schema: "product",
                table: "ProductModeOfPayment",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyAdvanceCollection_DurationId",
                schema: "product",
                table: "ProductPolicyAdvanceCollection",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyAdvanceCollection_InstallmentTypeId",
                schema: "product",
                table: "ProductPolicyAdvanceCollection",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyAdvanceCollection_ProductId",
                schema: "product",
                table: "ProductPolicyAdvanceCollection",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyLoan_DurationId",
                schema: "product",
                table: "ProductPolicyLoan",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyLoan_InstallmentTypeId",
                schema: "product",
                table: "ProductPolicyLoan",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyLoan_ProductId",
                schema: "product",
                table: "ProductPolicyLoan",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyLoanApprovalLimit_DurationId",
                schema: "product",
                table: "ProductPolicyLoanApprovalLimit",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyLoanApprovalLimit_InstallmentTypeId",
                schema: "product",
                table: "ProductPolicyLoanApprovalLimit",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyLoanApprovalLimit_ProductId",
                schema: "product",
                table: "ProductPolicyLoanApprovalLimit",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicySavings_InstallmentTypeId",
                schema: "product",
                table: "ProductPolicySavings",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicySavings_ProductId",
                schema: "product",
                table: "ProductPolicySavings",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicySecurity_InstallmentTypeId",
                schema: "product",
                table: "ProductPolicySecurity",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicySecurity_ProductId",
                schema: "product",
                table: "ProductPolicySecurity",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicySetup_Gender",
                schema: "product",
                table: "ProductPolicySetup",
                column: "Gender");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicySetup_ProductId",
                schema: "product",
                table: "ProductPolicySetup",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPolicyUpdateMember_ProductId",
                schema: "product",
                table: "ProductPolicyUpdateMember",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductScheme_DurationId",
                schema: "product",
                table: "ProductScheme",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductScheme_InstallmentTypeId",
                schema: "product",
                table: "ProductScheme",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductScheme_ProductId",
                schema: "product",
                table: "ProductScheme",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductScheme_SchemeId",
                schema: "product",
                table: "ProductScheme",
                column: "SchemeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTenure_CalculationMode",
                schema: "product",
                table: "ProductTenure",
                column: "CalculationMode");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTenure_CellingOrRound",
                schema: "product",
                table: "ProductTenure",
                column: "CellingOrRound");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTenure_DurationId",
                schema: "product",
                table: "ProductTenure",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTenure_GracePeriodId",
                schema: "product",
                table: "ProductTenure",
                column: "GracePeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTenure_InstallmentTypeId",
                schema: "product",
                table: "ProductTenure",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTenure_ProductId",
                schema: "product",
                table: "ProductTenure",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingsSecurityConfiguration_DurationId",
                schema: "product",
                table: "SavingsSecurityConfiguration",
                column: "DurationId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingsSecurityConfiguration_Frequency",
                schema: "product",
                table: "SavingsSecurityConfiguration",
                column: "Frequency");

            migrationBuilder.CreateIndex(
                name: "IX_SavingsSecurityConfiguration_InstallmentTypeId",
                schema: "product",
                table: "SavingsSecurityConfiguration",
                column: "InstallmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingsSecurityConfiguration_ProductId",
                schema: "product",
                table: "SavingsSecurityConfiguration",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingsSecurityConfiguration_ProductTypeId",
                schema: "product",
                table: "SavingsSecurityConfiguration",
                column: "ProductTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OfficeMapping",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductCharge",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductDuration",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductFund",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductGroup",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductGroupType",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductHouseholdSurplusConfiguration",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductInstallmentCount",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductInstallmentType",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductInterestRate",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductMinimumDepositConfiguration",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductModeOfPayment",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicyAdvanceCollection",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicyLoan",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicyLoanApprovalLimit",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicySavings",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicySecurity",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicySetup",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductPolicyUpdateMember",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductScheme",
                schema: "product");

            migrationBuilder.DropTable(
                name: "ProductTenure",
                schema: "product");

            migrationBuilder.DropTable(
                name: "SavingsSecurityConfiguration",
                schema: "product");

            migrationBuilder.DropTable(
                name: "Branch",
                schema: "common");

            migrationBuilder.DropTable(
                name: "Fund",
                schema: "config");

            migrationBuilder.DropTable(
                name: "GroupType",
                schema: "config");

            migrationBuilder.DropTable(
                name: "Scheme",
                schema: "config");

            migrationBuilder.DropTable(
                name: "ProductGracePeriod",
                schema: "product");

            migrationBuilder.DropTable(
                name: "Duration",
                schema: "config");

            migrationBuilder.DropTable(
                name: "InstallmentType",
                schema: "config");

            migrationBuilder.DropTable(
                name: "Product",
                schema: "product");

            migrationBuilder.DropTable(
                name: "Lookup",
                schema: "common");

            migrationBuilder.DropTable(
                name: "ProductType",
                schema: "config");
        }
    }
}
