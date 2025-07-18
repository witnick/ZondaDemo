using ZondaDemo.Core.Exceptions;

namespace ZondaDemo.Core.Entities;

public class ProductDetail : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int CustomerId { get; private set; }
    public Customer Customer { get; private set; } = null!;

    private ProductDetail() { }

    public ProductDetail(string name, decimal price, int customerId)
    {
        Update(name, price);
        CustomerId = customerId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, decimal price)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainValidationException("Name cannot be empty");
        if (price < 0)
            throw new DomainValidationException("Price cannot be negative");

        Name = name.Trim();
        Price = price;
        UpdatedAt = DateTime.UtcNow;
    }
} 