---
stage: Plan
group: Project Management
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# GitLab quick actions **(FREE ALL)**

Quick actions are text-based shortcuts for common actions that are usually done
by selecting buttons or dropdowns in the GitLab user interface. You can enter
these commands in the descriptions or comments of issues, epics, merge requests,
and commits. Quick actions are executed from both new comments and description, and when you edit
existing ones.

Many quick actions are context-aware, requiring certain conditions be met. For example, to remove
an issue due date with `/remove_due_date`, the issue must have a due date set.

Be sure to enter each quick action on a separate line to allow GitLab to
properly detect and execute the commands.

## Parameters

Many quick actions require a parameter. For example, the `/assign` quick action
requires a username. GitLab uses [autocomplete characters](autocomplete_characters.md)
with quick actions to help users enter parameters, by providing a list of
available values.

If you manually enter a parameter, it must be enclosed in double quotation marks
(`"`), unless it contains only these characters:

- ASCII letters
- Numbers (0-9)
- Underscore (`_`), hyphen (`-`), question mark (`?`), dot (`.`), ampersand (`&`) or at (`@`)

Parameters are case-sensitive. Autocomplete handles this, and the insertion
of quotation marks, automatically.

## Issues, merge requests, and epics

The following quick actions are applicable to descriptions, discussions, and
threads. Some quick actions might not be available to all subscription tiers.

<!--
Keep this table sorted alphabetically

To auto-format this table, use the VS Code Markdown Table formatter: `https://docs.gitlab.com/ee/development/documentation/styleguide/#editor-extensions-for-table-formatting`.
-->

| Command                                                                                          | Issue                  | Merge request          | Epic                   | Action |
|:-------------------------------------------------------------------------------------------------|:-----------------------|:-----------------------|:-----------------------|:-------|
| `/add_contacts [contact:email1@example.com] [contact:email2@example.com]`                        | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Add one or more active [CRM contacts](../crm/index.md) ([introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/73413) in GitLab 14.6). |
| `/approve`                                                                                       | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Approve the merge request. |
| `/assign @user1 @user2`                                                                          | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Assign one or more users. |
| `/assign me`                                                                                     | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Assign yourself. |
| `/assign_reviewer @user1 @user2` or `/reviewer @user1 @user2` or `/request_review @user1 @user2` | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Assign one or more users as reviewers. |
| `/assign_reviewer me` or `/reviewer me` or `/request_review me`                                  | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Assign yourself as a reviewer. |
| `/award :emoji:`                                                                                 | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Toggle an emoji reaction. |
| `/blocked_by <issue1> <issue2>`                                                                  | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Mark the issue as blocked by other issues. The `<issue>` value should be in the format of `#issue`, `group/project#issue`, or the full issue URL. ([Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/214232) in GitLab 16.0). |
| `/blocks <issue1> <issue2>`                                                                      | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Mark the issue as blocking other issues. The `<issue>` value should be in the format of `#issue`, `group/project#issue`, or the full issue URL. ([Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/214232) in GitLab 16.0). |
| `/cc @user`                                                                                      | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Mention a user. In GitLab 15.0 and later, this command performs no action. You can instead type `CC @user` or only `@user`. [In GitLab 14.9 and earlier](https://gitlab.com/gitlab-org/gitlab/-/issues/31200), mentioning a user at the start of a line created a specific type of to-do item notification. |
| `/child_epic <epic>`                                                                             | **{dotted-circle}** No | **{dotted-circle}** No | **{check-circle}** Yes | Add child epic to `<epic>`. The `<epic>` value should be in the format of `&epic`, `group&epic`, or a URL to an epic. |
| `/clear_health_status`                                                                           | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Clear [health status](issues/managing_issues.md#health-status) ([introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/213814) in GitLab 14.7). |
| `/clear_weight`                                                                                  | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Clear weight. |
| `/clone <path/to/project> [--with_notes]`                                                        | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Clone the issue to given project, or the current one if no arguments are given. Copies as much data as possible as long as the target project contains equivalent objects like labels, milestones, or epics. Does not copy comments or system notes unless `--with_notes` is provided as an argument. |
| `/close`                                                                                         | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Close. |
| `/confidential`                                                                                  | **{check-circle}** Yes | **{dotted-circle}** No | **{check-circle}** Yes | Mark issue or epic as confidential. Support for epics [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/213741) in GitLab 15.6. |
| `/copy_metadata <!merge_request>`                                                                | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Copy labels and milestone from another merge request in the project. |
| `/copy_metadata <#issue>`                                                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Copy labels and milestone from another issue in the project. |
| `/create_merge_request <branch name>`                                                            | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Create a new merge request starting from the current issue. |
| `/done`                                                                                          | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Mark to-do item as done. |
| `/draft`                                                                                         | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Set the [draft status](merge_requests/drafts.md). |
| `/due <date>`                                                                                    | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Set due date. Examples of valid `<date>` include `in 2 days`, `this Friday` and `December 31st`. See [Chronic](https://gitlab.com/gitlab-org/ruby/gems/gitlab-chronic#examples) for more examples. |
| `/duplicate <#issue>`                                                                            | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Close this issue. Mark as a duplicate of, and related to, issue `<#issue>`. |
| `/epic <epic>`                                                                                   | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Add to epic `<epic>`. The `<epic>` value should be in the format of `&epic`, `group&epic`, or a URL to an epic. |
| `/estimate <time>` or `/estimate_time <time>`                                                    | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Set time estimate. For example, `/estimate 1mo 2w 3d 4h 5m`. For more information, see [Time tracking](time_tracking.md). Alias `/estimate_time` [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/16501) in GitLab 15.6. |
| `/health_status <value>`                                                                         | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Set [health status](issues/managing_issues.md#health-status). Valid options for `<value>` are `on_track`, `needs_attention`, and `at_risk` ([introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/213814) in GitLab 14.7). |
| `/invite_email email1 email2`                                                                    | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Add up to six email participants. This action is behind feature flag `issue_email_participants` and is not yet supported in issue templates. |
| `/iteration *iteration:"iteration name"`                                                         | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Set iteration. For example, to set the `Late in July` iteration: `/iteration *iteration:"Late in July"`. |
| `/label ~label1 ~label2` or `/labels ~label1 ~label2`                                            | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Add one or more labels. Label names can also start without a tilde (`~`), but mixed syntax is not supported. |
| `/link`                                                                                          | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Add a link and description to [linked resources](../../operations/incident_management/linked_resources.md) in an incident ([introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/374964) in GitLab 15.5). |
| `/lock`                                                                                          | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Lock the discussions. |
| `/merge`                                                                                         | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Merge changes. Depending on the project setting, this may be [when the pipeline succeeds](merge_requests/merge_when_pipeline_succeeds.md), or adding to a [Merge Train](../../ci/pipelines/merge_trains.md). |
| `/milestone %milestone`                                                                          | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Set milestone. |
| `/move <path/to/project>`                                                                        | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Move this issue to another project. Be careful when moving an issue to a project with different access rules. Before moving the issue, make sure it does not contain sensitive data. |
| `/page <policy name>`                                                                            | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Start escalations for the incident ([introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/79977) in GitLab 14.9). |
| `/parent_epic <epic>`                                                                            | **{dotted-circle}** No | **{dotted-circle}** No | **{check-circle}** Yes | Set parent epic to `<epic>`. The `<epic>` value should be in the format of `&epic`, `group&epic`, or a URL to an epic. |
| `/promote_to_incident`                                                                           | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Promote issue to incident ([introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/296787) in GitLab 14.5). In [GitLab 15.8 and later](https://gitlab.com/gitlab-org/gitlab/-/issues/376760), you can also use the quick action when creating a new issue. |
| `/promote`                                                                                       | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Promote issue to epic. |
| `/publish`                                                                                       | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Publish issue to an associated [Status Page](../../operations/incident_management/status_page.md). |
| `/ready`                                                                                         | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Set the [ready status](merge_requests/drafts.md#mark-merge-requests-as-ready) ([Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/90361) in GitLab 15.1). |
| `/reassign @user1 @user2`                                                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Replace current assignees with those specified. |
| `/reassign_reviewer @user1 @user2`                                                               | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Replace current reviewers with those specified. |
| `/rebase`                                                                                        | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Rebase source branch. This schedules a background task that attempts to rebase the changes in the source branch on the latest commit of the target branch. If `/rebase` is used, `/merge` is ignored to avoid a race condition where the source branch is merged or deleted before it is rebased. If there are merge conflicts, GitLab displays a message that a rebase cannot be scheduled. Rebase failures are displayed with the merge request status. |
| `/relabel ~label1 ~label2`                                                                       | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Replace current labels with those specified. |
| `/relate #issue1 #issue2`                                                                        | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Mark issues as related. |
| `/remove_child_epic <epic>`                                                                      | **{dotted-circle}** No | **{dotted-circle}** No | **{check-circle}** Yes | Remove child epic from `<epic>`. The `<epic>` value should be in the format of `&epic`, `group&epic`, or a URL to an epic. |
| `/remove_contacts [contact:email1@example.com] [contact:email2@example.com]`                     | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Remove one or more [CRM contacts](../crm/index.md) ([introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/73413) in GitLab 14.6). |
| `/remove_due_date`                                                                               | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Remove due date. |
| `/remove_epic`                                                                                   | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Remove from epic. |
| `/remove_estimate` or `/remove_time_estimate`                                                    | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Remove time estimate. Alias `/remove_time_estimate` [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/16501) in GitLab 15.6. |
| `/remove_iteration`                                                                              | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Remove iteration. |
| `/remove_milestone`                                                                              | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Remove milestone. |
| `/remove_parent_epic`                                                                            | **{dotted-circle}** No | **{dotted-circle}** No | **{check-circle}** Yes | Remove parent epic from epic. |
| `/remove_time_spent`                                                                             | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Remove time spent. |
| `/remove_zoom`                                                                                   | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Remove Zoom meeting from this issue. |
| `/reopen`                                                                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Reopen. |
| `/severity <severity>`                                                                           | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Set the severity. Issue type must be `Incident`. Options for `<severity>` are `S1` ... `S4`, `critical`, `high`, `medium`, `low`, `unknown`. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/334045) in GitLab 14.2. |
| `/shrug <comment>`                                                                               | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Append the comment with `¯\＿(ツ)＿/¯`. |
| `/spend <time> [<date>]` or `/spend_time <time> [<date>]`                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Add or subtract spent time. Optionally, specify the date that time was spent on. For example, `/spend 1mo 2w 3d 4h 5m 2018-08-26` or `/spend -1h 30m`. For more information, see [Time tracking](time_tracking.md). Alias `/spend_time` [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/16501) in GitLab 15.6. |
| `/submit_review`                                                                                 | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Submit a pending review. |
| `/subscribe`                                                                                     | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Subscribe to notifications. |
| `/tableflip <comment>`                                                                           | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Append the comment with `(╯°□°)╯︵ ┻━┻`. |
| `/target_branch <local branch name>`                                                             | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Set target branch. |
| `/timeline <timeline comment> \| <date(YYYY-MM-DD)> <time(HH:MM)>`                               | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Add a timeline event to this incident. For example, `/timeline DB load spiked \| 2022-09-07 09:30`. ([introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/368721) in GitLab 15.4). |
| `/title <new title>`                                                                             | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Change title. |
| `/todo`                                                                                          | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Add a to-do item. |
| `/unapprove`                                                                                     | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Unapprove the merge request. ([introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/8103) in GitLab 14.3). |
| `/unassign @user1 @user2`                                                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Remove specific assignees. |
| `/unassign_reviewer @user1 @user2` or `/remove_reviewer @user1 @user2`                           | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Remove specific reviewers. |
| `/unassign_reviewer me`                                                                          | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Remove yourself as a reviewer. |
| `/unassign_reviewer` or `/remove_reviewer`                                                       | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Remove all reviewers. |
| `/unassign`                                                                                      | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Remove all assignees. |
| `/unlabel ~label1 ~label2` or `/remove_label ~label1 ~label2`                                    | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Remove specified labels. |
| `/unlabel` or `/remove_label`                                                                    | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Remove all labels. |
| `/unlink <issue>`                                                                                | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Remove link with to the provided issue. The `<issue>` value should be in the format of `#issue`, `group/project#issue`, or the full issue URL. ([Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/414400) in GitLab 16.1). |
| `/unlock`                                                                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{dotted-circle}** No | Unlock the discussions. |
| `/unsubscribe`                                                                                   | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Unsubscribe from notifications. |
| `/weight <value>`                                                                                | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Set weight. Valid values are integers like `0`, `1`, or `2`. |
| `/zoom <Zoom URL>`                                                                               | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Add a Zoom meeting to this issue or incident. In [GitLab 15.3 and later](https://gitlab.com/gitlab-org/gitlab/-/issues/230853) users on GitLab Premium can add a short description when [adding a Zoom link to an incident](../../operations/incident_management/linked_resources.md#link-zoom-meetings-from-an-incident). |

## Work items

> Executing quick actions from comments [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/391282) in GitLab 15.10.

Work items in GitLab include [tasks](../tasks.md) and [OKRs](../okrs.md).
The following quick actions can be applied through the description field when editing or commenting on work items.

<!--
Keep this table sorted alphabetically

To auto-format this table, use the VS Code Markdown Table formatter: `https://docs.gitlab.com/ee/development/documentation/styleguide/#editor-extensions-for-table-formatting`.
-->

| Command                                                       | Task                   | Objective              | Key Result             | Action |
|:--------------------------------------------------------------|:-----------------------|:-----------------------|:-----------------------|:-------|
| `/assign @user1 @user2`                                       | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Assign one or more users. |
| `/assign me`                                                  | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Assign yourself. |
| `/add_child <work_item>`                                                                         | **{dotted-circle}** No | **{check-circle}** Yes | **{dotted-circle}** No | Add child to `<work_item>`. The `<work_item>` value should be in the format of `#iid`, `group/project#iid`, or a URL to a work item. Multiple work items can be added as children at the same time. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/420797) in GitLab 16.5. |
| `/award :emoji:`                                                                                 | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Toggle an emoji reaction. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/412275) in GitLab 16.5 |
| `/cc @user`                                                   | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Mention a user. In GitLab 15.0 and later, this command performs no action. You can instead type `CC @user` or only `@user`. [In GitLab 14.9 and earlier](https://gitlab.com/gitlab-org/gitlab/-/issues/31200), mentioning a user at the start of a line creates a specific type of to-do item notification. |
| `/checkin_reminder <cadence>`                                 | **{dotted-circle}** No| **{check-circle}** Yes | **{dotted-circle}** No | Schedule [check-in reminders](../okrs.md#schedule-okr-check-in-reminders). Options are `weekly`, `twice-monthly`, `monthly`, or `never` (default). [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/422761) in GitLab 16.4 with flags named `okrs_mvc` and `okr_checkin_reminders`.  |
| `/clear_health_status`                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Clear [health status](issues/managing_issues.md#health-status). |
| `/clear_weight`                                               | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Clear weight. |
| `/close`                                                      | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Close. |
| `/confidential`                                               | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Mark work item as confidential.  [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/412276) in GitLab 16.4. |
| `/done`                                                       | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Mark to-do item as done. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/412277) in GitLab 16.2. |
| `/due <date>`                                                 | **{check-circle}** Yes | **{dotted-circle}** No | **{check-circle}** Yes | Set due date. Examples of valid `<date>` include `in 2 days`, `this Friday` and `December 31st`. |
| `/health_status <value>`                                      | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Set [health status](issues/managing_issues.md#health-status). Valid options for `<value>` are `on_track`, `needs_attention`, or `at_risk`. |
| `/label ~label1 ~label2` or `/labels ~label1 ~label2`         | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Add one or more labels. Label names can also start without a tilde (`~`), but mixed syntax is not supported. |
| `/promote_to <type>`                                          | **{check-circle}** Yes | **{dotted-circle}** No | **{check-circle}** Yes | Promotes work item to specified type. Available options for `<type>`: `issue` (promote a task) or `objective` (promote a key result). [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/412534) in GitLab 16.1. |
| `/reassign @user1 @user2`                                     | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Replace current assignees with those specified. |
| `/relabel ~label1 ~label2`                                    | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Replace current labels with those specified. |
| `/remove_due_date`                                            | **{check-circle}** Yes | **{dotted-circle}** No | **{check-circle}** Yes | Remove due date. |
| `/reopen`                                                     | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Reopen. |
| `/set_parent <work_item>`                                     | **{check-circle}** Yes | **{dotted-circle}** No | **{check-circle}** Yes | Set parent work item to `<work_item>`. The `<work_item>` value should be in the format of `#iid`, `group/project#iid`, or a URL to a work item. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/420798) in GitLab 16.5. |
| `/shrug <comment>`                                            | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Append the comment with `¯\＿(ツ)＿/¯`. |
| `/subscribe`                                                  | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Subscribe to notifications. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/420796) in GitLab 16.4 |
| `/tableflip <comment>`                                        | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Append the comment with `(╯°□°)╯︵ ┻━┻`. |
| `/title <new title>`                                          | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Change title. |
| `/todo`                                                       | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Add a to-do item. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/412277) in GitLab 16.2. |
| `/type`                                                       | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Converts work item to specified type. Available options for `<type>` include `issue`, `task`, `objective` and `key result`. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/385227) in GitLab 16.0. |
| `/unassign @user1 @user2`                                     | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Remove specific assignees. |
| `/unassign`                                                   | **{dotted-circle}** No | **{check-circle}** Yes | **{check-circle}** Yes | Remove all assignees. |
| `/unlabel ~label1 ~label2` or `/remove_label ~label1 ~label2` | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Remove specified labels. |
| `/unlabel` or `/remove_label`                                 | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Remove all labels. |
| `/unsubscribe`                                                  | **{check-circle}** Yes | **{check-circle}** Yes | **{check-circle}** Yes | Unsubscribe to notifications. [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/420796) in GitLab 16.4 |
| `/weight <value>`                                             | **{check-circle}** Yes | **{dotted-circle}** No | **{dotted-circle}** No | Set weight. Valid options for `<value>` include `0`, `1`, and `2`. |

## Commit messages

The following quick actions are applicable for commit messages:

| Command                 | Action                                    |
|:----------------------- |:------------------------------------------|
| `/tag v1.2.3 <message>` | Tags the commit with an optional message. |

## Troubleshooting

### Quick action isn't executed

If you run a quick action, but nothing happens, check if the quick action appears in the autocomplete
box as you type it.
If it doesn't, it's possible that:

- The feature related to the quick action isn't available to you based on your subscription tier or
  user role in the group or project.
- A required condition for the quick action isn't met.
  For example, you're running `/unlabel` on an issue without any labels.
