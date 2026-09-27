using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BillingSystem.Model;

public class Bill
{
    public int Id { get; set; }

    [Required, StringLength(150)]
    public string CustomerName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<BillItem> Items { get; set; } = new List<BillItem>();
}
