namespace LMS.Models.Responses.Subjects;

public class SubjectResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}