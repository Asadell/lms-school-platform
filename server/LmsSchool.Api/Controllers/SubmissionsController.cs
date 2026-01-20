using LMS.Models.Requests.Submissions;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;
using System.Security.Claims;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly ISubmissionService _submissionService;

    public SubmissionsController(ISubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [HttpGet]
    [Authorize(Roles = "teacher,admin")]
    public async Task<IActionResult> GetAll()
    {
        var submissions = await _submissionService.GetAllSubmissionsAsync();

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SBM-000",
            Message = "Submissions retrieved successfully",
            Data = submissions
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var submission = await _submissionService.GetSubmissionByIdAsync(id);

        if (submission == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SBM-001",
                Message = "Submission not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SBM-000",
            Message = "Submission retrieved successfully",
            Data = submission
        });
    }

    [HttpPost]
    [Authorize(Roles = "student")]
    public async Task<IActionResult> Create([FromBody] CreateSubmissionRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var studentId))
            return Unauthorized(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SBM-002",
                Message = "Invalid user authentication",
                Data = null
            });

        var submission = await _submissionService.CreateSubmissionAsync(request, studentId);

        if (submission == null)
            return BadRequest(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SBM-003",
                Message = "Failed to create submission. Assignment or student not found.",
                Data = null
            });

        return CreatedAtAction(nameof(GetById), new { id = submission.Id }, new BaseResponse<object, object>
        {
            Success = true,
            Code = "SBM-000",
            Message = "Submission created successfully",
            Data = submission
        });
    }

    [HttpPut("{id}/grade")]
    [Authorize(Roles = "teacher")]
    public async Task<IActionResult> Grade(Guid id, [FromBody] GradeSubmissionRequest request)
    {
        var submission = await _submissionService.GradeSubmissionAsync(id, request);

        if (submission == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "SBM-001",
                Message = "Submission not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "SBM-000",
            Message = "Submission graded successfully",
            Data = submission
        });
    }
}