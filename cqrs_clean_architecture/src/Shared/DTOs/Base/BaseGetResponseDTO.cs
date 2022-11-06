namespace Product.Shared.DTOs.Base;
public record BaseGetResponseDTO<TKey> where TKey : struct
{
    public TKey Id { get; set; }
}
