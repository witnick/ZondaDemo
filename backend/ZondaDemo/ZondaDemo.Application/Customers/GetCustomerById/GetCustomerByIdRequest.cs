using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Customers.GetCustomerById;

public record GetCustomerByIdRequest(int Id) : IRequest<Response<CustomerDto>>; 