using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Products.GetProductById;

public record GetProductByIdRequest(int Id) : IRequest<Response<ProductDetailDto>>; 