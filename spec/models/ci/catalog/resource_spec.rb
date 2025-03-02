# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Ci::Catalog::Resource, feature_category: :pipeline_composition do
  let_it_be(:current_user) { create(:user) }

  let_it_be(:project_a) { create(:project, name: 'A') }
  let_it_be(:project_b) { create(:project, name: 'B') }
  let_it_be(:project_c) { create(:project, name: 'C', description: 'B') }

  let_it_be_with_reload(:resource_a) do
    create(:ci_catalog_resource, project: project_a, latest_released_at: '2023-02-01T00:00:00Z')
  end

  let_it_be(:resource_b) do
    create(:ci_catalog_resource, project: project_b, latest_released_at: '2023-01-01T00:00:00Z')
  end

  let_it_be(:resource_c) { create(:ci_catalog_resource, project: project_c) }

  it { is_expected.to belong_to(:project) }

  it do
    is_expected.to(
      have_many(:components).class_name('Ci::Catalog::Resources::Component').with_foreign_key(:catalog_resource_id))
  end

  it do
    is_expected.to(
      have_many(:versions).class_name('Ci::Catalog::Resources::Version').with_foreign_key(:catalog_resource_id))
  end

  it do
    is_expected.to(
      have_many(:sync_events).class_name('Ci::Catalog::Resources::SyncEvent').with_foreign_key(:catalog_resource_id))
  end

  it { is_expected.to delegate_method(:avatar_path).to(:project) }
  it { is_expected.to delegate_method(:star_count).to(:project) }

  it { is_expected.to define_enum_for(:state).with_values({ draft: 0, published: 1 }) }

  describe '.for_projects' do
    it 'returns catalog resources for the given project IDs' do
      resources_for_projects = described_class.for_projects(project_a.id)

      expect(resources_for_projects).to contain_exactly(resource_a)
    end
  end

  describe '.search' do
    it 'returns catalog resources whose name or description match the search term' do
      resources = described_class.search('B')

      expect(resources).to contain_exactly(resource_b, resource_c)
    end
  end

  describe '.order_by_created_at_desc' do
    it 'returns catalog resources sorted by descending created at' do
      ordered_resources = described_class.order_by_created_at_desc

      expect(ordered_resources.to_a).to eq([resource_c, resource_b, resource_a])
    end
  end

  describe '.order_by_created_at_asc' do
    it 'returns catalog resources sorted by ascending created at' do
      ordered_resources = described_class.order_by_created_at_asc

      expect(ordered_resources.to_a).to eq([resource_a, resource_b, resource_c])
    end
  end

  describe '.order_by_name_desc' do
    subject(:ordered_resources) { described_class.order_by_name_desc }

    it 'returns catalog resources sorted by descending name' do
      expect(ordered_resources.pluck(:name)).to eq(%w[C B A])
    end

    it 'returns catalog resources sorted by descending name with nulls last' do
      resource_a.update!(name: nil)

      expect(ordered_resources.pluck(:name)).to eq(['C', 'B', nil])
    end
  end

  describe '.order_by_name_asc' do
    subject(:ordered_resources) { described_class.order_by_name_asc }

    it 'returns catalog resources sorted by ascending name' do
      expect(ordered_resources.pluck(:name)).to eq(%w[A B C])
    end

    it 'returns catalog resources sorted by ascending name with nulls last' do
      resource_a.update!(name: nil)

      expect(ordered_resources.pluck(:name)).to eq(['B', 'C', nil])
    end
  end

  describe '.order_by_latest_released_at_desc' do
    it 'returns catalog resources sorted by latest_released_at descending with nulls last' do
      ordered_resources = described_class.order_by_latest_released_at_desc

      expect(ordered_resources).to eq([resource_a, resource_b, resource_c])
    end
  end

  describe '.order_by_latest_released_at_asc' do
    it 'returns catalog resources sorted by latest_released_at ascending with nulls last' do
      ordered_resources = described_class.order_by_latest_released_at_asc

      expect(ordered_resources).to eq([resource_b, resource_a, resource_c])
    end
  end

  describe '#state' do
    it 'defaults to draft' do
      expect(resource_a.state).to eq('draft')
    end
  end

  describe '#publish!' do
    context 'when the catalog resource is in draft state' do
      it 'updates the state of the catalog resource to published' do
        expect(resource_a.state).to eq('draft')

        resource_a.publish!

        expect(resource_a.reload.state).to eq('published')
      end
    end

    context 'when the catalog resource already has a published state' do
      it 'leaves the state as published' do
        resource_a.update!(state: :published)
        expect(resource_a.state).to eq('published')

        resource_a.publish!

        expect(resource_a.state).to eq('published')
      end
    end
  end

  describe '#unpublish!' do
    context 'when the catalog resource is in published state' do
      it 'updates the state of the catalog resource to draft' do
        resource_a.update!(state: :published)
        expect(resource_a.state).to eq('published')

        resource_a.unpublish!

        expect(resource_a.reload.state).to eq('draft')
      end
    end

    context 'when the catalog resource is already in draft state' do
      it 'leaves the state as draft' do
        expect(resource_a.state).to eq('draft')

        resource_a.unpublish!

        expect(resource_a.reload.state).to eq('draft')
      end
    end
  end

  describe 'synchronizing denormalized columns with `projects` table', :sidekiq_inline do
    let_it_be_with_reload(:project) { create(:project, name: 'Test project', description: 'Test description') }

    context 'when the catalog resource is created' do
      let(:resource) { build(:ci_catalog_resource, project: project) }

      it 'updates the catalog resource columns to match the project' do
        resource.save!
        resource.reload

        expect(resource.name).to eq(project.name)
        expect(resource.description).to eq(project.description)
        expect(resource.visibility_level).to eq(project.visibility_level)
      end
    end

    context 'when the project is updated' do
      let_it_be(:resource) { create(:ci_catalog_resource, project: project) }

      context 'when project name is updated' do
        it 'updates the catalog resource name to match' do
          project.update!(name: 'New name')

          expect(resource.reload.name).to eq(project.name)
        end
      end

      context 'when project description is updated' do
        it 'updates the catalog resource description to match' do
          project.update!(description: 'New description')

          expect(resource.reload.description).to eq(project.description)
        end
      end

      context 'when project visibility_level is updated' do
        it 'updates the catalog resource visibility_level to match' do
          project.update!(visibility_level: Gitlab::VisibilityLevel::INTERNAL)

          expect(resource.reload.visibility_level).to eq(project.visibility_level)
        end
      end
    end

    context 'when FF `ci_process_catalog_resource_sync_events` is disabled' do
      before do
        stub_feature_flags(ci_process_catalog_resource_sync_events: false)
      end

      context 'when the catalog resource is created' do
        let(:resource) { build(:ci_catalog_resource, project: project) }

        it 'updates the catalog resource columns to match the project' do
          resource.save!
          resource.reload

          expect(resource.name).to eq(project.name)
          expect(resource.description).to eq(project.description)
          expect(resource.visibility_level).to eq(project.visibility_level)
        end
      end

      context 'when the project is updated' do
        let_it_be(:resource) { create(:ci_catalog_resource, project: project) }

        context 'when project name is updated' do
          it 'updates the catalog resource name to match' do
            project.update!(name: 'New name')

            expect(resource.reload.name).to eq(project.name)
          end
        end

        context 'when project description is updated' do
          it 'updates the catalog resource description to match' do
            project.update!(description: 'New description')

            expect(resource.reload.description).to eq(project.description)
          end
        end

        context 'when project visibility_level is updated' do
          it 'updates the catalog resource visibility_level to match' do
            project.update!(visibility_level: Gitlab::VisibilityLevel::INTERNAL)

            expect(resource.reload.visibility_level).to eq(project.visibility_level)
          end
        end
      end
    end
  end

  describe '#update_latest_released_at! triggered in model callbacks' do
    let_it_be(:project) { create(:project) }
    let_it_be(:resource) { create(:ci_catalog_resource, project: project) }

    let_it_be_with_refind(:january_release) do
      create(:release, :with_catalog_resource_version, project: project, tag: 'v1', released_at: '2023-01-01T00:00:00Z')
    end

    let_it_be_with_refind(:february_release) do
      create(:release, :with_catalog_resource_version, project: project, tag: 'v2', released_at: '2023-02-01T00:00:00Z')
    end

    it 'has the expected latest_released_at value' do
      expect(resource.reload.latest_released_at).to eq(february_release.released_at)
    end

    context 'when a new catalog resource version is created' do
      it 'updates the latest_released_at value' do
        march_release = create(:release, :with_catalog_resource_version, project: project, tag: 'v3',
          released_at: '2023-03-01T00:00:00Z')

        expect(resource.reload.latest_released_at).to eq(march_release.released_at)
      end
    end

    context 'when a catalog resource version is destroyed' do
      it 'updates the latest_released_at value' do
        february_release.catalog_resource_version.destroy!

        expect(resource.reload.latest_released_at).to eq(january_release.released_at)
      end
    end

    context 'when the released_at value of a release is updated' do
      it 'updates the latest_released_at value' do
        january_release.update!(released_at: '2024-01-01T00:00:00Z')

        expect(resource.reload.latest_released_at).to eq(january_release.released_at)
      end
    end

    context 'when a release is destroyed' do
      it 'updates the latest_released_at value' do
        february_release.destroy!
        expect(resource.reload.latest_released_at).to eq(january_release.released_at)
      end
    end

    context 'when all releases associated with the catalog resource are destroyed' do
      it 'updates the latest_released_at value to nil' do
        january_release.destroy!
        february_release.destroy!

        expect(resource.reload.latest_released_at).to be_nil
      end
    end
  end
end
