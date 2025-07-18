using FluentValidation;

namespace ZondaDemo.Application.Products.GetProductById;

public class GetProductByIdValidation : AbstractValidator<GetProductByIdRequest>
{
    public GetProductByIdValidation()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Product ID must be greater than 0");
    }
} 