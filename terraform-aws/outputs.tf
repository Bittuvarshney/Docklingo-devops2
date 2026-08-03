output "s3_bucket_name" {
  description = "Linguify S3 bucket name"
  value       = aws_s3_bucket.linguify_bucket.bucket
}

output "security_group_id" {
  description = "Linguify Security Group ID"
  value       = aws_security_group.linguify_sg.id
}

output "security_group_name" {
  description = "Linguify Security Group name"
  value       = aws_security_group.linguify_sg.name
}
