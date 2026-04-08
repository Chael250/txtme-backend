# TXTME Backend - AI-Powered Address Book

Welcome to the **txtme** backend! This service provides a robust authentication system and a foundation for an AI-powered address book application.

## 🚀 Tech Stack

- **Framework:** [Express 5](https://expressjs.com/) (Fast, unopinionated, minimalist web framework)
- **Runtime:** [Node.js 20+](https://nodejs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (ESM / NodeNext)
- **ORM:** [Prisma 6](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Security:** [JWT](https://jwt.io/) (JSON Web Tokens), [bcryptjs](https://github.com/dcodeIO/bcrypt.js/)
- **Validation:** [Zod](https://zod.dev/)
- **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## 🛠️ Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/) (Local development only)

### Installation & Run

1. **Clone the repository** (if not already in the directory):
   ```bash
   cd backend
   ```

2. **Set up Environment Variables**:
   Create a `.env` file in the root directory (one is provided by default):
   ```env
   PORT=5000
   DATABASE_URL=postgresql://txtme_user:txtme_password@postgres:5432/txtme_db?schema=public
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   NODE_ENV=development
   ```

3. **Launch the Application via Docker**:
   ```bash
   docker-compose up -d --build
   ```
   This will start two containers:
   - `txtme_backend`: The Express application on port **5000**.
   - `txtme_postgres`: The database on port **5432** (mapped to **5433** on the host).

4. **Initialize the Database**:
   Run the migrations inside the backend container:
   ```bash
   docker exec txtme_backend npx prisma migrate dev --name init
   ```

## 🔐 Authentication API

All authentication routes are prefixed with `/auth`.

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/auth/register` | `POST` | Create a new user account | ❌ |
| `/auth/login` | `POST` | Authenticate and receive tokens | ❌ |
| `/auth/logout` | `POST` | Invalidate current session | ✅ |
| `/auth/refresh-token` | `POST` | Get a new access token using a refresh token | ❌ |
| `/auth/me` | `GET` | Get current user's profile | ✅ |

### Request Bodies (JSON)

#### Register
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmpassword": "password123"
}
```

#### Login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 👤 User Management API

All user management routes are prefixed with `/users` and require a valid authentication token (Bearer or Cookie).

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/users` | `GET` | List all registered users | ✅ |
| `/users/:id` | `GET` | Get a specific user's profile | ✅ |
| `/users/:id` | `PUT` | Update your own details (Optional fields) | ✅ |
| `/users/:id` | `DELETE` | Delete your own account | ✅ |

> [!IMPORTANT]
> **Access Control:** Users can only `PUT` (Update) or `DELETE` their own profiles. Attempting to modify another user's profile will result in a `403 Forbidden` error.

## 📇 Contacts API

Address book core functionality. All routes require authentication.

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/contacts` | `GET` | List all your contacts | ✅ |
| `/contacts` | `POST` | Create a new contact | ✅ |
| `/contacts/:id` | `GET` | Get contact details (includes tags/notes) | ✅ |
| `/contacts/:id` | `PUT` | Update contact info | ✅ |
| `/contacts/:id` | `DELETE` | Delete a contact | ✅ |
| `/contacts/search?q=query` | `GET` | Search across names, emails, company | ✅ |
| `/contacts/filter?tag=X` | `GET` | Filter by tag, company, or date | ✅ |
| `/contacts/recent` | `GET` | Get 10 most recently updated contacts | ✅ |
| `/contacts/favorites` | `GET` | List all favorite contacts | ✅ |

### Contact Request Body (JSON)
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@doe.com",
  "phone": "+123456789",
  "company": "Tech Corp",
  "isFavorite": true
}
```

## 🏷️ Tags API

Manage categorization labels.

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/tags` | `GET` | List all your unique tags | ✅ |
| `/tags` | `POST` | Create a new tag | ✅ |
| `/tags/:id` | `DELETE` | Delete a tag globally (removes from all contacts) | ✅ |
| `/contacts/:id/tags` | `POST` | Attach a tag to a contact | ✅ |
| `/contacts/:id/tags/:tagId` | `DELETE` | Detach a tag from a contact | ✅ |

## 📝 Notes API

Detailed notes for specific contacts.

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `/contacts/:id/notes` | `POST` | Add a note to a contact | ✅ |
| `/contacts/:id/notes` | `GET` | List all notes for a contact | ✅ |
| `/notes/:id` | `PUT` | Update a specific note | ✅ |
| `/notes/:id` | `DELETE` | Delete a specific note | ✅ |

## 🧪 Testing

### 1. Using the Authentication Script
Verify core auth functionality:
```bash
/tmp/test_auth.sh
```

### 2. Manual Testing with curl

**Search Contacts:**
```bash
curl -G "http://localhost:5000/contacts/search" \
  --data-urlencode "q=John" \
  -H "Authorization: Bearer <TOKEN>"
```

**Filter by Tag:**
```bash
curl -G "http://localhost:5000/contacts/filter" \
  --data-urlencode "tag=Friends" \
  -H "Authorization: Bearer <TOKEN>"
```

**Add a Tag to Contact:**
```bash
curl -X POST http://localhost:5000/contacts/<CONTACT_ID>/tags \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Work"}'
```

**Add a Note to Contact:**
```bash
curl -X POST http://localhost:5000/contacts/<CONTACT_ID>/notes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Meeting at 5pm"}'
```

## 📂 Project Structure

```text
backend/
├── prisma/             # Prisma schema and migrations
├── src/
│   ├── controllers/    # Request handling
│   ├── middlewares/    # Custom middlewares (auth, validation)
│   ├── routes/         # Express routes
│   ├── services/       # Business logic layer
│   ├── utils/          # Utilities (JWT, schemas, errors)
│   ├── app.ts          # App configuration
│   └── index.ts        # Server entry point
├── Dockerfile          # Docker configuration
└── docker-compose.yml  # Container orchestration
```

## 📝 Important Notes

> [!TIP]
> **ESM Requirement:** All internal imports MUST include the `.js` extension (e.g., `import x from './utils.js'`) due to the `NodeNext` module resolution used in this project.

> [!IMPORTANT]
> **Database Host:** When connecting from the host machine (locally), use port **5433**. When connecting from within the backend container, use `postgres:5432`.
