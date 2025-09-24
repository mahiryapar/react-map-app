using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    // Attributes are defined in the Designer file; keep this class clean to avoid duplicate attributes
    public partial class RecreateTurColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop current 'tur' column if exists, then recreate clean
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" DROP COLUMN IF EXISTS \"tur\";");
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" ADD COLUMN \"tur\" text;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert by dropping and re-adding (no data restoration)
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" DROP COLUMN IF EXISTS \"tur\";");
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" ADD COLUMN \"tur\" text;");
        }
    }
}
