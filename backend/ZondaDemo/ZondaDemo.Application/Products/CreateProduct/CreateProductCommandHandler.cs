using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Entities;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Products.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Response<ProductDetailDto>>
{
    private readonly IProductDetailRepository _productRepository;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(IProductDetailRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<Response<ProductDetailDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new ProductDetail(
            name: request.Name,
            description: request.Description,
            price: request.Price,
            stock: request.Stock,
            customerId: null // Products are not assigned to customers by default
        );

        await _productRepository.AddAsync(product);

        var productDto = _mapper.Map<ProductDetailDto>(product);

        return Response<ProductDetailDto>.Succeed(
            productDto,
            "Product created successfully"
        );
    }
} 