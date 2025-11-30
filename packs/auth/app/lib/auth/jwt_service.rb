# frozen_string_literal: true

module Auth
  class JwtService
    class << self
      def encode(payload, expiration: 24.hours.from_now)
        payload = payload.dup
        payload[:exp] = expiration.to_i
        JWT.encode(payload, secret_key, "HS256")
      end

      def decode(token)
        decoded = JWT.decode(token, secret_key, true, algorithm: "HS256")
        decoded.first.with_indifferent_access
      rescue JWT::DecodeError, JWT::ExpiredSignature => e
        Rails.logger.warn("JWT decode error: #{e.message}")
        nil
      end

      private

        def secret_key
          Rails.application.credentials.secret_key_base || ENV.fetch("SECRET_KEY_BASE")
        end
    end
  end
end
