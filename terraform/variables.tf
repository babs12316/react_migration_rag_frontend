variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "access_key" {
  description = "AWS access key"
  type        = string
  default     = "test"
}

variable "secret_key" {
  description = "AWS secret key"
  type        = string
  default     = "test"
}

variable "localstack_endpoint" {
  description = "LocalStack endpoint URL"
  type        = string
  default     = "http://localhost:4566"
}

variable "upload_bucket" {
  description = "S3 bucket for uploaded .tsx files"
  type        = string
  default     = "migration-upload"
}

variable "migration_results" {
  description = "S3 bucket for migrated .tsx files"
  type        = string
  default     = "migration-results"
}

variable "frontend_bucket" {
  description = "S3 bucket for React build files"
  type        = string
  default     = "migration-frontend"
}

variable "force_destroy" {
  description = "Allow bucket deletion even if it has files"
  type        = bool
  default     = false
}

variable "is_local" {
  description = "Set to true for LocalStack, false for production"
  type        = bool
  default     = true
}
