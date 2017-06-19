# == Schema Information
#
# Table name: rooms
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Room < ApplicationRecord
	has_many :messages
	has_many :users, through: :messages
  after_create :set_counter

  def exist_messages
    #will change to using Redis later
    self.messages.map{|t| {id: t.id, sender: t.name, content: CGI::escapeHTML(t.content), at: t.created_at.strftime('%H:%M'), color: t.color } }
  end
  def set_counter
    Redis.current.set "room_#{self.id}", '0'
  end
end
