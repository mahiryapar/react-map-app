using NetTopologySuite.Geometries;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace backend.Entities
{
    public class PolygonEntity
    {
        public int Id { get; set; }
        public string? Ad { get; set; }
        public string? tur { get; set; }
        public string? numarataj { get; set; }
        public string? aciklama { get; set; }
        public int daire_sayisi { get; set; }
        public List<ImagesEntity>? resimler { get; set; }
        public Polygon? Geometry { get; set; }  
    }
}