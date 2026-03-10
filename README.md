# ☁️ Cloud-Native Task Manager

A production-style **microservices** application built with **Spring Boot**, **Docker**, **Kubernetes**, and **React**. This project demonstrates cloud-native development patterns including containerization, container orchestration, and CI/CD automation — all skills directly applicable to real-world backend and DevOps engineering.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                       │
│                  (Vite · React · Nginx)                     │
│                         :5173                               │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
                ▼                       ▼
 ┌──────────────────────┐   ┌──────────────────────┐
 │     User Service     │   │     Task Service     │
 │  Spring Boot · JPA   │   │  Spring Boot · JPA   │
 │   H2 · Lombok · :8081│   │   H2 · Lombok · :8082│
 └──────────────────────┘   └──────────────────────┘
```

The system is composed of **three independently deployable services**, each containerized with its own multi-stage Dockerfile:

| Service | Tech Stack | Port |
|---|---|---|
| `user-service` | Spring Boot 3.5, Java 17, H2, Lombok | `8081` |
| `task-manager` | Spring Boot 3.5, Java 17, H2, Lombok | `8082` |
| `frontend` | React 18, Vite, Nginx | `5173` |

---

## ✨ Features

- **User Service** — REST API for user management
- **Task Service** — REST API for full CRUD task management, with validation
- **React Frontend** — Login page, task dashboard, task creation form, and task card components
- **Spring Actuator** — Health check endpoints on both backend services
- **Bean Validation** — Request validation via `spring-boot-starter-validation`
- **Multi-stage Docker Builds** — Lean production images using `eclipse-temurin:17-jre`
- **Docker Compose** — One-command local environment for all three services
- **Kubernetes Manifests** — Deployment and Service YAMLs for both backend services (2 replicas each)
- **GitHub Actions CI** — Automated build, test, and Docker image build pipeline on every push to `main`

---

## 🛠️ Tech Stack

**Backend**
- Java 17
- Spring Boot 3.5 (Web, Data JPA, Actuator, Validation)
- H2 (in-memory database)
- Lombok
- Maven

**Frontend**
- React 18
- Vite
- Nginx (production serving inside Docker)

**DevOps & Infrastructure**
- Docker & Docker Compose
- Kubernetes (Deployments + Services)
- GitHub Actions (CI Pipeline)

---

## 🚀 Getting Started

### Prerequisites

- [Java 17+](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js 18+](https://nodejs.org/) *(for local frontend dev only)*
- [kubectl](https://kubernetes.io/docs/tasks/tools/) + a local cluster (e.g. [Minikube](https://minikube.sigs.k8s.io/)) *(for K8s)*

---

### Option 1 — Run with Docker Compose (Recommended)

This is the fastest way to get the entire stack running locally.

```bash
# Clone the repository
git clone https://github.com/youneselalaouielrhoul/spring-docker-k8s-task-manager.git
cd spring-docker-k8s-task-manager

# Build and start all services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| User Service | http://localhost:8081 |
| Task Service | http://localhost:8082 |

To stop everything:
```bash
docker compose down
```

---

### Option 2 — Run Services Individually (Development)

**User Service**
```bash
cd user-service
./mvnw spring-boot:run
```

**Task Service**
```bash
cd task-manager
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

### Option 3 — Deploy to Kubernetes

> Requires a running local cluster (e.g. Minikube) and that the Docker images are available in the cluster's registry.

```bash
# (If using Minikube) Point Docker to the Minikube daemon
eval $(minikube docker-env)

# Build images inside the cluster
docker build -t my-user-service:latest ./user-service
docker build -t my-task-service:latest ./task-manager

# Apply the Kubernetes manifests
kubectl apply -f k8s/user-deployment.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/task-deployment.yaml
kubectl apply -f k8s/task-service.yaml

# Verify pods are running
kubectl get pods
kubectl get services
```

Each backend service is deployed with **2 replicas** for high availability.

---

## 🔁 CI/CD Pipeline

A **GitHub Actions** workflow (`.github/workflows/ci.yml`) runs automatically on every push to `main`.

The pipeline runs **3 parallel jobs**:

```
Push to main
     │
     ├── build-user-service   → mvn clean test → docker build
     ├── build-task-service   → mvn clean test → docker build
     └── build-frontend       → npm ci → npm run build → docker build
```

---

## 📁 Project Structure

```
cloud-native-task-manager/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Navbar, TaskCard, TaskForm
│   │   ├── pages/              # LoginPage, TasksPage
│   │   ├── api/                # Axios API client modules
│   │   └── context/            # React context (global state)
│   ├── Dockerfile
│   └── nginx.conf
├── task-manager/               # Task microservice (Spring Boot)
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── user-service/               # User microservice (Spring Boot)
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── k8s/                        # Kubernetes manifests
│   ├── task-deployment.yaml
│   ├── task-service.yaml
│   ├── user-deployment.yaml
│   └── user-service.yaml
└── docker-compose.yml          # Local orchestration
```

---

## 📡 API Endpoints

### User Service (`localhost:8081`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/actuator/health` | Health check |
| `POST` | `/api/users` | Register a new user |
| `GET` | `/api/users` | Get all users |

### Task Service (`localhost:8082`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/actuator/health` | Health check |
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{id}` | Update a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## 🧠 Key Learning Outcomes

This project was built to demonstrate practical, interview-relevant skills:

- ✅ Designing and building **independent microservices** with REST APIs
- ✅ Writing production-grade **multi-stage Dockerfiles**
- ✅ Orchestrating multi-container apps with **Docker Compose**
- ✅ Writing **Kubernetes Deployment & Service** manifests
- ✅ Automating CI with **GitHub Actions** (parallel jobs, matrix testing)
- ✅ Connecting a **React frontend** to backend microservices
- ✅ Using **Spring Boot Actuator** for observability

---
