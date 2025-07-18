using Microsoft.AspNetCore.Mvc;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Application.Products.GetProductById;
using ZondaDemo.Application.Products.GetProductList;
using ZondaDemo.Application.Products.UpdateProduct;
using ZondaDemo.Application.Products.CreateProduct;
using ZondaDemo.Application.Products.DeleteProduct;

namespace ZondaDemo.API.Controllers;

public class ProductController : BaseApiController
{
    /// <summary>
    /// Gets a list of all products
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(Response<List<ProductDetailDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetProducts()
    {
        var response = await Mediator.Send(new GetProductListRequest());
        return HandleResponse(response);
    }

    /// <summary>
    /// Gets a product by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Response<ProductDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetProduct(int id)
    {
        var response = await Mediator.Send(new GetProductByIdRequest(id));
        return HandleResponse(response);
    }

    /// <summary>
    /// Creates a new product
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Response<ProductDetailDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand request)
    {
        var response = await Mediator.Send(request);
        return CreatedAtAction(nameof(GetProduct), new { id = response.Data.Id }, response);
    }

    /// <summary>
    /// Updates a product
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Response<ProductDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductRequest request)
    {
        if (id != request.Id)
        {
            return BadRequest(new ErrorResponse 
            { 
                Success = false, 
                Message = "ID mismatch", 
                ErrorCode = "VALIDATION_ERROR" 
            });
        }

        var response = await Mediator.Send(request);
        return HandleResponse(response);
    }

    /// <summary>
    /// Deletes a product
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var response = await Mediator.Send(new DeleteProductRequest(id));
        return response.Success ? NoContent() : HandleResponse(response);
    }
} 