using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ZondaDemo.Core.Interfaces;
using ZondaDemo.Infrastructure.Data;
using ZondaDemo.Infrastructure.Data.Seeding;
using ZondaDemo.Infrastructure.Persistence.Repositories;

namespace ZondaDemo.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IProductDetailRepository, ProductDetailRepository>();
        
        // Register database seeder
        services.AddDatabaseSeeding();

        return services;
    }
} 