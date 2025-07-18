using Bogus;
using ZondaDemo.Core.Entities;

namespace ZondaDemo.Infrastructure.Data.Seeding;

public class CustomerFaker : Faker<Customer>
{
    public CustomerFaker()
    {
        CustomInstantiator(f => new Customer(
            name: f.Name.FullName(),
            email: f.Internet.Email(),
            phone: f.Phone.PhoneNumber("(###) ###-####")
        ));
    }
}

public class CustomerDetailFaker : Faker<CustomerDetail>
{
    public CustomerDetailFaker(int customerId)
    {
        CustomInstantiator(f => new CustomerDetail(
            address: f.Address.FullAddress(),
            notes: f.Lorem.Sentence(),
            customerId: customerId
        ));
    }
}

public class ProductDetailFaker : Faker<ProductDetail>
{
    public ProductDetailFaker(int customerId)
    {
        CustomInstantiator(f => new ProductDetail(
            name: f.Commerce.ProductName(),
            price: decimal.Parse(f.Commerce.Price(10, 1000)),
            customerId: customerId
        ));
    }
} 