namespace Product.Core.Entities.Base
{
    public class BaseEntity<TKey> where TKey : struct
    {
        public TKey Id { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string AuthorizeStatus { get; set; } = "U";
        public bool IsDeleted { get; set; } = false;
        public Guid? AuthorizedBy { get; set; }
        public DateTime? AuthorizedDate { get; set; }
        public Guid? LastModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
