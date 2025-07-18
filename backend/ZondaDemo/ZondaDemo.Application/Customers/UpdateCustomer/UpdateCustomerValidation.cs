using FluentValidation;

namespace ZondaDemo.Application.Customers.UpdateCustomer;

public class UpdateCustomerValidation : AbstractValidator<UpdateCustomerRequest>
{
    public UpdateCustomerValidation()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Customer ID must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MaximumLength(100)
            .WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Invalid email format")
            .MaximumLength(150)
            .WithMessage("Email cannot exceed 150 characters");

        RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Phone is required")
            .MaximumLength(20)
            .WithMessage("Phone cannot exceed 20 characters")
            .Matches(@"^\+?[\d\s-]+$")
            .WithMessage("Invalid phone number format");
    }
} 