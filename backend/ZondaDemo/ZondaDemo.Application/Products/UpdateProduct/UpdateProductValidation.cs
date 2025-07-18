using FluentValidation;

namespace ZondaDemo.Application.Products.UpdateProduct;

public class UpdateProductValidation : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductValidation()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Product ID must be greater than 0");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MaximumLength(100)
            .WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Price cannot be negative");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Stock cannot be negative");
    }
} 