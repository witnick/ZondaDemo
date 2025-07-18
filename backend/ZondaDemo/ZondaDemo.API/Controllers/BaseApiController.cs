using MediatR;
using Microsoft.AspNetCore.Mvc;
using ZondaDemo.Application.Common.Models;

namespace ZondaDemo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    private IMediator? _mediator;
    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<IMediator>();

    protected IActionResult HandleResponse<T>(Response<T> response)
    {
        if (response == null)
            return NotFound();

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    protected IActionResult HandleErrorResponse(ErrorResponse response)
    {
        if (response == null)
            return StatusCode(500, new ErrorResponse { Success = false, Message = "An unexpected error occurred" });

        var statusCode = response.ErrorCode switch
        {
            "VALIDATION_ERROR" => StatusCodes.Status400BadRequest,
            "NOT_FOUND" => StatusCodes.Status404NotFound,
            "UNAUTHORIZED" => StatusCodes.Status401Unauthorized,
            "FORBIDDEN" => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status500InternalServerError
        };

        return StatusCode(statusCode, response);
    }
} 