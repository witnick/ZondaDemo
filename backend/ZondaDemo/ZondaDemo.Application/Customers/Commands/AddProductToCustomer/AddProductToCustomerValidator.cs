using FluentValidation;

namespace ZondaDemo.Application.Customers.Commands.AddProductToCustomer;

public class AddProductToCustomerValidator : AbstractValidator<AddProductToCustomerRequest>
{
    public AddProductToCustomerValidator()
    {
        RuleFor(x => x.CustomerId)
            .GreaterThan(0)
            .WithMessage("Customer ID must be greater than 0.");

        RuleFor(x => x.ProductId)
            .GreaterThan(0)
            .WithMessage("Product ID must be greater than 0.");
    }
} 