namespace backend.Interfaces
{
    public interface IUnitOfWork
    {
        IPolygonRepository Polygons { get; }
        Task<int> CompleteAsync();
    }
}
