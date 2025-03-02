---
stage: Create
group: Code Review
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Commit message templates **(FREE ALL)**

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/20263) in GitLab 14.5.
> - Squash commit templates [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/345275) in GitLab 14.6.

GitLab uses commit templates to create default messages for specific types of
commits. These templates encourage commit messages to follow a particular format,
or contain specific information. Users can override these templates when merging
a merge request.

Commit templates use syntax similar to the syntax for
[review suggestions](reviews/suggestions.md#configure-the-commit-message-for-applied-suggestions).

## Configure commit templates

Change the commit templates for your project if the default templates don't
contain the information you need.

Prerequisites:

- You must have at least the Maintainer role for a project.

To do this:

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Settings > Merge requests**.
1. Depending on the type of template you want to create, scroll to either
   [**Merge commit message template**](#default-template-for-merge-commits) or
   [**Squash commit message template**](#default-template-for-squash-commits).
1. For your desired commit type, enter your default message. You can use both static
   text and [variables](#supported-variables-in-commit-templates). Each template
   is limited to a maximum of 500 characters, though after replacing the templates
   with data, the final message may be longer.
1. Select **Save changes**.

## Default template for merge commits

The default template for merge commit messages is:

```plaintext
Merge branch '%{source_branch}' into '%{target_branch}'

%{title}

%{issues}

See merge request %{reference}
```

## Default template for squash commits

If you have configured your project to [squash commits on merge](squash_and_merge.md),
GitLab creates a squash commit message with this template:

```plaintext
%{title}
```

## Supported variables in commit templates

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/20263) in GitLab 14.5.
> - `first_commit` and `first_multiline_commit` variables [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/346805) in GitLab 14.6.
> - `url`, `approved_by`, and `merged_by` variables [introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/75639) in GitLab 14.7.
> - `co_authored_by` variable [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/20421) in GitLab 14.7.
> - `all_commits` variable [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/26303) in GitLab 14.9.
> - `reviewed_by` variable [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/378352) in GitLab 15.7.
> - `local_reference` variable [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/199823) in GitLab 16.1.
> - `source_project_id` variables [introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/128553) in GitLab 16.3.

Commit message templates support these variables:

| Variable | Description | Output example |
|----------|-------------|----------------|
| `%{source_branch}` | The name of the branch being merged. | `my-feature-branch` |
| `%{target_branch}` | The name of the branch that the changes are applied to. | `main` |
| `%{title}`         | Title of the merge request. | `Fix tests and translations` |
| `%{issues}`        | String with phrase `Closes <issue numbers>`. Contains all issues mentioned in the merge request description that match [issue closing patterns](../issues/managing_issues.md#closing-issues-automatically). Empty if no issues are mentioned. | `Closes #465, #190 and #400` |
| `%{description}`   | Description of the merge request. | `Merge request description.`<br>`Can be multiline.` |
| `%{reference}`     | Reference to the merge request. | `group-name/project-name!72359` |
| `%{local_reference}` | Local reference to the merge request. | `!72359` |
| `%{source_project_id}` | ID of the merge request's source project. | `123` |
| `%{first_commit}`  | Full message of the first commit in merge request diff. | `Update README.md` |
| `%{first_multiline_commit}` | Full message of the first commit that's not a merge commit and has more than one line in message body. Merge request title if all commits aren't multiline. | `Update README.md`<br><br>`Improved project description in readme file.` |
| `%{url}`           | Full URL to the merge request. | `https://gitlab.com/gitlab-org/gitlab/-/merge_requests/1` |
| `%{reviewed_by}`   | Line-separated list of the merge request reviewers, based on users who submit a review via batch comments, in a `Reviewed-by` Git commit trailer format. | `Reviewed-by: Sidney Jones <sjones@example.com>` <br> `Reviewed-by: Zhang Wei <zwei@example.com>` |
| `%{approved_by}`   | Line-separated list of the merge request approvers in a `Approved-by` Git commit trailer format. | `Approved-by: Sidney Jones <sjones@example.com>` <br> `Approved-by: Zhang Wei <zwei@example.com>` |
| `%{merged_by}`     | User who merged the merge request. | `Alex Garcia <agarcia@example.com>` |
| `%{co_authored_by}` | Names and emails of commit authors in a `Co-authored-by` Git commit trailer format. Limited to authors of 100 most recent commits in merge request. | `Co-authored-by: Zane Doe <zdoe@example.com>` <br> `Co-authored-by: Blake Smith <bsmith@example.com>` |
| `%{all_commits}`   | Messages from all commits in the merge request. Limited to 100 most recent commits. Skips commit bodies exceeding 100 KiB and merge commit messages. | `* Feature introduced` <br><br> `This commit implements feature` <br> `Changelog:added` <br><br> `* Bug fixed` <br><br> `* Documentation improved` <br><br>`This commit introduced better docs.`|

Any line containing only an empty variable is removed. If the line to be removed is both
preceded and followed by an empty line, the preceding empty line is also removed.

After you edit a commit message on an open merge request, GitLab
automatically updates the commit message again.
To restore the commit message to the project template, reload the page.

## Related topics

- [Squash and merge](squash_and_merge.md).
