
using Product.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Product.Core.Entities;

[Table("Product", Schema = "product")]
public class Product : BaseEntity<Guid>
{
    [Required]
    public Guid ProductTypeId { get; set; }
    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = null;
    [Required]
    [MaxLength(6)]
    public string ShortName { get; set; } = null;
    [Required]
    public string Code { get; set; } 
    [Required]
    public Guid CategoryId { get; set; }
    [Required]
    [Column(TypeName = "Date")]
    public DateTime EffectiveFrom { get; set; } 
    [Required]
    [Column(TypeName = "Date")]
    public DateTime EffectiveTo { get; set; } 
    [Required]
    [MaxLength(2)]
    public int SortOrder { get; set; }
    [Required]
    public bool Status  { get; set; }
  

}
