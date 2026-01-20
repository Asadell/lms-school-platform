using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Models.Entities;

public class Material
{
    [Key]
    public Guid Id { get; set; }
    
    [ForeignKey("Subject")]
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime PublishDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}