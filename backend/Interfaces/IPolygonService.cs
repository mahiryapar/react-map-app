using backend.Models;
using basarsoft_react_web_api.Entities;
using basarsoft_react_web_api.Models;
using System.Text.Json.Nodes;

namespace backend.Interfaces
{
    public interface IPolygonService
    {
        Task<PolygonDto> CreateAsync(PolygonModel model);
        Task<PolygonDto> UpdateAsync(PolygonModel model);
        Task<IEnumerable<PolygonDto>> GetAllAsync();
        Task<int> GetCount();
        Task<IEnumerable<PagedDTO>> GetPagedPolygonData(int pageNumber,int pageSize);
        Task<bool> DeleteAsync(int id);
    }
}
