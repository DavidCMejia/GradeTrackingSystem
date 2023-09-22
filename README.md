# GradeTrackingSystem
Grading Tracking System

The Grading Tracking System is a web application designed to help educational institutions efficiently manage student grades. It is built using a modern tech stack that includes PostgreSQL as the database system, TypeScript, React, and Next.js for the frontend, and Python with Django for the backend. The user interface is enhanced with Material-UI components, and user authentication is powered by Auth0.

Prerequisites: 
Before you start the backend server, make sure you have Docker Compose installed on your system. You can download it from Docker Compose. If you don't already have Python and Django installed, you can do so by following these steps:

Install Python: Download and install the latest version of Python from python.org.

1. Make sure the environment variables for Django are set up correctly. You can do this by following the steps in the Django documentation. File .env (must be in /backend)
2. Make sure the environtment variables for Next.js are set up correctly. You can do this by following the steps in the Next.js documentation. File .env.local (must be in /gradesfront)

BACKEND SETUP
Navigate to the backend directory:
cd backend

1. docker compose up -d 
2. For linux source venv/bin/activate or for windows .\venv\Scripts\Activate
3. if step 2 doesnt work, delete venv folder and create a new venv "python -m venv venv" then try again step 2
4. pip install -r requirements.txt
5. python manage.py migrate
6. python manage.py runserver

This will launch the backend server, which you can access in your web browser at http://localhost:8000.

FRONTEND SETUP
Navigate to the frontend directory:

cd frontend
cd gradesfront

1. Install the required Node.js packages: yarn
2. Start the Next.js development server: yarn dev.

This will launch the frontend application, which you can access in your web browser at http://localhost:3000.

Features
The Grading Tracking System includes the following features:

User authentication and management powered by Auth0.
User profiles, including settings, for both professors and students.
Course and grade tracking for classrooms and universities.

Permissions/roles:

1. Student: Can view their own grades, all schedules and all courses. He can also enroll to the courses he wants. However he cannot edit or delete anything, look at other students grades or go to the admin module.
2. Regular Professor: Can view all grades, all schedules and own courses. He can also edit and delete own courses and grades. However he cannot enroll to courses, look at other students grades but can not delete accounts. He can provide admin password to gain access to admin module.
3. Admin Professor: Can view all grades, all schedules and all courses. He can also edit and delete courses and grades. He can also look at other students grades. He can also go to the admin module.

| Role                | Student             | Regular Professor   | Admin Professor     |
|-------------------- |:-------------------:|:-------------------:|:-------------------:|
| View Own Grades     |         X           |         X           |         X           |
| View All Grades     |         -           |         X           |         X           |
| View All Schedules  |         X           |         X           |         X           |
| View All Courses    |         X           |         -           |         X           |
| Enroll in Courses   |         X           |         -           |         -           |
| Edit Own Courses    |         -           |         X           |         X           |
| Delete Own Courses  |         -           |         X           |         X           |
| Edit All Grades     |         -           |         X           |         X           |
| Delete All Grades   |         -           |         X           |         X           |
| CRUD All Grades     |     -               |         -           |         X           |
| View All Grades     |         -           |         -           |         X           |
| Admin Module Access |         -           | Admin Password      |         X           |
| Admin Tasks         |         -           |         -           |         X           |
| Delete, Edit Accounts |       -           |         -           |         X           |

ORDER:
Here are a few suggestions to help you get started:
1. Verify your info, then use Professor Role (when you verify yourself as a professor you will create a new professor in the database)
2. Create a student
3. When the student is created, create a course and enroll the student to the course (You can assign multiple students to a course but only one professor)
4. Create a grade for the student
5. Create a Schedule

Note: If you want admin access, select Professor Role then click access and user "admin" as a user and password.
