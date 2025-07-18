using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Products.CreateProduct;

public record CreateProductCommand : IRequest<Response<ProductDetailDto>>
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Stock { get; init; }
} 