output "instance_id" {
  value = module.app.instance_id
}

output "public_ip" {
  value = module.app.public_ip
}

output "app_url" {
  value = "http://${module.app.public_ip}:${var.app_port}"
}

output "ecr_repository_url" {
  value = module.app.ecr_repository_url
}

output "jenkins_iam_user" {
  value = module.app.jenkins_iam_user
}

output "region" {
  value = var.region
}
