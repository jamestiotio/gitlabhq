# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'Sessions', feature_category: :system_access do
  include SessionHelpers

  let(:user) { create(:user) }

  context 'for authentication', :allow_forgery_protection do
    it 'logout does not require a csrf token' do
      login_as(user)

      post(destroy_user_session_path, headers: { 'X-CSRF-Token' => 'invalid' })

      expect(response).to redirect_to(new_user_session_path)
    end
  end

  describe 'gitlab_user cookie', :saas do
    let_it_be(:user) { create(:user) }

    context 'when user signs in' do
      it 'sets marketing cookie' do
        post user_session_path(user: { login: user.username, password: user.password })
        expect(response.cookies['gitlab_user']).to be_present
      end
    end

    context 'when user uses remember_me' do
      it 'sets marketing cookie' do
        post user_session_path(user: { login: user.username, password: user.password, remember_me: true })
        expect(response.cookies['gitlab_user']).to be_present
      end
    end

    context 'when user has pending invitations' do
      it 'accepts the invitations and stores a user location' do
        create(:group_member, :invited, invite_email: user.email)
        member = create(:group_member, :invited, invite_email: user.email)

        post user_session_path(user: { login: user.username, password: user.password })

        expect(response).to redirect_to(group_path(member.source))
      end
    end

    context 'when using two-factor authentication via OTP' do
      let_it_be(:user) { create(:user, :two_factor, :invalid) }
      let(:user_params) { { login: user.username, password: user.password } }

      def authenticate_2fa(otp_attempt:)
        post(user_session_path(params: { user: user_params })) # First sign-in request for password, second for OTP
        post(user_session_path(params: { user: user_params.merge(otp_attempt: otp_attempt) }))
      end

      context 'with an invalid user' do
        it 'raises StandardError when ActiveRecord::RecordInvalid is raised to return 500 instead of 422' do
          otp = user.current_otp

          expect { authenticate_2fa(otp_attempt: otp) }.to raise_error(StandardError)
        end
      end

      context 'with an invalid record other than user' do
        it 'raises ActiveRecord::RecordInvalid for invalid record to return 422f' do
          otp = user.current_otp
          allow_next_instance_of(ActiveRecord::RecordInvalid) do |instance|
            allow(instance).to receive(:record).and_return(nil) # Simulate it's not a user
          end

          expect { authenticate_2fa(otp_attempt: otp) }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end
    end

    context 'when user is not using GitLab SaaS' do
      before do
        allow(::Gitlab).to receive(:com?).and_return(false)
      end

      it 'does not set marketing cookie' do
        post user_session_path(user: { login: user.username, password: user.password })
        expect(response.cookies['gitlab_user']).to be_nil
      end
    end
  end
end
