using MediatR;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Products.DeleteProduct;

public class DeleteProductHandler : IRequestHandler<DeleteProductRequest, Response<Unit>>
{
    private readonly IProductDetailRepository _productRepository;

    public DeleteProductHandler(IProductDetailRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Response<Unit>> Handle(DeleteProductRequest request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id);
        
        if (product == null)
        {
            throw new NotFoundException($"Product with ID {request.Id} was not found");
        }

        await _productRepository.DeleteAsync(product);
        
        return Response<Unit>.Succeed(
            Unit.Value,
            "Product deleted successfully"
        );
    }
} 