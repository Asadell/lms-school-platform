using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Teacher
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public string Nip { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    
    // Navigation
    public List<Subject> Subjects { get; set; } = new();
    public List<Class> HomeroomClasses { get; set; } = new();
}