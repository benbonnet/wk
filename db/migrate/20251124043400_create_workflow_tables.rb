# frozen_string_literal: true

class CreateWorkflowTables < ActiveRecord::Migration[8.0]
  def change
    create_table :workflow_executions, id: :uuid do |t|
      t.string :workflow_id, null: false
      t.string :status, null: false, default: "running"
      t.jsonb :input, default: {}
      t.jsonb :ctx, default: {}
      t.string :current_step
      t.jsonb :result
      t.string :recover_to
      t.jsonb :halt_data
      t.text :error
      t.timestamps

      t.index :workflow_id
      t.index :status
      t.index :created_at
    end

    create_table :workflow_entries, id: :uuid do |t|
      t.uuid :execution_id, null: false
      t.string :step_id, null: false
      t.string :step_type, null: false
      t.string :action, null: false
      t.integer :duration_ms
      t.jsonb :input
      t.jsonb :output
      t.text :error
      t.datetime :timestamp, null: false

      t.index :execution_id
      t.index :step_id
      t.index :timestamp
    end

    add_foreign_key :workflow_entries, :workflow_executions,
                    column: :execution_id, primary_key: :id
  end
end
