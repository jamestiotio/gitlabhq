---
stage: Govern
group: Authentication
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Make new users confirm email **(FREE SELF)**

GitLab can be configured to require confirmation of a user's email address when
the user signs up. When this setting is enabled, the user is unable to sign in until
they confirm their email address.

1. On the left sidebar, at the bottom, select **Admin Area**.
1. On the left sidebar, select **Settings > General**.
1. Expand **Sign-up restrictions** and look for the **Email confirmation settings** options.

## Confirmation token expiry

By default, a user can confirm their account within 24 hours after the confirmation email was sent.
After 24 hours, the confirmation token becomes invalid.

## Automatically delete unconfirmed users **(PREMIUM SELF)**

When email confirmation is turned on, administrators can enable the setting to
[automatically delete unconfirmed users](../administration/moderate_users.md#automatically-delete-unconfirmed-users).
