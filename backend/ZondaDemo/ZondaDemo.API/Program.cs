using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using NSwag;
using Scalar.AspNetCore;
using ZondaDemo.API.Middleware;
using ZondaDemo.Application;
using ZondaDemo.Infrastructure;
using ZondaDemo.Infrastructure.Data;
using ZondaDemo.Infrastructure.Data.Seeding;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddApplication();

// Configure database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseInMemoryDatabase("ZondaDemoDb");
    // Disable change tracking for better performance
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

// Add Infrastructure layer (after database configuration)
builder.Services.AddInfrastructure();

// Configure OpenAPI
builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "ZondaDemo API";
    config.Version = "v1";
    config.Description = "API for managing customers and products";
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var seeder = services.GetRequiredService<IDatabaseSeeder>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        logger.LogInformation("Ensuring database is created...");
        context.Database.EnsureCreated();

        logger.LogInformation("Starting database seeding...");
        await seeder.SeedAsync(100);
        logger.LogInformation("Database seeding completed");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database");
        throw;
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Serve OpenAPI specification
    app.UseOpenApi(config =>
    {
        config.Path = "/openapi/v1.json";
    });

    // Configure Scalar UI
    app.MapScalarApiReference(opt => {
	});
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseExceptionHandling();
app.MapControllers();

app.Run();
