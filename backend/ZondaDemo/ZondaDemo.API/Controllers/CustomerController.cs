using Microsoft.AspNetCore.Mvc;
using ZondaDemo.Application.Common.Models;
using ZondaDemo.Application.Customers.GetCustomerById;
using ZondaDemo.Application.Customers.GetCustomerList;
using ZondaDemo.Application.Customers.UpdateCustomer;
using ZondaDemo.Application.Customers.Commands.UpdateCustomerDetail;
using ZondaDemo.Application.Customers.Commands.AddProductToCustomer;
using ZondaDemo.Application.Customers.Commands.RemoveProductFromCustomer;

namespace ZondaDemo.API.Controllers;

public class CustomerController : BaseApiController
{
    /// <summary>
    /// Gets a list of all customers
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(Response<List<CustomerDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCustomers()
    {
        var response = await Mediator.Send(new GetCustomerListRequest());
        return HandleResponse(response);
    }

    /// <summary>
    /// Gets a customer by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Response<CustomerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCustomer(int id)
    {
        var response = await Mediator.Send(new GetCustomerByIdRequest(id));
        return HandleResponse(response);
    }

    /// <summary>
    /// Updates a customer
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Response<CustomerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCustomer(int id, UpdateCustomerRequest request)
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
    /// Updates a customer's detail
    /// </summary>
    [HttpPut("{id}/detail")]
    [ProducesResponseType(typeof(Response<CustomerDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCustomerDetail(int id, [FromBody] UpdateCustomerDetailRequest request)
    {
        if (id != request.CustomerId)
        {
            request.CustomerId = id;
        }

        var response = await Mediator.Send(request);
        return HandleResponse(response);
    }

    /// <summary>
    /// Adds a product to a customer
    /// </summary>
    [HttpPost("{id}/products/{productId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddProductToCustomer(int id, int productId)
    {
        var request = new AddProductToCustomerRequest { CustomerId = id, ProductId = productId };
        await Mediator.Send(request);
        return NoContent();
    }

    /// <summary>
    /// Removes a product from a customer
    /// </summary>
    [HttpDelete("{id}/products/{productId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveProductFromCustomer(int id, int productId)
    {
        var request = new RemoveProductFromCustomerRequest { CustomerId = id, ProductId = productId };
        await Mediator.Send(request);
        return NoContent();
    }
} 