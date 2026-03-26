terraform {
  required_version = ">= 1.5.0"

  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

resource "local_file" "backend_env" {
  filename = "${path.module}/backend.env"

  content = <<EOT
PORT=${var.port}
DATABASE_URL=${var.database_url}
JWT_KEY=${var.jwt_key}
FRONTEND_URL=${var.frontend_url}
GOOGLE_CLIENT_ID=${var.google_client_id}
GOOGLE_CLIENT_SECRET=${var.google_client_secret}
GOOGLE_CALLBACK_URL=${var.google_callback_url}
EOT
}