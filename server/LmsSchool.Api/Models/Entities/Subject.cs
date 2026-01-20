using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Subject
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    
    [ForeignKey("Teacher")]
    public Guid TeacherId { get; set; }
    public Teacher Teacher { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public List<ClassSubject> ClassSubjects { get; set; } = new();
    public List<Material> Materials { get; set; } = new();
    public List<Assignment> Assignments { get; set; } = new();
}