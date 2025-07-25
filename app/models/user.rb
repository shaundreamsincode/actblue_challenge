class User < ApplicationRecord
  has_one :vote

  validates_presence_of :email
  validates_uniqueness_of :email
  validates_presence_of :zip_code
  validates_presence_of :password
end
