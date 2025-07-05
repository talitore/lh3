# frozen_string_literal: true

require 'test_helper'

class PasswordsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = sign_in_as(users(:lazaro_nixon))
  end

  test 'should get edit' do
    inertia_get edit_password_url
    assert_response :success
    assert_inertia_response
    assert_inertia_component 'Passwords/Edit'
    assert_inertia_props 'user' => { 'id' => @user.id, 'email' => @user.email }
  end

  test 'should update password' do
    patch password_url,
          params: { password_challenge: 'Secret1*3*5*', password: 'Secret6*4*2*',
                    password_confirmation: 'Secret6*4*2*' }
    assert_redirected_to root_url
  end

  test 'should not update password with wrong password challenge' do
    inertia_patch password_url,
                  params: { password_challenge: 'SecretWrong1*3', password: 'Secret6*4*2*',
                            password_confirmation: 'Secret6*4*2*' }

    assert_response :unprocessable_entity
    assert_inertia_response
    assert_inertia_component 'Passwords/Edit'
    assert_inertia_props do |props|
      assert_equal @user.id, props['user']['id']
      assert_equal @user.email, props['user']['email']
      assert props['errors'], 'Errors should be present'
      assert props['errors']['password_challenge'], 'Password challenge error should be present'
      assert_match /is invalid/, props['errors']['password_challenge'].first
    end
  end
end
