class AddIndexToMessage < ActiveRecord::Migration[5.0]
  def change
    add_index :messages, :room_id
    add_index :messages, :user_id
  end
end
