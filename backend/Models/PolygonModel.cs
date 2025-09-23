using System.Text.Json.Nodes;

namespace backend.Models
{
    public class PolygonModel
    {
        public int Id { get; set; } // Güncelleme işlemleri için eklendi
        public JsonObject Geometry { get; set; }   // GeoJSON objesini karşılamak için
        public Dictionary<string, string> Properties { get; set; }
    }
}
