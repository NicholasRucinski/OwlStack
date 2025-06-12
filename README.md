# MVP

- Basic Laravel + Inertia Dashboard

    - User registration/login

    - UI for uploading Dockerfiles or choosing from templates

- Golang build + deploy service

    - Accept Dockerfiles

    - Build using BuildKit

    - Push images to a local registry

    - Deploy to K8s (1 namespace per user)

- Laravel triggers Go service

    - Use HTTP API or a job queue (like Redis)

- Show deployment status in Laravel UI

    - Use K8s client or status endpoint from Go service

# Example Endpoint

POST /build
{
"dockerfile": "",
"app_name": "",
"user_id": "",
"settings": "",
}

# Example Setup

[Control PC]

- Kubernetes control plane
- Laravel + Inertia dashboard
- Golang build/deploy service
- NGINX Ingress controller

[Worker PC #1]

- Kubernetes node
- Runs user app pods

[Worker PC #2]

- Kubernetes node
- Runs more user pods

# Ingress

Use wildcard A record to allow
\*.app.domain.com
