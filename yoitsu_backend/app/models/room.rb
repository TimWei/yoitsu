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

	def exist_messages
		#will change to using Redis later
		self.messages.map{|t| {id: t.id, sender: t.name, content: t.content, at: t.created_at.strftime('%H:%M') } }
	end
end
