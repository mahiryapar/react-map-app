namespace backend.Interfaces
{
    public interface IUnitOfWork
    {
        IPolygonRepository Polygons { get; }
        IImagesRepository Images { get; }
        Task<int> CompleteAsync();
    }
}
