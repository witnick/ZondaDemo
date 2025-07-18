using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Products.GetProductList;

// Empty request since we're getting all products
public record GetProductListRequest : IRequest<Response<List<ProductDetailDto>>>; 