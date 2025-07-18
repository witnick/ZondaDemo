namespace ZondaDemo.Application.Common.Models;

public record CustomerDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public CustomerDetailDto? Detail { get; init; }
    public List<ProductDetailDto> Products { get; init; } = new();
}

public record CustomerDetailDto
{
    public int Id { get; init; }
    public string Address { get; init; } = string.Empty;
    public string Notes { get; init; } = string.Empty;
    public int CustomerId { get; init; }
}

public record ProductDetailDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int CustomerId { get; init; }
} 