---
stage: none
group: unassigned
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# Profile preferences **(FREE ALL)**

You can update your preferences to change the look and feel of GitLab.

## Change the color theme

You can change the color theme of the GitLab UI. These colors are displayed on the left sidebar.
Using individual color themes might help you differentiate between your different
GitLab instances.

To change the color theme:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. In the **Color theme** section, select a theme.

### Dark mode

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/28252) in GitLab 13.1 as an [Experiment](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/28252).

Dark mode makes elements on the GitLab UI stand out on a dark background.

- To turn on Dark mode, Select **Preferences > Color theme > Dark Mode**.

Dark mode works only with the **Dark** Syntax highlighting theme. You can report and view issues, send feedback, and track progress in [epic 2092](https://gitlab.com/groups/gitlab-org/-/epics/2902).

## Change the syntax highlighting theme

> Changing the default syntax highlighting theme for authenticated and unauthenticated users [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/25129) in GitLab 15.1.

Syntax highlighting is a feature in code editors and IDEs. The highlighter assigns a color to each type of code, such as strings and comments.

To change the syntax highlighting theme:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. In the **Syntax highlighting theme** section, select a theme.
1. Select **Save changes**.

To view the updated syntax highlighting theme, refresh your project's page.

To customize the syntax highlighting theme, you can also [use the Application settings API](../../api/settings.md#list-of-settings-that-can-be-accessed-via-api-calls). Use `default_syntax_highlighting_theme` to change the syntax highlighting colors on a more granular level.

If these steps do not work, your programming language might not be supported by the syntax highlighters.
For more information, view [Rouge Ruby Library](https://github.com/rouge-ruby/rouge) for guidance on code files and Snippets. View [Monaco Editor](https://microsoft.github.io/monaco-editor/) and [Monarch](https://microsoft.github.io/monaco-editor/monarch.html) for guidance on the Web IDE.

## Change the diff colors

Diffs use two different background colors to show changes between versions of code. By default, the original file is in red, and the changes are in green.

To change the diff colors:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Diff colors** section.
1. Select a color or enter a color code.
1. Select **Save changes**.

To change back to the default colors, clear the **Color for removed lines** and **Color for added lines** text boxes and select **Save changes**.

## Behavior

Use the **Behavior** section to customize the behavior and layout of your GitLab self-managed instance. You can change your layout width and choose the default content for your homepage, group and project overview pages. You have options to customize appearance and function, like whitespace rendering, file display, and text automation.

### Change the layout width on the UI

You can stretch content on the GitLab UI to fill the entire page. By default, page content is fixed at 1280 pixels wide.

To change the layout width of your UI:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Under **Layout width**, choose **Fixed** or **Fluid**.
1. Select **Save changes**.

### Choose your homepage

Control what page you view when you select the GitLab logo (**{tanuki}**). You can set your homepage to be Projects (default), Your Groups, Your Activity, and other content.

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. For **Homepage**, select a default.
1. Select **Save changes**.

### Customize default content on your group overview page

You can change the main content on your group overview page. Your group overview page is the page that shows when you select **Groups** on the left sidebar. You can customize the default content for your group overview page to the:

- Details Dashboard (default), which includes an overview of group activities and projects.
- Security Dashboard, which might include group security policies and other security topics.

For more information, view [Groups](../../user/group/index.md).

To change the default content on your group overview page:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. For **Group overview content**, select an option.
1. Select **Save changes**.

### Customize default content on your project overview page

Your project overview page is the page you view when you select **Project overview** on the left sidebar. You can set your main project overview page to the Activity page, the README file, and other content.

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. For **Project overview content**, select an option.
1. Select **Save changes**.

### Hide shortcut buttons

Shortcut buttons precede the list of files on a project's overview page. These buttons provide links to parts of a project, such as the README file or license agreements.

To hide shortcut buttons on the project overview page:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Clear the **Show shortcut buttons above files on project overview** checkbox.
1. Select **Save changes**.

### Show whitespace characters in the Web IDE

Whitespace characters are any blank characters in a text, such as spaces and indentations. You might use whitespace to structure content in code. If your programming language is sensitive to whitespaces, the Web IDE can detect changes to them.

To render whitespace in the Web IDE:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Select the **Render whitespace characters in the Web IDE** checkbox.
1. Select **Save changes**.

You can view changes to whitespace in diffs.

To view diffs on the Web IDE, follow these steps:

1. On the left sidebar, select **Source Control** (**{branch}**).
1. Under the **Changes** tab, select your file.

### Show whitespace changes in diffs

View changes to whitespace in diff files. For more information on whitespaces, view the previous task.

To view changes to whitespace in diffs:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Select the **Show whitespace changes in diffs** checkbox.
1. Select **Save changes**.

For more information on diffs, view [Change the diff colors](#change-the-diff-colors).

### Show one file per page in a merge request

The **Changes** tab lets you view all file changes in a merge request on one page.
Instead, you can choose to view one file at a time.

To show one file per page on the **Changes** tab:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Select the **Show one file at a time on merge request's Changes tab** checkbox.
1. Select **Save changes**.

Then, to move between files on the **Changes** tab, below each file, select the **Previous** and **Next** buttons.

### Auto-enclose characters

Automatically add the corresponding closing character to text when you type the opening character. For example, you can automatically insert a closing bracket when you type an opening bracket. This setting works only in description and comment boxes and for the following characters: `**"`, `'`, ```, `(`, `[`, `{`, `<`, `*`, `_**`.

To auto-enclose characters in description and comment boxes:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Select the **Surround text selection when typing quotes or brackets** checkbox.
1. Select **Save changes**.

In a description or comment box, you can now type a word, highlight it, then type an
opening character. Instead of replacing the text, the closing character is added to the end.

### Automate new list items

Create a new list item when you press <kbd>Enter</kbd> in a list in description and comment boxes.

To add a new list item when you press the <kbd>Enter</kbd> key:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. Select the **Automatically add new list items** checkbox.
1. Select **Save changes**.

### Change the tab width

Change the default size of tabs in diffs, blobs, and snippets. The WebIDE, file editor, and Markdown editor do not support this feature.

To adjust the default tab width:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Behavior** section.
1. For **Tab width**, enter a value.
1. Select **Save changes**.

## Localization

Change localization settings such as your language, calendar start day, and time preferences.

### Change your display language on the GitLab UI

GitLab supports multiple languages on the UI. To help improve translations or request support for an unlisted language, view [Translating GitLab](../../development/i18n/translation.md).

To choose a language for the GitLab UI:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Localization** section.
1. Under **Language**, select an option.
1. Select **Save changes**.

You might need to refresh your page to view the updated language.

### Customize your contribution calendar start day

Choose which day of the week the contribution calendar starts with. The contribution calendar shows project contributions over the past year. You can view this calendar on each user profile. To access your user profile:

- On the left sidebar, select your avatar > select your name or username.

To change your contribution calendar start day:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Localization** section.
1. Under **First day of the week**, select an option.
1. Select **Save changes**.

After you change your calendar start day, refresh your user profile page.

### Show exact times instead of relative times

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/65570) in GitLab 14.1.

Customize the format used to display times of activities on your group and project overview pages and user profiles. You can display times in a:

- Relative format, for example `30 minutes ago`.
- Absolute format, for example `September 3, 2022, 3:57 PM`.

To use exact times on the GitLab UI:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Time preferences** section.
1. Clear the **Use relative times** checkbox.
1. Select **Save changes**.

### Customize time format

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/15206) in GitLab 16.6.

You can customize the format used to display times of activities on your group and project overview pages and user
profiles. You can display times as:

- 12 hour format. For example: `2:34 PM`.
- 24 hour format. For example: `14:34`.

You can also follow your system's setting.

To customize the time format:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Go to the **Time preferences** section.
1. Under **Time format**, select either the **System**, **12-hour**, or **24-hour** option.
1. Select **Save changes**.

## User identities in CI job JSON web tokens

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/387537) in GitLab 16.0.

CI/CD jobs generate JSON web tokens, which can include a list of your external identities.
Instead of making separate API calls to get individual accounts, you can find your user identities in a single authentication token.

External identities are not included by default.
To enable including external identities, see [Token payload](../../ci/secrets/id_token_authentication.md#token-payload).

## Control follower engagement

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/issues/325558) in GitLab 16.0.

Turn off the ability to follow or be followed by other GitLab users. By default, your user profile, including your name and profile photo, is public in the **Following** tabs of other users. When you deactivate this setting:

- GitLab deletes all of your followers and followed connections.
- GitLab automatically removes your user profile from the pages of each connection.

To remove the ability to be followed by and follow other users:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Clear the **Enable follow users** checkbox.
1. Select **Save changes**.

To access your **Followers** and **Following** tabs:

- On the left sidebar, select your avatar > select your name or username.
- Select **Followers** or **Following**.

## Enable Code Suggestions

> [Introduced](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/121079) in GitLab 16.1 as [Beta](../../policy/experiment-beta-support.md#beta).

Code Suggestions are disabled by default at the user account level.

To update this setting:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Select the **Enable Code Suggestions** checkbox.
1. Select **Save changes**.

NOTE:
If Code Suggestions are disabled [for any groups that you belong to](../../user/group/manage.md#enable-code-suggestions), then you cannot enable them for yourself. (Your setting has no effect.)

## Integrate your GitLab instance with third-party services

Give third-party services access to your GitLab account.

### Integrate your GitLab instance with Gitpod

Configure your GitLab instance with Gitpod when you want to launch and manage code directly from your GitLab browser. Gitpod automatically prepares and builds development environments for your projects.

To integrate with Gitpod:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Find the **Integrations** section.
1. Select the **Enable Gitpod integration** checkbox.
1. Select **Save changes**.

### Integrate your GitLab instance with Sourcegraph

GitLab supports Sourcegraph integration for all public projects on GitLab.

To integrate with Sourcegraph:

1. On the left sidebar, select your avatar.
1. Select **Preferences**.
1. Find the **Integrations** section.
1. Select the **Enable integrated code intelligence on code views** checkbox.
1. Select **Save changes**.

You must be the administrator of the GitLab instance to configure GitLab with Sourcegraph.

<!-- ## Troubleshooting

Include any troubleshooting steps that you can foresee. If you know beforehand what issues
one might have when setting this up, or when something is changed, or on upgrading, it's
important to describe those, too. Think of things that may go wrong and include them here.
This is important to minimize requests for support, and to avoid doc comments with
questions that you know someone might ask.

Each scenario can be a third-level heading, for example `### Getting error message X`.
If you have none to add when creating a doc, leave this section in place
but commented out to help encourage others to add to it in the future. -->
