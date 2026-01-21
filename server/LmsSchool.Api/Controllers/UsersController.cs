using LMS.Models.Requests.Users;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "USR-000",
            Message = "Users retrieved successfully",
            Data = users
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);

        if (user == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "USR-001",
                Message = "User not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "USR-000",
            Message = "User retrieved successfully",
            Data = user
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var user = await _userService.UpdateUserAsync(id, request);

        if (user == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "USR-001",
                Message = "User not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "USR-000",
            Message = "User updated successfully",
            Data = user
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _userService.DeleteUserAsync(id);

        if (!deleted)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "USR-001",
                Message = "User not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "USR-000",
            Message = "User deleted successfully",
            Data = null
        });
    }
}