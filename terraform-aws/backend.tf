terraform {
  backend "s3" {
    bucket       = "linguify-terraform-state-783161623047"
    key          = "linguify/terraform.tfstate"
    region       = "ap-southeast-2"
    use_lockfile = true
    encrypt      = true
  }
}
