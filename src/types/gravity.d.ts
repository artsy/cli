interface GravityCredentials {
  email: string
  password: string
}

interface GravityAccessTokenRequest extends GravityCredentials {
  grant_type: string
  client_id: string
  client_secret: string
}

interface GravityAccessTokenResponse {
  access_token: string
  expires_in: string
}

interface GravityErrorResponse {
  error: string
  error_description: string
}
