using BillingSystem.Model.DTOs;

namespace BillingSystem.IServices;

public interface IBillService
{
    Task<List<BillResponse>> GetAll();
    Task<BillResponse?> GetById(int id);
    Task<BillResponse> Create(CreateBillRequest request);
    Task<bool> Delete(int id);
}
