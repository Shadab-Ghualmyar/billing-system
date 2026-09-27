using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BillingSystem.Model;

public class Product
{
    public int Id { get; set; }

    [Required, StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, 999999999)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [JsonIgnore]
    public ICollection<BillItem> BillItems { get; set; } = new List<BillItem>();
}
