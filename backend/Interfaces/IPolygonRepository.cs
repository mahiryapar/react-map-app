using System.Collections.Generic;
using System.Threading.Tasks;
using basarsoft_react_web_api.Entities;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPolygonRepository
    {
        Task<PolygonEntity?> GetByIdAsync(int id);
        Task<IEnumerable<PolygonEntity>> GetAllAsync();
        Task<IEnumerable<PolygonEntity>> GetPagedAsync(int pageNumber, int pageSize);
        Task<int> GetCountAsync();
        Task AddSync(PolygonEntity entity);
        void Remove(PolygonEntity entity);
        void Update(PolygonEntity entity);
        Task SaveChangesAsync();
    }
}
