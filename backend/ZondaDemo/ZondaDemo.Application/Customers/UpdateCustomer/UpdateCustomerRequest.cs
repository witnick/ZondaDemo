using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Application.Customers.GetCustomerById;

namespace ZondaDemo.Application.Customers.UpdateCustomer;

public record UpdateCustomerRequest : IRequest<Response<CustomerDto>>
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
} 