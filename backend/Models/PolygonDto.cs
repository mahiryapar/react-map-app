using System.Text.Json;
using System.Text.Json.Nodes;

namespace backend.Models
{
    public class PolygonDto
    {
        public int Id { get; set; }
        public JsonObject? Properties { get; set; }
        public JsonObject Geometry { get; set; } = default!;
    }
}
