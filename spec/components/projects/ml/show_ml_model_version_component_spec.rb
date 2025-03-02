# frozen_string_literal: true

require "spec_helper"

RSpec.describe Projects::Ml::ShowMlModelVersionComponent, type: :component, feature_category: :mlops do
  let_it_be(:project) { create(:project) } # rubocop:disable RSpec/FactoryBot/AvoidCreate -- build_stubbed breaks because it doesn't create iids properly.
  let_it_be(:user) { project.owner }
  let_it_be(:model) { create(:ml_models, project: project) } # rubocop:disable RSpec/FactoryBot/AvoidCreate -- build_stubbed breaks because it doesn't create iids properly.
  let_it_be(:experiment) { model.default_experiment }
  let_it_be(:candidate) do
    create(:ml_candidates, :with_artifact, experiment: experiment, user: user, project: project) # rubocop:disable RSpec/FactoryBot/AvoidCreate -- build_stubbed breaks because it doesn't create iids properly.
  end

  let_it_be(:version) do
    build_stubbed(:ml_model_versions, :with_package, model: model, candidate: candidate, description: 'abc')
  end

  subject(:component) do
    described_class.new(model_version: version, current_user: user)
  end

  describe 'rendered' do
    before do
      render_inline component
    end

    it 'renders element with view_model' do
      element = page.find("#js-mount-show-ml-model-version")

      expect(Gitlab::Json.parse(element['data-view-model'])).to eq({
        'modelVersion' => {
          'id' => version.id,
          'version' => version.version,
          'description' => 'abc',
          'projectPath' => "/#{project.full_path}",
          'path' => "/#{project.full_path}/-/ml/models/#{model.id}/versions/#{version.id}",
          'packageId' => version.package_id,
          'model' => {
            'name' => model.name,
            'path' => "/#{project.full_path}/-/ml/models/#{model.id}"
          },
          'candidate' => {
            'info' => {
              'iid' => candidate.iid,
              'eid' => candidate.eid,
              'pathToArtifact' => "/#{project.full_path}/-/packages/#{candidate.artifact.id}",
              'experimentName' => candidate.experiment.name,
              'pathToExperiment' => "/#{project.full_path}/-/ml/experiments/#{experiment.iid}",
              'status' => 'running',
              'path' => "/#{project.full_path}/-/ml/candidates/#{candidate.iid}",
              'ciJob' => nil
            },
            'metrics' => [],
            'params' => [],
            'metadata' => []
          }
        }
      })
    end
  end
end
