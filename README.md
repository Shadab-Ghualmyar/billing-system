# Simple Billing System

A simple interview-friendly Billing System using ASP.NET Core 10, EF Core 10, SQL Server LocalDB and React.

## Backend

Open `BillingSystem.sln` in Visual Studio and press F5.

The API runs on:

- http://localhost:5000
- Swagger: http://localhost:5000/swagger

The application creates the database automatically with `EnsureCreated()` and adds four sample products the first time it runs.

## Frontend

Open a terminal inside `frontend` and run:

```bash
npm install
npm start
```

React runs on http://localhost:3000.

## Simple structure

```text
React
  -> Controller
  -> Service
  -> DbContext
  -> SQL Server
```

There is no repository pattern, no authentication, no advanced state management and no EF migrations in this version. The project is intentionally kept simple so the code can be explained in an interview.
