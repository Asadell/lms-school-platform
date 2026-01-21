using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.Date;
using Nedo.AspNet.Request.Validation.Attributes.Uuid;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Materials;

public class CreateMaterialRequest
{
    [Required]
    [MinLength(5)]
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [Required]
    [Uuid]
    [JsonPropertyName("subject_id")]
    public string SubjectId { get; set; } = string.Empty;

    [Required]
    [DateFormat("yyyy-MM-dd")]
    [PastDate(2025, 1, 21)]
    [JsonPropertyName("publish_date")]
    public string PublishDate { get; set; } = string.Empty;
}