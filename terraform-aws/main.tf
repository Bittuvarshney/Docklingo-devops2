resource "aws_s3_bucket" "linguify_bucket" {
  bucket = "linguify-devops-783161623047"

  tags = {
    Name        = "Linguify DevOps Bucket"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}

resource "aws_security_group" "linguify_sg" {
  name        = "${var.project_name}-sg"
  description = "Security group for Linguify DevOps project"
  vpc_id      = "vpc-09c2edc8a04e76e40"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Grafana"
    from_port   = 31559
    to_port     = 31559
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = "${var.project_name}-sg"
    ManagedBy = "Terraform"
  }
}

resource "aws_instance" "linguify_server" {
  ami           = "ami-06259b63260eddc13"
  instance_type = "m7i-flex.large"

  subnet_id = "subnet-03d2dd44d60d86813"

  associate_public_ip_address = true

  key_name = "devops2"

  iam_instance_profile = "terraform-ec2-role"

  vpc_security_group_ids = [
    "sg-016a6aeda02d3fa75"
  ]

  root_block_device {
    volume_size = 60
    volume_type = "gp3"
  }

  tags = {
    Name = "devops2"
  }
}
