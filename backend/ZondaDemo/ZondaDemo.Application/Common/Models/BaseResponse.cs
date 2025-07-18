namespace ZondaDemo.Application.Common.Models;

/// <summary>
/// Base response class for all API responses
/// </summary>
public abstract class BaseResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Response class for successful operations that return data
/// </summary>
public class Response<T> : BaseResponse
{
    public T Data { get; set; }

    public static Response<T> Succeed(T data, string message = "")
    {
        return new Response<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }
}

/// <summary>
/// Response class for error scenarios
/// </summary>
public class ErrorResponse : BaseResponse
{
    public string ErrorCode { get; set; } = string.Empty;
    public IDictionary<string, string[]> ValidationErrors { get; set; } = new Dictionary<string, string[]>();

    public static ErrorResponse Fail(string message, string errorCode = "", IDictionary<string, string[]>? validationErrors = null)
    {
        return new ErrorResponse
        {
            Success = false,
            Message = message,
            ErrorCode = errorCode,
            ValidationErrors = validationErrors ?? new Dictionary<string, string[]>()
        };
    }
} 