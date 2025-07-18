using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ZondaDemo.Core.Entities;

namespace ZondaDemo.Infrastructure.Persistence.Configurations;

public class ProductDetailConfiguration : IEntityTypeConfiguration<ProductDetail>
{
    public void Configure(EntityTypeBuilder<ProductDetail> builder)
    {
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.Property(p => p.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(p => p.Stock)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasOne(p => p.Customer)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
} 