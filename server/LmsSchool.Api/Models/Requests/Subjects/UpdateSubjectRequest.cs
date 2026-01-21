using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Subjects;

public class UpdateSubjectRequest
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
}
