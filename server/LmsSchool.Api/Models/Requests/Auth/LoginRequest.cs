using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.String;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Auth;

public class LoginRequest
{
    [Required]
    [Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}