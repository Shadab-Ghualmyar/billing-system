using BillingSystem.IServices;
using BillingSystem.Model.DbConfiguration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("React", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Connection")));

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBillService, BillService>();

var app = builder.Build();

//}

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("React");
app.MapControllers();

app.Run();



