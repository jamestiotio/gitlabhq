---
stage: Govern
group: Threat Insights
info: To determine the technical writer assigned to the Stage/Group associated with this page, see https://about.gitlab.com/handbook/product/ux/technical-writing/#assignments
---

# GitLab Security Dashboards and Security Center **(ULTIMATE ALL)**

## Security Dashboards

Security Dashboards are used to assess the security posture of your applications. GitLab provides
you with a collection of metrics, ratings, and charts for the vulnerabilities detected by the [security scanners](../index.md#application-coverage) run on your project. The security dashboard provides data such as:

- Vulnerability trends over a 30, 60, or 90-day time-frame for all projects in a group
- A letter grade rating for each project based on vulnerability severity
- The total number of vulnerabilities detected within the last 365 days including their severity

The data provided by the Security Dashboards can be used supply to insight on what decisions can be made to improve your security posture. For example, using the 365 day trend view, you can see on which days a significant number of vulnerabilities were introduced. Then you can examine the code changes performed on those particular days in order perform a root-cause analysis to create better policies for preventing the introduction of vulnerabilities in the future.

<i class="fa fa-youtube-play youtube" aria-hidden="true"></i>
For an overview, see [Security Dashboard](https://www.youtube.com/watch?v=Uo-pDns1OpQ).

## Prerequisites

To view the Security Dashboards, the following is required:

- [Maintainer Role](../../permissions.md#roles) for the project or group.
- At least one [security scanner](../index.md#application-coverage) configured within your project.
- A successful security scan performed on the [default branch](../../project/repository/branches/default.md) of your project

**Note**:
The Security Dashboards show results of scans from the most recent completed pipeline on the
[default branch](../../project/repository/branches/default.md). Dashboards are updated with the result of completed pipelines run on the default branch; they do not include vulnerabilities discovered in pipelines from other un-merged branches.

## Viewing the Security Dashboard

The Security Dashboard can be seen at the project, group, and the Security Center levels.
Each dashboard provides a unique viewpoint of your security posture.

### Project Security Dashboard

The Project Security Dashboard shows the total number of vulnerabilities detected over time,
with up to 365 days of historical data for a given project. You can view the Project Security
Dashboard:

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Secure > Security dashboard**.
1. Filter and search for what you need.
   - To filter the chart by severity, select the legend name.
   - To view a specific time frame, use the time range handles (**{scroll-handle}**).
   - To view a specific area of the chart, select the left-most icon (**{marquee-selection}**) and drag
     across the chart.
   - To reset to the original range, select **Remove Selection** (**{redo}**).

![Project Security Dashboard](img/project_security_dashboard.png)

#### Downloading the vulnerability chart

You can download an image of the vulnerability chart from the Project Security Dashboard
to use in documentation, presentations, and so on. To download the image of the vulnerability
chart:

1. On the left sidebar, select **Search or go to** and find your project.
1. Select **Secure > Security dashboard**.
1. Select **Save chart as an image** (**{download}**).

You will then be prompted to download the image in SVG format.

### Group Security Dashboard

The group Security Dashboard provides an overview of vulnerabilities found in the default
branches of all projects in a group and its subgroups. The Group Security Dashboard
supplies the following:

- Vulnerability trends over a 30, 60, or 90-day time frame
- A letter grade for each project in the group according to its highest-severity open vulnerability. The letter grades are assigned using the following criteria:

| Grade | Description |
| ----- | ----------- |
| **F** | One or more `critical` vulnerabilities |
| **D** | One or more `high` or `unknown` vulnerabilities |
| **C** | One or more `medium` vulnerabilities |
| **B** | One or more `low` vulnerabilities |
| **A** | Zero vulnerabilities |

To view group security dashboard:

1. On the left sidebar, select **Search or go to** and find your group.
1. Select **Security > Security dashboard**.
1. Hover over the **Vulnerabilities over time** chart to get more details about vulnerabilities.
   - You can display the vulnerability trends over a 30, 60, or 90-day time frame (the default is 90 days).
   - To view aggregated data beyond a 90-day time frame, use the [VulnerabilitiesCountByDay GraphQL API](../../../api/graphql/reference/index.md#vulnerabilitiescountbyday). GitLab retains the data for 365 days.

1. Select the arrows under the **Project security status** section to see the what projects fall under a particular letter-grade rating:
   - You can see how many vulnerabilities of a particular severity are found in a project
   - You can select a project's name to directly access its project security dashboard

![Group Security Dashboard](img/group_security_dashboard.png)

## Security Center

> [Introduced](https://gitlab.com/groups/gitlab-org/-/epics/3426) in GitLab 13.4.

The Security Center is a configurable personal space where you can view vulnerabilities across all the
projects you belong to. The Security Center includes:

- The group Security Dashboard
- A [vulnerability report](../vulnerability_report/index.md)
- A settings area to configure which projects to display

### Viewing the Security Center

To view the Security Center:

1. On the left sidebar, select **Search or go to**.
1. Select **Your work**.
1. Select **Security > Security dashboard**.

The Security Center is blank by default. You must add a project which have been configured with at least one security scanner.

### Adding Projects to the Security Center

To add projects to the Security Center:

1. On the left sidebar, select **Search or go to**.
1. Select **Your work**.
1. Expand **Security**.
1. Select **Settings**.
1. Use the **Search your projects** text box to search for and select projects.
1. Select **Add projects**.

After you add projects, the security dashboard and vulnerability report show the vulnerabilities found in those projects' default branches. You can add a maximum of 1,000 projects, however the **Project** filter in the **Vulnerability Report** is limited to 100 projects.

## Related topics

- [Vulnerability reports](../vulnerability_report/index.md)
- [Vulnerability Page](../vulnerabilities/index.md)
