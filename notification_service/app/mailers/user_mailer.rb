class UserMailer < ApplicationMailer
  def welcome_email
    @email = params[:email]
    @login_url = "http://localhost/auth/login"

    mail(to: @email, subject: 'Willkommen bei Mau-Mau Online!')
  end
end
