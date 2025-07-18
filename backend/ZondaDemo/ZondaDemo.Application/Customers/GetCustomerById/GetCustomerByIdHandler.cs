using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Customers.GetCustomerById;

public class GetCustomerByIdHandler : IRequestHandler<GetCustomerByIdRequest, Response<CustomerDto>>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public GetCustomerByIdHandler(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<Response<CustomerDto>> Handle(GetCustomerByIdRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetCustomerWithProductsAsync(request.Id);
        
        if (customer == null)
        {
            throw new NotFoundException($"Customer with ID {request.Id} was not found");
        }

        var customerDto = _mapper.Map<CustomerDto>(customer);
        
        return Response<CustomerDto>.Succeed(
            customerDto,
            "Customer retrieved successfully"
        );
    }
} 