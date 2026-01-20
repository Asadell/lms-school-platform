using LMS.Data;
using LMS.Models.Entities;
using LMS.Models.Requests.Classes;
using LMS.Models.Responses.Classes;
using Microsoft.EntityFrameworkCore;

namespace LMS.Services;

public class ClassService : IClassService
{
    private readonly AppDbContext _context;

    public ClassService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ClassResponse>> GetAllClassesAsync()
    {
        return await _context.Classes
            .Include(c => c.HomeroomTeacher)
                .ThenInclude(t => t!.User)
            .Select(c => new ClassResponse
            {
                Id = c.Id.ToString(),
                Name = c.Name,
                GradeLevel = c.GradeLevel,
                AcademicYear = c.AcademicYear,
                HomeroomTeacher = c.HomeroomTeacher != null ? c.HomeroomTeacher.User.Username : null,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ClassResponse?> GetClassByIdAsync(Guid id)
    {
        var classEntity = await _context.Classes
            .Include(c => c.HomeroomTeacher)
                .ThenInclude(t => t!.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (classEntity == null) return null;

        return new ClassResponse
        {
            Id = classEntity.Id.ToString(),
            Name = classEntity.Name,
            GradeLevel = classEntity.GradeLevel,
            AcademicYear = classEntity.AcademicYear,
            HomeroomTeacher = classEntity.HomeroomTeacher?.User.Username,
            CreatedAt = classEntity.CreatedAt
        };
    }

    public async Task<ClassResponse> CreateClassAsync(CreateClassRequest request)
    {
        var newClass = new Class
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            GradeLevel = request.GradeLevel,
            AcademicYear = request.AcademicYear,
            CreatedAt = DateTime.UtcNow
        };

        _context.Classes.Add(newClass);
        await _context.SaveChangesAsync();

        return new ClassResponse
        {
            Id = newClass.Id.ToString(),
            Name = newClass.Name,
            GradeLevel = newClass.GradeLevel,
            AcademicYear = newClass.AcademicYear,
            CreatedAt = newClass.CreatedAt
        };
    }

    public async Task<ClassResponse?> UpdateClassAsync(Guid id, UpdateClassRequest request)
    {
        var classEntity = await _context.Classes.FindAsync(id);
        if (classEntity == null) return null;

        if (!string.IsNullOrEmpty(request.Name))
            classEntity.Name = request.Name;

        if (request.GradeLevel.HasValue)
            classEntity.GradeLevel = request.GradeLevel.Value;

        await _context.SaveChangesAsync();

        return new ClassResponse
        {
            Id = classEntity.Id.ToString(),
            Name = classEntity.Name,
            GradeLevel = classEntity.GradeLevel,
            AcademicYear = classEntity.AcademicYear,
            CreatedAt = classEntity.CreatedAt
        };
    }

    public async Task<bool> DeleteClassAsync(Guid id)
    {
        var classEntity = await _context.Classes.FindAsync(id);
        if (classEntity == null) return false;

        _context.Classes.Remove(classEntity);
        await _context.SaveChangesAsync();
        return true;
    }
}