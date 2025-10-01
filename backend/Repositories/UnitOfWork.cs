using backend.Data;
using backend.Interfaces;

namespace backend.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Polygons = new PolygonRepository(_context);
            Images = new ImagesRepository(_context);
        }

        public IPolygonRepository Polygons { get; private set; }
        public IImagesRepository Images { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }

}
