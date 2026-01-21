using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Submission
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("Assignment")]
    public Guid AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;
    
    [ForeignKey("Student")]
    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;
    
    public string AnswerText { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    // Grading
    public int? Score { get; set; }
    public string? Feedback { get; set; }
    public DateTime? GradedAt { get; set; }
}