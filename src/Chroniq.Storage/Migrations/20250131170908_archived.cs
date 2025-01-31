using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chroniq.Storage.Migrations
{
    /// <inheritdoc />
    public partial class archived : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "avatarUrl",
                table: "Students",
                newName: "AvatarUrl");

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "Students",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "Students");

            migrationBuilder.RenameColumn(
                name: "AvatarUrl",
                table: "Students",
                newName: "avatarUrl");
        }
    }
}
