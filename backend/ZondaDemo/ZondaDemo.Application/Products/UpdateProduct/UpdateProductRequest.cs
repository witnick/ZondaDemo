using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Products.UpdateProduct;

public record UpdateProductRequest : IRequest<Response<ProductDetailDto>>
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
} 