Overview
Wanderlust is a full stack web application that allows users to create, explore, and review listings. The application is built using Node.js, Express, and MongoDB, following MVC architecture and RESTful design principles. It includes secure authentication, role-based authorization, session management, and cloud-based image handling.
The project is deployed in a production environment and demonstrates real-world backend development practices.

Features

Core Functionality:- 
•	Create, read, update, and delete listings 
•	Add and manage reviews for listings 
•	Search functionality for listings 
•	Server-side rendered UI using EJS 

Authentication & Authorization:- 
•	User authentication using Passport.js (Local Strategy) 
•	Session-based login with persistent storage 
•	Role-based access control: 
o	Only listing owners can edit/delete listings 
o	Only review authors can delete reviews 
•	Route protection using middleware 

Data Handling & Scalability:- 
•	Pagination implemented for handling large datasets 
•	Filtering system for refined search results 
•	MongoDB Atlas used for cloud database storage 
•	Mongoose used for schema modeling and validation 

Media & Integrations:- 
•	Image upload using Multer 
•	Cloud storage integration for media handling 
•	Map integration for location-based listing visualization 

Backend Architecture:- 
•	MVC architecture for separation of concerns 
•	RESTful routing structure 
•	Reusable middleware for: 
o	Authentication 
o	Authorization 
o	Validation 
•	Centralized error handling with custom error classes 
•	Async error handling using wrapper functions 

Session & Security:- 
•	Session management using express-session 
•	Persistent session storage using connect-mongo 
•	Secure cookies with expiration and HTTP-only flags 
•	Environment variable management using dotenv 

Developer Experience:- 
•	API testing and documentation using Postman / Swagger 
•	Clean and scalable project structure 

Deployment:
•	Fully deployed on Render 
•	Uses cloud database and environment configuration 

Tech Stack:- 
Backend: Node.js, Express.js| 
Frontend: EJS, Bootstrap| 
Database: MongoDB Atlas, Mongoose| 
Authentication: Passport.js| 
Session Management: Express-session, Connect-Mongo| 
File Upload: Multer| 
Other Tools: Dotenv, Method-Override, Connect-Flash| 

