namespace :yoitsu do
  desc "delete_todays_messages"
  task :delete_today_message => :environment do
     Message.all.select{|t| t.created_at > Date.current}.each{|t| t.delete}
  end
end