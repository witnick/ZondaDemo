using FluentValidation;

namespace ZondaDemo.Application.Customers.Commands.RemoveProductFromCustomer;

public class RemoveProductFromCustomerValidator : AbstractValidator<RemoveProductFromCustomerRequest>
{
    public RemoveProductFromCustomerValidator()
    {
        RuleFor(x => x.CustomerId)
            .GreaterThan(0)
            .WithMessage("Customer ID must be greater than 0.");

        RuleFor(x => x.ProductId)
            .GreaterThan(0)
            .WithMessage("Product ID must be greater than 0.");
    }
} 