# GradeTrackingSystem
Grading Tracking System

The Grading Tracking System is a web application designed to help educational institutions efficiently manage student grades. It is built using a modern tech stack that includes PostgreSQL as the database system, TypeScript, React, and Next.js for the frontend, and Python with Django for the backend. The user interface is enhanced with Material-UI components, and user authentication is powered by Auth0.

Prerequisites: 
Before you start the backend server, make sure you have Docker Compose installed on your system. You can download it from Docker Compose. If you don't already have Python and Django installed, you can do so by following these steps:

Install Python: Download and install the latest version of Python from python.org.

1. Make sure the environment variables for Django are set up correctly. You can do this by following the steps in the Django documentation. File .env
2. Make sure the environtment variables for Next.js are set up correctly. You can do this by following the steps in the Next.js documentation. File .env.local


BACKEND SETUP
Navigate to the backend directory:
cd backend

1. docker compose up -d 
2. source venv/bin/activate
3. pip install -r requirements.txt
4. python manage.py runserver

This will launch the backend server, which you can access in your web browser at http://localhost:8000.

FRONTEND SETUP
Navigate to the frontend directory:

cd frontend
cd gradesfront

Install the required Node.js packages:
yarn

Start the Next.js development server:
yarn dev.
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
| View All Courses    |         X           |         X           |         X           |
| Enroll in Courses   |         X           |         -           |         -           |
| Edit Own Courses    |         -           |         X           |         X           |
| Delete Own Courses  |         -           |         X           |         X           |
| Edit Own Grades     |         -           |         X           |         X           |
| Delete Own Grades   |         -           |         X           |         X           |
| CRUD All Grades     |     -               |         -           |         X           |
| View All Grades     |         -           |         -           |         X           |
| Admin Module Access |         -           | Admin Password      |         X           |
| Admin Tasks         |         -           |         -           |         X           |
| Delete, Edit Accounts |       -           |         -           |         X           |

