using LMS.Models.Requests.Classes;
using LMS.Models.Responses.Classes;

namespace LMS.Services;

public interface IClassService
{
    Task<List<ClassResponse>> GetAllClassesAsync();
    Task<ClassResponse?> GetClassByIdAsync(Guid id);
    Task<ClassResponse> CreateClassAsync(CreateClassRequest request);
    Task<ClassResponse?> UpdateClassAsync(Guid id, UpdateClassRequest request);
    Task<bool> DeleteClassAsync(Guid id);
}