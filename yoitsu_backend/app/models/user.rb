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
#

class User < ApplicationRecord
	has_many :messages
	has_many :rooms, through: :messages
end
