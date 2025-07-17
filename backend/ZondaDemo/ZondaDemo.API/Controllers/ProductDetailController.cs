using Microsoft.AspNetCore.Mvc;
using ZondaDemo.API;
using System.Collections.Concurrent;

namespace ZondaDemo.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductDetailController : ControllerBase
    {
        private static readonly ConcurrentDictionary<int, ProductDetail> Products = new();
        private static int _nextId = 1;

        // Mock data initialization
        static ProductDetailController()
        {
            Products.Clear();
            Products[1] = new ProductDetail
            {
                Id = 1,
                Name = "Widget A",
                Description = "A basic widget",
                Price = 9.99m,
                Stock = 100
            };
            Products[2] = new ProductDetail
            {
                Id = 2,
                Name = "Widget B",
                Description = "A premium widget",
                Price = 19.99m,
                Stock = 50
            };
            Products[3] = new ProductDetail
            {
                Id = 3,
                Name = "Gadget X",
                Description = "A useful gadget",
                Price = 14.99m,
                Stock = 75
            };
			Products[3] = new ProductDetail
			{
				Id = 4,
				Name = "Gadget Y",
				Description = "Another useful gadget",
				Price = 14.99m,
				Stock = 45
			};
			_nextId = 5;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(new {
                success = true,
                message = "Product details fetched successfully",
                data = Products.Values.ToList()
            });
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            if (!Products.TryGetValue(id, out var product))
            {
                return NotFound(new {
                    type = "https://api.example.com/errors/resource-not-found",
                    title = "Resource Not Found",
                    status = 404,
                    detail = $"ProductDetail with ID {id} not found",
                    instance = $"/productdetail/{id}",
                    errorCode = "PRODUCTDETAIL_NOT_FOUND"
                });
            }
            return Ok(new {
                success = true,
                message = "Product detail fetched successfully",
                data = product
            });
        }

        [HttpPost]
        public IActionResult Create([FromBody] ProductDetail product)
        {
            product.Id = _nextId++;
            Products[product.Id] = product;
            return StatusCode(201, new {
                success = true,
                message = "Product detail created successfully",
                data = product
            });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ProductDetail product)
        {
            if (!Products.ContainsKey(id))
            {
                return NotFound(new {
                    type = "https://api.example.com/errors/resource-not-found",
                    title = "Resource Not Found",
                    status = 404,
                    detail = $"ProductDetail with ID {id} not found",
                    instance = $"/productdetail/{id}",
                    errorCode = "PRODUCTDETAIL_NOT_FOUND"
                });
            }
            product.Id = id;
            Products[id] = product;
            return Ok(new {
                success = true,
                message = "Product detail updated successfully",
                data = product
            });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!Products.TryRemove(id, out _))
            {
                return NotFound(new {
                    type = "https://api.example.com/errors/resource-not-found",
                    title = "Resource Not Found",
                    status = 404,
                    detail = $"ProductDetail with ID {id} not found",
                    instance = $"/productdetail/{id}",
                    errorCode = "PRODUCTDETAIL_NOT_FOUND"
                });
            }
            return NoContent();
        }

        public static IReadOnlyDictionary<int, ProductDetail> GetProductsDictionary()
        {
            return Products;
        }
    }
} 