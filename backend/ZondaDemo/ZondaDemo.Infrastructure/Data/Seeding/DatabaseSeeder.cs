using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ZondaDemo.Infrastructure.Data;

namespace ZondaDemo.Infrastructure.Data.Seeding;

public interface IDatabaseSeeder
{
    Task SeedAsync(int customerCount = 100);
    Task ClearAsync();
}

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;
    private readonly CustomerFaker _customerFaker;
    
    public DatabaseSeeder(
        AppDbContext context,
        ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _logger = logger;
        _customerFaker = new CustomerFaker();
    }

    public async Task SeedAsync(int customerCount = 100)
    {
        try
        {
            if (await _context.Customers.AnyAsync())
            {
                _logger.LogInformation("Database already contains data, skipping seeding");
                return;
            }

            _logger.LogInformation($"Starting database seeding with {customerCount} customers...");

            // Generate customers in batches of 50
            for (int i = 0; i < customerCount; i += 50)
            {
                var batchSize = Math.Min(50, customerCount - i);
                var customers = _customerFaker.Generate(batchSize);
                
                await _context.Customers.AddRangeAsync(customers);
                await _context.SaveChangesAsync();

                // Generate customer details
                foreach (var customer in customers)
                {
                    var detailFaker = new CustomerDetailFaker(customer.Id);
                    var detail = detailFaker.Generate();
                    customer.SetDetail(detail);
                    await _context.CustomerDetails.AddAsync(detail);
                }
                await _context.SaveChangesAsync();

                // Generate 1-5 products for each customer
                foreach (var customer in customers)
                {
                    var productFaker = new ProductDetailFaker(customer.Id);
                    var products = productFaker.Generate(Random.Shared.Next(1, 6));
                    await _context.Products.AddRangeAsync(products);
                }
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Seeded {i + batchSize} customers with details and products");
            }

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while seeding the database");
            throw;
        }
    }

    public async Task ClearAsync()
    {
        // For in-memory database, we'll remove entities directly
        var products = await _context.Products.ToListAsync();
        _context.Products.RemoveRange(products);

        var details = await _context.CustomerDetails.ToListAsync();
        _context.CustomerDetails.RemoveRange(details);

        var customers = await _context.Customers.ToListAsync();
        _context.Customers.RemoveRange(customers);

        await _context.SaveChangesAsync();
        _logger.LogInformation("Database cleared successfully");
    }
} 