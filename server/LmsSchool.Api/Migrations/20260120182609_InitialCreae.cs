using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LmsSchool.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreae : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    username = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "students",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nis = table.Column<string>(type: "text", nullable: false),
                    grade = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_students", x => x.id);
                    table.ForeignKey(
                        name: "fk_students_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "teachers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    nip = table.Column<string>(type: "text", nullable: false),
                    specialization = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_teachers", x => x.id);
                    table.ForeignKey(
                        name: "fk_teachers_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "classes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    grade_level = table.Column<int>(type: "integer", nullable: false),
                    academic_year = table.Column<string>(type: "text", nullable: false),
                    homeroom_teacher_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_classes", x => x.id);
                    table.ForeignKey(
                        name: "fk_classes_teachers_homeroom_teacher_id",
                        column: x => x.homeroom_teacher_id,
                        principalTable: "teachers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "subjects",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
                    teacher_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_subjects", x => x.id);
                    table.ForeignKey(
                        name: "fk_subjects_teachers_teacher_id",
                        column: x => x.teacher_id,
                        principalTable: "teachers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "class_members",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    student_id = table.Column<Guid>(type: "uuid", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_class_members", x => x.id);
                    table.ForeignKey(
                        name: "fk_class_members_classes_class_id",
                        column: x => x.class_id,
                        principalTable: "classes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_class_members_students_student_id",
                        column: x => x.student_id,
                        principalTable: "students",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "assignments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    subject_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    max_score = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_assignments", x => x.id);
                    table.ForeignKey(
                        name: "fk_assignments_subjects_subject_id",
                        column: x => x.subject_id,
                        principalTable: "subjects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "class_subjects",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    subject_id = table.Column<Guid>(type: "uuid", nullable: false),
                    assigned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_class_subjects", x => x.id);
                    table.ForeignKey(
                        name: "fk_class_subjects_classes_class_id",
                        column: x => x.class_id,
                        principalTable: "classes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_class_subjects_subjects_subject_id",
                        column: x => x.subject_id,
                        principalTable: "subjects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "materials",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    subject_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    publish_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_materials", x => x.id);
                    table.ForeignKey(
                        name: "fk_materials_subjects_subject_id",
                        column: x => x.subject_id,
                        principalTable: "subjects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "submissions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    assignment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    student_id = table.Column<Guid>(type: "uuid", nullable: false),
                    answer_text = table.Column<string>(type: "text", nullable: false),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    score = table.Column<int>(type: "integer", nullable: true),
                    feedback = table.Column<string>(type: "text", nullable: true),
                    graded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_submissions", x => x.id);
                    table.ForeignKey(
                        name: "fk_submissions_assignments_assignment_id",
                        column: x => x.assignment_id,
                        principalTable: "assignments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_submissions_students_student_id",
                        column: x => x.student_id,
                        principalTable: "students",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_assignments_subject_id",
                table: "assignments",
                column: "subject_id");

            migrationBuilder.CreateIndex(
                name: "ix_class_members_class_id",
                table: "class_members",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "ix_class_members_student_id",
                table: "class_members",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "ix_class_subjects_class_id",
                table: "class_subjects",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "ix_class_subjects_subject_id",
                table: "class_subjects",
                column: "subject_id");

            migrationBuilder.CreateIndex(
                name: "ix_classes_homeroom_teacher_id",
                table: "classes",
                column: "homeroom_teacher_id");

            migrationBuilder.CreateIndex(
                name: "ix_materials_subject_id",
                table: "materials",
                column: "subject_id");

            migrationBuilder.CreateIndex(
                name: "ix_students_nis",
                table: "students",
                column: "nis",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_students_user_id",
                table: "students",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_subjects_code",
                table: "subjects",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_subjects_teacher_id",
                table: "subjects",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "ix_submissions_assignment_id",
                table: "submissions",
                column: "assignment_id");

            migrationBuilder.CreateIndex(
                name: "ix_submissions_student_id",
                table: "submissions",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "ix_teachers_nip",
                table: "teachers",
                column: "nip",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_teachers_user_id",
                table: "teachers",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_username",
                table: "users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "class_members");

            migrationBuilder.DropTable(
                name: "class_subjects");

            migrationBuilder.DropTable(
                name: "materials");

            migrationBuilder.DropTable(
                name: "submissions");

            migrationBuilder.DropTable(
                name: "classes");

            migrationBuilder.DropTable(
                name: "assignments");

            migrationBuilder.DropTable(
                name: "students");

            migrationBuilder.DropTable(
                name: "subjects");

            migrationBuilder.DropTable(
                name: "teachers");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
