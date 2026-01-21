using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class ClassMember
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("Class")]
    public Guid ClassId { get; set; }
    public Class Class { get; set; } = null!;
    
    [ForeignKey("Student")]
    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}