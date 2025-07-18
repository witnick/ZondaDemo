using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Application.Customers.GetCustomerById;

namespace ZondaDemo.Application.Customers.GetCustomerList;

// Empty request since we're getting all customers
public record GetCustomerListRequest : IRequest<Response<List<CustomerDto>>>; 