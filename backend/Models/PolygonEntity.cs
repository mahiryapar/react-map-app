using NetTopologySuite.Geometries;
using System.Text.Json;

namespace backend.Models
{
    public class PolygonEntity
    {
        public int Id { get; set; }
        public string? Name { get; set; }      
        public JsonDocument? Properties { get; set; }
        public Polygon? Geometry { get; set; }   
    }
}