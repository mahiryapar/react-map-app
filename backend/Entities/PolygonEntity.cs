using NetTopologySuite.Geometries;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace basarsoft_react_web_api.Entities
{
    public class PolygonEntity
    {
        public int Id { get; set; }
        public string? Ad { get; set; }
        public string? tur { get; set; }
        public string? numarataj { get; set; }
        public string? aciklama { get; set; }
        public Polygon? Geometry { get; set; }  
    }
}