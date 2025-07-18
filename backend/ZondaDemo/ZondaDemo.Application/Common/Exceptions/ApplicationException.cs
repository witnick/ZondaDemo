namespace ZondaDemo.Application.Common.Exceptions;

public abstract class ApplicationException : Exception
{
    protected ApplicationException(string title, string message)
        : base(message)
    {
        Title = title;
    }

    public string Title { get; }
}

public class NotFoundException : ApplicationException
{
    public NotFoundException(string message)
        : base("Not Found", message)
    {
    }
}

public class ValidationException : ApplicationException
{
    public ValidationException(IDictionary<string, string[]> failures)
        : base("Validation Error", "One or more validation errors occurred")
    {
        Failures = failures;
    }

    public IDictionary<string, string[]> Failures { get; }
}

public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message)
        : base("Unauthorized", message)
    {
    }
} 