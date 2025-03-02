# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'User searches for wiki pages', :js, :clean_gitlab_redis_rate_limiting,
  feature_category: :global_search do
  include ListboxHelpers
  let_it_be(:user) { create(:user) }
  let_it_be(:project) { create(:project, :repository, :wiki_repo, namespace: user.namespace) }
  let_it_be(:wiki_page) do
    create(:wiki_page, wiki: project.wiki, title: 'directory/title', content: 'Some Wiki content')
  end

  before do
    project.add_maintainer(user)
    sign_in(user)

    visit(search_path)
  end

  include_examples 'top right search form'
  include_examples 'search timeouts', 'wiki_blobs' do
    let(:additional_params) { { project_id: project.id } }
  end

  shared_examples 'search wiki blobs' do
    it 'finds a page' do
      find('[data-testid="project-filter"]').click

      wait_for_requests

      page.within('[data-testid="project-filter"]') do
        select_listbox_item project.name
      end

      fill_in('dashboard_search', with: search_term)
      find('.gl-search-box-by-click-search-button').click
      select_search_scope('Wiki')

      page.within('.results') do
        expect(page).to have_link(wiki_page.title, href: project_wiki_path(project, wiki_page.slug))
      end
    end
  end

  context 'when searching by content' do
    it_behaves_like 'search wiki blobs' do
      let(:search_term) { 'content' }
    end
  end

  context 'when searching by title' do
    it_behaves_like 'search wiki blobs' do
      let(:search_term) { 'title' }
    end
  end
end
