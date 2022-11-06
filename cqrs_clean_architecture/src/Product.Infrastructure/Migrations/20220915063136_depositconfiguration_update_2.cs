using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Product.Infrastructure.Migrations
{
    public partial class depositconfiguration_update_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndingDate",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                type: "Date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartingDate",
                schema: "product",
                table: "ProductMinimumDepositConfiguration",
                type: "Date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndingDate",
                schema: "product",
                table: "ProductMinimumDepositConfiguration");

            migrationBuilder.DropColumn(
                name: "StartingDate",
                schema: "product",
                table: "ProductMinimumDepositConfiguration");
        }
    }
}
