using LMS.Models.Requests.Submissions;
using LMS.Models.Responses.Submissions;

namespace LMS.Services;

public interface ISubmissionService
{
    Task<List<SubmissionResponse>> GetAllSubmissionsAsync();
    Task<SubmissionResponse?> GetSubmissionByIdAsync(Guid id);
    Task<SubmissionResponse?> CreateSubmissionAsync(CreateSubmissionRequest request, Guid studentId);
    Task<SubmissionResponse?> GradeSubmissionAsync(Guid id, GradeSubmissionRequest request);
}