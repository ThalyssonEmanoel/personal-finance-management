# Personal finance management

This is a personal finance management project designed to help users track their expenses, financial goals, and monthly reports.

---

## 🔎 Context
Nowadays, many people struggle to keep track of their income and expenses, which can hurt their financial control. To help with that, this project aims to build a web app where users can log their income and expenses and view them through interactive charts — making it easier to stay on top of their finances.

---

## 🎯 Objectives

### General objectives
Develop a web-based system for personal finance management, enabling users to record and visualize their income and expenses in order to promote better financial control and organization.

### Specific objectives
1. Investigate the main challenges individuals face in managing their monthly expenses;
2. Elicit the necessary requirements for the development of a website and API focused on personal finance management;
3. Design a model the database architecture;
4. Develop, test, and document the API;
5. Create end-user documentation.

---

## ✅ Requirements

Requirements describe what the system must do and the constraints it must operate under. They guide the development process and ensure the final product meets user needs and expectations.

- **Functional Requirements** specify the core features and behaviors the system must provide, such as user authentication, transaction management, and report generation.
- **Nonfunctional Requirements** define the quality attributes and constraints of the system, such as performance, security, usability, and reliability. 

### 📌 Functional Requirements

| **ID**   | **Requirement**                                                                                        | **Priority** | **Status**  |
| -------- | ------------------------------------------------------------------------------------------------------ | ------------ | ----------- |
| **RF01** | The system should allow users to create an account.                                                    | High         | Implemented |
| **RF02** | The system should allow users to log in.                                                               | High         | Implemented |
| **RF03** | The system should let users add their income and expenses.                                             | High         | Implemented |
| **RF04** | The system should let users add income and expenses with installments or recurring entries.            | High         | Implemented |
| **RF05** | The system should allow users to export their transactions recorded in the system.                     | Medium       | To do       |
| **RF06** | The system should display dashboards showing income and expenses.                                      | Medium       | To do       |
| **RF07** | The system should let users pick a date from the calendar and display data based on the selected date. | Medium       | To do       |
| **RF08** | The system should let users set monthly goals for each income or expense they add.                     | High         | Implemented |
| **RF09** | The system should display a chart that shows a comparison between users goals and transactions.        | Medium       | To do       |
| **RF10** | The system should allow users to manage their accounts.                                                | High         | Implemented |
| **RF11** | The system should allow users to manage transfers between their accounts registered in the system.     | High         | To do       |



### ⚙️ Nonfunctional Requirements

| **ID**    | **Description**                                                                                                                            | **Priority** | **Status**  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------- |
| **RNF01** | The login process should respond in 3 seconds or less.                                                                                     | High         | Implemented |
| **RNF02** | The system should be secure and protect user data.                                                                                         | High         | Implemented |
| **RNF03** | The system should be easy and intuitive to use.                                                                                            | Medium       | To do       |
| **RNF04** | The system must calculate installment values and add the remainder of the division to the last installment.                                | High         | Implemented |
| **RNF05** | The system must calculate recurring transaction values and automatically add a new transaction equal to the previous one using a cron job. | High         | Implemented |
| **RNF06** | The system should handle basic math operations to generate charts.                                                                         | Medium       | To do       |
| **RNF07** | The system should allow users to search for expenses or income based on the applied filters.                                               | Medium       | Implemented |

---
## 🧱 Architecture Overview

The system follows a layered architecture organized in the following structure:

### **Presentation Layer (Routes & Controllers)**
- **Routes** (`src/routes/`): Define API endpoints and handle HTTP requests
- **Controllers** (`src/controllers/`): Process incoming requests, validate data, and coordinate responses
- **Middlewares** (`src/middlewares/`): Handle authentication, authorization, error handling, and file uploads

### **Business Logic Layer (Services)**
- **Services** (`src/services/`): Implement core business logic and domain rules
- **Validation** (`src/schemas/`): Data validation schemas using Zod
- **Background Jobs**: Cron jobs for recurring transactions and installment processing

### **Data Access Layer (Repositories)**
- **Repositories** (`src/repositories/`): Abstract database operations and provide data access methods
- **Prisma ORM** (`src/generated/`): Database client generation and schema management
- **Database Models** (`prisma/schema.prisma`): Define data models and relationships

### **Database Layer**
- **MySQL Database**: Persistent data storage with the following main entities:
  - Users (authentication and user management)
  - Accounts (financial accounts)
  - Transactions (income and expenses)
  - Payment Methods (payment options)
  - Bank Transfers (account-to-account transfers)
  - Goals (financial targets)

### **Supporting Components**
- **Documentation** (`src/docs/`): API documentation with Swagger/OpenAPI
- **File Storage** (`src/uploads/`): Static file storage for user avatars and attachments
- **Testing** (`src/test/`): Unit and integration tests
- **Utilities** (`src/utils/`): Helper functions and common utilities
- **Seed Data** (`src/seed/`): Database initialization scripts

### **Infrastructure**
- **Docker**: Containerization for development and deployment
- **Node.js/Express**: Runtime environment and web framework
- **Prisma**: Database ORM and migration management

The architecture promotes separation of concerns, making the system maintainable, testable, and scalable while ensuring clear data flow from the API endpoints down to the database layer.

---

## 🧪 Testing

Unit and integration tests are implemented using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest). Tests are focused on:

### **Testing Strategy**
The project adopts a focused testing approach, concentrating on the **3 main routes** that represent the core functionality of the personal finance management system:

1. **Authentication Routes** (`/login`, `/register`) - User authentication and authorization
2. **User Management Routes** (`/users`) - User CRUD operations and profile management  
3. **Transaction Routes** (`/transactions`) - Financial transactions (income/expenses) management
4. **Bank Transfer Routes** (`/BankTransfer`) - Transfer between accounts management

### **Test Organization**
```
src/test/
├── integração/          # Integration tests
│   ├── user.spec.js     # User management tests
│   └── account.spec.js  # Account management tests
└── unitário/            # Unit tests (planned)
```

### **Testing Tools & Configuration**
- **Jest**: Testing framework with ES6 modules support
- **Supertest**: HTTP assertions for API endpoint testing
- **Faker.js**: Generate realistic test data
- **Coverage Reports**: Generated using Jest's built-in coverage tools
- **Test Execution**: Uses `--experimental-vm-modules` flag for ES6 module compatibility

### **Test Structure**
Each test suite follows a consistent pattern:
- **Setup**: Authentication and test data preparation using `beforeAll()`
- **Happy Path Tests**: Validate successful operations with valid inputs
- **Sad Path Tests**: Verify proper error handling with invalid inputs
- **CRUD Operations**: Complete lifecycle testing (Create, Read, Update, Delete)
- **Data Validation**: Schema validation and business rule enforcement

### **Test Coverage**
- **Integration Tests**: API endpoints with real database interactions
- **Authentication Flow**: Login, token validation, and protected routes
- **Data Persistence**: Database operations and data integrity
- **Error Handling**: Validation errors, not found scenarios, and conflict resolution

### **Running Tests**
```bash
npm test          
npm run coverage 
```

The testing approach ensures the core financial management functionality is thoroughly validated while maintaining development efficiency by focusing on the most critical system components.


---
## 🛠️ Technologies to be used 

### Back-End
- [Node.js](https://nodejs.org/);
- [Mysql WorkBench](https://www.mysql.com/products/workbench/);
- [phpMyAdmin](https://www.phpmyadmin.net/);
- [Prisma](https://www.prisma.io/);
- [docker](https://www.docker.com/);
- [Express](https://expressjs.com/);
- [Jest](https://jestjs.io/docs/next/getting-started);
- [Swagger](https://swagger.io/docs/);
- [decimal.js](https://www.npmjs.com/package/decimal.js?activeTab=readme);
- [cron](https://www.npmjs.com/package/cron).

