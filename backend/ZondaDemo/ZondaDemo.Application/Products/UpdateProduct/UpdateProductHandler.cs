using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Entities;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Products.UpdateProduct;

public class UpdateProductHandler : IRequestHandler<UpdateProductRequest, Response<ProductDetailDto>>
{
    private readonly IProductDetailRepository _productRepository;
    private readonly IMapper _mapper;

    public UpdateProductHandler(IProductDetailRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<Response<ProductDetailDto>> Handle(UpdateProductRequest request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id);
        
        if (product == null)
        {
            throw new NotFoundException($"Product with ID {request.Id} was not found");
        }

        try
        {
            // Update product using domain entity methods which include validation
            product.Update(request.Name, request.Price);

            await _productRepository.UpdateAsync(product);

            var productDto = _mapper.Map<ProductDetailDto>(product);
            
            return Response<ProductDetailDto>.Succeed(
                productDto,
                "Product updated successfully"
            );
        }
        catch (Core.Exceptions.DomainValidationException ex)
        {
            // Convert domain validation exception to application validation exception
            var errors = new Dictionary<string, string[]>
            {
                { "DomainValidation", new[] { ex.Message } }
            };
            throw new ValidationException(errors);
        }
    }
} 