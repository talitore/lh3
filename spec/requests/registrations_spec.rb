require 'rails_helper'

RSpec.describe 'Registrations', type: :request, inertia: true do
  describe 'GET /register' do
    it 'renders the registration page' do
      get sign_up_path
      expect(response).to be_successful
      expect(inertia).to render_component('Auth/Register')
    end
  end

  describe 'POST /register' do
    let(:valid_params) do
      {
        email: 'newuser@example.com',
        password: 'securepassword',
        password_confirmation: 'securepassword',
        display_name: 'New User'
      }
    end

    context 'with valid parameters' do
      it 'creates a new user and logs them in' do
        expect {
          post sign_up_path, params: valid_params
        }.to change(User, :count).by(1)

        user = User.find_by(email: valid_params[:email])
        expect(user).not_to be_nil
        expect(cookies[:session_token]).to be_present
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia).to render_component('Home')
      end
    end

    context 'with invalid parameters' do
      it 'does not create a user and renders errors' do
        invalid_params = valid_params.merge(password_confirmation: 'wrong')
        expect {
          post sign_up_path, params: invalid_params
        }.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(inertia).to render_component('Auth/Register')
        expect(inertia.props[:errors]).to include(:password_confirmation)
      end

      it 'does not create a user with missing email' do
        invalid_params = valid_params.except(:email)
        expect {
          post sign_up_path, params: invalid_params
        }.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(inertia).to render_component('Auth/Register')
        expect(inertia.props[:errors]).to include(:email)
      end
    end
  end
end
