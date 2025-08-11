# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Sessions", :inertia do
  describe "GET /sign_in" do
    it "renders the login page via Inertia" do
      get sign_in_path

      expect_inertia.to render_component("Auth/Login")
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /sign_in" do
    let!(:user) { create(:user, email: "user@example.com", password: "secret", password_confirmation: "secret") }

    context "with valid credentials" do
      it "creates a session, sets cookie, and redirects home with notice" do
        expect do
          post sign_in_path, params: {email: "user@example.com", password: "secret"}
        end.to change(Session, :count).by(1)

        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq I18n.t("session.signed_in")
        expect(cookies['session_token']).to be_present
      end
    end

    context "with invalid credentials" do
      it "does not create a session and redirects back with alert and hint" do
        expect do
          post sign_in_path, params: {email: "user@example.com", password: "wrong"}
        end.not_to change(Session, :count)

        expect(response).to redirect_to(sign_in_path(email_hint: "user@example.com"))
        expect(flash[:alert]).to eq I18n.t("session.invalid_credentials")
      end
    end
  end

  describe "DELETE /logout" do
    let!(:user) { create(:user) }

    it "destroys the current session and redirects to root with notice" do
      sign_in(user)

      expect do
        delete logout_path
      end.to change(Session, :count).by(-1)

      expect(response).to redirect_to(root_path)
      expect(flash[:notice]).to eq I18n.t("session.logged_out")
      # Cookie cleared
      expect(cookies['session_token']).to be_blank
    end
  end
end
