---
stage: Create
group: Source Code
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Merge request approval settings **(PREMIUM ALL)**

You can configure the settings for [merge request approvals](index.md) to
ensure the approval rules meet your use case. You can also configure
[approval rules](rules.md), which define the number and type of users who must
approve work before it's merged. Merge request approval settings define how
those rules are applied as a merge request moves toward completion.

## Edit merge request approval settings

To view or edit merge request approval settings:

1. Go to your project and select **Settings > Merge requests**.
1. Expand **Approvals**.

### Approval settings

These settings limit who can approve merge requests:

- [**Prevent approval by author**](#prevent-approval-by-author):
  Prevents the author of a merge request from approving it.
- [**Prevent approvals by users who add commits**](#prevent-approvals-by-users-who-add-commits):
  Prevents users who add commits to a merge request from also approving it.
- [**Prevent editing approval rules in merge requests**](#prevent-editing-approval-rules-in-merge-requests):
  Prevents users from overriding project level approval rules on merge requests.
- [**Require user re-authentication (password or SAML) to approve**](#require-user-re-authentication-to-approve):
  Force potential approvers to first authenticate with either a password or with SAML.
- Code Owner approval removals: Define what happens to existing approvals when
  commits are added to the merge request.
  - **Keep approvals**: Do not remove any approvals.
  - [**Remove all approvals**](#remove-all-approvals-when-commits-are-added-to-the-source-branch):
    Remove all existing approvals.
  - [**Remove approvals by Code Owners if their files changed**](#remove-approvals-by-code-owners-if-their-files-changed):
    If a Code Owner approves a merge request, and a later commit changes files
    they are a Code Owner for, their approval is removed.

## Prevent approval by author

> Moved to GitLab Premium in 13.9.

By default, the author of a merge request cannot approve it. To change this setting:

1. On the left sidebar, select **Settings > Merge requests**.
1. In the **Merge request approvals** section, scroll to **Approval settings** and
   clear the **Prevent approval by author** checkbox.
1. Select **Save changes**.

Authors can edit the approval rule in an individual merge request and override
this setting, unless you configure one of these options:

- [Prevent overrides of default approvals](#prevent-editing-approval-rules-in-merge-requests) at
  the project level.
- *(Self-managed instances only)* Prevent overrides of default approvals
  [at the instance level](../../../../administration/admin_area.md). When configured
  at the instance level, you can't edit this setting at the project or individual
  merge request levels.

## Prevent approvals by users who add commits

> - Moved to GitLab Premium in 13.9.
> - [Feature flag `keep_merge_commits_for_approvals`](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/127744) added in GitLab 16.3 to also include merge commits in this check.
> - [Feature flag `keep_merge_commits_for_approvals`](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/131778) removed in GitLab 16.5. This check now includes merge commits.

By default, users who commit to a merge request can still approve it. At both
the project level or [instance level](../../../../administration/admin_area.md),
you can prevent committers from approving merge requests that are partially
their own. To do this:

1. On the left sidebar, select **Settings > Merge requests**.
1. In the **Merge request approvals** section, scroll to **Approval settings** and
   select **Prevent approvals by users who add commits**.
   If this checkbox is cleared, an administrator has disabled it
   [at the instance level](../../../../administration/admin_area.md), and
   it can't be changed at the project level.
1. Select **Save changes**.

Depending on your version of GitLab, [code owners](../../codeowners/index.md) who commit
to a merge request may or may not be able to approve the work:

- In GitLab 13.10 and earlier, code owners who commit
  to a merge request can approve it, even if the merge request affects files they own.
- In [GitLab 13.11 and later](https://gitlab.com/gitlab-org/gitlab/-/issues/331548),
  code owners who commit
  to a merge request cannot approve it, when the merge request affects files they own.

For more information, see the [official Git documentation](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History).

## Prevent editing approval rules in merge requests

By default, users can override the approval rules you [create for a project](rules.md)
on a per-merge-request basis. If you don't want users to change approval rules
on merge requests, you can disable this setting:

1. On the left sidebar, select **Settings > Merge requests**.
1. In the **Merge request approvals** section, scroll to **Approval settings** and
   select **Prevent editing approval rules in merge requests**.
1. Select **Save changes**.

This change affects all open merge requests.

When this field is changed, it can affect all open merge requests depending on the setting:

- If users could edit approval rules previously, and you disable this behavior,
  all open merge requests are updated to enforce the approval rules.
- If users could **not** edit approval rules previously, and you enable approval rule
  editing, open merge requests remain unchanged. This preserves any changes already
  made to approval rules in those merge requests.

## Require user re-authentication to approve

> Requiring re-authentication by using SAML authentication for GitLab.com groups [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/5981) in GitLab 16.6 [with a flag](../../../../administration/feature_flags.md) named `ff_require_saml_auth_to_approve`. Disabled by default.

FLAG:
On self-managed GitLab, by default requiring re-authentication by using SAML authentication is not available. To make it available, an administrator can
[enable the feature flag](../../../../administration/feature_flags.md) named `ff_require_saml_auth_to_approve`. On GitLab.com, this feature is not available.

You can force potential approvers to first authenticate with either:

- A password.
- SAML. Available on GitLab.com groups only.

This permission enables an electronic signature for approvals, such as the one defined by
[Code of Federal Regulations (CFR) Part 11](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=11&showFR=1&subpartNode=21:1.0.1.1.8.3)):

1. Enable password authentication and SAML authentication. For more information on:
   - Password authentication, see
     [sign-in restrictions documentation](../../../../administration/settings/sign_in_restrictions.md#password-authentication-enabled).
   - SAML authentication for GitLab.com groups, see
     [SAML SSO for GitLab.com groups documentation](../../../../user/group/saml_sso).
1. On the left sidebar, select **Settings > Merge requests**.
1. In the **Merge request approvals** section, scroll to **Approval settings** and
   select **Require user re-authentication (password or SAML) to approve**.
1. Select **Save changes**.

## Remove all approvals when commits are added to the source branch

By default, an approval on a merge request is removed when you add more changes
after the approval. In GitLab Premium and Ultimate tiers, to keep existing approvals
after more changes are added to the merge request:

1. On the left sidebar, select **Settings > Merge requests**.
1. In the **Merge request approvals** section, scroll to **Approval settings** and
   clear the **Remove all approvals** checkbox.

   NOTE:
   This setting is not available in GitLab Free.

1. Select **Save changes**.

Approvals aren't removed when a merge request is [rebased from the UI](../methods/index.md#rebasing-in-semi-linear-merge-methods)
However, approvals are reset if the target branch is changed.

## Remove approvals by Code Owners if their files changed

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/90578) in GitLab 15.3.

If you only want to remove approvals by Code Owners whose files have been changed when a commit is added:

Prerequisites:

- You must have at least the Maintainer role for a project.

To do this:

1. On the left sidebar, select **Settings > Merge requests**.
1. In the **Merge request approvals** section, scroll to **Approval settings** and
   select **Remove approvals by Code Owners if their files changed**.
1. Select **Save changes**.

## Settings cascading

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/285410) in GitLab 14.4. [Deployed behind the `group_merge_request_approval_settings_feature_flag` flag](../../../../administration/feature_flags.md), disabled by default.
> - [Enabled by default](https://gitlab.com/gitlab-org/gitlab/-/issues/285410) in GitLab 14.5.
> - [Feature flag `group_merge_request_approval_settings_feature_flag`](https://gitlab.com/gitlab-org/gitlab/-/issues/343872) removed in GitLab 14.9.

You can also enforce merge request approval settings:

- At the [instance level](../../../../administration/admin_area.md), which apply to all groups
  on an instance and, therefore, all projects.
- On a [top-level group](../../../group/manage.md#group-merge-request-approval-settings), which apply to all subgroups
  and projects.

If the settings are inherited by a group or project, they cannot be changed in the group or project
that inherited them.

## Related topics

- [Instance-level merge request approval settings](../../../../administration/admin_area.md)
- [Compliance center](../../../compliance/compliance_center/index.md)
- [Merge request approvals API](../../../../api/merge_request_approvals.md)
