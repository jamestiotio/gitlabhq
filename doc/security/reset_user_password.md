---
stage: Govern
group: Authentication
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Reset a user's password **(FREE SELF)**

You can reset user passwords by using the UI, a Rake task, a Rails console, or the
[Users API](../api/users.md#user-modification).

## Prerequisites

To reset a user password, you must be an administrator of a self-managed GitLab instance.

The user's new password must meet all [password requirements](../user/profile/user_passwords.md#password-requirements).

## Use the UI

To reset a user's password in the UI:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. On the left sidebar, select **Overview > Users**.
1. For the user whose password you want to update, select **Edit**.
1. In the **Password** area, type a password and password confirmation.
1. Select **Save changes**.

A confirmation is displayed.

## Use a Rake task

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/52347) in GitLab 13.9.

Use the following Rake task to reset a user's password.

::Tabs

:::TabTitle Linux package (Omnibus)

```shell
sudo gitlab-rake "gitlab:password:reset"
```

:::TabTitle Self-compiled (source)

```shell
bundle exec rake "gitlab:password:reset"
```

::EndTabs

GitLab requests a username, a password, and confirmation of the password. When complete, the user's password is updated.

The Rake task can take a username as an argument. For example, to reset the password for the user with username
`sidneyjones`:

::Tabs

:::TabTitle Linux package (Omnibus)

  ```shell
  sudo gitlab-rake "gitlab:password:reset[sidneyjones]"
  ```

:::TabTitle Self-compiled (source)

  ```shell
  bundle exec rake "gitlab:password:reset[sidneyjones]"
  ```

::EndTabs

## Use a Rails console

If you know the username, user ID, or email address, you can use the Rails console to reset their password:

1. Open a [Rails console](../administration/operations/rails_console.md).
1. Find the user:

   - By username:

     ```ruby
     user = User.find_by_username 'exampleuser'
     ```

   - By user ID:

     ```ruby
     user = User.find(123)
     ```

   - By email address:

     ```ruby
     user = User.find_by(email: 'user@example.com')
     ```

1. Reset the password by setting a value for `user.password` and `user.password_confirmation`. For example, to set a new random
   password:

   ```ruby
   new_password = ::User.random_password
   user.password = new_password
   user.password_confirmation = new_password
   user.password_automatically_set = false
   ```

   To set a specific value for the new password:

   ```ruby
   new_password = 'examplepassword'
   user.password = new_password
   user.password_confirmation = new_password
   user.password_automatically_set = false
   ```

1. Optional. Notify the user that an administrator changed their password:

   ```ruby
   user.send_only_admin_changed_your_password_notification!
   ```

1. Save the changes:

   ```ruby
   user.save!
   ```

1. Exit the console:

   ```ruby
   exit
   ```

## Reset the root password

To reset the root password, follow the steps listed previously.

- If the root account name hasn't changed, use the username `root`.
- If the root account name has changed and you don't know the new username,
  you might be able to use a Rails console with user ID `1`. In almost all
  cases, the first user is the default administrator account.

## Troubleshooting

Use the following information to troubleshoot issues when resetting a
user's password.

### Email confirmation issues

If the new password doesn't work, it might be [an email confirmation issue](../user/upgrade_email_bypass.md). You can
attempt to fix this issue in a Rails console. For example, if a new `root` password isn't working:

1. Start a [Rails console](../administration/operations/rails_console.md).
1. Find the user and skip reconfirmation:

   ```ruby
   user = User.find(1)
   user.skip_reconfirmation!
   ```

1. Attempt to sign in again.

### Unmet password requirements

The password might be too short, too weak, or not meet complexity
requirements. Ensure the password you are attempting to set meets all
[password requirements](../user/profile/user_passwords.md#password-requirements).

### Expired password

You might not be able to reset a user's expired password due to the [Password Expired error on Git Fetch via SSH for LDAP users](../topics/git/troubleshooting_git.md#password-expired-error-on-git-fetch-via-ssh-for-ldap-user).
