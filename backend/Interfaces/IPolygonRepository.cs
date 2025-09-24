using basarsoft_react_web_api.Entities;


namespace backend.Interfaces
{
    public interface IPolygonRepository
    {
        Task<PolygonEntity?> GetByIdAsync(int id);
        Task<IEnumerable<PolygonEntity>> GetAllAsync();
        Task AddSync(PolygonEntity entity);
        void Remove(PolygonEntity entity);
        void Update(PolygonEntity entity);
        Task SaveChangesAsync();
    }
}
