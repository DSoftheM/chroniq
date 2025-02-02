namespace Chroniq.Services.Exceptions;

public class ValidationException(string message = "Validation error") : Exception(message);