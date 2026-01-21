using Nedo.AspNet.Request.Validation.Attributes.Generic;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Materials;

public class UpdateMaterialRequest
{
    [MaxLength(200)]
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [MinLength(10)]
    [JsonPropertyName("content")]
    public string? Content { get; set; }
}