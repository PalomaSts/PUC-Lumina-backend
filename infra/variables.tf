variable "port" {
  type    = number
  default = 4000
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "jwt_key" {
  type      = string
  sensitive = true
}

variable "frontend_url" {
  type = string
}

variable "google_client_id" {
  type      = string
  sensitive = true
}

variable "google_client_secret" {
  type      = string
  sensitive = true
}

variable "google_callback_url" {
  type = string
}