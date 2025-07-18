using Microsoft.EntityFrameworkCore;
using ZondaDemo.Core.Entities;
using ZondaDemo.Core.Interfaces;
using ZondaDemo.Infrastructure.Data;
using System.Linq;

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
        var product = await _context.Products.FindAsync(productId);
        if (product != null)
        {
            product.AssignToCustomer(customerId);
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveProductFromCustomerAsync(int customerId, int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product != null && product.CustomerId == customerId)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UnassignProductFromCustomerAsync(int customerId, int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product != null && product.CustomerId == customerId)
        {
            product.UnassignFromCustomer();
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