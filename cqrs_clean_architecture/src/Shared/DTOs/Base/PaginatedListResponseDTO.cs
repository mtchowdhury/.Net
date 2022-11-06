namespace Product.Shared.DTOs.Base;
public class PaginatedListResponseDTO<TEntity> where TEntity : class
{
    public int CurrentPage { get; private set; }
    public int TotalPages { get; private set; }
    public int PageSize { get; private set; }
    public long Count { get; private set; }

    public bool HasPrevious => CurrentPage > 1 && TotalPages > 1;
    public bool HasNext => CurrentPage < TotalPages;

    public IEnumerable<TEntity>? Items { get; set; }

    public PaginatedListResponseDTO(List<TEntity> items, long count, int pageNumber, int pageSize)
    {
        Count = count;
        //if pageSize default value 1 is found that means return all the data
        PageSize = pageSize == 1 ? (int)count : pageSize;

        //if count = 0 means no data found,then totalPages = 0 , otherwise apply pagination rule

        if (count > 0)
        {
            TotalPages = (int)Math.Ceiling(count / (double)PageSize);
            CurrentPage = pageNumber;
        }
        else
        {
            TotalPages = 0;
            CurrentPage = 0;
        }

        Items = items;
    }
}
