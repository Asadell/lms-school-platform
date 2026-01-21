using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.Numeric;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Classes;

public class UpdateClassRequest
{
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [Range(1, 12)]
    [JsonPropertyName("grade_level")]
    public int? GradeLevel { get; set; }

    [JsonPropertyName("academic_year")]
    public string? AcademicYear { get; set; }

    [JsonPropertyName("homeroom_teacher_user_id")]
    public string? HomeroomTeacherUserId { get; set; }
}