# 🚀 Docklingo – DevOps CI/CD Project

Docklingo is a document-based web application deployed using a complete
DevOps and Cloud-Native workflow.

This project implements CI/CD, containerization, Kubernetes orchestration,
Infrastructure as Code, configuration management, monitoring and alerting.

---

## 📌 Project Overview

The complete deployment pipeline is automated using:

- GitHub
- Jenkins
- Docker
- DockerHub
- Kubernetes (K3s)
- Terraform
- Ansible
- Prometheus
- Grafana
- Alertmanager
- Traefik

Whenever code is pushed to GitHub, a webhook triggers Jenkins.
Jenkins builds the application, creates a Docker image and deploys the
application to Kubernetes.

The Kubernetes cluster is monitored using Prometheus and Grafana.
Alertmanager sends email notifications when configured alerts are triggered.

---

# 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │    Developer     │
                    │   Code Changes   │
                    └────────┬─────────┘
                             │
                             │ git push
                             ▼
                    ┌──────────────────┐
                    │      GitHub      │
                    │   Repository     │
                    └────────┬─────────┘
                             │
                             │ Webhook
                             ▼
                    ┌──────────────────┐
                    │     Jenkins      │
                    │    CI / CD       │
                    └────────┬─────────┘
                             │
                             │ Build
                             ▼
                    ┌──────────────────┐
                    │      Docker      │
                    │   Build Image    │
                    └────────┬─────────┘
                             │
                             │ Push
                             ▼
                    ┌──────────────────┐
                    │    DockerHub     │
                    │  Image Registry  │
                    └────────┬─────────┘
                             │
                             │ Pull Image
                             ▼
              ┌─────────────────────────────┐
              │       Kubernetes / K3s     │
              │                             │
              │   ┌─────────────────────┐   │
              │   │ Linguify Deployment │   │
              │   │                     │   │
              │   │  Replica 1          │   │
              │   │  Replica 2          │   │
              │   └──────────┬──────────┘   │
              │              │              │
              │        ┌─────▼─────┐        │
              │        │  Service  │        │
              │        └─────┬─────┘        │
              │              │              │
              │        ┌─────▼─────┐        │
              │        │  Traefik  │        │
              │        │  Ingress  │        │
              │        └───────────┘        │
              └─────────────────────────────┘
                             │
                             │ Metrics
                             ▼
                    ┌──────────────────┐
                    │    Prometheus    │
                    │    Monitoring    │
                    └────────┬─────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
                   ▼                   ▼
          ┌─────────────────┐  ┌─────────────────┐
          │     Grafana     │  │   Alertmanager  │
          │    Dashboards   │  │ Email Alerts    │
          └─────────────────┘  └─────────────────┘


       Infrastructure / Configuration Layer

             ┌──────────────┐
             │   Terraform  │
             │   AWS IaC    │
             └──────────────┘

             ┌──────────────┐
             │   Ansible    │
             │ Configuration│
             └──────────────┘
