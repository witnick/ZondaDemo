using ZondaDemo.Core.Exceptions;

namespace ZondaDemo.Core.Entities;

public class ProductDetail : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int Stock { get; private set; }
    public int? CustomerId { get; private set; }
    public Customer? Customer { get; private set; }

    private ProductDetail() { }

    public ProductDetail(string name, string description, decimal price, int stock, int? customerId)
    {
        Update(name, description, price, stock);
        CustomerId = customerId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, string description, decimal price, int stock)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainValidationException("Name cannot be empty");
        if (price < 0)
            throw new DomainValidationException("Price cannot be negative");
        if (stock < 0)
            throw new DomainValidationException("Stock cannot be negative");

        Name = name.Trim();
        Description = description?.Trim() ?? string.Empty;
        Price = price;
        Stock = stock;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AssignToCustomer(int customerId)
    {
        CustomerId = customerId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UnassignFromCustomer()
    {
        CustomerId = null;
        UpdatedAt = DateTime.UtcNow;
    }
} 