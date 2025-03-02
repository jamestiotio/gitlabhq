---
stage: Service Management
group: Respond
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Use Service Desk **(FREE ALL)**

You can use Service Desk to [create an issue](#as-an-end-user-issue-creator) or [respond to one](#as-a-responder-to-the-issue).
In these issues, you can also see our friendly neighborhood [Support Bot](configure.md#support-bot-user).

## View Service Desk email address

To check what the Service Desk email address is for your project:

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Monitor > Service Desk**.

The email address is available at the top of the issue list.

## As an end user (issue creator)

> Support for additional email headers [introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/346600) in GitLab 14.6. In earlier versions, the Service Desk email address had to be in the "To" field.

To create a Service Desk issue, an end user does not need to know anything about
the GitLab instance. They just send an email to the address they are given, and
receive an email back confirming receipt:

![Service Desk enabled](img/service_desk_confirmation_email.png)

This also gives the end user an option to unsubscribe.

If they don't choose to unsubscribe, then any new comments added to the issue
are sent as emails:

![Service Desk reply email](img/service_desk_reply.png)

Any responses they send via email are displayed in the issue itself.

For information about headers used for treating email, see
[the incoming email documentation](../../../administration/incoming_email.md#accepted-headers).

## As a responder to the issue

For responders to the issue, everything works just like other GitLab issues.
GitLab displays a familiar-looking issue tracker where responders can see
issues created through customer support requests, and filter or interact with them.

![Service Desk Issue tracker](img/service_desk_issue_tracker.png)

Messages from the end user are shown as coming from the special
[Support Bot user](../../../subscriptions/self_managed/index.md#billable-users).
You can read and write comments as you usually do in GitLab:

![Service Desk issue thread](img/service_desk_thread.png)

- The project's visibility (private, internal, public) does not affect Service Desk.
- The path to the project, including its group or namespace, is shown in emails.

### View Service Desk issues

Prerequisites:

- You must have at least the Reporter role for the project.

To view Service Desk issues:

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Monitor > Service Desk**.

#### Redesigned issue list

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/413092) in GitLab 16.1 [with a flag](../../../administration/feature_flags.md) named `service_desk_vue_list`. Disabled by default.
> - [Enabled on GitLab.com and self-managed](https://gitlab.com/gitlab-org/gitlab/-/issues/413092) in GitLab 16.5.

FLAG:
On self-managed GitLab, by default this feature is available. To hide the feature per project or for your entire instance, an administrator can [disable the feature flag](../../../administration/feature_flags.md) named `service_desk_vue_list`.
On GitLab.com, this feature is available.

When this feature is enabled, the Service Desk issue list more closely matches the regular issue list.
Available features include:

- The same sorting and ordering options [as on the issue list](../issues/sorting_issue_lists.md).
- The same filters, including [the OR operator](#filter-with-the-or-operator) and [filtering by issue ID](#filter-issues-by-id).

There is no longer an option to create a new issue from the Service Desk issue list.
This decision better reflects the nature of Service Desk, where new issues are created by emailing
a dedicated email address.

##### Filter the list of issues

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Monitor > Service Desk**.
1. Above the list of issues, select **Search or filter results...**.
1. In the dropdown list that appears, select the attribute you want to filter by.
1. Select or type the operator to use for filtering the attribute. The following operators are
   available:
   - `=`: Is
   - `!=`: Is not one of
1. Enter the text to filter the attribute by.
   You can filter some attributes by **None** or **Any**.
1. Repeat this process to filter by multiple attributes. Multiple attributes are joined by a logical
   `AND`.

##### Filter with the OR operator

When [filtering with the OR operator](../issues/managing_issues.md#filter-with-the-or-operator) is enabled,
you can use **is one of: `||`**
when you [filter the list of issues](#filter-the-list-of-issues) by:

- Assignees
- Labels

`is one of` represents an inclusive OR. For example, if you filter by `Assignee is one of Sidney Jones` and
`Assignee is one of Zhang Wei`, GitLab shows issues where either `Sidney`, `Zhang`, or both of them are assignees.

##### Filter issues by ID

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Monitor > Service Desk**.
1. In the **Search** box, type the issue ID. For example, enter filter `#10` to return only issue 10.

## Email contents and formatting

### Special HTML formatting in HTML emails

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/109811) in GitLab 15.9 [with a flag](../../../administration/feature_flags.md) named `service_desk_html_to_text_email_handler`. Disabled by default.
> - [Generally available](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/116809) in GitLab 15.11. Feature flag `service_desk_html_to_text_email_handler` removed.

HTML emails show HTML formatting, such as:

- Tables
- Blockquotes
- Images
- Collapsible sections

### Files attached to comments

> - [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/11733) in GitLab 15.8 [with a flag](../../../administration/feature_flags.md) named `service_desk_new_note_email_native_attachments`. Disabled by default.
> - [Enabled on GitLab.com and self-managed](https://gitlab.com/gitlab-org/gitlab/-/issues/386860) in GitLab 15.10.
> - [Generally available](https://gitlab.com/gitlab-org/gitlab/-/issues/11733) in GitLab 16.6. Feature flag `service_desk_new_note_email_native_attachments` removed.

If a comment contains any attachments and their total size is less than or equal to 10 MB, these
attachments are sent as part of the email. In other cases, the email contains links to the attachments.

In GitLab 15.9 and earlier, uploads to a comment are sent as links in the email.

## Privacy considerations

> [Changed](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/108901) the minimum required role to view the creator's and participant's email in GitLab 15.9.

Service Desk issues are [confidential](../issues/confidential_issues.md), so they are
only visible to project members. The project owner can
[make an issue public](../issues/confidential_issues.md#in-an-existing-issue).
When a Service Desk issue becomes public, the issue creator's and participants' email addresses are
visible to signed-in users with at least the Reporter role for the project.

In GitLab 15.8 and earlier, when a Service Desk issue becomes public, the issue creator's email
address is disclosed to everyone who can view the project.

Anyone in your project can use the Service Desk email address to create an issue in this project, **regardless
of their role** in the project.

The unique internal email address is visible to project members at least
the Reporter role in your GitLab instance.
An external user (issue creator) cannot see the internal email address
displayed in the information note.

### Moving a Service Desk issue

> [Changed](https://gitlab.com/gitlab-org/gitlab/-/issues/372246) in GitLab 15.7: customers continue receiving notifications when a Service Desk issue is moved.

You can move a Service Desk issue the same way you
[move a regular issue](../issues/managing_issues.md#move-an-issue) in GitLab.

If a Service Desk issue is moved to a different project with Service Desk enabled,
the customer who created the issue continues to receive email notifications.
Because a moved issue is first closed, then copied, the customer is considered to be a participant
in both issues. They continue to receive any notifications in the old issue and the new one.
