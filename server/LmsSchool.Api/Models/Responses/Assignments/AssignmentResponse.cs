namespace LMS.Models.Responses.Assignments;

public class AssignmentResponse
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public int MaxScore { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}