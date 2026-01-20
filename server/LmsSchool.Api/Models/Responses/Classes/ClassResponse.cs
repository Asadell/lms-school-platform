namespace LMS.Models.Responses.Classes;

public class ClassResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int GradeLevel { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public string? HomeroomTeacher { get; set; }
    public DateTime CreatedAt { get; set; }
}