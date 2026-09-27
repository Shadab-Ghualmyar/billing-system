using BillingSystem.Model;
using BillingSystem.Model.DbConfiguration;
using BillingSystem.Model.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BillingSystem.IServices;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _db;

    public ProductService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<Product>> GetAll()
    {
        return await _db.Products
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Product?> GetById(int id)
    {
        return await _db.Products.FindAsync(id);
    }

    public async Task<Product> Create(ProductRequest request)
    {
        var product = new Product
        {
            Name = request.Name.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return product;
    }

    public async Task<bool> Update(int id, ProductRequest request)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return false;

        product.Name = request.Name.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return false;

        if (await _db.BillItems.AnyAsync(x => x.ProductId == id))
            throw new InvalidOperationException("This product is already used in a bill.");

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return true;
    }
}
