using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chroniq.Storage.Migrations
{
    /// <inheritdoc />
    public partial class ordernonunique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Orders_Order",
                table: "Orders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Orders_Order",
                table: "Orders",
                column: "Order",
                unique: true);
        }
    }
}
