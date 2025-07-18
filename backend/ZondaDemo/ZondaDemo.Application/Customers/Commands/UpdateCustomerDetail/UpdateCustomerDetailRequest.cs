using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Customers.Commands.UpdateCustomerDetail;

public record UpdateCustomerDetailRequest : IRequest<Response<CustomerDetailDto>>
{
    public int CustomerId { get; set; }
    public string Address { get; init; } = string.Empty;
    public string Notes { get; init; } = string.Empty;
} 