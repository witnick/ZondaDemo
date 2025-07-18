using Microsoft.EntityFrameworkCore;
using ZondaDemo.Core.Entities;
using ZondaDemo.Core.Interfaces;
using ZondaDemo.Infrastructure.Data;

namespace ZondaDemo.Infrastructure.Persistence.Repositories;

public class ProductDetailRepository : BaseRepository<ProductDetail>, IProductDetailRepository
{
    public ProductDetailRepository(AppDbContext context) : base(context)
    {
    }

    public override async Task<ProductDetail?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<ProductDetail>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(p => p.Customer)
            .Where(p => p.CustomerId == customerId)
            .ToListAsync();
    }
} 