source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.4"
# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group(:development, :test) do
  gem("brakeman", require: false)
  gem("rubocop-rails-omakase", require: false)
  gem("annotaterb")
  gem("debug", ">= 1.0.0")
  gem("dotenv")
  gem("factory_bot_rails", "~> 6.4.4")
  gem("ffaker")
  gem("rubocop")
  gem("rubocop-rails")
  gem("rubocop-rspec")
  gem("overcommit", require: false)
  gem("rswag-specs")
end

group(:test) do
  gem("database_cleaner", "~> 2.1.0")
  gem("rails-controller-testing", "~> 1.0")
  gem("rspec-rails", "~> 6.1")
  gem("shoulda-matchers", "~> 5.3")
  gem("test-prof", "~> 1.0")
  gem("webmock")
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
  gem "rswag-api"
  gem "rswag-ui"
end

gem "vite_rails", "~> 3.0"
gem "packwerk", "~> 3.2"
gem "packs-rails", "~> 0.0.5"
gem "packwerk-extensions", "~> 0.3.0"
# gem("alba", "~> 3.7")
# gem("rest-client", "~> 2.1")
# gem("typelizer", "~> 0.4.1")
# gem("devise", "~> 4.9")
# gem("omniauth", "~> 2.1")
# gem("omniauth-rails_csrf_protection", "~> 1.0.0")
# gem("omniauth-github", "~> 2.0")
# gem("twilio-ruby", "~> 7.0")
# gem("good_job", "~> 3.25")
# gem("rbnacl", "~> 7.1")
# gem("rubyzip", "~> 2.3")
# gem("repost", "~> 0.4.2")
# gem("random_username", "~> 1.1")
# gem("dry-struct", "~> 1.6")

gem "alba", "~> 3.10"
gem "rest-client", "~> 2.1"
gem "typelizer", "~> 0.5.3"
gem "devise", "~> 4.9"
gem "omniauth", "~> 2.1"
gem "omniauth-rails_csrf_protection", "~> 2.0"
gem "twilio-ruby", "~> 7.8"
gem "repost", "~> 0.4.2"
gem "omniauth-auth0", "~> 3.1"
gem "ruby_llm", "~> 1.9"
gem "ruby_llm-schema", "~> 0.2.5"

# gems
# NOTE: Local development uses `bundle config local.durable_workflow /path/to/durable_workflow`
# This overrides the GitHub source to point to your local copy. Do NOT change to `path:` reference.
gem "durable_workflow", github: "getnvoi/durable_workflows", branch: "main"
