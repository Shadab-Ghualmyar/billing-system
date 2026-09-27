using BillingSystem.Model;
using BillingSystem.Model.DbConfiguration;
using BillingSystem.Model.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BillingSystem.IServices;

public class BillService : IBillService
{
    private readonly ApplicationDbContext _db;

    public BillService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<BillResponse>> GetAll()
    {
        var bills = await _db.Bills
            .Include(b => b.Items)
            .ThenInclude(i => i.Product)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return bills.Select(ToResponse).ToList();
    }

    public async Task<BillResponse?> GetById(int id)
    {
        var bill = await _db.Bills
            .Include(b => b.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(b => b.Id == id);

        return bill == null ? null : ToResponse(bill);
    }

    public async Task<BillResponse> Create(CreateBillRequest request)
    {
        if (request.Items.GroupBy(x => x.ProductId).Any(g => g.Count() > 1))
            throw new InvalidOperationException("The same product cannot be added twice.");

        var productIds = request.Items.Select(x => x.ProductId).ToList();
        var products = await _db.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        var bill = new Bill
        {
            CustomerName = request.CustomerName.Trim()
        };

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
                throw new KeyNotFoundException($"Product {item.ProductId} was not found.");

            if (item.Quantity > product.StockQuantity)
                throw new InvalidOperationException(
                    $"Not enough stock for {product.Name}. Available: {product.StockQuantity}.");

            product.StockQuantity -= item.Quantity;

            bill.Items.Add(new BillItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });
        }

        _db.Bills.Add(bill);
        await _db.SaveChangesAsync();

        return ToResponse(bill);
    }

    public async Task<bool> Delete(int id)
    {
        var bill = await _db.Bills
            .Include(b => b.Items)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (bill == null) return false;

        foreach (var item in bill.Items)
        {
            var product = await _db.Products.FindAsync(item.ProductId);
            if (product != null)
                product.StockQuantity += item.Quantity;
        }

        _db.Bills.Remove(bill);
        await _db.SaveChangesAsync();
        return true;
    }

    private static BillResponse ToResponse(Bill bill)
    {
        var items = bill.Items.Select(item => new BillItemResponse
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product.Name,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Total = item.UnitPrice * item.Quantity
        }).ToList();

        return new BillResponse
        {
            Id = bill.Id,
            CustomerName = bill.CustomerName,
            CreatedAt = bill.CreatedAt,
            TotalAmount = items.Sum(x => x.Total),
            Items = items
        };
    }
}
