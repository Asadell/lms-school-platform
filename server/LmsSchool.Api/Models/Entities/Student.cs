using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Student
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public string Nis { get; set; } = string.Empty;
    public int Grade { get; set; }
    
    // Navigation
    public List<ClassMember> ClassMembers { get; set; } = new();
    public List<Submission> Submissions { get; set; } = new();
}