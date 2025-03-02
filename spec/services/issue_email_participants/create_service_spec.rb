# frozen_string_literal: true

require 'spec_helper'

RSpec.describe IssueEmailParticipants::CreateService, feature_category: :service_desk do
  shared_examples 'a successful service execution' do
    it 'creates new participants', :aggregate_failures do
      expect(response).to be_success

      issue.reset
      note = issue.notes.last
      expect(note.system?).to be true
      expect(note.author).to eq(user)

      participants_emails = issue.email_participants_emails_downcase

      expected_emails.each do |email|
        expect(participants_emails).to include(email)
        expect(response.message).to include(email)
        expect(note.note).to include(email)
      end
    end
  end

  shared_examples 'a failed service execution' do
    it 'returns error ServiceResponse with message', :aggregate_failures do
      expect(response).to be_error
      expect(response.message).to eq(error_message)
    end
  end

  describe '#execute' do
    let_it_be_with_reload(:project) { create(:project) }
    let_it_be(:user) { create(:user) }
    let_it_be(:issue) { create(:issue, project: project) }

    let(:emails) { nil }
    let(:service) { described_class.new(target: issue, current_user: user, emails: emails) }
    let(:expected_emails) { emails }

    let(:error_feature_flag) { "Feature flag issue_email_participants is not enabled for this project." }
    let(:error_underprivileged) { _("You don't have permission to add email participants.") }
    let(:error_no_participants) do
      _("No email participants were added. Either none were provided, or they already exist.")
    end

    subject(:response) { service.execute }

    context 'when the user is not a project member' do
      let(:error_message) { error_underprivileged }

      it_behaves_like 'a failed service execution'
    end

    context 'when user has reporter role in project' do
      before_all do
        project.add_reporter(user)
      end

      context 'when no emails are provided' do
        let(:error_message) { error_no_participants }

        it_behaves_like 'a failed service execution'
      end

      context 'when one email is provided' do
        let(:emails) { ['user@example.com'] }

        it_behaves_like 'a successful service execution'

        context 'when email is already a participant of the issue' do
          let(:error_message) { error_no_participants }

          before do
            issue.issue_email_participants.create!(email: emails.first)
          end

          it_behaves_like 'a failed service execution'

          context 'when email is formatted in a different case' do
            let(:emails) { ['USER@example.com'] }

            it_behaves_like 'a failed service execution'
          end
        end
      end

      context 'when multiple emails are provided' do
        let(:emails) { ['user@example.com', 'user2@example.com'] }

        it_behaves_like 'a successful service execution'

        context 'when duplicate email provided' do
          let(:emails) { ['user@example.com', 'user@example.com'] }
          let(:expected_emails) { emails[...-1] }

          it_behaves_like 'a successful service execution'
        end

        context 'when an email is already a participant of the issue' do
          let(:expected_emails) { emails[1...] }

          before do
            issue.issue_email_participants.create!(email: emails.first)
          end

          it_behaves_like 'a successful service execution'
        end
      end

      context 'when more than the allowed number of emails a re provided' do
        let(:emails) { (1..7).map { |i| "user#{i}@example.com" } }

        let(:expected_emails) { emails[...-1] }

        it_behaves_like 'a successful service execution'
      end
    end

    context 'when feature flag issue_email_participants is disabled' do
      let(:error_message) { error_feature_flag }

      before do
        stub_feature_flags(issue_email_participants: false)
      end

      it_behaves_like 'a failed service execution'
    end
  end
end
