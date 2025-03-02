---
stage: Manage
group: Import and Integrate
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# GitLab for Slack app administration **(FREE SELF)**

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/358872) for self-managed instances in GitLab 16.2.

NOTE:
This page contains information about administering the GitLab for Slack app for self-managed instances. For user documentation, see [GitLab for Slack app](../../user/project/integrations/gitlab_slack_application.md).

The GitLab for Slack app distributed through the Slack App Directory only works with GitLab.com.
On self-managed GitLab, you can create your own copy of the GitLab for Slack app from a [manifest file](https://api.slack.com/reference/manifests#creating_apps) and configure your instance.

The app is a private one-time copy installed in your Slack workspace only and not distributed through the Slack App Directory. To have the [GitLab for Slack app](../../user/project/integrations/gitlab_slack_application.md) on your self-managed instance, you must enable the integration.

## Create a GitLab for Slack app

Prerequisites:

- You must be at least a [Slack workspace administrator](https://slack.com/help/articles/360018112273-Types-of-roles-in-Slack).

To create a GitLab for Slack app:

- **In GitLab**:

  1. On the left sidebar, at the bottom, select **Admin Area**.
  1. On the left sidebar, select **Settings > General**.
  1. Expand **GitLab for Slack app**.
  1. Select **Create Slack app**.

You're then redirected to Slack for the next steps.

- **In Slack**:

  1. Select the Slack workspace to create the app in, then select **Next**.
  1. Slack displays a summary of the app for review. To view the complete manifest, select **Edit Configurations**. To go back to the review summary, select **Next**.
  1. Select **Create**.
  1. Select **Got it** to close the dialog.
  1. Select **Install to Workspace**.

## Configure the settings

After you've [created a GitLab for Slack app](#create-a-gitlab-for-slack-app), you can configure the settings in GitLab:

1. On the left sidebar, at the bottom, select **Admin Area**.
1. On the left sidebar, select **Settings > General**.
1. Expand **GitLab for Slack app**.
1. Select the **Enable GitLab for Slack app** checkbox.
1. Enter the details of your GitLab for Slack app:
   1. Go to [Slack API](https://api.slack.com/apps).
   1. Search for and select **GitLab (\<your host name\>)**.
   1. Scroll to **App Credentials**.
1. Select **Save changes**.

### Test your configuration

To test your GitLab for Slack app configuration:

1. Enter the `/gitlab help` slash command into a channel in your Slack workspace.
1. Press <kbd>Enter</kbd>.

You should see a list of available Slash commands.

To use Slash commands for a project, configure the [GitLab for Slack app](../../user/project/integrations/gitlab_slack_application.md) for the project.

## Update the GitLab for Slack app

Prerequisites:

- You must be at least a [Slack workspace administrator](https://slack.com/help/articles/360018112273-Types-of-roles-in-Slack).

When GitLab releases new features for the GitLab for Slack app, you might have to manually update your copy to use the new features.

To update your copy of the GitLab for Slack app:

- **In GitLab**:

  1. On the left sidebar, at the bottom, select **Admin Area**.
  1. On the left sidebar, select **Settings > General**.
  1. Expand **GitLab for Slack app**.
  1. Select **Download latest manifest file** to download `slack_manifest.json`.

- **In Slack**:

  1. Go to [Slack API](https://api.slack.com/apps).
  1. Search for and select **GitLab (\<your host name\>)**.
  1. On the left sidebar, select **App Manifest**.
  1. Select the **JSON** tab to switch to a JSON view of the manifest.
  1. Copy the contents of the `slack_manifest.json` file you've downloaded from GitLab.
  1. Paste the contents into the JSON viewer to replace any existing contents.
  1. Select **Save Changes**.

## Connectivity requirements

To enable the GitLab for Slack app functionality, your network must allow inbound and outbound connections between GitLab and Slack.

- For [Slack notifications](../../user/project/integrations/gitlab_slack_application.md#slack-notifications), the GitLab instance must be able to send requests to `https://slack.com`.
- For [Slash commands](../../user/project/integrations/gitlab_slack_application.md#slash-commands) and other features, the GitLab instance must be able to receive requests from `https://slack.com`.

## Troubleshooting

When administering the GitLab for Slack app for self-managed instances, you might encounter the following issues.

For GitLab.com, see [GitLab for Slack app](../../user/project/integrations/gitlab_slack_application.md#troubleshooting).

### Slash commands return an error in Slack

Slash commands might return `/gitlab failed with the error "dispatch_failed"` in Slack. To resolve this issue, ensure:

- The GitLab for Slack app is properly [configured](#configure-the-settings) and the **Enable GitLab for Slack app** checkbox is selected.
- Your GitLab instance [allows requests to and from Slack](#connectivity-requirements).
