using FluentValidation;

namespace ZondaDemo.Application.Customers.Commands.UpdateCustomerDetail;

public class UpdateCustomerDetailValidator : AbstractValidator<UpdateCustomerDetailRequest>
{
    public UpdateCustomerDetailValidator()
    {
        RuleFor(x => x.CustomerId)
            .GreaterThan(0)
            .WithMessage("Customer ID must be greater than 0.");

        RuleFor(x => x.Address)
            .NotEmpty()
            .WithMessage("Address is required.")
            .MaximumLength(200)
            .WithMessage("Address cannot exceed 200 characters.");

        RuleFor(x => x.Notes)
            .MaximumLength(500)
            .WithMessage("Notes cannot exceed 500 characters.");
    }
} 