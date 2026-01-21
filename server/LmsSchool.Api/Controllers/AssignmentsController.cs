using LMS.Models.Requests.Assignments;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentsController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var assignments = await _assignmentService.GetAllAssignmentsAsync();

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "ASG-000",
            Message = "Assignments retrieved successfully",
            Data = assignments
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var assignment = await _assignmentService.GetAssignmentByIdAsync(id);

        if (assignment == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "ASG-001",
                Message = "Assignment not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "ASG-000",
            Message = "Assignment retrieved successfully",
            Data = assignment
        });
    }

    [HttpPost]
    [Authorize(Roles = "teacher")]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentRequest request)
    {
        var assignment = await _assignmentService.CreateAssignmentAsync(request);

        if (assignment == null)
            return BadRequest(new BaseResponse<object, object>
            {
                Success = false,
                Code = "ASG-002",
                Message = "Failed to create assignment. Subject not found.",
                Data = null
            });

        return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, new BaseResponse<object, object>
        {
            Success = true,
            Code = "ASG-000",
            Message = "Assignment created successfully",
            Data = assignment
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "teacher")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAssignmentRequest request)
    {
        var assignment = await _assignmentService.UpdateAssignmentAsync(id, request);

        if (assignment == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "ASG-001",
                Message = "Assignment not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "ASG-000",
            Message = "Assignment updated successfully",
            Data = assignment
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "teacher,admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _assignmentService.DeleteAssignmentAsync(id);

        if (!deleted)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "ASG-001",
                Message = "Assignment not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "ASG-000",
            Message = "Assignment deleted successfully",
            Data = null
        });
    }
}