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
#

class Message < ApplicationRecord
	belongs_to :user
	belongs_to :room
end
