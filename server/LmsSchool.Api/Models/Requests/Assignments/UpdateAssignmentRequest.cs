using Nedo.AspNet.Request.Validation.Attributes.Date;
using Nedo.AspNet.Request.Validation.Attributes.Numeric;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Assignments;

public class UpdateAssignmentRequest
{
    [FutureDate(2025, 1, 21)]
    [JsonPropertyName("due_date")]
    public string? DueDate { get; set; }

    [Range(1, 100)]
    [JsonPropertyName("max_score")]
    public int? MaxScore { get; set; }
}