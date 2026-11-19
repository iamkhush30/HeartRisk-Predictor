variable "region" {
  description = "AWS region for everything"
  type        = string
}

variable "project_name" {
  description = "Prefix for resource names"
  type        = string
}

variable "instance_type" {
  description = "EC2 size"
  type        = string
}

variable "disk_gb" {
  description = "Root disk size in GB"
  type        = number
}

variable "app_port" {
  description = "Port the Flask app listens on"
  type        = number
}

variable "allowed_cidr" {
  description = "Who can reach the app port"
  type        = string
}

variable "ecr_repo_name" {
  description = "ECR repository name"
  type        = string
}

variable "ami" {
  description = "AMI ID for the EC2 instances"
  type        = string
}
