# ═══════════════════════════════════════════════
# FRONTEND STATIC HOSTING INFRASTRUCTURE
# ═══════════════════════════════════════════════

# Storage for React build files
resource "aws_s3_bucket" "react_build" {
  bucket        = var.frontend_bucket
  force_destroy = var.is_local
}

# Enable static website hosting
resource "aws_s3_bucket_website_configuration" "react_hosting" {
  bucket = aws_s3_bucket.react_build.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"  # For SPA routing
  }
}

# Allow public access
resource "aws_s3_bucket_public_access_block" "react_public" {
  bucket                  = aws_s3_bucket.react_build.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Public read policy
resource "aws_s3_bucket_policy" "react_read_policy" {
  bucket     = aws_s3_bucket.react_build.id
  depends_on = [aws_s3_bucket_public_access_block.react_public]
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowPublicRead"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.react_build.arn}/*"
    }]
  })
}

# CDN distribution
resource "aws_cloudfront_distribution" "react_cdn" {
  count = var.is_local ? 0 : 1
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = "${aws_s3_bucket.react_build.bucket}.s3-website.${var.region}.amazonaws.com"
    origin_id   = "react-s3-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "react-s3-origin"
    viewer_protocol_policy = var.is_local ? "allow-all" : "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
