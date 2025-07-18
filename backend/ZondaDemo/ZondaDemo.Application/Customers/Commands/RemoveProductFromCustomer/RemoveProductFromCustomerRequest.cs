using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Customers.Commands.RemoveProductFromCustomer;

public record RemoveProductFromCustomerRequest : IRequest<Response<Unit>>
{
    public int CustomerId { get; set; }
    public int ProductId { get; set; }
} 