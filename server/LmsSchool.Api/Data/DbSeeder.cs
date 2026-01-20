using LMS.Models.Entities;
using BCrypt.Net;

namespace LMS.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        // Skip if data exists
        if (context.Users.Any()) return;

        // 1. ADMIN
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@lms.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"),
            Role = "admin",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(admin);

        // 2. TEACHER
        var teacherUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "teacher1",
            Email = "teacher1@lms.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher123"),
            Role = "teacher",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(teacherUser);

        var teacher = new Teacher
        {
            Id = Guid.NewGuid(),
            UserId = teacherUser.Id,
            Nip = "198001012000011001",
            Specialization = "Mathematics"
        };
        context.Teachers.Add(teacher);

        // 3. STUDENT
        var studentUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "student1",
            Email = "student1@lms.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student123"),
            Role = "student",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(studentUser);

        var student = new Student
        {
            Id = Guid.NewGuid(),
            UserId = studentUser.Id,
            Nis = "2025001",
            Grade = 10
        };
        context.Students.Add(student);

        // 4. CLASS
        var class10A = new Class
        {
            Id = Guid.NewGuid(),
            Name = "10A",
            GradeLevel = 10,
            AcademicYear = "2024/2025",
            HomeroomTeacherId = teacher.Id,
            CreatedAt = DateTime.UtcNow
        };
        context.Classes.Add(class10A);

        // 5. SUBJECT
        var mathSubject = new Subject
        {
            Id = Guid.NewGuid(),
            Name = "Mathematics",
            Code = "MATH1",
            TeacherId = teacher.Id,
            CreatedAt = DateTime.UtcNow
        };
        context.Subjects.Add(mathSubject);

        // 6. CLASS-SUBJECT
        var classSubject = new ClassSubject
        {
            Id = Guid.NewGuid(),
            ClassId = class10A.Id,
            SubjectId = mathSubject.Id,
            AssignedAt = DateTime.UtcNow
        };
        context.ClassSubjects.Add(classSubject);

        // 7. STUDENT-CLASS
        var classMember = new ClassMember
        {
            Id = Guid.NewGuid(),
            ClassId = class10A.Id,
            StudentId = student.Id,
            JoinedAt = DateTime.UtcNow
        };
        context.ClassMembers.Add(classMember);

        context.SaveChanges();
    }
}