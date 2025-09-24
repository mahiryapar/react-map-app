using backend.Models;
using NetTopologySuite.Geometries;
using System.Text.Json.Nodes;
using System.Text.Json;
using backend.Interfaces;
using basarsoft_react_web_api.Entities;

namespace backend.Services
{
    public class PolygonService: IPolygonService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PolygonService> _logger;
        private static readonly GeometryFactory GeometryFactory4326 = new(new PrecisionModel(), 4326);

        public PolygonService(IUnitOfWork unitOfWork, ILogger<PolygonService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<PolygonDto> CreateAsync(PolygonModel model)
        {
            var ntsPolygon = ParseGeoJsonPolygon(model.Geometry!);

            var entity = new PolygonEntity
            {
                Ad = model.Properties?["ad"],
                tur = model.Properties?["tur"],
                numarataj = model.Properties?["numarataj"],
                aciklama = model.Properties?["aciklama"],
                Geometry = ntsPolygon
            };
            await _unitOfWork.Polygons.AddSync(entity);
            await _unitOfWork.Polygons.SaveChangesAsync();

            return EntitytoDto(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _unitOfWork.Polygons.GetByIdAsync(id);
            if (entity == null)
                return false;
            _unitOfWork.Polygons.Remove(entity);
            await _unitOfWork.Polygons.SaveChangesAsync();
            return true;
        }

        public async Task<JsonObject> GetPagedPolygonData()
        {
            var data = new { };




            return data;
        }

        public async Task<PolygonDto> UpdateAsync(PolygonModel model)
        {
            var entity = await _unitOfWork.Polygons.GetByIdAsync(model.Id);
            if (entity == null)
                throw new KeyNotFoundException("Polygon bulunamadı.");
            var ntsPolygon = ParseGeoJsonPolygon(model.Geometry!);
            entity.Ad = model.Properties?["ad"];
            entity.tur = model.Properties?["tur"];
            entity.numarataj = model.Properties?["numarataj"];
            entity.aciklama = model.Properties?["aciklama"];
            entity.Geometry = ntsPolygon;
            await _unitOfWork.Polygons.SaveChangesAsync();
            return EntitytoDto(entity);
        }

        public async Task<IEnumerable<PolygonDto>> GetAllAsync()
        {
            var list = await _unitOfWork.Polygons.GetAllAsync();
            return list.Select(EntitytoDto);
        }

        private PolygonDto EntitytoDto(PolygonEntity entity)
        {
            var props = new JsonObject
            {
                ["ad"] = entity.Ad ,
                ["tur"] = entity.tur,
                ["numarataj"] = entity.numarataj ,
                ["aciklama"] = entity.aciklama ,
            };

            return new PolygonDto
            {
                Id = entity.Id,
                Properties = props,
                Geometry = entity.Geometry != null ? ToGeoJson(entity.Geometry) : null!
            };
        }
   
        private static JsonArray CoordinatesToJsonArray(Coordinate[] coords)
        {
            var array = new JsonArray();
            foreach (var c in coords)
            {
                var pair = new JsonArray
                {
                    JsonValue.Create(c.X),
                    JsonValue.Create(c.Y)
                };
                array.Add(pair);
            }
            return array;
        }
        private static JsonObject ToGeoJson(Polygon polygon)
        {
            // Polygon -> GeoJSON (JsonObject)
            var obj = new JsonObject
            {
                ["type"] = "Polygon"
            };

            var rings = new JsonArray();
            rings.Add(CoordinatesToJsonArray(polygon.Shell.Coordinates));
            if (polygon.Holes is { Length: > 0 })
            {
                foreach (var hole in polygon.Holes)
                {
                    rings.Add(CoordinatesToJsonArray(hole.Coordinates));
                }
            }
            obj["coordinates"] = rings;
            return obj;
        }

        private static LinearRing ToLinearRing(JsonArray ringArray)
        {
            if (ringArray == null || ringArray.Count < 4)
                throw new InvalidOperationException("Halka en az 4 koordinat içermelidir.");

            var coords = new List<Coordinate>(ringArray.Count);
            foreach (var coordNode in ringArray)
            {
                if (coordNode is not JsonArray pos || pos.Count < 2)
                    throw new InvalidOperationException("Pozisyon [lon, lat] formatında olmalıdır.");

                var lon = pos[0]!.GetValue<double>();
                var lat = pos[1]!.GetValue<double>();
                // GeoJSON: [lon, lat]
                coords.Add(new Coordinate(lon, lat));
            }

            // Halka kapalı değilse ilk noktayı sona ekle
            if (!coords[0].Equals2D(coords[^1]))
            {
                coords.Add(coords[0]);
            }

            return GeometryFactory4326.CreateLinearRing(coords.ToArray());
        }

        private static Polygon? ParseGeoJsonPolygon(JsonObject geom)
        {
            if (geom == null) return null;

            var type = geom["type"]?.GetValue<string>();
            if (!string.Equals(type, "Polygon", StringComparison.OrdinalIgnoreCase))
                return null;

            var coordsNode = geom["coordinates"] as JsonArray;
            if (coordsNode == null || coordsNode.Count == 0)
                throw new InvalidOperationException("Koordinatlar eksik.");

            var shell = ToLinearRing((JsonArray)coordsNode[0]!);
            if (!shell.IsValid) throw new InvalidOperationException("Dış halka geçersiz.");

            var holes = new List<LinearRing>();
            for (int i = 1; i < coordsNode.Count; i++)
            {
                var holeRing = ToLinearRing((JsonArray)coordsNode[i]!);
                if (!holeRing.IsValid) throw new InvalidOperationException($"Delik halkası {i} geçersiz.");
                holes.Add(holeRing);
            }

            var polygon = GeometryFactory4326.CreatePolygon(shell, holes.ToArray());
            return polygon;
        }
    }

}
