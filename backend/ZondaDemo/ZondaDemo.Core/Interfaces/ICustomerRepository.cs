using ZondaDemo.Core.Entities;

namespace ZondaDemo.Core.Interfaces;

public interface ICustomerRepository : IRepository<Customer>
{
    Task<Customer?> GetCustomerWithProductsAsync(int id);
    Task AddProductToCustomerAsync(int customerId, int productId);
    Task RemoveProductFromCustomerAsync(int customerId, int productId);
    Task UnassignProductFromCustomerAsync(int customerId, int productId);
    Task<Customer?> GetByIdWithDetailAsync(int id);
} 