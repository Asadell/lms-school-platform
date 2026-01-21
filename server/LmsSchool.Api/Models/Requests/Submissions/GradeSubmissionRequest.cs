using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.Numeric;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Submissions;

public class GradeSubmissionRequest
{
    [Required]
    [Range(0, 100)]
    [JsonPropertyName("score")]
    public int Score { get; set; }

    [MinLength(10)]
    [MaxLength(500)]
    [JsonPropertyName("feedback")]
    public string? Feedback { get; set; }
}