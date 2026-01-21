namespace LMS.Models.Responses.Auth;

using System.Text.Json.Serialization;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    
    [JsonPropertyName("profileId")]
    public string? ProfileId { get; set; }
}