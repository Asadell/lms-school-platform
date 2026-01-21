using LMS.Models.Requests.Subjects;
using LMS.Models.Responses.Subjects;

namespace LMS.Services;

public interface ISubjectService
{
    Task<List<SubjectResponse>> GetAllSubjectsAsync();
    Task<SubjectResponse?> GetSubjectByIdAsync(Guid id);
    Task<SubjectResponse?> CreateSubjectAsync(CreateSubjectRequest request);
    Task<SubjectResponse?> UpdateSubjectAsync(Guid id, UpdateSubjectRequest request);
    Task<bool> DeleteSubjectAsync(Guid id);
}