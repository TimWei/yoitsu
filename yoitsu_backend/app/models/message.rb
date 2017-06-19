# == Schema Information
#
# Table name: messages
#
#  id         :integer          not null, primary key
#  content    :text(65535)
#  user_id    :integer
#  room_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  name       :string(255)
#  color      :string(255)
#

class Message < ApplicationRecord
	belongs_to :user
	belongs_to :room

	#name shouldnt using relation because user should never trace back who said it
end
