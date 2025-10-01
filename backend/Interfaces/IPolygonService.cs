using backend.Models;
using backend.Entities;
using System.Text.Json.Nodes;

namespace backend.Interfaces
{
    public interface IPolygonService
    {
        Task<PolygonDto> CreateAsync(PolygonModel model);
        Task<PolygonDto> UpdateAsync(PolygonModel model);
        Task<IEnumerable<PolygonDto>> GetAllAsync();
        Task<int> GetCount(String Search);
        Task<IEnumerable<PagedDTO>> GetPagedPolygonData(int pageNumber,int pageSize,String search);
        Task<bool> DeleteAsync(int id);
    }
}
