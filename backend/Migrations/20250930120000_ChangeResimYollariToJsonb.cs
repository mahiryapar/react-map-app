using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    [Migration("20250930120000_ChangeResimYollariToJsonb")]
    public partial class ChangeResimYollariToJsonb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Convert existing text[] data to jsonb
            migrationBuilder.Sql("ALTER TABLE \"Polygons\" ALTER COLUMN \"resim_yollari\" TYPE jsonb USING to_jsonb(\"resim_yollari\")");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Convert jsonb back to text[]
            migrationBuilder.Sql(@"ALTER TABLE ""Polygons"" ALTER COLUMN ""resim_yollari"" TYPE text[] USING (
                CASE 
                    WHEN ""resim_yollari"" IS NULL THEN NULL 
                    ELSE (SELECT array_agg(value::text) FROM jsonb_array_elements(""resim_yollari""))
                END)");
        }
    }
}
