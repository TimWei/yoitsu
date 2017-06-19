# == Schema Information
#
# Table name: users
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  token      :string(255)
#  is_admin   :boolean          default(FALSE)
#  last_login :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  color      :string(255)
#

class User < ApplicationRecord
	has_many :messages
	has_many :rooms, through: :messages
	has_secure_token
	after_create :set_color

	def set_color
		self.color = self.token[0..5].each_char.map{|t| (t.ord * 7 % 16).to_s(16) }.join
		self.save
	end
end
