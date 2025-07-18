using System.Text.Json;
using ZondaDemo.Application.Common.Exceptions;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Core.Exceptions;

namespace ZondaDemo.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while processing the request");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = exception switch
        {
            Application.Common.Exceptions.ValidationException validationException =>
                CreateErrorResponse(
                    StatusCodes.Status400BadRequest,
                    "Validation Error",
                    "VALIDATION_ERROR",
                    validationErrors: validationException.Failures),

            NotFoundException notFoundException =>
                CreateErrorResponse(
                    StatusCodes.Status404NotFound,
                    notFoundException.Message,
                    "NOT_FOUND"),

            DomainValidationException domainValidationException =>
                CreateErrorResponse(
                    StatusCodes.Status400BadRequest,
                    domainValidationException.Message,
                    "DOMAIN_VALIDATION_ERROR"),

            UnauthorizedException unauthorizedException =>
                CreateErrorResponse(
                    StatusCodes.Status401Unauthorized,
                    unauthorizedException.Message,
                    "UNAUTHORIZED"),

            _ => CreateErrorResponse(
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred",
                    "SERVER_ERROR")
        };

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = response.Status;

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }

    private static ProblemDetails CreateErrorResponse(
        int status,
        string detail,
        string errorCode,
        IDictionary<string, string[]>? validationErrors = null)
    {
        var response = new ProblemDetails
        {
            Type = $"https://api.example.com/errors/{errorCode.ToLower()}",
            Title = detail,
            Status = status,
            Detail = detail,
            Instance = $"/errors/{Guid.NewGuid()}",
            ErrorCode = errorCode,
            TraceId = Guid.NewGuid().ToString()
        };

        if (validationErrors != null)
        {
            response.ValidationErrors = validationErrors;
        }

        return response;
    }
}

public class ProblemDetails
{
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int Status { get; set; }
    public string Detail { get; set; } = string.Empty;
    public string Instance { get; set; } = string.Empty;
    public string ErrorCode { get; set; } = string.Empty;
    public string TraceId { get; set; } = string.Empty;
    public IDictionary<string, string[]>? ValidationErrors { get; set; }
}

public static class ExceptionHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
} 