class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :login, null: false
      t.string :name
      t.string :email
      t.string :avatar_url
      t.string :auth0_id, null: false
      t.text :access_token
      t.datetime :last_login_at
      t.boolean :internal, null: false, default: false

      t.timestamps
    end
    add_index :users, :login, unique: true
    add_index :users, :auth0_id, unique: true
  end
end
