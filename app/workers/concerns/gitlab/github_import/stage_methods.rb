# frozen_string_literal: true

module Gitlab
  module GithubImport
    module StageMethods
      extend ActiveSupport::Concern

      MAX_RETRIES_AFTER_INTERRUPTION = 20

      included do
        include ApplicationWorker

        sidekiq_retries_exhausted do |msg, e|
          Gitlab::Import::ImportFailureService.track(
            project_id: msg['args'][0],
            exception: e,
            error_source: self.class.name,
            fail_import: true
          )
        end
      end

      class_methods do
        # We can increase the number of times a GitHubImport::Stage worker is retried
        # after being interrupted if the importer it executes can restart exactly
        # from where it left off.
        #
        # It is not safe to call this method if the importer loops over its data from
        # the beginning when restarted, even if it skips data that is already imported
        # inside the loop, as there is a possibility the importer will never reach
        # the end of the loop.
        #
        # Examples of stage workers that call this method are ones that execute services that:
        #
        # - Continue paging an endpoint from where it left off:
        #   https://gitlab.com/gitlab-org/gitlab/-/blob/487521cc/lib/gitlab/github_import/parallel_scheduling.rb#L114-117
        # - Continue their loop from where it left off:
        #   https://gitlab.com/gitlab-org/gitlab/-/blob/024235ec/lib/gitlab/github_import/importer/pull_requests/review_requests_importer.rb#L15
        def resumes_work_when_interrupted!
          sidekiq_options max_retries_after_interruption: MAX_RETRIES_AFTER_INTERRUPTION
        end
      end

      # project_id - The ID of the GitLab project to import the data into.
      def perform(project_id)
        info(project_id, message: 'starting stage')

        return unless (project = find_project(project_id))

        if project.import_state&.completed?
          info(
            project_id,
            message: 'Project import is no longer running. Stopping worker.',
            import_status: project.import_state.status
          )

          return
        end

        client = GithubImport.new_client_for(project)

        try_import(client, project)

        info(project_id, message: 'stage finished')
      rescue StandardError => e
        Gitlab::Import::ImportFailureService.track(
          project_id: project_id,
          exception: e,
          error_source: self.class.name,
          fail_import: false,
          metrics: true
        )

        raise(e)
      end

      # client - An instance of Gitlab::GithubImport::Client.
      # project - An instance of Project.
      def try_import(client, project)
        project.import_state.refresh_jid_expiration

        import(client, project)
      rescue RateLimitError
        self.class.perform_in(client.rate_limit_resets_in, project.id)
      end

      def find_project(id)
        # If the project has been marked as failed we want to bail out
        # automatically.
        # rubocop: disable CodeReuse/ActiveRecord
        Project.joins_import_state.where(import_state: { status: :started }).find_by_id(id)
        # rubocop: enable CodeReuse/ActiveRecord
      end

      private

      def info(project_id, extra = {})
        Gitlab::GithubImport::Logger.info(log_attributes(project_id, extra))
      end

      def log_attributes(project_id, extra = {})
        extra.merge(
          project_id: project_id,
          import_stage: self.class.name
        )
      end

      def import_settings(project)
        Gitlab::GithubImport::Settings.new(project)
      end
    end
  end
end
