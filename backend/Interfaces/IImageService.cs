namespace backend.Interfaces
{
    public interface IImageService
    {
        Task<bool> UploadImageAsync(IFormFile file, int polygonId);
        Task<int> GetImageCount(int polygonId);
    }
}
