using FluentValidation;

namespace ZondaDemo.Application.Products.DeleteProduct;

public class DeleteProductValidator : AbstractValidator<DeleteProductRequest>
{
    public DeleteProductValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Product ID must be greater than 0");
    }
} 