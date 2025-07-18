using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Products.GetProductList;

public class GetProductListHandler : IRequestHandler<GetProductListRequest, Response<List<ProductDetailDto>>>
{
    private readonly IProductDetailRepository _productRepository;
    private readonly IMapper _mapper;

    public GetProductListHandler(IProductDetailRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<Response<List<ProductDetailDto>>> Handle(GetProductListRequest request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync();
        var productDtos = _mapper.Map<List<ProductDetailDto>>(products);

        return Response<List<ProductDetailDto>>.Succeed(
            productDtos,
            "Products retrieved successfully"
        );
    }
} 