# frozen_string_literal: true

module Core
  module Schemas
    class DocumentSchema < Core::Schema::Base
      title "Document"
      slug "document"
      description "Uploaded document or file"

      string :title, description: "Document title"
      string :description, required: false, description: "Document description"
      string :file_url, required: false, description: "File URL"
      string :file_name, required: false, description: "Original file name"
      integer :file_size, required: false, description: "File size in bytes"
      string :file_type, required: false, description: "File MIME type"
      boolean :is_image, required: false, description: "Whether the document is an image"

      timestamps

      translations(
        en: {
          title: "Title",
          description: "Description",
          file_url: "File URL",
          file_name: "File Name",
          file_size: "File Size",
          file_type: "File Type",
          is_image: "Is Image"
        },
        fr: {
          title: "Titre",
          description: "Description",
          file_url: "URL du Fichier",
          file_name: "Nom du Fichier",
          file_size: "Taille du Fichier",
          file_type: "Type de Fichier",
          is_image: "Est une Image"
        }
      )
    end
  end
end
