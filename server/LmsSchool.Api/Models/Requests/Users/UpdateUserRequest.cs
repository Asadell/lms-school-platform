using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.String;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Users;

public class UpdateUserRequest
{
    [MinLength(3)]
    [MaxLength(50)]
    [AlphaNumeric]
    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]
    [MaxLength(100)]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [Required]
    [JsonPropertyName("is_active")]
    public bool IsActive { get; set; }
}