# frozen_string_literal: true

AUTH0_CREDS = {
  client_id: ENV.fetch("AUTH0_CLIENT_ID", nil),
  client_secret: ENV.fetch("AUTH0_CLIENT_SECRET", nil),
  domain: ENV.fetch("AUTH0_DOMAIN", nil),
  audience: ENV.fetch("AUTH0_AUDIENCE", nil)
}.freeze
