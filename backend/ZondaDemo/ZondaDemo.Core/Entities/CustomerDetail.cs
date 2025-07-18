using ZondaDemo.Core.Exceptions;

namespace ZondaDemo.Core.Entities;

public class CustomerDetail : BaseEntity
{
    public string Address { get; private set; } = string.Empty;
    public string Notes { get; private set; } = string.Empty;
    public int CustomerId { get; private set; }
    public Customer Customer { get; private set; } = null!;

    private CustomerDetail() { }

    public CustomerDetail(string address, string notes, int customerId)
    {
        Update(address, notes);
        CustomerId = customerId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string address, string notes)
    {
        if (string.IsNullOrWhiteSpace(address))
            throw new DomainValidationException("Address cannot be empty");

        Address = address.Trim();
        Notes = notes?.Trim() ?? string.Empty;
        UpdatedAt = DateTime.UtcNow;
    }
} 