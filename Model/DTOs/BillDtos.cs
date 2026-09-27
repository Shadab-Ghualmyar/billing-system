using System.ComponentModel.DataAnnotations;

namespace BillingSystem.Model.DTOs;

public class ProductRequest
{
    [Required, StringLength(150)]
    public string Name { get; set; } = "";

    [Range(0.01, 999999999)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
}

public class BillItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}

public class CreateBillRequest
{
    [Required, StringLength(150)]
    public string CustomerName { get; set; } = "";

    [Required, MinLength(1)]
    public List<BillItemRequest> Items { get; set; } = new();
}

public class BillResponse
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public List<BillItemResponse> Items { get; set; } = new();
}



public class BillItemResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}
