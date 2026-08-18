# College CRM - Production DevOps Project

A production-style College CRM application designed to demonstrate AWS DevOps practices including Docker, Jenkins, Terraform, AWS networking, CI/CD, monitoring, security, and high availability.

## Current Architecture

```text
Developer
   |
 GitHub
   |
 Docker Compose
   |
 +-----------------------------+
 |                             |
 |  Node.js Application        |
 |          |                  |
 |      +---+---+              |
 |      |       |              |
 |    MySQL    Redis            |
 |                             |
 +-----------------------------+
