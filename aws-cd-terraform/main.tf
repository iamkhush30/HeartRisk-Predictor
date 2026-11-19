data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

module "app" {
  source = "./my_app_infra_module"

  region        = var.region
  project_name  = var.project_name
  instance_type = var.instance_type
  disk_gb       = var.disk_gb
  app_port      = var.app_port
  allowed_cidr  = var.allowed_cidr
  ecr_repo_name = var.ecr_repo_name
  ami           = data.aws_ami.al2023.id
}
