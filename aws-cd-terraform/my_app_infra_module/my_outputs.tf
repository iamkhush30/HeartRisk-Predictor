output "instance_id" {
  value = aws_instance.app.id
}

output "public_ip" {
  value = aws_instance.app.public_ip
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "jenkins_iam_user" {
  value = aws_iam_user.jenkins.name
}
