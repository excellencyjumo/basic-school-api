# Express School-API

This is a RESTful API built with Express.js for managing basic school information. It provides endpoints for creating, reading, updating, and deleting data related to students, teachers, courses, and grades.

## Installation

1. Clone the repository: `git clone https://github.com/excellencyjumo/basic-school-api.git`
2. Install dependencies: `npm install`

## Usage

1. Start the server: `npm start`
2. Access the API endpoints using a tool like Postman or cURL.

## API Endpoints

### Students

- `GET /students` - Get all students
- `GET /students/:id` - Get a specific student by ID
- `POST /students` - Create a new student
- `PUT /students/:id` - Update a student by ID
- `DELETE /students/:id` - Delete a student by ID

### Teachers

- `GET /teachers` - Get all teachers
- `GET /teachers/:id` - Get a specific teacher by ID
- `POST /teachers` - Create a new teacher
- `PUT /teachers/:id` - Update a teacher by ID
- `DELETE /teachers/:id` - Delete a teacher by ID

### Courses

- `GET /courses` - Get all courses
- `GET /courses/:id` - Get a specific course by ID
- `POST /courses` - Create a new course
- `PUT /courses/:id` - Update a course by ID
- `DELETE /courses/:id` - Delete a course by ID

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
