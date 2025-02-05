1. Immediate Tasks

Backend & API

Finalize the centralized callApi structure and refactor all API calls in the project.
Implement a mongo function to calculate the rank of students based on the oldest transaction
Implement password hashing for user authentication (bcrypt or similar library).
Create a secure authentication middleware to restrict access to routes (/admin, /teacher, /student) based on user roles.
Add a reset classroom that removes the student adresses

DB

Add a classrooms field in the User table that contains an array of all the classes the student is enrolled in. This will time optimize the ListUsersStudent function in mongo.ts, which currently iterates over all classrooms.
Fix the "duplicate student" issue by ensuring students can be added to multiple classrooms without conflicting in the users database.
We should only allow teachers to add students so they directly have a classroom assigned. The admin only adds teachers
When a teacher adds a student, an email should be sent to the student containing their email/username on the platform and a temporary password. ( using magic link for example )

Frontend

Refresh the [name].vue teacher page automatically after updates to student accounts.
Implement the ability to generate key pairs for individual students from the teacher interface.

2. Short-Term Features

Implement a signup system for students using:

    QR codes for easy onboarding (scanning directs students to a pre-filled signup page).
    A Kahoot-like code system, allowing students to join with a classroom code.

Automate scenario generation for the game using OpenAI’s API to dynamically create tasks and scenarios.
Allow teachers to send emails to students with:

    Login credentials (email/temporary password).
    Classroom joining instructions.

Security

Add protection for API calls.
Enhance input validation and sanitation for forms (e.g., email validation, preventing script injections).

    Implement rate limiting for endpoints like login, signup, and classroom creation.

Database

    Design a seeding script for MongoDB to generate mock data for classrooms, teachers, and students for testing. ( example using Mongoose and Faker.js)

3. Medium-Term Goal

Add a game dashboard for students to:

    View current game stages.
    Track progress and rank.
    Access generated scenarios and tasks.

Implement a leaderboard feature for classrooms to encourage competition.

Enable teachers to reset game stages for specific students or the entire class.

UI/UX Design

Improve visual elements (e.g., buttons, modals, layouts).
Create a https://www.xrpl-commons.org/ like design

App should work for mobile devices (e.g., QR code scanning, game interfaces).

4. Long-Term Goals

Advanced Features

Integrate a progress tracker for teachers to monitor student performance.
Allow students to view hints or ask for help during the game (e.g., with token deductions for hints).

Add an achievement system for students, unlocking badges for milestones.

Create a demo mode for prospective teachers to test the app without full registration.

Build a tutorial/onboarding guide for teachers and students.
