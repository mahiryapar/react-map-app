using backend.Entities;


namespace backend.Interfaces
{
    public interface IImagesRepository
    {
        Task AddSync(ImagesEntity entity);
        void Remove(ImagesEntity entity);
        Task<IEnumerable<ImagesEntity>> GetByPolygonId(int polygonId);
        Task<ImagesEntity?> GetById(int id);
        Task SaveChangesAsync();
    }
}
