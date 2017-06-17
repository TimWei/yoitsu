class AddColorToUser < ActiveRecord::Migration[5.0]
  def change
  	add_column :messages, :color, :string
  	add_column :users, :color, :string
  end
end
