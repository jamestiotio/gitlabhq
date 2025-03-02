---
info: For assistance with this Style Guide page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments-to-other-projects-and-subjects.
stage: none
group: unassigned
---

# Metadata

Each documentation Markdown page contains YAML front matter.
All values in the metadata are treated as strings and are used for the
docs website only.

## Stage and group metadata

Each page should have metadata related to the stage and group it
belongs to, as well as an information block. For example:

```yaml
---
stage: Example Stage
group: Example Group
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---
```

To populate the metadata, include this information:

- `stage`: The [Stage](https://about.gitlab.com/handbook/product/categories/#devops-stages)
  that the majority of the page's content belongs to.
- `group`: The [Group](https://about.gitlab.com/company/team/structure/#product-groups)
  that the majority of the page's content belongs to.
- `info`: How to find the Technical Writer associated with the page's stage and
  group.

## Additional metadata

The following metadata is optional and is not actively maintained.

- `description`: A short description of what the page is about. See the Google [Best practices for creating quality meta descriptions](https://developers.google.com/search/docs/appearance/snippet#meta-descriptions) for writing tips. This content can be used in search result snippets and is shown in social media previews.
- `feedback`: Set to `false` to not include the "Help & Feedback" footer.
- `noindex`: Set to `false` to prevent the page from being indexed by search engines.
- `redirect_to`: Used to control redirects. For more information, see [Redirects in GitLab documentation](redirects.md).
- `searchbar`: Set to `false` to not include the search bar in the page header.
- `toc`: Set to `false` to not include the "On this page" navigation.

## Batch updates for TW metadata

The [`CODEOWNERS`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/.gitlab/CODEOWNERS)
file contains a list of files and the associated technical writers.

When a merge request contains documentation, the information in the `CODEOWNERS` file determines:

- The list of users in the **Approvers** section.
- The technical writer that the GitLab Bot pings for community contributions.

You can use a Rake task to update the `CODEOWNERS` file.

### Update the `CODEOWNERS` file

When groups or [TW assignments](https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments)
change, you must update the `CODEOWNERS` file:

1. Update the [stage and group metadata](#stage-and-group-metadata) for any affected doc pages, if necessary. If there are many changes, you can do this step in a separate MR.
1. Update the [`codeowners.rake`](https://gitlab.com/gitlab-org/gitlab/blob/master/lib/tasks/gitlab/tw/codeowners.rake) file with the changes.
1. Go to the root of the `gitlab` repository.
1. Run the Rake task with this command: `bundle exec rake tw:codeowners`
1. Review the changes in the `CODEOWNERS` file.
1. Add and commit all your changes and push your branch up to `origin`.
1. Create a merge request and assign it to a technical writing manager for review.

When you update the `codeowners.rake` file:

- To specify multiple writers for a single group, use a space between writer names. Files are assigned to both writers.

  ```ruby
  CodeOwnerRule.new('Group Name', '@writer1 @writer2'),
  ```

  - To assign different writers within a group to docs in different directories, use the `path` parameter to specify a directory:

    ```ruby
    CodeOwnerRule.new('Group Name', ->(path) { path.start_with?('/doc/user') ? '@writer1' : '@writer2' }),
    ```

    In this example, `writer1` is a code owner for files related to this group that are in `/doc/user`.
    For everything else, `writer2` is made code owner. For an example, see [MR 127903](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/127903).

- For a group that does not have an assigned writer, include the group name in the file and comment out the line:

  ```ruby
  # CodeOwnerRule.new('Group Name', ''),
  ```
