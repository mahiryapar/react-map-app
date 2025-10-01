using System.Text.Json.Nodes;

namespace backend.Models
{
    public class PagedDTO
    {
        public int Id { get; set; }
        public string? Ad { get; set; }
        public string? tur { get; set; }
        public string? daire_sayisi { get; set; }
        public string? numarataj { get; set; }
        public string? aciklama { get; set; }
        public JsonObject Geometry { get; set; } = default!;
    }
}
