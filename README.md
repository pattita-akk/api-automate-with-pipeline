# API Automation with Playwright & Jenkins CI/CD Pipeline

Automated API testing project using **Playwright** with a full **CI/CD pipeline** powered by **Jenkins** and **Docker**.

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | API test framework |
| TypeScript | Programming language |
| Docker | Containerization |
| Jenkins | CI/CD automation |
| GitHub | Source code repository |

---

## 📁 Project Structure

```
api-automate-with-pipeline/
├── apiTests/
│   └── example.spec.ts     # API test files
├── helper/                 # Utility/helper functions
├── Dockerfile              # Docker image configuration
├── Jenkinsfile             # Jenkins pipeline definition
├── playwright.config.ts    # Playwright configuration
├── package.json
└── .dockerignore
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v22.18.0
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

## 🚀 Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/pattita-akk/api-automate-with-pipeline.git
cd api-automate-with-pipeline

# 2. Install dependencies
npm ci

# 3. Run tests
npx playwright test
```

---

## 🐳 Run with Docker

```bash
# Build Docker image
docker build -t playwright-api-tests .

# Run tests inside container
docker run --rm playwright-api-tests
```

---

## 🔄 CI/CD Pipeline (Jenkins + Docker)

This project uses **Jenkins** running inside Docker to automate test execution on every push to GitHub.

### Pipeline Flow

```
Push to GitHub
      ↓
GitHub Webhook triggers Jenkins
      ↓
Jenkins: Checkout code from GitHub
      ↓
Jenkins: docker build → Create image
      ↓
Jenkins: docker run → Execute Playwright tests
      ↓
Jenkins: Copy HTML report from container
      ↓
Jenkins: Publish Playwright Report
      ↓
Jenkins: Cleanup Docker image
```

### Jenkins Setup

#### 1. Run Jenkins via Docker

```bash
# Build custom Jenkins image with Docker CLI
cd ~/jenkins-docker
docker build -t jenkins-docker .

# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins-docker
```

#### 2. Get Initial Admin Password

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open `http://localhost:8080` and enter the password.

#### 3. Install Required Plugins

Go to **Manage Jenkins → Plugins → Available plugins** and install:

- Git
- GitHub Integration
- Pipeline
- HTML Publisher
- Docker Pipeline

#### 4. Create Pipeline Job

1. Click **New Item** → Enter name → Select **Pipeline**
2. Under **Pipeline** section:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/pattita-akk/api-automate-with-pipeline.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
3. Click **Save**

#### 5. Set Up GitHub Webhook (Auto-trigger)

In Jenkins Job → **Configure → Build Triggers** → ✅ Check **"GitHub hook trigger for GITScm polling"**

In GitHub → **Settings → Webhooks → Add webhook**:
```
Payload URL: http://YOUR_SERVER_IP:8080/github-webhook/
Content type: application/json
Events: Just the push event
```

> 💡 For local development, use [ngrok](https://ngrok.com/) to expose Jenkins:
> ```bash
> ngrok http 8080
> ```

### Jenkinsfile Overview

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout')          // Pull code from GitHub
        stage('Build Docker Image') // Build image from Dockerfile
        stage('Run Playwright Tests') // Run tests inside container
        stage('Publish Report')    // Publish HTML test report
    }
    post {
        always  // Cleanup Docker image
        success // Print success message
        failure // Print failure message
    }
}
```

---

## 📊 Test Report

After each pipeline run, the **Playwright HTML Report** is available in Jenkins under the **"Playwright Report"** link in the build sidebar.

### Example 
![alt text](https://github.com/pattita-akk/api-automate-with-pipeline/blob/main/Screenshot 2569-03-14 at 19.05.56.png?raw=true)

---

## 🌐 Base URL

Tests run against:
```
https://automationexercise.com
```

---

## 📝 Notes

- `node_modules`, `test-results`, and `playwright-report` are excluded from Docker builds via `.dockerignore`
- The pipeline uses `docker cp` to extract the HTML report from the container after tests complete
- Docker permission for `docker.sock` must be set after Jenkins container starts:
  ```bash
  docker exec -u root jenkins chmod 666 /var/run/docker.sock
  ```
