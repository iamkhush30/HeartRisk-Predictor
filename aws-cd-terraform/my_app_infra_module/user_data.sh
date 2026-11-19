#!/bin/bash
set -euxo pipefail

dnf install -y docker
systemctl enable --now docker
usermod -aG docker ec2-user

# 2 GB swap as a safety net for the ML libraries
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
