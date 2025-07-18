using ZondaDemo.Core.Exceptions;

namespace ZondaDemo.Core.Entities;

public class Customer : BaseEntity
{
    // Properties with private setters for EF Core
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public CustomerDetail? Detail { get; private set; }
    public List<ProductDetail> Products { get; private set; } = new();

    // Required by EF Core
    private Customer() { }

    // Constructor for creating new customer
    public Customer(string name, string email, string phone)
    {
        Name = name.Trim();
        Email = email.Trim().ToLower();
        Phone = phone.Trim();
        CreatedAt = DateTime.UtcNow;
    }

    // Single update method
    public void Update(string name, string email, string phone)
    {
        Name = name.Trim();
        Email = email.Trim().ToLower();
        Phone = phone.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDetail(CustomerDetail detail)
    {
        Detail = detail;
        UpdatedAt = DateTime.UtcNow;
    }
} 