using LMS.Models.Requests.Materials;
using LMS.Models.Responses.Materials;

namespace LMS.Services;

public interface IMaterialService
{
    Task<List<MaterialResponse>> GetAllMaterialsAsync();
    Task<MaterialResponse?> GetMaterialByIdAsync(Guid id);
    Task<MaterialResponse?> CreateMaterialAsync(CreateMaterialRequest request);
    Task<MaterialResponse?> UpdateMaterialAsync(Guid id, UpdateMaterialRequest request);
    Task<bool> DeleteMaterialAsync(Guid id);
}