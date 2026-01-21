using LMS.Models.Requests.Auth;
using LMS.Services;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);

        if (result == null)
            return BadRequest(new BaseResponse<object, object>
            {
                Success = false,
                Code = "REG-001",
                Message = "Registration failed. Username or email already exists.",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "REG-000",
            Message = "User registered successfully",
            Data = result
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
            return Unauthorized(new BaseResponse<object, object>
            {
                Success = false,
                Code = "AUTH-001",
                Message = "Invalid email or password",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "AUTH-000",
            Message = "Login successful",
            Data = result
        });
    }
}