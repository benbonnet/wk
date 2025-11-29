# frozen_string_literal: true

module Core
  module Schema
    module Translations
      extend ActiveSupport::Concern

      class_methods do
        def translations(data = nil)
          if data
            @translations = data
          end
          @translations || {}
        end

        def t(key, locale: :en)
          translations.dig(locale, key.to_sym) || key.to_s.humanize
        end

        def translation_keys
          translations.values.flat_map(&:keys).uniq
        end
      end
    end
  end
end
