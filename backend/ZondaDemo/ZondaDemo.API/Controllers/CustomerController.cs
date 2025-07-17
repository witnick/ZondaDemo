using Microsoft.AspNetCore.Mvc;
using ZondaDemo.API;
using System.Collections.Concurrent;

namespace ZondaDemo.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private static readonly ConcurrentDictionary<int, Customer> Customers = new();
        private static int _nextId = 1;

        // Mock data initialization
        static CustomerController()
        {
            Customers.Clear();
            Customers[1] = new Customer
            {
                Id = 1,
                Name = "Alice Smith",
                Email = "alice@example.com",
                Detail = new CustomerDetail
                {
                    Id = 1,
                    Address = "123 Main St",
                    Phone = "555-1234",
                    Notes = "VIP customer"
                },
                ProductIds = new List<int> { 1, 2 }
            };
            Customers[2] = new Customer
            {
                Id = 2,
                Name = "Bob Johnson",
                Email = "bob@example.com",
                Detail = new CustomerDetail
                {
                    Id = 2,
                    Address = "456 Oak Ave",
                    Phone = "555-5678",
                    Notes = "Prefers email contact"
                },
                ProductIds = new List<int> { 3 }
            };
            Customers[3] = new Customer
			{
				Id = 3,
				Name = "John Doe",
				Email = "john@example.com",
				Detail = new CustomerDetail
				{
					Id = 2,
					Address = "789 Cedar Ave",
					Phone = "123-5678",
					Notes = "Potential lead"
				},
				ProductIds = new List<int> { 4 }
			};
			_nextId = 3;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] bool includeProducts = false)
        {
            var customers = Customers.Values.ToList();
            if (includeProducts)
            {
                var productController = new ProductDetailController();
                var products = ProductDetailController.GetProductsDictionary();
                var result = customers.Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Email,
                    c.Detail,
                    Products = c.ProductIds.Select(pid => products.TryGetValue(pid, out var p) ? p : null).Where(p => p != null).ToList()
                });
                return Ok(new {
                    success = true,
                    message = "Customers with products fetched successfully",
                    data = result
                });
            }
            return Ok(new {
                success = true,
                message = "Customers fetched successfully",
                data = customers
            });
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id, [FromQuery] bool includeProducts = false)
        {
            if (!Customers.TryGetValue(id, out var customer))
            {
                return NotFound(new {
                    type = "https://api.example.com/errors/resource-not-found",
                    title = "Resource Not Found",
                    status = 404,
                    detail = $"Customer with ID {id} not found",
                    instance = $"/customer/{id}",
                    errorCode = "CUSTOMER_NOT_FOUND"
                });
            }
            if (includeProducts)
            {
                var products = ProductDetailController.GetProductsDictionary();
                var result = new
                {
                    customer.Id,
                    customer.Name,
                    customer.Email,
                    customer.Detail,
                    Products = customer.ProductIds.Select(pid => products.TryGetValue(pid, out var p) ? p : null).Where(p => p != null).ToList()
                };
                return Ok(new {
                    success = true,
                    message = "Customer with products fetched successfully",
                    data = result
                });
            }
            return Ok(new {
                success = true,
                message = "Customer fetched successfully",
                data = customer
            });
        }

        [HttpPost]
        public IActionResult Create([FromBody] Customer customer)
        {
            customer.Id = _nextId++;
            Customers[customer.Id] = customer;
            return StatusCode(201, new {
                success = true,
                message = "Customer created successfully",
                data = customer
            });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Customer customer)
        {
            if (!Customers.ContainsKey(id))
            {
                return NotFound(new {
                    type = "https://api.example.com/errors/resource-not-found",
                    title = "Resource Not Found",
                    status = 404,
                    detail = $"Customer with ID {id} not found",
                    instance = $"/customer/{id}",
                    errorCode = "CUSTOMER_NOT_FOUND"
                });
            }
            customer.Id = id;
            Customers[id] = customer;
            return Ok(new {
                success = true,
                message = "Customer updated successfully",
                data = customer
            });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!Customers.TryRemove(id, out _))
            {
                return NotFound(new {
                    type = "https://api.example.com/errors/resource-not-found",
                    title = "Resource Not Found",
                    status = 404,
                    detail = $"Customer with ID {id} not found",
                    instance = $"/customer/{id}",
                    errorCode = "CUSTOMER_NOT_FOUND"
                });
            }
            return NoContent();
        }
    }
} 