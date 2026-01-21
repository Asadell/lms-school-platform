using Nedo.AspNet.Request.Validation.Attributes.Generic;
using Nedo.AspNet.Request.Validation.Attributes.String;
using System.Text.Json.Serialization;

namespace LMS.Models.Requests.Auth;

public class RegisterRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    [AlphaNumeric]
    [NoWhitespace]
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]
    [MaxLength(100)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;
}