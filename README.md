# modular_nestjs_script

This project serves as a guide to modular architecture in back-end development, specifically tailored for the NestJS framework. It provides practical examples and in-depth discussions on architectural patterns such as the Script Pattern vs. Domain Model, various types of models in back-end systems, and the role of services in mapping requests to responses. The guide also covers aspects of service development, dependency injection, serialization/deserialization processes, and modern development techniques like debugging, all within the context of NestJS. By the end of this project, participants will gain a comprehensive understanding of how to design and implement maintainable, scalable, and robust back-end systems using modular architecture principles as demonstrated through NestJS.

## Features

- **Modular Architecture**: Utilizes NestJS modules to organize the codebase, making it easier to maintain and scale.
- **Database Integration**: Integrates with SQLite using TypeORM for data management.
- **Authentication and Authorization**: Implements an authentication guard to manage access to certain endpoints.
- **CRUD Operations**: Supports full CRUD operations for entities like customers, products, and categories through RESTful APIs.
- **Loyalty Program**: Includes a loyalty program system where customers earn points on purchases.
- **Seeding Script**: Provides a seeding script to populate the database with initial data for testing and development purposes.
- **Error Handling**: Implements robust error handling strategies to manage and respond to various error states.
- **Static Assets Management**: Serves static assets like CSS and JavaScript for the frontend.
- **Custom Middleware**: Uses custom middleware for functionalities like cookie parsing.

## Prerequisites

- Node.js
- npm or yarn

## Installation

- Clone the repository
- Install the dependencies

```bash
npm install
```

## Seeding the database

```bash
npm run seed
```

## Running the application

- Start the application

```bash
npm run build
npm run start
```

The application will be running on [http://localhost:3000](http://localhost:3000)
