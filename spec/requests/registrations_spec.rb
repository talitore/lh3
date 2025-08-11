# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Registrations", :inertia do
  include ActiveJob::TestHelper

  describe "GET /sign_up" do
    it "renders the registration page via Inertia" do
      get sign_up_path

      expect_inertia.to render_component("Auth/Register")
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /sign_up" do
    let(:email) { "new_user@example.com" }
    let(:password) { "password123" }
    let(:display_name) { "New User" }

    context "with valid params" do
      it "creates the user, signs them in, redirects home, and enqueues verification email" do
        expect do
          perform_enqueued_jobs do
            post sign_up_path, params: {
              email: email,
              password: password,
              password_confirmation: password,
              display_name: display_name
            }
          end
        end.to change(User, :count).by(1).and change(Session, :count).by(1)

        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq I18n.t("registration.welcome")

        # Ensure the session cookie was set
        expect(cookies['session_token']).to be_present

        # Email verification is sent asynchronously and delivered
        mail = ActionMailer::Base.deliveries.last
        expect(mail).to be_present
        expect(mail.to).to include(email)
        expect(mail.subject).to eq(I18n.t("email_subjects.email_verification"))
      end
    end

    context "with invalid params" do
      it "renders the form with errors via Inertia (missing display_name)" do
        expect do
          post sign_up_path, params: {
            email: email,
            password: password,
            password_confirmation: password
            # missing display_name
          }
        end.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia.to render_component("Auth/Register")
        expect(inertia.props[:errors]).to include(display_name: include("can't be blank"))
      end

      it "renders the form with errors when password confirmation mismatches" do
        expect do
          post sign_up_path, params: {
            email: email,
            password: password,
            password_confirmation: "wrong",
            display_name: display_name
          }
        end.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia.to render_component("Auth/Register")
        expect(inertia.props[:errors]).to include(password_confirmation: include("doesn't match Password"))
      end

      it "renders the form with errors when email already taken" do
        create(:user, email: email)

        expect do
          post sign_up_path, params: {
            email: email,
            password: password,
            password_confirmation: password,
            display_name: display_name
          }
        end.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia.to render_component("Auth/Register")
        expect(inertia.props[:errors]).to include(email: include("has already been taken"))
      end
    end
  end
end

RSpec.describe "Registrations", :inertia do
  describe "GET /register" do
    it "renders the registration page" do
      get sign_up_path
      expect(response).to be_successful
      expect(inertia).to render_component("Auth/Register")
    end
  end

  describe "POST /register" do
    let(:valid_params) do
      {
        email: "newuser@example.com",
        password: "securepassword",
        password_confirmation: "securepassword",
        display_name: "New User"
      }
    end

    context "with valid parameters" do
      it "creates a new user and logs them in" do
        expect do
          post sign_up_path, params: valid_params
        end.to change(User, :count).by(1)

        user = User.find_by(email: valid_params[:email])
        expect(user).not_to be_nil
        expect(cookies[:session_token]).to be_present
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia).to render_component("Home")
      end
    end

    context "with invalid parameters" do
      it "does not create a user and renders errors" do
        invalid_params = valid_params.merge(password_confirmation: "wrong")
        expect do
          post sign_up_path, params: invalid_params
        end.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(inertia).to render_component("Auth/Register")
        expect(inertia.props[:errors]).to include(:password_confirmation)
      end

      it "does not create a user with missing email" do
        invalid_params = valid_params.except(:email)
        expect do
          post sign_up_path, params: invalid_params
        end.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(inertia).to render_component("Auth/Register")
        expect(inertia.props[:errors]).to include(:email)
      end
    end
  end
end
