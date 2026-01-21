using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.String;
using Nedo.AspNet.Request.Validation.Attributes.Uuid;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Subjects;

public class CreateSubjectRequest
{
    [Required]
    [AlphaSpaceQuote]
    [MaxLength(100)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [UpperCaseOnly]
    [ExactLength(5)]
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [Required]
    [Uuid]
    [JsonPropertyName("teacher_id")]
    public string TeacherId { get; set; } = string.Empty;
}