Things left to do:

    - Optimize the ListUsersStudent function in mongo.ts, which currently iterates over all classrooms. I added a classrooms field in user table so it should be easy to optimize
    - We need to add in the final DB an index on the email of the user's table. And an index on student's email in the classroom table.
    - When a teacher removes a student from a classroom we need to check if the students is in other classrooms so we don't completely remove his user instance of the DB but we only remove the current classroom from the string[] classrooms in the user table and we also remove the student from the current classroom.
    - We should allow only teachers to create new students so they are directly assigned to a classroom
    - Hashing passwords before writing in DB
    - Refresh the [name].vue page as soon as the accounts are updated.
    - In the teacher interface, it should be possible to generate a key pair for a single selected student. We have already started implementing this (see page/teacher/[name]/[name].vue).
    - Create a rank column in the teacher interface that assigns each student a rank based on the oldest transaction column.
    - When a teacher adds a student, an email should be sent to the student containing their email/username on the platform and a temporary password.
    - Create a signup system where the teacher can simply show a QR code to the class, and each student arrives on a signup page. Alternatively, implement something similar to Kahoot with a code that allows access to the game.
    - Automate the scenario generation system for the serious game by using an OpenAI key to generate the scenario, which will then be available on the student interface.
    - Improve the graphical interface.
    - Add a classrooms field in the User table that contains an array of all the classes the student is enrolled in. This will optimize the ListUsersStudent function in mongo.ts, which currently iterates over all classrooms.
    - If a teacher wants to add a student to their class, our function should add the student to both the users database and the specific classroom. However, if the student is already in a classroom, they will already be in the users database. This will cause an error when trying to add the student, as there cannot be duplicates in the users database.
    - Write the tsconfig.json
    - Implement security measures to restrict access to routes such as /admin or /teacher based on the user's role.
