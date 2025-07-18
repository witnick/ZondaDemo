using AutoMapper;
using MediatR;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Entities;
using ZondaDemo.Core.Interfaces;

namespace ZondaDemo.Application.Customers.Commands.UpdateCustomerDetail;

public class UpdateCustomerDetailHandler : IRequestHandler<UpdateCustomerDetailRequest, Response<CustomerDetailDto>>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public UpdateCustomerDetailHandler(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<Response<CustomerDetailDto>> Handle(UpdateCustomerDetailRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdWithDetailAsync(request.CustomerId);
        if (customer == null)
        {
            throw new NotFoundException($"Customer with ID {request.CustomerId} was not found");
        }

        if (customer.Detail == null)
        {
            // If detail doesn't exist, create a new one
            var newDetail = new CustomerDetail(request.Address, request.Notes, request.CustomerId);
            customer.SetDetail(newDetail);
        }
        else
        {
            // Otherwise, update the existing detail
            customer.Detail.Update(request.Address, request.Notes);
        }

        await _customerRepository.UpdateAsync(customer);

        var updatedDetailDto = _mapper.Map<CustomerDetailDto>(customer.Detail);

        return Response<CustomerDetailDto>.Succeed(updatedDetailDto, "Customer detail updated successfully.");
    }
} 