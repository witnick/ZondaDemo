using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Application.Customers.GetCustomerById;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Customers.GetCustomerList;

public class GetCustomerListHandler : IRequestHandler<GetCustomerListRequest, Response<List<CustomerDto>>>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public GetCustomerListHandler(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<Response<List<CustomerDto>>> Handle(GetCustomerListRequest request, CancellationToken cancellationToken)
    {
        var customers = await _customerRepository.GetAllAsync();
        var customerDtos = _mapper.Map<List<CustomerDto>>(customers);

        return Response<List<CustomerDto>>.Succeed(
            customerDtos,
            "Customers retrieved successfully"
        );
    }
} 