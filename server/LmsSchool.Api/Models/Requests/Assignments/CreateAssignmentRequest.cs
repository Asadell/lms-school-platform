using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.Numeric;
using Nedo.AspNet.Request.Validation.Attributes.Date;
using Nedo.AspNet.Request.Validation.Attributes.Uuid;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Assignments;

public class CreateAssignmentRequest
{
    [Required]
    [MinLength(5)]
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [FutureDate(2025, 1, 21)]
    [JsonPropertyName("due_date")]
    public string DueDate { get; set; } = string.Empty;

    [Required]
    [PositiveNumber]
    [MaxValue(100)]
    [JsonPropertyName("max_score")]
    public int MaxScore { get; set; }

    [Required]
    [Uuid]
    [JsonPropertyName("subject_id")]
    public string SubjectId { get; set; } = string.Empty;
}