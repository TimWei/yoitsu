class AddUserNameToMessage < ActiveRecord::Migration[5.0]
  def change
  	add_column :messages, :name, :string
  end
end
