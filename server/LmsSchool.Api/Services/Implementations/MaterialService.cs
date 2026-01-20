using LMS.Data;
using LMS.Models.Entities;
using LMS.Models.Requests.Materials;
using LMS.Models.Responses.Materials;
using Microsoft.EntityFrameworkCore;

namespace LMS.Services;

public class MaterialService : IMaterialService
{
    private readonly AppDbContext _context;

    public MaterialService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MaterialResponse>> GetAllMaterialsAsync()
    {
        return await _context.Materials
            .Include(m => m.Subject)
            .Select(m => new MaterialResponse
            {
                Id = m.Id.ToString(),
                Title = m.Title,
                Content = m.Content,
                SubjectName = m.Subject.Name,
                PublishDate = m.PublishDate,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<MaterialResponse?> GetMaterialByIdAsync(Guid id)
    {
        var material = await _context.Materials
            .Include(m => m.Subject)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (material == null) return null;

        return new MaterialResponse
        {
            Id = material.Id.ToString(),
            Title = material.Title,
            Content = material.Content,
            SubjectName = material.Subject.Name,
            PublishDate = material.PublishDate,
            CreatedAt = material.CreatedAt
        };
    }

    public async Task<MaterialResponse?> CreateMaterialAsync(CreateMaterialRequest request)
    {
        var subjectId = Guid.Parse(request.SubjectId);
        var subject = await _context.Subjects.FindAsync(subjectId);
        if (subject == null) return null;

        var material = new Material
        {
            Id = Guid.NewGuid(),
            SubjectId = subjectId,
            Title = request.Title,
            Content = request.Content,
            PublishDate = DateTime.Parse(request.PublishDate),
            CreatedAt = DateTime.UtcNow
        };

        _context.Materials.Add(material);
        await _context.SaveChangesAsync();

        return new MaterialResponse
        {
            Id = material.Id.ToString(),
            Title = material.Title,
            Content = material.Content,
            SubjectName = subject.Name,
            PublishDate = material.PublishDate,
            CreatedAt = material.CreatedAt
        };
    }

    public async Task<MaterialResponse?> UpdateMaterialAsync(Guid id, UpdateMaterialRequest request)
    {
        var material = await _context.Materials
            .Include(m => m.Subject)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (material == null) return null;

        if (!string.IsNullOrEmpty(request.Title))
            material.Title = request.Title;

        if (!string.IsNullOrEmpty(request.Content))
            material.Content = request.Content;

        await _context.SaveChangesAsync();

        return new MaterialResponse
        {
            Id = material.Id.ToString(),
            Title = material.Title,
            Content = material.Content,
            SubjectName = material.Subject.Name,
            PublishDate = material.PublishDate,
            CreatedAt = material.CreatedAt
        };
    }

    public async Task<bool> DeleteMaterialAsync(Guid id)
    {
        var material = await _context.Materials.FindAsync(id);
        if (material == null) return false;

        _context.Materials.Remove(material);
        await _context.SaveChangesAsync();
        return true;
    }
}