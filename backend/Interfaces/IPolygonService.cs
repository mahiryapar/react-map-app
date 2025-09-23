using backend.Models;

namespace backend.Interfaces
{
    public interface IPolygonService
    {
        Task<PolygonDto> CreateAsync(PolygonModel model);
        Task<PolygonDto> UpdateAsync(PolygonModel model);
        Task<IEnumerable<PolygonDto>> GetAllAsync();

        Task<bool> DeleteAsync(int id);
    }
}
