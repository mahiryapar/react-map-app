using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.Text.Json;
using backend.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;



namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PolygonEntity> Polygons { get; set; }
        public DbSet<ImagesEntity> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // PostGIS extension
            modelBuilder.HasPostgresExtension("postgis");

            // Geometry için PostGIS desteği
            modelBuilder.Entity<PolygonEntity>()
                .Property(p => p.Geometry)
                .HasColumnType("geometry (Polygon, 4326)");

            modelBuilder.Entity<ImagesEntity>()
                .HasOne(p => p.Polygon)
                .WithMany(b => b.resimler)
                .HasForeignKey(p => p.PolygonEntityId);
        }
    }
}
