using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Products.GetProductById;

public class GetProductByIdHandler : IRequestHandler<GetProductByIdRequest, Response<ProductDetailDto>>
{
    private readonly IProductDetailRepository _productRepository;
    private readonly IMapper _mapper;

    public GetProductByIdHandler(IProductDetailRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<Response<ProductDetailDto>> Handle(GetProductByIdRequest request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id);
        
        if (product == null)
        {
            throw new NotFoundException($"Product with ID {request.Id} was not found");
        }

        var productDto = _mapper.Map<ProductDetailDto>(product);
        
        return Response<ProductDetailDto>.Succeed(
            productDto,
            "Product retrieved successfully"
        );
    }
} 