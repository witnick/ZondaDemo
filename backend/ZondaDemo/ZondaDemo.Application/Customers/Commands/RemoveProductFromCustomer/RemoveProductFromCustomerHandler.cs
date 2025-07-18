using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Customers.Commands.RemoveProductFromCustomer;

public class RemoveProductFromCustomerHandler : IRequestHandler<RemoveProductFromCustomerRequest, Response<Unit>>
{
    private readonly ICustomerRepository _customerRepository;

    public RemoveProductFromCustomerHandler(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<Response<Unit>> Handle(RemoveProductFromCustomerRequest request, CancellationToken cancellationToken)
    {
        await _customerRepository.RemoveProductFromCustomerAsync(request.CustomerId, request.ProductId);
        return Response<Unit>.Succeed(Unit.Value, "Product removed from customer successfully.");
    }
} 