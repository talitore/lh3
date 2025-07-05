# frozen_string_literal: true

require 'test_helper'

module Identity
  class EmailsControllerTest < ActionDispatch::IntegrationTest
    setup do
      @user = sign_in_as(users(:lazaro_nixon))
    end

    test 'should get edit' do
      inertia_get edit_identity_email_url
      assert_response :success
      assert_inertia_response
      assert_inertia_component 'Identity/Emails/Edit'
      assert_inertia_props 'user' => { 'id' => @user.id, 'email' => @user.email }
    end

    test 'should update email' do
      patch identity_email_url, params: { email: 'new_email@hey.com', password_challenge: 'Secret1*3*5*' }
      assert_redirected_to root_url
    end

    test 'should not update email with wrong password challenge' do
      inertia_patch identity_email_url, params: { email: 'new_email@hey.com', password_challenge: 'SecretWrong1*3' }

      assert_response :unprocessable_entity
      assert_inertia_response
      assert_inertia_component 'Identity/Emails/Edit'
      assert_inertia_props do |props|
        assert_equal @user.id, props['user']['id']
        assert_equal @user.email, props['user']['email']
        assert props['errors'], 'Errors should be present'
        assert props['errors']['password_challenge'], 'Password challenge error should be present'
        assert_match(/is invalid/, props['errors']['password_challenge'].first)
      end
    end
  end
end
