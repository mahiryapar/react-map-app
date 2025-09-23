using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("polygons")]
    public class PolygonsController : ControllerBase
    {
        private readonly IPolygonService _polygonService;

        public PolygonsController(IPolygonService polygonservice) 
        {
            _polygonService = polygonservice;
        }

        [HttpPost]
        public async Task<IActionResult> SavePolygon([FromBody] PolygonModel polygon) 
        {
            try
            {
                if (polygon == null || polygon.Geometry == null)
                    return BadRequest("Geçersiz istek gövdesi.");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var dto = await _polygonService.CreateAsync(polygon);
                return Ok(new { message = "Polygon Başarıyla Kaydedildi!", entity = dto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Polygon kaydedilirken bir hata oluştu.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePolygon(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest("Geçersiz ID.");
                var result = await _polygonService.DeleteAsync(id);
                if (!result)
                    return NotFound("Polygon bulunamadı veya silinemedi.");
                return Ok(new { message = "Polygon Başarıyla Silindi!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Polygon silinirken bir hata oluştu.", error = ex.Message });
            }
            
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePolygons([FromBody] PolygonModel polygon)
        {
            try
            {
                if (polygon == null || polygon.Geometry == null)
                    return BadRequest("Geçersiz istek gövdesi.");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var dto = await _polygonService.UpdateAsync(polygon);
                return Ok(new { message = "Polygon Başarıyla Güncellendi!", entity = dto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Polygon güncellenirken bir hata oluştu.", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPolygons()
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var list = await _polygonService.GetAllAsync();
                return Ok(list);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = "Polygonlar çekilirken bir hata oluştu", error = ex.Message });
            }
        }
    }
}