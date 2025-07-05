# frozen_string_literal: true

# Base class for all application mailers
class ApplicationMailer < ActionMailer::Base
  default from: 'from@example.com'
  layout 'mailer'

  protected

  def default_url_options
    { host: 'www.example.com' }
  end
end
