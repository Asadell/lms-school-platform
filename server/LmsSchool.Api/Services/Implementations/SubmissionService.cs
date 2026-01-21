using LMS.Data;
using LMS.Models.Entities;
using LMS.Models.Requests.Submissions;
using LMS.Models.Responses.Submissions;
using Microsoft.EntityFrameworkCore;

namespace LMS.Services;

public class SubmissionService : ISubmissionService
{
    private readonly AppDbContext _context;

    public SubmissionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SubmissionResponse>> GetAllSubmissionsAsync()
    {
        return await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
                .ThenInclude(st => st.User)
            .Select(s => new SubmissionResponse
            {
                Id = s.Id.ToString(),
                AssignmentTitle = s.Assignment.Title,
                StudentName = s.Student.User.Username,
                AnswerText = s.AnswerText,
                SubmittedAt = s.SubmittedAt,
                Score = s.Score,
                Feedback = s.Feedback,
                GradedAt = s.GradedAt
            })
            .ToListAsync();
    }

    public async Task<SubmissionResponse?> GetSubmissionByIdAsync(Guid id)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
                .ThenInclude(st => st.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null) return null;

        return new SubmissionResponse
        {
            Id = submission.Id.ToString(),
            AssignmentTitle = submission.Assignment.Title,
            StudentName = submission.Student.User.Username,
            AnswerText = submission.AnswerText,
            SubmittedAt = submission.SubmittedAt,
            Score = submission.Score,
            Feedback = submission.Feedback,
            GradedAt = submission.GradedAt
        };
    }

    public async Task<SubmissionResponse?> CreateSubmissionAsync(CreateSubmissionRequest request, Guid studentId)
    {
        var assignmentId = Guid.Parse(request.AssignmentId);
        var assignment = await _context.Assignments.FindAsync(assignmentId);
        if (assignment == null) return null;

        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == studentId);
        if (student == null) return null;

        var submission = new Submission
        {
            Id = Guid.NewGuid(),
            AssignmentId = assignmentId,
            StudentId = student.Id,
            AnswerText = request.AnswerText,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync();

        return new SubmissionResponse
        {
            Id = submission.Id.ToString(),
            AssignmentTitle = assignment.Title,
            StudentName = student.User.Username,
            AnswerText = submission.AnswerText,
            SubmittedAt = submission.SubmittedAt
        };
    }

    public async Task<SubmissionResponse?> GradeSubmissionAsync(Guid id, GradeSubmissionRequest request)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
                .ThenInclude(st => st.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null) return null;

        submission.Score = request.Score;
        submission.Feedback = request.Feedback;
        submission.GradedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new SubmissionResponse
        {
            Id = submission.Id.ToString(),
            AssignmentTitle = submission.Assignment.Title,
            StudentName = submission.Student.User.Username,
            AnswerText = submission.AnswerText,
            SubmittedAt = submission.SubmittedAt,
            Score = submission.Score,
            Feedback = submission.Feedback,
            GradedAt = submission.GradedAt
        };
    }
}