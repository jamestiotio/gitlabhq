---
stage: Govern
group: Authentication
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Moderate users (administration) **(FREE SELF)**

This is the administration documentation. For information about moderating users at the group level, see the [group-level documentation](../user/group/moderate_users.md).

GitLab administrators can moderate user access by approving, blocking, banning, or deactivating
users.

## Users pending approval

A user in _pending approval_ state requires action by an administrator. A user sign up can be in a
pending approval state because an administrator has enabled any of the following options:

- [Require administrator approval for new sign-ups](../administration/settings/sign_up_restrictions.md#require-administrator-approval-for-new-sign-ups) setting.
- [User cap](../administration/settings/sign_up_restrictions.md#user-cap).
- [Block auto-created users (OmniAuth)](../integration/omniauth.md#configure-common-settings)
- [Block auto-created users (LDAP)](../administration/auth/ldap/index.md#basic-configuration-settings)

When a user registers for an account while this setting is enabled:

- The user is placed in a **Pending approval** state.
- The user sees a message telling them their account is awaiting approval by an administrator.

A user pending approval:

- Is functionally identical to a [blocked](#block-a-user) user.
- Cannot sign in.
- Cannot access Git repositories or the GitLab API.
- Does not receive any notifications from GitLab.
- Does not consume a [seat](../subscriptions/self_managed/index.md#billable-users).

An administrator must [approve their sign up](#approve-or-reject-a-user-sign-up) to allow them to
sign in.

### View user sign ups pending approval

To view user sign ups pending approval:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Pending approval** tab.

### Approve or reject a user sign up

A user sign up pending approval can be approved or rejected from the Admin Area.

To approve or reject a user sign up:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Pending approval** tab.
1. For the user sign up you want to approve or reject, select the vertical ellipsis (**{ellipsis_v}**), then **Approve** or **Reject**.

Approving a user:

- Activates their account.
- Changes the user's state to active.
- Consumes a subscription [seat](../subscriptions/self_managed/index.md#billable-users).

## Block and unblock users

GitLab administrators can block and unblock users.
You should block a user when you don't want them to access the instance, but you want to retain their data.

A blocked user:

- Cannot sign in or access any repositories. The blocked user's data remains in those repositories.
- Cannot use slash commands. For more information, see [slash commands](../user/project/integrations/gitlab_slack_application.md#slash-commands).
- Does not occupy a seat. For more information, see [billable users](../subscriptions/self_managed/index.md#billable-users).

### Block a user

Prerequisites:

- You must be an administrator for the instance.

You can block a user's access to the instance.

To block a user:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. For the user you want to block, select the vertical ellipsis (**{ellipsis_v}**), then **Block**.

The user receives an email notification that their account has been blocked. After this email, they no longer receive notifications.

To report abuse from other users, see [report abuse](../user/report_abuse.md). For more information on abuse reports in the Admin area, see [resolving abuse reports](../administration/review_abuse_reports.md#resolving-abuse-reports).

### Unblock a user

A blocked user can be unblocked from the Admin Area. To do this:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Blocked** tab.
1. For the user you want to unblock, select the vertical ellipsis (**{ellipsis_v}**), then **Unblock**.

The user's state is set to active and they consume a
[seat](../subscriptions/self_managed/index.md#billable-users).

NOTE:
Users can also be unblocked using the [GitLab API](../api/users.md#unblock-user).

The unblock option may be unavailable for LDAP users. To enable the unblock option,
the LDAP identity first needs to be deleted:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Blocked** tab.
1. Select a user.
1. Select the **Identities** tab.
1. Find the LDAP provider and select **Delete**.

## Activate and deactivate users

GitLab administrators can deactivate and activate users.
You should deactivate a user if they have no recent activity, and you don't want them to occupy a seat on the instance.

A deactivated user:

- Can sign in to GitLab.
  - If a deactivated user signs in, they are automatically activated.
- Cannot access repositories or the API.
- Cannot use slash commands. For more information, see [slash commands](../user/project/integrations/gitlab_slack_application.md#slash-commands).
- Does not occupy a seat. For more information, see [billable users](../subscriptions/self_managed/index.md#billable-users).

When you deactivate a user, their projects, groups, and history remain.

### Deactivate a user

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/22257) in GitLab 12.4.

Prerequisites:

- The user has had no activity in the last 90 days.

To deactivate a user:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. For the user you want to deactivate, select the vertical ellipsis (**{ellipsis_v}**) and then **Deactivate**.
1. On the dialog, select **Deactivate**.

The user receives an email notification that their account has been deactivated. After this email, they no longer receive notifications.
For more information, see [user deactivation emails](../administration/settings/email.md#user-deactivation-emails).

To deactivate users with the GitLab API, see [deactivate user](../api/users.md#deactivate-user). For information about permanent user restrictions, see [block and unblock users](#block-and-unblock-users).

### Automatically deactivate dormant users

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/320875) in GitLab 14.0.
> - Exclusion of GitLab generate bots [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/340346) in GitLab 14.5
> - Customizable time period [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/336747) in GitLab 15.4
> - The lower limit for inactive period set to 90 days [introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/100793) in GitLab 15.5

Administrators can enable automatic deactivation of users who either:

- Were created more than a week ago and have not signed in.
- Have no activity for a specified period of time (default and minimum is 90 days).

To do this:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Settings > General**.
1. Expand the **Account and limit** section.
1. Under **Dormant users**, check **Deactivate dormant users after a period of inactivity**.
1. Under **Days of inactivity before deactivation**, enter the number of days before deactivation. Minimum value is 90 days.
1. Select **Save changes**.

When this feature is enabled, GitLab runs a job once a day to deactivate the dormant users.

A maximum of 100,000 users can be deactivated per day.

NOTE:
GitLab generated bots are excluded from the automatic deactivation of dormant users.

### Automatically delete unconfirmed users **(PREMIUM SELF)**

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/352514) in GitLab 16.1 [with a flag](../administration/feature_flags.md) named `delete_unconfirmed_users_setting`. Disabled by default.
> - [Enabled by default](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/124982) in GitLab 16.2.

Prerequisites:

- You must be an administrator.

You can enable automatic deletion of users who both:

- Never confirmed their email address.
- Signed up for GitLab more than a specified number of days in the past.

You can configure these settings using either the [Settings API](../api/settings.md) or in a Rails console:

```ruby
 Gitlab::CurrentSettings.update(delete_unconfirmed_users: true)
 Gitlab::CurrentSettings.update(unconfirmed_users_delete_after_days: 365)
```

When the `delete_unconfirmed_users` setting is enabled, GitLab runs a job once an hour to delete the unconfirmed users.
The job only deletes users who signed up more than `unconfirmed_users_delete_after_days` days in the past.

This job only runs when the `email_confirmation_setting` is set to `soft` or `hard`.

A maximum of 240,000 users can be deleted per day.

### Activate a user

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/22257) in GitLab 12.4.

A deactivated user can be activated from the Admin Area.

To do this:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Deactivated** tab.
1. For the user you want to activate, select the vertical ellipsis (**{ellipsis_v}**), then **Activate**.

The user's state is set to active and they consume a
[seat](../subscriptions/self_managed/index.md#billable-users).

NOTE:
A deactivated user can also activate their account themselves by logging back in via the UI.
Users can also be activated using the [GitLab API](../api/users.md#activate-user).

## Ban and unban users

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/327353) in GitLab 14.2 [with a flag](../administration/feature_flags.md) named `ban_user_feature_flag`. Disabled by default.
> - Ban and unban users [generally available](https://gitlab.com/gitlab-org/gitlab/-/issues/327353) in GitLab 14.8. Feature flag `ban_user_feature_flag` removed.
> - Hiding merge requests of banned users [introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/107836) in GitLab 15.8 [with a flag](../administration/feature_flags.md) named `hide_merge_requests_from_banned_users`. Disabled by default.
> - Hiding comments of banned users [introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/112973) in GitLab 15.11 [with a flag](../administration/feature_flags.md) named `hidden_notes`. Disabled by default.
> - Hiding projects of banned users [introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/121488) in GitLab 16.2 [with a flag](../administration/feature_flags.md) named `hide_projects_of_banned_users`. Disabled by default.

GitLab administrators can ban and unban users.
You should ban a user when you want to block them and hide their activity from the instance.

A banned user:

- Is blocked from the instance. The banned user's projects, issues, merge requests, and comments are hidden.
- Does not occupy a [seat](../subscriptions/self_managed/index.md#billable-users).

### Ban a user

To block a user and hide their contributions, administrators can ban the user.

Users can be banned using the Admin Area. To do this:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. For the user you want to ban, select the vertical ellipsis (**{ellipsis_v}**), then **Ban user**.

### Unban a user

A banned user can be unbanned using the Admin Area. To do this:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Banned** tab.
1. For the user you want to unban, select the vertical ellipsis (**{ellipsis_v}**), then **Unban user**.

The user's state is set to active and they consume a
[seat](../subscriptions/self_managed/index.md#billable-users).

## Delete a user

Use the Admin Area to delete users.

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. For the user you want to delete, select the vertical ellipsis (**{ellipsis_v}**), then **Delete user**.
1. Type the username.
1. Select **Delete user**.

NOTE:
You can only delete a user if there are inherited or direct owners of a group. You cannot delete a user if they are the only group owner.

You can also delete a user and their contributions, such as merge requests, issues, and groups of which they are the only group owner.

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. For the user you want to delete, select the vertical ellipsis (**{ellipsis_v}**), then **Delete user and contributions**.
1. Type the username.
1. Select **Delete user and contributions**.

NOTE:
Before 15.1, additionally groups of which deleted user were the only owner among direct members were deleted.

## Trust and untrust users

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/132402) in GitLab 16.5.

You can trust and untrust users from the Admin Area.

By default, a user is not trusted and is blocked from creating issues, notes, and snippets considered to be spam. When you trust a user, they can create issues, notes, and snippets without being blocked.

Prerequisites:

- You must be an administrator.

::Tabs

:::TabTitle Trust a user

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select a user.
1. From the **User administration** dropdown list, select **Trust user**.
1. On the confirmation dialog, select **Trust user**.

The user is trusted.

:::TabTitle Untrust a user

1. On the left sidebar, at the bottom, select **Admin Area**.
1. Select **Overview > Users**.
1. Select the **Trusted** tab.
1. Select a user.
1. From the **User administration** dropdown list, select **Untrust user**.
1. On the confirmation dialog, select **Untrust user**.

The user is untrusted.

::EndTabs

## Troubleshooting

When moderating users, you may need to perform bulk actions on them based on certain conditions. The following rails console scripts show some examples of this. You may [start a rails console session](../administration/operations/rails_console.md#starting-a-rails-console-session) and use scripts similar to the following:

### Deactivate users that have no recent activity

Administrators can deactivate users that have no recent activity.

WARNING:
Commands that change data can cause damage if not run correctly or under the right conditions. Always run commands in a test environment first and have a backup instance ready to restore.

```ruby
days_inactive = 90
inactive_users = User.active.where("last_activity_on <= ?", days_inactive.days.ago)

inactive_users.each do |user|
    puts "user '#{user.username}': #{user.last_activity_on}"
    user.deactivate!
end
```

### Block users that have no recent activity

Administrators can block users that have no recent activity.

WARNING:
Commands that change data can cause damage if not run correctly or under the right conditions. Always run commands in a test environment first and have a backup instance ready to restore.

```ruby
days_inactive = 90
inactive_users = User.active.where("last_activity_on <= ?", days_inactive.days.ago)

inactive_users.each do |user|
    puts "user '#{user.username}': #{user.last_activity_on}"
    user.block!
end
```

### Block or delete users that have no projects or groups

Administrators can block or delete users that have no projects or groups.

WARNING:
Commands that change data can cause damage if not run correctly or under the right conditions. Always run commands in a test environment first and have a backup instance ready to restore.

```ruby
users = User.where('id NOT IN (select distinct(user_id) from project_authorizations)')

# How many users are removed?
users.count

# If that count looks sane:

# You can either block the users:
users.each { |user|  user.blocked? ? nil  : user.block! }

# Or you can delete them:
  # need 'current user' (your user) for auditing purposes
current_user = User.find_by(username: '<your username>')

users.each do |user|
  DeleteUserWorker.perform_async(current_user.id, user.id)
end
```
