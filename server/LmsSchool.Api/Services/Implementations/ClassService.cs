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
        Guid? teacherId = null;
        if (!string.IsNullOrEmpty(request.HomeroomTeacherUserId))
        {
            var teacherUserId = Guid.Parse(request.HomeroomTeacherUserId);
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == teacherUserId);
            if (teacher != null) teacherId = teacher.Id;
        }

        var newClass = new Class
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            GradeLevel = request.GradeLevel,
            AcademicYear = request.AcademicYear,
            HomeroomTeacherId = teacherId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Classes.Add(newClass);
        await _context.SaveChangesAsync();

        // Re-fetch to get Teacher details (or optimize with known data)
        var createdClass = await GetClassByIdAsync(newClass.Id);
        return createdClass!;
    }

    public async Task<ClassResponse?> UpdateClassAsync(Guid id, UpdateClassRequest request)
    {
        var classEntity = await _context.Classes.FindAsync(id);
        if (classEntity == null) return null;

        if (!string.IsNullOrEmpty(request.Name))
            classEntity.Name = request.Name;

        if (request.GradeLevel.HasValue)
            classEntity.GradeLevel = request.GradeLevel.Value;
            
        if (!string.IsNullOrEmpty(request.AcademicYear))
            classEntity.AcademicYear = request.AcademicYear;

        if (!string.IsNullOrEmpty(request.HomeroomTeacherUserId))
        {
            var teacherUserId = Guid.Parse(request.HomeroomTeacherUserId);
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == teacherUserId);
            if (teacher != null) classEntity.HomeroomTeacherId = teacher.Id;
            else classEntity.HomeroomTeacherId = null; // Or keep current? Usually null means explicitly clearing or invalid if we enforced it. 
            // If ID is passed but invalid, let's treat as null or failure? 
            // For now: if teacher not found but ID passed, ignore or nullify. Let's nullify to match "clearing".
        }

        await _context.SaveChangesAsync();
        
        return (await GetClassByIdAsync(id))!;
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