using BillingSystem.IServices;
using BillingSystem.Model.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BillingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillController : ControllerBase
{
    private readonly IBillService _service;

    public BillController(IBillService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAll());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var bill = await _service.GetById(id);
        return bill == null ? NotFound() : Ok(bill);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBillRequest request)
    {
        try
        {
            return Ok(await _service.Create(request));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await _service.Delete(id) ? NoContent() : NotFound();
    }
}
