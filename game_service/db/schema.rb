# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_06_16_142443) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "game_status", ["waiting_for_players", "waiting_for_talon", "running", "finished"]

  create_table "games", force: :cascade do |t|
    t.string "uid", null: false
    t.string "players", default: [], array: true
    t.string "active_player"
    t.enum "status", default: "waiting_for_players", null: false, enum_type: "game_status"
    t.datetime "finished_at"
    t.string "talon", default: [], array: true
    t.string "discard_pile", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
