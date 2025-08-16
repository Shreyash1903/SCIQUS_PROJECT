"""
Database utilities for Student Course Management System
"""
from django.db import connection
from typing import Dict, List, Any


class DatabaseManager:
    """Custom database manager with stored procedures and optimized queries"""

    @staticmethod
    def create_stored_procedures():
        """Create stored procedures for common operations"""
        procedures = [
            """
            CREATE OR REPLACE FUNCTION insert_student_with_course(
                p_username VARCHAR(150),
                p_email VARCHAR(254),
                p_first_name VARCHAR(30),
                p_last_name VARCHAR(30),
                p_password VARCHAR(128),
                p_course_id UUID,
                p_phone VARCHAR(15) DEFAULT ''
            ) RETURNS UUID AS $$
            DECLARE
                user_id INTEGER;
                student_id UUID;
            BEGIN
                -- Insert user
                INSERT INTO auth_user (
                    username, email, first_name, last_name, password,
                    phone, role, is_active, date_joined
                ) VALUES (
                    p_username, p_email, p_first_name, p_last_name, p_password,
                    p_phone, 'student', TRUE, NOW()
                ) RETURNING id INTO user_id;
                
                -- Insert student
                INSERT INTO students (
                    student_id, user_id, course_id, enrollment_date, status
                ) VALUES (
                    gen_random_uuid(), user_id, p_course_id, CURRENT_DATE, 'active'
                ) RETURNING student_id INTO student_id;
                
                RETURN student_id;
            END;
            $$ LANGUAGE plpgsql;
            """,

            """
            CREATE OR REPLACE FUNCTION update_student_course(
                p_student_id UUID,
                p_new_course_id UUID
            ) RETURNS BOOLEAN AS $$
            DECLARE
                course_duration INTEGER;
                enrollment_date DATE;
            BEGIN
                -- Get course duration and student enrollment date
                SELECT c.course_duration, s.enrollment_date
                INTO course_duration, enrollment_date
                FROM courses c, students s
                WHERE c.course_id = p_new_course_id 
                AND s.student_id = p_student_id;
                
                -- Update student course
                UPDATE students 
                SET course_id = p_new_course_id,
                    updated_at = NOW()
                WHERE student_id = p_student_id;
                
                RETURN FOUND;
            END;
            $$ LANGUAGE plpgsql;
            """,

            """
            CREATE OR REPLACE FUNCTION get_students_by_course(
                p_course_id UUID
            ) RETURNS TABLE (
                student_id UUID,
                student_number VARCHAR(20),
                full_name VARCHAR(300),
                email VARCHAR(254),
                status VARCHAR(20),
                enrollment_date DATE
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    s.student_id,
                    s.student_number,
                    CONCAT(u.first_name, ' ', u.last_name) as full_name,
                    u.email,
                    s.status,
                    s.enrollment_date
                FROM students s
                JOIN auth_user u ON s.user_id = u.id
                WHERE s.course_id = p_course_id
                ORDER BY s.student_number;
            END;
            $$ LANGUAGE plpgsql;
            """,

            """
            CREATE OR REPLACE FUNCTION delete_student_safe(
                p_student_id UUID
            ) RETURNS BOOLEAN AS $$
            DECLARE
                user_id INTEGER;
            BEGIN
                -- Get user ID
                SELECT user_id INTO user_id FROM students WHERE student_id = p_student_id;
                
                -- Delete student record
                DELETE FROM students WHERE student_id = p_student_id;
                
                -- Delete user record
                DELETE FROM auth_user WHERE id = user_id;
                
                RETURN FOUND;
            END;
            $$ LANGUAGE plpgsql;
            """
        ]

        with connection.cursor() as cursor:
            for procedure in procedures:
                try:
                    cursor.execute(procedure)
                except Exception as e:
                    print(f"Error creating stored procedure: {e}")

    @staticmethod
    def call_insert_student_with_course(student_data: Dict[str, Any]) -> str:
        """Call stored procedure to insert student with course"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT insert_student_with_course(%s, %s, %s, %s, %s, %s, %s)
            """, [
                student_data['username'],
                student_data['email'],
                student_data['first_name'],
                student_data['last_name'],
                student_data['password'],
                student_data['course_id'],
                student_data.get('phone', '')
            ])
            return cursor.fetchone()[0]

    @staticmethod
    def call_update_student_course(student_id: str, new_course_id: str) -> bool:
        """Call stored procedure to update student course"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT update_student_course(%s, %s)
            """, [student_id, new_course_id])
            return cursor.fetchone()[0]

    @staticmethod
    def call_get_students_by_course(course_id: str) -> List[Dict[str, Any]]:
        """Call stored procedure to get students by course"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM get_students_by_course(%s)
            """, [course_id])
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]

    @staticmethod
    def call_delete_student_safe(student_id: str) -> bool:
        """Call stored procedure to safely delete student"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT delete_student_safe(%s)
            """, [student_id])
            return cursor.fetchone()[0]

    @staticmethod
    def get_course_statistics() -> Dict[str, Any]:
        """Get comprehensive course statistics"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.course_id,
                    c.course_name,
                    c.course_code,
                    COUNT(s.student_id) as total_students,
                    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_students,
                    COUNT(CASE WHEN s.status = 'graduated' THEN 1 END) as graduated_students
                FROM courses c
                LEFT JOIN students s ON c.course_id = s.course_id
                WHERE c.is_active = TRUE
                GROUP BY c.course_id, c.course_name, c.course_code
                ORDER BY c.course_name
            """)
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]

    @staticmethod
    def get_student_enrollment_trends() -> Dict[str, Any]:
        """Get student enrollment trends by month"""
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    DATE_TRUNC('month', enrollment_date) as month,
                    COUNT(*) as enrollments,
                    c.course_name
                FROM students s
                JOIN courses c ON s.course_id = c.course_id
                WHERE s.enrollment_date >= NOW() - INTERVAL '12 months'
                GROUP BY DATE_TRUNC('month', enrollment_date), c.course_name
                ORDER BY month DESC, c.course_name
            """)
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
