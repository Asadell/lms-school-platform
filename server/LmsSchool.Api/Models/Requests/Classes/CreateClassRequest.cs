using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.Numeric;
using Nedo.AspNet.Request.Validation.Attributes.String;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Classes;

public class CreateClassRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(1, 12)]
    [JsonPropertyName("grade_level")]
    public int GradeLevel { get; set; }

    [Required]
    [JsonPropertyName("academic_year")]
    public string AcademicYear { get; set; } = string.Empty;

    [JsonPropertyName("homeroom_teacher_user_id")]
    public string? HomeroomTeacherUserId { get; set; }
}