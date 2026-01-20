using LMS.Models.Requests.Auth;
using LMS.Models.Responses.Auth;

namespace LMS.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<RegisterResponse?> RegisterAsync(RegisterRequest request);
}