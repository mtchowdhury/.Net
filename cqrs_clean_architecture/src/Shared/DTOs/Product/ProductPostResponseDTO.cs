namespace Product.Shared.DTOs.Product;
public record ProductPostResponseDTO 
{
    public Guid Id  { get; set; }
    public Guid ProductTypeId { get; set; }
    public string Name { get; set; } = null;
    public string ShortName { get; set; } = null;
    public string Code { get; set; }
    public Guid CategoryId { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime EffectiveTo { get; set; }
    public int SortOrder { get; set; }
    public bool Status { get; set; }
}
