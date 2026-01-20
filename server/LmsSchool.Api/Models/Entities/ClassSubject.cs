using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class ClassSubject
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("Class")]
    public Guid ClassId { get; set; }
    public Class Class { get; set; } = null!;
    
    [ForeignKey("Subject")]
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}