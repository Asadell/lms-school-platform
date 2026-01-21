using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Assignment
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("Subject")]
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public int MaxScore { get; set; } = 100;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public List<Submission> Submissions { get; set; } = new();
}