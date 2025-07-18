using FluentValidation;

namespace ZondaDemo.Application.Customers.GetCustomerById;

public class GetCustomerByIdValidation : AbstractValidator<GetCustomerByIdRequest>
{
    public GetCustomerByIdValidation()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Customer ID must be greater than 0");
    }
} 