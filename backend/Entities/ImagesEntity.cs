

namespace backend.Entities
{
    public class ImagesEntity
    {
         
        public int Id { get; set; }
        public string? ImagePath { get; set; }
        public string? GUID { get; set; }

        public int PolygonEntityId { get; set; }

        public PolygonEntity? Polygon { get; set; }


    }
}
