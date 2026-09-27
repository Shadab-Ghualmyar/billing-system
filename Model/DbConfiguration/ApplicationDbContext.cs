using Microsoft.EntityFrameworkCore;

namespace BillingSystem.Model.DbConfiguration;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    //public DbSet<Product> Products => Set<Product>();
    //public DbSet<Bill> Bills => Set<Bill>();
    //public DbSet<BillItem> BillItems => Set<BillItem>();

    public DbSet<Product> Products { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<BillItem> BillItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
        modelBuilder.Entity<BillItem>().Property(i => i.UnitPrice).HasPrecision(18, 2);

        modelBuilder.Entity<Bill>()
            .HasMany(b => b.Items)
            .WithOne(i => i.Bill)
            .HasForeignKey(i => i.BillId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Product>()
            .HasMany(p => p.BillItems)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<Product>().HasData(new List<Product>() {
            new Product {  Id = 1, Name = "Laptop", Price = 850, StockQuantity = 20 },
            new Product {  Id = 2, Name = "Hard Disk", Price = 75, StockQuantity = 50 },
            new Product { Id = 3, Name = "Keyboard", Price = 25, StockQuantity = 100 },
            new Product { Id = 4, Name = "Mouse", Price = 15, StockQuantity = 100 }
        });



    }
}
