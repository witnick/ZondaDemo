using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Customers.Commands.AddProductToCustomer;

public record AddProductToCustomerRequest : IRequest<Response<Unit>>
{
    public int CustomerId { get; set; }
    public int ProductId { get; set; }
} 