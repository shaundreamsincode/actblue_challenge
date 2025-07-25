# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear out old data
Vote.delete_all
User.delete_all
Candidate.delete_all

# Create candidates
candidate1 = Candidate.create!(name: "Radiohead")
candidate2 = Candidate.create!(name: "Beyoncé")

# Create a user who has voted
voted_user = User.create!(email: "voted@example.com", zip_code: "12345", password: "fake")
Vote.create!(user: voted_user, candidate: candidate1)

# Create a user who has not voted
non_voter = User.create!(email: "novote@example.com", zip_code: "54321", password: "fake")

puts "Seeded:"
puts "- Candidates: #{Candidate.count}"
puts "- Users: #{User.count}"
puts "- Votes: #{Vote.count}"
