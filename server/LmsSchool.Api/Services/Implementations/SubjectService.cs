using LMS.Data;
using LMS.Models.Entities;
using LMS.Models.Requests.Subjects;
using LMS.Models.Responses.Subjects;
using Microsoft.EntityFrameworkCore;

namespace LMS.Services;

public class SubjectService : ISubjectService
{
    private readonly AppDbContext _context;

    public SubjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SubjectResponse>> GetAllSubjectsAsync()
    {
        return await _context.Subjects
            .Include(s => s.Teacher)
                .ThenInclude(t => t.User)
            .Select(s => new SubjectResponse
            {
                Id = s.Id.ToString(),
                Name = s.Name,
                Code = s.Code,
                TeacherName = s.Teacher.User.Username,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<SubjectResponse?> GetSubjectByIdAsync(Guid id)
    {
        var subject = await _context.Subjects
            .Include(s => s.Teacher)
                .ThenInclude(t => t.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (subject == null) return null;

        return new SubjectResponse
        {
            Id = subject.Id.ToString(),
            Name = subject.Name,
            Code = subject.Code,
            TeacherName = subject.Teacher.User.Username,
            CreatedAt = subject.CreatedAt
        };
    }

    public async Task<SubjectResponse?> CreateSubjectAsync(CreateSubjectRequest request)
    {
        var teacherId = Guid.Parse(request.TeacherId);
        var teacher = await _context.Teachers.FindAsync(teacherId);
        if (teacher == null) return null;

        // Check unique code
        if (await _context.Subjects.AnyAsync(s => s.Code == request.Code))
            return null;

        var subject = new Subject
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Code = request.Code,
            TeacherId = teacherId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        var teacherUser = await _context.Users.FindAsync(teacher.UserId);

        return new SubjectResponse
        {
            Id = subject.Id.ToString(),
            Name = subject.Name,
            Code = subject.Code,
            TeacherName = teacherUser!.Username,
            CreatedAt = subject.CreatedAt
        };
    }

    public async Task<bool> DeleteSubjectAsync(Guid id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject == null) return false;

        _context.Subjects.Remove(subject);
        await _context.SaveChangesAsync();
        return true;
    }
}