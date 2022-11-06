using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Product.Infrastructure.Migrations
{
    public partial class SPGetProductListCreated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var createSpGetProductList = @"/****************************************************************
** File: Product List Get
** Name: product.usp_SELProducts
** Desc: Get all product with pagination by status
** Auth: Shihab Uddin
** Date: '2022-09-20'
*****************************************************************
** Change History
** Date Author Description
*****************************************************************
** <mm/dd/yyyy> <developer> <description of change>
****************************************************************/
CREATE or ALTER PROCEDURE product.usp_SELProducts
(
    @pageNumber int,
    @pageSize int,
    @status bit
)
AS
BEGIN
	SET NOCOUNT, XACT_ABORT ON;
	DECLARE @productTable table
	(
		Id uniqueidentifier
		,ProductTypeId uniqueidentifier
		,ProductTypeName nvarchar(60)
		,Name nvarchar(60)
		,ShortName nvarchar(12)
		,Code nvarchar(5)
		,CategoryId uniqueidentifier
		,CategoryName nvarchar(20)
		,EffectiveFrom datetime
		,EffectiveTo datetime
		,SortOrder int
		,Status bit
	)

    INSERT INTO @productTable
    SELECT
    p.Id
    ,p.ProductTypeId
    ,pt.Name as ProductTypeName
    ,p.Name
    ,p.ShortName
    ,p.Code
    ,p.CategoryId
    ,lu.Value as CategoryName
    ,p.EffectiveFrom
    ,p.EffectiveTo
    ,p.SortOrder
    ,p.Status
    FROM
    product.Product p
    INNER JOIN config.ProductType pt on pt.Id=p.ProductTypeId
    INNER JOIN common.[Lookup] lu on lu.Id=p.CategoryId and lu.Type='ProductCategory'
    WHERE 
	p.Status=@status AND
    p.IsDeleted=0

    SELECT * FROM @productTable
	ORDER BY NAME
    OFFSET (@pageNumber-1)*@pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY

    SELECT COUNT(1) FROM @productTable
END";
            migrationBuilder.Sql(createSpGetProductList);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var dropSpGetProductList = "DROP PROCEDURE product.usp_SELProducts";
            migrationBuilder.Sql(dropSpGetProductList);
        }
    }
}
