using backend.Data;
using backend.Interfaces;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;


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

        public async Task<IEnumerable<PolygonEntity>> GetPagedAsync(int pageNumber, int pageSize, string Search)
        {
            var query = _context.Polygons.AsQueryable();

            if (!string.IsNullOrWhiteSpace(Search))
            {
                Search = Search.Trim();

                query = query.Where(p =>
                    (!string.IsNullOrEmpty(p.Ad) && EF.Functions.Like(p.Ad, $"%{Search}%")) || 
                    (!string.IsNullOrEmpty(p.tur) && EF.Functions.Like(p.tur, $"%{Search}%")) ||
                    (!string.IsNullOrEmpty(p.numarataj) && EF.Functions.Like(p.numarataj, $"%{Search}%")) ||
                    (!string.IsNullOrEmpty(p.aciklama) && EF.Functions.Like(p.aciklama, $"%{Search}%")) ||
                    p.Id.ToString().Contains(Search) ||
                    p.daire_sayisi.ToString().Contains(Search)
                );
            }

            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetCountAsync(String Search)
        {
            var query = _context.Polygons.AsQueryable();
            if (!string.IsNullOrWhiteSpace(Search))
            {
                Search = Search.Trim();

                query = query.Where(p =>
                    (!string.IsNullOrEmpty(p.Ad) && EF.Functions.Like(p.Ad, $"%{Search}%")) ||
                    (!string.IsNullOrEmpty(p.tur) && EF.Functions.Like(p.tur, $"%{Search}%")) ||
                    (!string.IsNullOrEmpty(p.numarataj) && EF.Functions.Like(p.numarataj, $"%{Search}%")) ||
                    (!string.IsNullOrEmpty(p.aciklama) && EF.Functions.Like(p.aciklama, $"%{Search}%")) ||
                    p.Id.ToString().Contains(Search)
                );
                return await query.CountAsync();
            }
            return await _context.Polygons.CountAsync();
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
