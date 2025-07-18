using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Application.Customers.GetCustomerById;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Customers.UpdateCustomer;

public class UpdateCustomerHandler : IRequestHandler<UpdateCustomerRequest, Response<CustomerDto>>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public UpdateCustomerHandler(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<Response<CustomerDto>> Handle(UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(request.Id);
        
        if (customer == null)
        {
            throw new NotFoundException($"Customer with ID {request.Id} was not found");
        }

        customer.Update(request.Name, request.Email, request.Phone);

        await _customerRepository.UpdateAsync(customer);

        var customerDto = _mapper.Map<CustomerDto>(customer);
            
        return Response<CustomerDto>.Succeed(
            customerDto,
            "Customer updated successfully"
        );
    }
} 