<!-- Title suggestion: [Feature flag] Enable <feature-flag-name> -->

[main-issue]: MAIN-ISSUE-LINK

## Summary

This issue is to roll out [the feature][main-issue] on production,
that is currently behind the `<feature-flag-name>` feature flag.

## Owners

- Most appropriate Slack channel to reach out to: `#g_TEAM_NAME`
- Best individual to reach out to: GITLAB_USERNAME_OF_DRI

## Expectations

### What are we expecting to happen?

<!-- Describe the expected outcome when rolling out this feature -->

### What can go wrong and how would we detect it?

<!-- Data loss, broken pages, stability/availability impact? -->

<!-- Which dashboards from https://dashboards.gitlab.net are most relevant? -->

## Rollout Steps

Note: Please make sure to run the chatops commands in the Slack channel that gets impacted by the command.

### Rollout on non-production environments

- Verify the MR with the feature flag is merged to `master` and have been deployed to non-production environments with `/chatops run auto_deploy status <merge-commit-of-your-feature>`
<!-- Delete Incremental roll out if it is not relevant to this deploy -->
- [ ] Deploy the feature flag at a percentage (recommended percentage: 50%) with `/chatops run feature set <feature-flag-name> <rollout-percentage> --actors --dev --staging --staging-ref`
- [ ] Monitor that the error rates did not increase (repeat with a different percentage as necessary).
<!-- End of block for deletes -->
- [ ] Enable the feature globally on non-production environments with `/chatops run feature set <feature-flag-name> true --dev --staging --staging-ref`
- [ ] Verify that the feature works as expected.
      The best environment to validate the feature in is [`staging-canary`](https://about.gitlab.com/handbook/engineering/infrastructure/environments/#staging-canary)
      as this is the first environment deployed to. Make sure you are [configured to use canary](https://next.gitlab.com/).
- [ ] If the feature flag causes end-to-end tests to fail, disable the feature flag on staging to avoid blocking [deployments](https://about.gitlab.com/handbook/engineering/deployments-and-releases/deployments/).

For assistance with end-to-end test failures, please reach out via the [`#test-platform` Slack channel](https://gitlab.slack.com/archives/C3JJET4Q6). Note that end-to-end test failures on `staging-ref` [don't block deployments](https://about.gitlab.com/handbook/engineering/infrastructure/environments/staging-ref/#how-to-use-staging-ref).

### Specific rollout on production

For visibility, all `/chatops` commands that target production should be executed in the [`#production` Slack channel](https://gitlab.slack.com/archives/C101F3796)
and cross-posted (with the command results) to the responsible team's Slack channel.

- Ensure that the feature MRs have been deployed to both production and canary with `/chatops run auto_deploy status <merge-commit-of-your-feature>`
- [ ] Depending on the [type of actor](https://docs.gitlab.com/ee/development/feature_flags/#feature-actors) you are using, pick one of these options:
  - For **project-actor**: `/chatops run feature set --project=gitlab-org/gitlab,gitlab-org/gitlab-foss,gitlab-com/www-gitlab-com <feature-flag-name> true`
  - For **group-actor**: `/chatops run feature set --group=gitlab-org,gitlab-com <feature-flag-name> true`
  - For **user-actor**: `/chatops run feature set --user=<your-username> <feature-flag-name> true`
- [ ] Verify that the feature works for the specific actors.

### Preparation before global rollout

- [ ] Set a milestone to this rollout issue to signal for enabling and removing the feature flag when it is stable.
- [ ] Check if the feature flag change needs to be accompanied with a
  [change management issue](https://about.gitlab.com/handbook/engineering/infrastructure/change-management/#feature-flags-and-the-change-management-process).
  Cross link the issue here if it does.
- [ ] Ensure that you or a representative in development can be available for at least 2 hours after feature flag updates in production.
  If a different developer will be covering, or an exception is needed, please inform the oncall SRE by using the `@sre-oncall` Slack alias.
- [ ] Ensure that documentation exists for the feature, and the [version history text](https://docs.gitlab.com/ee/development/documentation/feature_flags.html#add-version-history-text) has been updated.
- [ ] Leave a comment on [the feature issue][main-issue] announcing estimated time when this feature flag will be enabled on GitLab.com.
- [ ] Ensure that any breaking changes have been announced following the [release post process](https://about.gitlab.com/handbook/marketing/blog/release-posts/#deprecations-removals-and-breaking-changes) to ensure GitLab customers are aware.
- [ ] Notify the [`#support_gitlab-com` Slack channel](https://gitlab.slack.com/archives/C4XFU81LG) and your team channel ([more guidance when this is necessary in the dev docs](https://docs.gitlab.com/ee/development/feature_flags/controls.html#communicate-the-change)).
- [ ] Ensure that the feature flag rollout plan is reviewed by another developer familiar with the domain.

### Global rollout on production

For visibility, all `/chatops` commands that target production should be executed in the [`#production` Slack channel](https://gitlab.slack.com/archives/C101F3796)
and cross-posted (with the command results) to the responsible team's Slack channel (`#g_TEAM_NAME`).

- [ ] (Optional) [Incrementally roll out](https://docs.gitlab.com/ee/development/feature_flags/controls.html#process) the feature on production environment.
  - Between every step wait for at least 15 minutes and monitor the appropriate graphs on https://dashboards.gitlab.net.
  - Perform **actor-based** rollout: `/chatops run feature set <feature-flag-name> <rollout-percentage> --actors`
- [ ] Enable the feature globally on production environment: `/chatops run feature set <feature-flag-name> true`
- [ ] Observe appropriate graphs on https://dashboards.gitlab.net and verify that services are not affected.
- [ ] Leave a comment on [the feature issue][main-issue] announcing that the feature has been globally enabled.
- [ ] Wait for [at least one day for the verification term](https://about.gitlab.com/handbook/product-development-flow/feature-flag-lifecycle/#including-a-feature-behind-feature-flag-in-the-final-release).

### (Optional) Release the feature with the feature flag

**WARNING:** This approach has the downside that it makes it difficult for us to
[clean up](https://docs.gitlab.com/ee/development/feature_flags/controls.html#cleaning-up) the flag.
For example, on-premise users could disable the feature on their GitLab instance. But when you
remove the flag at some point, they suddenly see the feature as enabled and they can't roll it back
to the previous behavior. To avoid this potential breaking change, use this approach only for urgent
matters.

<details><summary>See instructions if you're sure about enabling the feature globally through the feature flag definition</summary>

If you're still unsure whether the feature is [deemed stable](https://about.gitlab.com/handbook/product-development-flow/feature-flag-lifecycle/#including-a-feature-behind-feature-flag-in-the-final-release)
but want to release it in the current milestone, you can change the default state of the feature flag to be enabled.
To do so, follow these steps:

- [ ] Create a merge request with the following changes. Ask for review and merge it.
    - [ ] Set the `default_enabled` attribute in [the feature flag definition](https://docs.gitlab.com/ee/development/feature_flags/#feature-flag-definition-and-validation) to `true`.
    - [ ] Decide [which changelog entry](https://docs.gitlab.com/ee/development/feature_flags/#changelog) is needed.
- [ ] Ensure that the default-enabling MR has been included in the release package.
      If the merge request was deployed before [the monthly release was tagged](https://about.gitlab.com/handbook/engineering/releases/#self-managed-releases-1),
      the feature can be officially announced in a release blog post: `/chatops run release check <merge-request-url> <milestone>`
- [ ] Consider cleaning up the feature flag from all environments by running these chatops command in `#production` channel. Otherwise these settings may override the default enabled: `/chatops run feature delete <feature-flag-name> --dev --staging --staging-ref --production`
- [ ] Close [the feature issue][main-issue] to indicate the feature will be released in the current milestone.
- [ ] Set the next milestone to this rollout issue for scheduling [the flag removal](#release-the-feature).
- [ ] (Optional) You can [create a separate issue](https://gitlab.com/gitlab-org/gitlab/-/issues/new?issuable_template=Feature%20Flag%20Cleanup) for scheduling the steps below to [Release the feature](#release-the-feature).
    - [ ] Set the title to "[Feature flag] Cleanup `<feature-flag-name>`".
    - [ ] Execute the `/copy_metadata <this-rollout-issue-link>` quick action to copy the labels from this rollout issue.
    - [ ] Link this rollout issue as a related issue.
    - [ ] Close this rollout issue.

</details>

### Release the feature

After the feature has been [deemed stable](https://about.gitlab.com/handbook/product-development-flow/feature-flag-lifecycle/#including-a-feature-behind-feature-flag-in-the-final-release),
the [clean up](https://docs.gitlab.com/ee/development/feature_flags/controls.html#cleaning-up)
should be done as soon as possible to permanently enable the feature and reduce complexity in the
codebase.

You can either [create a follow-up issue for Feature Flag Cleanup](https://gitlab.com/gitlab-org/gitlab/-/issues/new?issuable_template=Feature%20Flag%20Cleanup) or use the checklist below in this same issue.

<!-- The checklist here is to help stakeholders keep track of the feature flag status -->
- [ ] Create a merge request to remove the `<feature-flag-name>` feature flag. Ask for review/approval/merge as usual. The MR should include the following changes:
    - Remove all references to the feature flag from the codebase.
    - Remove the YAML definitions for the feature from the repository.
    - Create [a changelog entry](https://docs.gitlab.com/ee/development/feature_flags/#changelog).
- [ ] Ensure that the cleanup MR has been included in the release package.
      If the merge request was deployed before [the monthly release was tagged](https://about.gitlab.com/handbook/engineering/releases/#self-managed-releases-1),
      the feature can be officially announced in a release blog post: `/chatops run release check <merge-request-url> <milestone>`
- [ ] Close [the feature issue][main-issue] to indicate the feature will be released in the current milestone.
- [ ] Clean up the feature flag from all environments by running these chatops command in `#production` channel: `/chatops run feature delete <feature-flag-name> --dev --ops --pre --staging --staging-ref --production`
- [ ] Close this rollout issue.

## Rollback Steps

- [ ] This feature can be disabled by running the following Chatops command:

```
/chatops run feature set <feature-flag-name> false
```

/label ~group::
/label ~"feature flag"
/assign me
/due in 2 weeks
