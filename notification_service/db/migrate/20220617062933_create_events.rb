class CreateEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :events do |t|
      t.string :name, null: false
      t.string :eid, null: false, index: { unique: true }
      t.jsonb :payload, null: false, default: {}
      t.datetime :timestamp, null: false

      t.timestamps
    end
  end
end
