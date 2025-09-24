using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixTurColumnFromRenameToNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop old Name column if it still exists
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" DROP COLUMN IF EXISTS \"Name\";");

            // Ensure we create a brand new 'tur' column (not renamed). If it was created by rename earlier, drop and recreate
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" DROP COLUMN IF EXISTS \"tur\";");
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" ADD COLUMN \"tur\" text;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert: drop new 'tur' and bring back 'Name'
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" DROP COLUMN IF EXISTS \"tur\";");
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" ADD COLUMN \"Name\" text;");
        }
    }
}
