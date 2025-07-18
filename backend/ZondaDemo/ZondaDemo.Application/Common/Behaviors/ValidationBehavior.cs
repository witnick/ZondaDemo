using FluentValidation;
using MediatR;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior to handle validation of requests using FluentValidation
/// </summary>
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : BaseResponse
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .Where(r => r.Errors.Any())
            .SelectMany(r => r.Errors)
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        if (failures.Any())
        {
            // Create an instance of TResponse using Activator since we can't use new() constraint
            var response = Activator.CreateInstance<TResponse>();
            response.Success = false;
            response.Message = "Validation failed";

            if (response is ErrorResponse errorResponse)
            {
                errorResponse.ErrorCode = "VALIDATION_ERROR";
                errorResponse.ValidationErrors = failures;
            }

            return response;
        }

        return await next();
    }
} 