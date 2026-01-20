using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Class
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int GradeLevel { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    
    [ForeignKey("HomeroomTeacher")]
    public Guid? HomeroomTeacherId { get; set; }
    public Teacher? HomeroomTeacher { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public List<ClassMember> ClassMembers { get; set; } = new();
    public List<ClassSubject> ClassSubjects { get; set; } = new();
}