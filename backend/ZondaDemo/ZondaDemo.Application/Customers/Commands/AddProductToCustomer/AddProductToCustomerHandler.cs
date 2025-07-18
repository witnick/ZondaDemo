using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Customers.Commands.AddProductToCustomer;

public class AddProductToCustomerHandler : IRequestHandler<AddProductToCustomerRequest, Response<Unit>>
{
    private readonly ICustomerRepository _customerRepository;

    public AddProductToCustomerHandler(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<Response<Unit>> Handle(AddProductToCustomerRequest request, CancellationToken cancellationToken)
    {
        await _customerRepository.AddProductToCustomerAsync(request.CustomerId, request.ProductId);
        return Response<Unit>.Succeed(Unit.Value, "Product added to customer successfully.");
    }
} 