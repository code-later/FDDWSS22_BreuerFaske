class CreateGames < ActiveRecord::Migration[7.0]
  def up
    create_enum :game_status, %w(waiting_for_players waiting_for_talon running finished)

    create_table :games do |t|
      t.string :uid, null: false, uniq: true
      t.string :players, array: true, default: []
      t.string :active_player
      t.enum :status, enum_type: :game_status, null: false, default: "waiting_for_players"
      t.datetime :finished_at
      t.string :talon, array: true, default: []
      t.string :discard_pile, array: true, default: []

      t.timestamps
    end
  end

  # There's no built in support for dropping enums, but you can do it manually.
  # You should first drop any table that depends on them.
  def down
    drop_table :games

    execute <<~SQL
      DROP TYPE game_status;
    SQL
  end
end
