using Microsoft.AspNetCore.Mvc;
using backend.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("upload")]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _ImageService;
        public ImageController(IImageService ImageService)
        {
            _ImageService = ImageService;
        }

        // Explicitly state we accept multipart/form-data and bind from the form
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> uploadImage([FromForm] IFormFile file, [FromForm] int polygonId)
        {
            try
            {
                var result = await _ImageService.UploadImageAsync(file, polygonId);
                if (result)
                {
                    return Ok(new { Message = "Resim başarıyla yüklendi" });
                }
                return BadRequest(new { Message = "Resim yüklenirken bir hata oluştu" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Sunucu hatası", Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult deleteImage(string id)
        {
            try
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), id);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                    return Ok(new { Message = "Resim başarıyla silindi" });
                }
                return NotFound(new { Message = "Resim bulunamadı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Sunucu hatası", Error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public IActionResult getImage(string id)
        {
            try
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), id);
                if (System.IO.File.Exists(imagePath))
                {
                    var imageBytes = System.IO.File.ReadAllBytes(imagePath);
                    var contentType = "image/" + Path.GetExtension(imagePath).TrimStart('.');
                    return File(imageBytes, contentType);
                }
                return NotFound(new { Message = "Resim bulunamadı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Sunucu hatası", Error = ex.Message });
            }
        }
        [HttpGet]

        public IActionResult getImageCount([FromQuery]int polygonIdCount)
        {
            try
            {
                var result = _ImageService.GetImageCount(polygonIdCount);
                return Ok(new { Count = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Sunucu hatası", Error = ex.Message });
            }
        }

        [HttpGet("PolygonId")]
        public IActionResult getImageByPolygonId(int polygonId)
        {
            try
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{polygonId}.png");
                if (System.IO.File.Exists(imagePath))
                {
                    var imageBytes = System.IO.File.ReadAllBytes(imagePath);
                    var contentType = "image/png";
                    return File(imageBytes, contentType);
                }
                return NotFound(new { Message = "Resim bulunamadı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Sunucu hatası", Error = ex.Message });
            }
        }
    }
}
