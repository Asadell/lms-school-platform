using LMS.Models.Requests.Subjects;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubjectsController : ControllerBase
{
    private readonly ISubjectService _subjectService;

    public SubjectsController(ISubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subjects = await _subjectService.GetAllSubjectsAsync();

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SUB-000",
            Message = "Subjects retrieved successfully",
            Data = subjects
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var subject = await _subjectService.GetSubjectByIdAsync(id);

        if (subject == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SUB-001",
                Message = "Subject not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SUB-000",
            Message = "Subject retrieved successfully",
            Data = subject
        });
    }

    [HttpPost]
    [Authorize(Roles = "admin,teacher")]
    public async Task<IActionResult> Create([FromBody] CreateSubjectRequest request)
    {
        var subject = await _subjectService.CreateSubjectAsync(request);

        if (subject == null)
            return BadRequest(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SUB-002",
                Message = "Failed to create subject. Teacher not found or code already exists.",
                Data = null
            });

        return CreatedAtAction(nameof(GetById), new { id = subject.Id }, new BaseResponse<object, object>
        {
            Success = true,
            Code = "SUB-000",
            Message = "Subject created successfully",
            Data = subject
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,teacher")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSubjectRequest request)
    {
        var subject = await _subjectService.UpdateSubjectAsync(id, request);

        if (subject == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SUB-003",
                Message = "Subject not found or code already exists",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SUB-000",
            Message = "Subject updated successfully",
            Data = subject
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _subjectService.DeleteSubjectAsync(id);

        if (!deleted)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SUB-001",
                Message = "Subject not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SUB-000",
            Message = "Subject deleted successfully",
            Data = null
        });
    }
}