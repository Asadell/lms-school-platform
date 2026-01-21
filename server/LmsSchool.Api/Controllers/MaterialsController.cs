using LMS.Models.Requests.Materials;
using LMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sindika.AspNet.Response;

namespace LMS.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MaterialsController : ControllerBase
{
    private readonly IMaterialService _materialService;

    public MaterialsController(IMaterialService materialService)
    {
        _materialService = materialService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var materials = await _materialService.GetAllMaterialsAsync();

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "MAT-000",
            Message = "Materials retrieved successfully",
            Data = materials
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var material = await _materialService.GetMaterialByIdAsync(id);

        if (material == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "MAT-001",
                Message = "Material not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "MAT-000",
            Message = "Material retrieved successfully",
            Data = material
        });
    }

    [HttpPost]
    [Authorize(Roles = "teacher")]
    public async Task<IActionResult> Create([FromBody] CreateMaterialRequest request)
    {
        var material = await _materialService.CreateMaterialAsync(request);

        if (material == null)
            return BadRequest(new BaseResponse<object, object>
            {
                Success = false,
                Code = "MAT-002",
                Message = "Failed to create material. Subject not found.",
                Data = null
            });

        return CreatedAtAction(nameof(GetById), new { id = material.Id }, new BaseResponse<object, object>
        {
            Success = true,
            Code = "MAT-000",
            Message = "Material created successfully",
            Data = material
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "teacher")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMaterialRequest request)
    {
        var material = await _materialService.UpdateMaterialAsync(id, request);

        if (material == null)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "MAT-001",
                Message = "Material not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "MAT-000",
            Message = "Material updated successfully",
            Data = material
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "teacher,admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _materialService.DeleteMaterialAsync(id);

        if (!deleted)
            return NotFound(new BaseResponse<object, object>
            {
                Success = false,
                Code = "MAT-001",
                Message = "Material not found",
                Data = null
            });

        return Ok(new BaseResponse<object, object>
        {
            Success = true,
            Code = "MAT-000",
            Message = "Material deleted successfully",
            Data = null
        });
    }
}