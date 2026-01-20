using LMS.Models.Requests.Classes;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClassesController : ControllerBase
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _classService.GetAllClassesAsync();

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "CLS-000",
            Message = "Classes retrieved successfully",
            Data = classes
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var classEntity = await _classService.GetClassByIdAsync(id);

        if (classEntity == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "CLS-001",
                Message = "Class not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "CLS-000",
            Message = "Class retrieved successfully",
            Data = classEntity
        });
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateClassRequest request)
    {
        var classEntity = await _classService.CreateClassAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = classEntity.Id }, new BaseResponse<object, object>
        {
            Success = true,
            Code = "CLS-000",
            Message = "Class created successfully",
            Data = classEntity
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClassRequest request)
    {
        var classEntity = await _classService.UpdateClassAsync(id, request);

        if (classEntity == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "CLS-001",
                Message = "Class not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "CLS-000",
            Message = "Class updated successfully",
            Data = classEntity
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _classService.DeleteClassAsync(id);

        if (!deleted)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "CLS-001",
                Message = "Class not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "CLS-000",
            Message = "Class deleted successfully",
            Data = null
        });
    }
}