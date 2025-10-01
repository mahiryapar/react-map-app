using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ConvertResimYollariToJsonb2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" ALTER COLUMN \"resim_yollari\" TYPE jsonb USING to_jsonb(\"resim_yollari\")");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE ""Polygons"" ALTER COLUMN ""resim_yollari"" TYPE text[] USING (
                CASE 
                    WHEN ""resim_yollari"" IS NULL THEN NULL 
                    ELSE (SELECT array_agg(value::text) FROM jsonb_array_elements(""resim_yollari""))
                END)");
        }
    }
}
