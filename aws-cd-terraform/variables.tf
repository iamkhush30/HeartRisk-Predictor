variable "region" {
  description = "AWS region for everything"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Prefix for resource names"
  type        = string
  default     = "heartrisk"
}

variable "instance_type" {
  description = "EC2 size. On a Free-plan account it must be a Free-plan-eligible type"
  type        = string
  default     = "m7i-flex.large"
}

variable "disk_gb" {
  description = "Root disk size in GB (image is ~2 GB, keep headroom)"
  type        = number
  default     = 20
}

variable "app_port" {
  description = "Port the Flask app listens on"
  type        = number
  default     = 5000
}

variable "allowed_cidr" {
  description = "Who can reach the app port. Restrict to your IP, e.g. 203.0.113.5/32"
  type        = string
  default     = "0.0.0.0/0"
}

variable "ecr_repo_name" {
  description = "ECR repository name"
  type        = string
  default     = "ml-app"
}
