using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Products.DeleteProduct;

public record DeleteProductRequest : IRequest<Response<Unit>>
{
    public int Id { get; }

    public DeleteProductRequest(int id)
    {
        Id = id;
    }
} 