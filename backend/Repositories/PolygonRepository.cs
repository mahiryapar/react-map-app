using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Interfaces;
using backend.Data;


namespace backend.Repositories
{
    public class PolygonRepository : IPolygonRepository
    {
        private readonly AppDbContext _context;
        public PolygonRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddSync(PolygonEntity entity)
        {
            await _context.Polygons.AddAsync(entity);
        }

        public async Task<IEnumerable<PolygonEntity>> GetAllAsync()
        {
            return await _context.Polygons.ToListAsync();
        }

        public void Remove(PolygonEntity entity)
        {
            _context.Polygons.Remove(entity);
        }

        public async Task<PolygonEntity?> GetByIdAsync(int id)
        {
            return await _context.Polygons.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Update(PolygonEntity entity)
        {
            _context.Polygons.Update(entity);
        }
    }
}
