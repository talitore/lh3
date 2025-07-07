require 'rails_helper'

RSpec.describe 'User Registration', type: :request, inertia: true do
  describe 'POST /sign_up' do
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
          post '/sign_up', params: valid_params
        }.to change(User, :count).by(1)

        user = User.find_by(email: valid_params[:email])
        expect(user).to be_present
        expect(response).to redirect_to(root_path)
        # Check that the session_token cookie is set
        expect(response.cookies['session_token']).to be_present
      end
    end

    context 'with missing required fields' do
      it 'does not create a user and returns errors' do
        expect {
          post '/sign_up', params: valid_params.except(:email)
        }.not_to change(User, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.body).to include('errors')
      end
    end

    context 'with password mismatch' do
      it 'does not create a user and returns errors' do
        params = valid_params.merge(password_confirmation: 'wrong')
        expect {
          post '/sign_up', params: params
        }.not_to change(User, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.body).to include('errors')
      end
    end

    context 'with duplicate email' do
      before { create(:user, email: valid_params[:email]) }
      it 'does not create a user and returns errors' do
        expect {
          post '/sign_up', params: valid_params
        }.not_to change(User, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.body).to include('errors')
      end
    end
  end
end
