# frozen_string_literal: true

require "capybara/rspec"
require "selenium-webdriver"
require "rack_session_access/capybara"

# Configure Capybara
Capybara.default_driver = :selenium_chrome_headless
Capybara.javascript_driver = :selenium_chrome_headless
Capybara.default_max_wait_time = 5

# Register headless Chrome driver
Capybara.register_driver :selenium_chrome_headless do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument("--headless=new")
  options.add_argument("--no-sandbox")
  options.add_argument("--disable-dev-shm-usage")
  options.add_argument("--window-size=1920,1080")

  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

# Configure server
Capybara.server = :puma, { Silent: true }

RSpec.configure do |config|
  # Include Warden test helpers for login_as
  config.include Warden::Test::Helpers, type: :system

  config.before(:each, type: :system) do
    driven_by :selenium_chrome_headless
    Warden.test_mode!
  end

  config.after(:each, type: :system) do
    Warden.test_reset!
  end

  # Disable transactional fixtures for system tests (Selenium runs in separate thread)
  config.use_transactional_fixtures = false

  # Use DatabaseCleaner for system tests
  config.before(:suite) do
    # Clear stale Vite test assets to ensure fresh builds
    FileUtils.rm_rf(Rails.root.join("public/vite-test"))
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each, type: :system) do
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.start
  end

  config.after(:each, type: :system) do
    DatabaseCleaner.clean
  end
end
