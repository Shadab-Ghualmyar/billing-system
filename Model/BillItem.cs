using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BillingSystem.Model;

public class BillItem
{
    public int Id { get; set; }

    public int BillId { get; set; }
    public int ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [JsonIgnore]
    public Bill Bill { get; set; } = null!;
    [JsonIgnore]
    public Product Product { get; set; } = null!;

    [NotMapped]
    public decimal LineTotal => UnitPrice * Quantity;
}
