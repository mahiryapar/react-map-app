using Microsoft.EntityFrameworkCore;  
using backend.Models;
using NetTopologySuite.Geometries;
using System.Text.Json;



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

            // JSONB için Properties alanı (JsonDocument olarak sakla)
            modelBuilder.Entity<PolygonEntity>()
                .Property(p => p.Properties)
                .HasColumnType("jsonb");

            // Geometry için PostGIS desteği
            modelBuilder.Entity<PolygonEntity>()
                .Property(p => p.Geometry)
                .HasColumnType("geometry (Polygon, 4326)");
        }
    }
}
