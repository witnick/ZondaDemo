using ZondaDemo.Core.Entities;

namespace ZondaDemo.Core.Interfaces;
 
public interface IProductDetailRepository : IRepository<ProductDetail>
{
    Task<List<ProductDetail>> GetByCustomerIdAsync(int customerId);
} 