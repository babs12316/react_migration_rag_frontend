# Outputs with clear names
output "react_bucket_name" {
  value       = aws_s3_bucket.react_build.id
  description = "Bucket where React build files are stored"
}

output "react_website_url" {
  value       = "${aws_s3_bucket.react_build.bucket}.s3-website.${var.region}.amazonaws.com"
  description = "Direct S3 website endpoint"
}
output "react_cdn_url" {
  value       = var.is_local ? null : "https://${aws_cloudfront_distribution.react_cdn[0].domain_name}"
  description = "CloudFront URL (prod only)"
}