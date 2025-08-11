# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Passwords", :inertia do
  let(:user) { create(:user) }

  before do
    sign_in(user)
  end

  describe "GET /password/edit" do
    it "returns a successful response" do
      get edit_password_path
      expect(response).to be_successful
    end
  end

  describe "PATCH /password" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          password: "new_password",
          password_confirmation: "new_password",
          password_challenge: "password"
        }
      end

      it "updates the user password" do
        patch password_path, params: valid_params
        expect(user.reload.authenticate("new_password")).to be_truthy
      end

      it "redirects to the root path" do
        patch password_path, params: valid_params
        expect(response).to redirect_to(root_path)
      end

      it "sets a flash notice" do
        patch password_path, params: valid_params
        expect(flash[:notice]).to eq(I18n.t("password.changed"))
      end
    end

    context "with invalid password confirmation" do
      let(:invalid_params) do
        {
          password: "new_password",
          password_confirmation: "wrong_confirmation",
          password_challenge: "password"
        }
      end

      it "does not update the user password" do
        patch password_path, params: invalid_params
        expect(user.reload.authenticate("password")).to be_truthy
      end

      it "returns an unprocessable_entity status" do
        patch password_path, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "with invalid password challenge" do
      let(:invalid_params) do
        {
          password: "new_password",
          password_confirmation: "new_password",
          password_challenge: "wrong_password"
        }
      end

      it "does not update the user password" do
        patch password_path, params: invalid_params
        expect(user.reload.authenticate("password")).to be_truthy
      end

      it "returns an unprocessable_entity status" do
        patch password_path, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
