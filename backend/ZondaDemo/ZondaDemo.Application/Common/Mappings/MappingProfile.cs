using AutoMapper;
using ZondaDemo.Core.Entities;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Customer, CustomerDto>();
        CreateMap<CustomerDetail, CustomerDetailDto>();
        CreateMap<ProductDetail, ProductDetailDto>();
    }
} 