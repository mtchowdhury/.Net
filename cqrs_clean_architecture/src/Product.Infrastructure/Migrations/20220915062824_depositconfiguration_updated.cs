using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Product.Infrastructure.Migrations
{
    public partial class depositconfiguration_updated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductMinimumDepositConfiguration_Lookup_LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration");

            migrationBuilder.DropIndex(
                name: "IX_ProductMinimumDepositConfiguration_LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration");

            migrationBuilder.DropColumn(
                name: "LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductMinimumDepositConfiguration_LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                column: "LookupId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductMinimumDepositConfiguration_Lookup_LookupId",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                column: "LookupId",
                principalSchema: "common",
                principalTable: "Lookup",
                principalColumn: "Id");
        }
    }
}
