namespace LMS.Models.Responses.Submissions;

public class SubmissionResponse
{
    public string Id { get; set; } = string.Empty;
    public string AssignmentTitle { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string AnswerText { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int? Score { get; set; }
    public string? Feedback { get; set; }
    public DateTime? GradedAt { get; set; }
}