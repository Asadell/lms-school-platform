using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.Uuid;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Submissions;

public class CreateSubmissionRequest
{
    [Required]
    [Uuid]
    [JsonPropertyName("assignment_id")]
    public string AssignmentId { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    [JsonPropertyName("answer_text")]
    public string AnswerText { get; set; } = string.Empty;
}