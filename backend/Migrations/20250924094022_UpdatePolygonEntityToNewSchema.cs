using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePolygonEntityToNewSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Properties",
                table: "Polygons");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Polygons");

            migrationBuilder.AddColumn<string>(
                name: "tur",
                table: "Polygons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ad",
                table: "Polygons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "aciklama",
                table: "Polygons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "numarataj",
                table: "Polygons",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ad",
                table: "Polygons");

            migrationBuilder.DropColumn(
                name: "aciklama",
                table: "Polygons");

            migrationBuilder.DropColumn(
                name: "numarataj",
                table: "Polygons");

            migrationBuilder.DropColumn(
                name: "tur",
                table: "Polygons");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Polygons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<JsonDocument>(
                name: "Properties",
                table: "Polygons",
                type: "jsonb",
                nullable: true);
        }
    }
}
