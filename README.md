# TaskFlow 🚀

Full-stack task management application built with ASP.NET Core and React.

## Live Demo
🔗 **App:** https://taskflow-frontend-rwyk.onrender.com  
🔗 **API (Swagger):** https://taskflow-api-3qsm.onrender.com/swagger

> ⚠️ First load may take up to 60 seconds (free tier cold start).

## Features
- ✅ Full CRUD operations (Create, Read, Update, Delete tasks)
- 📊 Interactive data grid with AG Grid
- 🎨 Color-coded status badges (Todo / InProgress / Done)
- 📄 Pagination
- 🔄 Real-time updates

## Tech Stack

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- SQL Server (local) / SQLite (production)
- Swagger / OpenAPI
- Docker

**Frontend**
- React 18 + TypeScript
- Vite
- AG Grid
- Axios

**Testing & CI/CD**
- xUnit + Moq + EF Core InMemory (7 unit tests)
- GitHub Actions (automated build & test pipeline)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Project Structure

```
TaskFlow/
├── TaskFlow.Api/          # ASP.NET Core Web API
│   ├── Controllers/       # API endpoints
│   ├── Services/          # Business logic
│   ├── Models/            # Domain entities
│   ├── DTOs/              # Data transfer objects
│   └── Data/              # EF Core DbContext
├── TaskFlow.Tests/        # xUnit tests
├── taskflow-frontend/     # React + TypeScript app
└── .github/workflows/     # CI/CD pipeline
```

## Run Locally

**Backend**
```bash
cd TaskFlow.Api
dotnet run
```
API available at `http://localhost:5282` — Swagger at `/swagger`

**Frontend**
```bash
cd taskflow-frontend
npm install
npm run dev
```
App available at `http://localhost:5173`

**Tests**
```bash
cd TaskFlow.Tests
dotnet test
```

## Author
**David Kezi Setondo**  
🔗 [GitHub](https://github.com/davidset87) · [Portfolio](https://davidset-portfolio.netlify.app)