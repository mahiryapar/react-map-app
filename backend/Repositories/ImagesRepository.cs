using backend.Interfaces;
using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;


namespace backend.Repositories
{
    public class ImagesRepository : IImagesRepository
    {
        private readonly AppDbContext _context;
        public ImagesRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddSync(ImagesEntity entity)
        {
            await _context.Images.AddAsync(entity);
        }

        public void Remove(ImagesEntity entity)
        {
            _context.Images.Remove(entity);
        }

        public async Task<IEnumerable<ImagesEntity>> GetByPolygonId(int polygonId)
        {
            return await _context.Images.Where(i => i.PolygonEntityId == polygonId).ToListAsync();
        }

        public async Task<ImagesEntity?> GetById(int id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
