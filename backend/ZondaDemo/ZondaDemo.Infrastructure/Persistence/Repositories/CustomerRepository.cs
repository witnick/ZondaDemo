using Microsoft.EntityFrameworkCore;
using ZondaDemo.Core.Entities;
using ZondaDemo.Core.Interfaces;
using ZondaDemo.Infrastructure.Data;

namespace ZondaDemo.Infrastructure.Persistence.Repositories;

public class CustomerRepository : BaseRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Customer?> GetCustomerWithProductsAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Products)
            .Include(c => c.Detail)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddProductToCustomerAsync(int customerId, int productId)
    {
        var customer = await GetByIdAsync(customerId);
        var product = await _context.Products.FindAsync(productId);

        if (customer != null && product != null)
        {
            // This is a simplified approach. In a real application, you might
            // want to handle the case where the product is already associated
            // with the customer.
            customer.Products.Add(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveProductFromCustomerAsync(int customerId, int productId)
    {
        var customer = await GetByIdAsync(customerId);
        var product = await _context.Products.FindAsync(productId);

        if (customer != null && product != null)
        {
            customer.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Customer?> GetByIdWithDetailAsync(int id)
    {
        return await _context.Customers
            .Include(c => c.Detail)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
} 