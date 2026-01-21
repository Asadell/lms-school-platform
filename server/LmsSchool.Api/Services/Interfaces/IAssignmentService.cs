using LMS.Models.Requests.Assignments;
using LMS.Models.Responses.Assignments;

namespace LMS.Services;

public interface IAssignmentService
{
    Task<List<AssignmentResponse>> GetAllAssignmentsAsync();
    Task<AssignmentResponse?> GetAssignmentByIdAsync(Guid id);
    Task<AssignmentResponse?> CreateAssignmentAsync(CreateAssignmentRequest request);
    Task<AssignmentResponse?> UpdateAssignmentAsync(Guid id, UpdateAssignmentRequest request);
    Task<bool> DeleteAssignmentAsync(Guid id);
}