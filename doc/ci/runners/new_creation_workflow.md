---
stage: Verify
group: Runner
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Migrating to the new runner registration workflow **(FREE ALL)**

DISCLAIMER:
This page contains information related to upcoming products, features, and functionality.
It is important to note that the information presented is for informational purposes only.
Please do not rely on this information for purchasing or planning purposes.
As with all projects, the items mentioned on this page are subject to change or delay.
The development, release, and timing of any products, features, or functionality remain at the
sole discretion of GitLab Inc.

In GitLab 16.0, we introduced a new runner creation workflow that uses runner authentication tokens to register
runners. The legacy workflow that uses registration tokens is deprecated and will be removed in GitLab 18.0.

For information about the current development status of the new workflow, see [epic 7663](https://gitlab.com/groups/gitlab-org/-/epics/7663).

For information about the technical design and reasons for the new architecture, see [Next GitLab Runner Token Architecture](../../architecture/blueprints/runner_tokens/index.md).

If you experience problems or have concerns about the new runner registration workflow,
or if the following information is not sufficient,
you can let us know in the [feedback issue](https://gitlab.com/gitlab-org/gitlab/-/issues/387993).

## The new runner registration workflow

For the new runner registration workflow, you:

1. [Create a runner](runners_scope.md) directly in the GitLab UI.
1. Receive a runner authentication token.
1. Use the runner authentication token instead of the registration token when you register
   a runner with this configuration. Runner managers registered in multiple hosts appear
   under the same runner in the GitLab UI, but with an identifying system ID.

The new runner registration workflow has the following benefits:

- Preserved ownership records for runners, and minimized impact on users.
- The addition of a unique system ID ensures that you can reuse the same authentication token across
multiple runners. For more information, see [Reusing a GitLab Runner configuration](https://docs.gitlab.com/runner/fleet_scaling/#reusing-a-gitlab-runner-configuration).

## Estimated time frame for planned changes

- In GitLab 15.10 and later, you can use the new runner registration workflow.
- In GitLab 17.0, we plan to disable runner registration tokens.
- In GitLab 18.0, we plan to completely remove support for runner registration tokens.

## Prevent your runner registration workflow from breaking

Until GitLab 17.0, you can still use the legacy runner registration workflow.

In GitLab 17.0, the legacy runner registration workflow will be disabled automatically. You will be able to manually re-enable the legacy runner registration workflow for a limited time. For more information, see
[Using registration tokens after GitLab 17.0](#using-registration-tokens-after-gitlab-170).

If no action is taken before your GitLab instance is upgraded to GitLab 17.0, then your runner registration
workflow will break.

To avoid a broken workflow, you must:

1. [Create a shared runner](runners_scope.md#create-a-shared-runner-with-a-runner-authentication-token) and obtain the authentication token.
1. Replace the registration token in your runner registration workflow with the
authentication token.

## Using registration tokens after GitLab 17.0

To continue using registration tokens after GitLab 17.0:

- On GitLab.com, you can manually re-enable the legacy runner registration process in the top-level group settings until GitLab 18.0.
- On GitLab self-managed, you can manually re-enable the legacy runner registration process in the Admin Area settings until GitLab 18.0.

Plans to implement a UI setting to re-enable registration tokens are proposed in [issue 411923](https://gitlab.com/gitlab-org/gitlab/-/issues/411923)

## Impact on existing runners

Existing runners will continue to work as usual even after 18.0. This change only affects registration of new runners.

## Changes to the `gitlab-runner register` command syntax

The `gitlab-runner register` command will stop accepting registration tokens and instead accept new runner
authentication tokens generated in the GitLab runners administration page.
The runner authentication tokens are recognizable by their `glrt-` prefix.

When you create a runner in the GitLab UI, you specify configuration values that were previously command-line options
prompted by the `gitlab-runner register` command.
These command-line options have been [deprecated](../../update/deprecations.md#registration-tokens-and-server-side-runner-arguments-in-post-apiv4runners-endpoint).

If you specify a runner authentication token with:

- the `--token` command-line option, the `gitlab-runner register` command does not accept the configuration values.
- the `--registration-token` command-line option, the `gitlab-runner register` command ignores the configuration values.

| Token                                  | Registration command                                                                                      |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Runner authentication token            | `gitlab-runner register --token $RUNNER_AUTHENTICATION_TOKEN`                                             |
| Runner registration token (deprecated) | `gitlab-runner register --registration-token $RUNNER_REGISTRATION_TOKEN <runner configuration arguments>` |

Authentication tokens have the prefix, `glrt-`.

To ensure minimal disruption to your automation workflow,
[legacy-compatible registration processing](https://docs.gitlab.com/runner/register/#legacy-compatible-registration-process)
triggers if a runner authentication token is specified in the legacy parameter `--registration-token`.

Example command for GitLab 15.9:

```shell
gitlab-runner register \
    --non-interactive \
    --executor "shell" \
    --url "https://gitlab.com/" \
    --tag-list "shell,mac,gdk,test" \
    --run-untagged "false" \
    --locked "false" \
    --access-level "not_protected" \
    --registration-token "GR1348941C6YcZVddc8kjtdU-yWYD"
```

In GitLab 15.10 and later, you create the runner and some of the attributes in the UI, like the
tag list, locked status, and access level.
In GitLab 15.11 and later, these attributes are no longer accepted as arguments to `register` when a runner authentication token with the `glrt-` prefix is specified.

The following example shows the new command:

```shell
gitlab-runner register \
    --non-interactive \
    --executor "shell" \
    --url "https://gitlab.com/" \
    --token "glrt-2CR8_eVxiioB1QmzPZwa"
```

## Impact on autoscaling

In autoscaling scenarios such as GitLab Runner Operator or GitLab Runner Helm Chart, the
registration token is replaced with the runner authentication token generated from the UI.
This means that the same runner configuration is reused across jobs, instead of creating a runner
for each job.
The specific runner can be identified by the unique system ID that is generated when the runner
process is started.

## Creating runners programmatically

In GitLab 15.11 and later, you can use the [POST /user/runners REST API](../../api/users.md#create-a-runner-linked-to-a-user)
to create a runner as an authenticated user. This should only be used if the runner configuration is dynamic
or not reusable. If the runner configuration is static, you should reuse the runner authentication token of
an existing runner.

For instructions about how to automate runner creation and registration, see the tutorial,
[Automate runner creation and registration](../../tutorials/automate_runner_creation/index.md).

## Installing GitLab Runner with Helm chart

Several runner configuration options cannot be set during runner registration. These options can only be configured:

- When you create a runner in the UI.
- With the `user/runners` REST API endpoint.

The following configuration options are no longer supported in [`values.yaml`](https://gitlab.com/gitlab-org/charts/gitlab-runner/-/blob/main/values.yaml):

```yaml
## All these fields are DEPRECATED and the runner WILL FAIL TO START if you specify them
runnerRegistrationToken: ""
locked: true
tags: ""
maximumTimeout: ""
runUntagged: true
protected: true
```

If you store the runner authentication token in `secrets`, you must also modify them.

In the legacy runner registration workflow, fields were specified with:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gitlab-runner-secret
type: Opaque
data:
  runner-registration-token: "REDACTED" # DEPRECATED, set to ""
  runner-token: ""
```

In the new runner registration workflow, you must use `runner-token` instead:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gitlab-runner-secret
type: Opaque
data:
  runner-registration-token: "" # need to leave as an empty string for compatibility reasons
  runner-token: "REDACTED"
```

NOTE:
If your secret management solution doesn't allow you to set an empty string for `runner-registration-token`,
you can set it to any string - it will be ignored when `runner-token` is present.

## Known issues

### Pod name is not visible in runner details page

When you use the new registration workflow to register your runners with the Helm chart, the pod name is not visible
in the runner details page.
For more information, see [issue 423523](https://gitlab.com/gitlab-org/gitlab/-/issues/423523).

### Runner authentication token does not update when rotated

When you use the new registration workflow to register your runners with the GitLab Operator,
the runner authentication token referenced by the Custom Resource Definition does not update when the token is rotated.
This occurs when:

- You're using a runner authentication token (prefixed with `glrt-`) in a secret
  [referenced by a Custom Resource Definition](https://docs.gitlab.com/runner/install/operator.html#install-gitlab-runner).
- The runner authentication token is due to expire.
  For more information about runner authentication token expiration,
  see [Authentication token security](configure_runners.md#authentication-token-security).

For more information, see [issue 186](https://gitlab.com/gitlab-org/gl-openshift/gitlab-runner-operator/-/issues/186).
