using BillingSystem.Model;
using BillingSystem.Model.DTOs;

namespace BillingSystem.IServices;

public interface IProductService
{
    Task<List<Product>> GetAll();
    Task<Product?> GetById(int id);
    Task<Product> Create(ProductRequest request);
    Task<bool> Update(int id, ProductRequest request);
    Task<bool> Delete(int id);
}
