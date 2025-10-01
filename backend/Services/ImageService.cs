using backend.Entities;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public class ImageService : IImageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly string _imagesRootPath;

        public ImageService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _imagesRootPath = configuration["ImagesPath"];
        }

        public async Task<bool> UploadImageAsync(IFormFile file, int polygonId)
        {
            if (file == null || file.Length == 0)
                return false;

            var now = DateTime.Now;
            var structuredFolder = Path.Combine(
                _imagesRootPath,
                now.Year.ToString("D4"),
                now.Month.ToString("D2"),
                now.Day.ToString("D2"),
                now.Hour.ToString("D2")
            );

            Directory.CreateDirectory(structuredFolder);

            var fileName = Guid.NewGuid().ToString("N") + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(structuredFolder, fileName);

            var imageEntity = new ImagesEntity
            {
                PolygonEntityId = polygonId,
                ImagePath = fullPath,
                GUID = fileName
            };

            await _unitOfWork.Images.AddSync(imageEntity);

            using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await file.CopyToAsync(stream);
            }

            await _unitOfWork.Images.SaveChangesAsync();

            return true;
        }

        public async Task<int> GetImageCount(int polygonId)
        {
            var images = await _unitOfWork.Images.GetByPolygonId(polygonId);
            return images.Count();
        }

        public async Task<bool> DeleteImageAsync(int id)
        {
            var image = await _unitOfWork.Images.GetById(id);
            if (image != null)
            {
                _unitOfWork.Images.Remove(image);
                await _unitOfWork.Images.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public IActionResult getImageAsync(int id)
        {
            var image = _unitOfWork.Images.GetById(id).Result;
            if (image != null)
            {
                var imagePath = image.ImagePath;
                if (System.IO.File.Exists(imagePath))
                {
                    var imageBytes = System.IO.File.ReadAllBytes(imagePath);
                    var contentType = "image/" + Path.GetExtension(imagePath).TrimStart('.');
                    return new FileContentResult(imageBytes, contentType);
                }
                return new NotFoundObjectResult(new { Message = "Resim bulunamadı" });
            }
            return new NotFoundObjectResult(new { Message = "Resim bulunamadı" });
        }
    }
}
