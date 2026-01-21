using LMS.Data;
using LMS.Models.Entities;
using LMS.Models.Requests.Assignments;
using LMS.Models.Responses.Assignments;
using Microsoft.EntityFrameworkCore;

namespace LMS.Services;

public class AssignmentService : IAssignmentService
{
    private readonly AppDbContext _context;

    public AssignmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AssignmentResponse>> GetAllAssignmentsAsync()
    {
        return await _context.Assignments
            .Include(a => a.Subject)
            .Select(a => new AssignmentResponse
            {
                Id = a.Id.ToString(),
                Title = a.Title,
                Description = a.Description,
                DueDate = a.DueDate,
                MaxScore = a.MaxScore,
                SubjectName = a.Subject.Name,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<AssignmentResponse?> GetAssignmentByIdAsync(Guid id)
    {
        var assignment = await _context.Assignments
            .Include(a => a.Subject)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment == null) return null;

        return new AssignmentResponse
        {
            Id = assignment.Id.ToString(),
            Title = assignment.Title,
            Description = assignment.Description,
            DueDate = assignment.DueDate,
            MaxScore = assignment.MaxScore,
            SubjectName = assignment.Subject.Name,
            CreatedAt = assignment.CreatedAt
        };
    }

    public async Task<AssignmentResponse?> CreateAssignmentAsync(CreateAssignmentRequest request)
    {
        var subjectId = Guid.Parse(request.SubjectId);
        var subject = await _context.Subjects.FindAsync(subjectId);
        if (subject == null) return null;

        var assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            SubjectId = subjectId,
            Title = request.Title,
            Description = request.Description,
            DueDate = DateTime.Parse(request.DueDate),
            MaxScore = request.MaxScore,
            CreatedAt = DateTime.UtcNow
        };

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        return new AssignmentResponse
        {
            Id = assignment.Id.ToString(),
            Title = assignment.Title,
            Description = assignment.Description,
            DueDate = assignment.DueDate,
            MaxScore = assignment.MaxScore,
            SubjectName = subject.Name,
            CreatedAt = assignment.CreatedAt
        };
    }

    public async Task<AssignmentResponse?> UpdateAssignmentAsync(Guid id, UpdateAssignmentRequest request)
    {
        var assignment = await _context.Assignments
            .Include(a => a.Subject)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment == null) return null;

        if (!string.IsNullOrEmpty(request.Title))
            assignment.Title = request.Title;

        if (!string.IsNullOrEmpty(request.Description))
            assignment.Description = request.Description;

        if (!string.IsNullOrEmpty(request.DueDate))
            assignment.DueDate = DateTime.Parse(request.DueDate);

        if (request.MaxScore.HasValue)
            assignment.MaxScore = request.MaxScore.Value;

        await _context.SaveChangesAsync();

        return new AssignmentResponse
        {
            Id = assignment.Id.ToString(),
            Title = assignment.Title,
            Description = assignment.Description,
            DueDate = assignment.DueDate,
            MaxScore = assignment.MaxScore,
            SubjectName = assignment.Subject.Name,
            CreatedAt = assignment.CreatedAt
        };
    }

    public async Task<bool> DeleteAssignmentAsync(Guid id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null) return false;

        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();
        return true;
    }
}