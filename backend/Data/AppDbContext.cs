using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.Text.Json;
using basarsoft_react_web_api.Entities;



namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PolygonEntity> Polygons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // PostGIS extension
            modelBuilder.HasPostgresExtension("postgis");

            // Geometry için PostGIS desteği
            modelBuilder.Entity<PolygonEntity>()
                .Property(p => p.Geometry)
                .HasColumnType("geometry (Polygon, 4326)");
        }
    }
}
