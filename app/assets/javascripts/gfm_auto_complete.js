import $ from 'jquery';
import '~/lib/utils/jquery_at_who';
import { escape as lodashEscape, sortBy, template, escapeRegExp } from 'lodash';
import * as Emoji from '~/emoji';
import axios from '~/lib/utils/axios_utils';
import { loadingIconForLegacyJS } from '~/loading_icon_for_legacy_js';
import { s__, __, sprintf } from '~/locale';
import { isUserBusy } from '~/set_status_modal/utils';
import SidebarMediator from '~/sidebar/sidebar_mediator';
import { state } from '~/sidebar/components/reviewers/sidebar_reviewers.vue';
import AjaxCache from './lib/utils/ajax_cache';
import { spriteIcon } from './lib/utils/common_utils';
import { parsePikadayDate } from './lib/utils/datetime_utility';
import { unicodeLetters } from './lib/utils/regexp';

const USERS_ALIAS = 'users';
const ISSUES_ALIAS = 'issues';
const MILESTONES_ALIAS = 'milestones';
const MERGEREQUESTS_ALIAS = 'mergerequests';
const LABELS_ALIAS = 'labels';
const SNIPPETS_ALIAS = 'snippets';
const CONTACTS_ALIAS = 'contacts';

export const AT_WHO_ACTIVE_CLASS = 'at-who-active';
export const CONTACT_STATE_ACTIVE = 'active';
export const CONTACTS_ADD_COMMAND = '/add_contacts';
export const CONTACTS_REMOVE_COMMAND = '/remove_contacts';

/**
 * Escapes user input before we pass it to at.js, which
 * renders it as HTML in the autocomplete dropdown.
 *
 * at.js allows you to reference data using `${}` syntax
 * (e.g. ${search}) which it replaces with the actual data
 * before rendering it in the autocomplete dropdown.
 * To prevent user input from executing this `${}` syntax,
 * we also need to escape the $ character.
 *
 * @param string user input
 * @return {string} escaped user input
 */
export function escape(string) {
  // To prevent double (or multiple) enconding attack
  // Decode the user input repeatedly prior to escaping the final decoded string.
  let encodedString = string;
  let decodedString = decodeURIComponent(encodedString);

  while (decodedString !== encodedString) {
    encodedString = decodeURIComponent(decodedString);
    decodedString = decodeURIComponent(encodedString);
  }

  return lodashEscape(decodedString.replace(/\$/g, '&dollar;'));
}

export function showAndHideHelper($input, alias = '') {
  $input.on(`hidden${alias ? '-' : ''}${alias}.atwho`, () => {
    $input.removeClass(AT_WHO_ACTIVE_CLASS);
  });
  $input.on(`shown${alias ? '-' : ''}${alias}.atwho`, () => {
    $input.addClass(AT_WHO_ACTIVE_CLASS);
  });
}

function createMemberSearchString(member) {
  return `${member.name.replace(/ /g, '')} ${member.username}`;
}

export function membersBeforeSave(members) {
  return members.map((member) => {
    const GROUP_TYPE = 'Group';

    let title = '';
    if (member.username == null) {
      return member;
    }
    title = member.name;
    if (member.count && !member.mentionsDisabled) {
      title += ` (${member.count})`;
    }

    const autoCompleteAvatar = member.avatar_url || member.username.charAt(0).toUpperCase();

    const rectAvatarClass = member.type === GROUP_TYPE ? 'rect-avatar' : '';
    const imgAvatar = `<img src="${member.avatar_url}" alt="${member.username}" class="avatar ${rectAvatarClass} avatar-inline center s26"/>`;
    const txtAvatar = `<div class="avatar ${rectAvatarClass} center avatar-inline s26">${autoCompleteAvatar}</div>`;
    const avatarIcon = member.mentionsDisabled
      ? spriteIcon('notifications-off', 's16 vertical-align-middle gl-ml-2')
      : '';

    return {
      username: member.username,
      avatarTag: autoCompleteAvatar.length === 1 ? txtAvatar : imgAvatar,
      title,
      search: createMemberSearchString(member),
      icon: avatarIcon,
      availability: member?.availability,
    };
  });
}

export const highlighter = (li, query) => {
  // override default behaviour to escape dot character
  // see https://github.com/ichord/At.js/pull/576
  if (!query) {
    return li;
  }
  const escapedQuery = escapeRegExp(query);
  const regexp = new RegExp(`>\\s*([^<]*?)(${escapedQuery})([^<]*)\\s*<`, 'ig');
  return li.replace(regexp, (str, $1, $2, $3) => `> ${$1}<strong>${$2}</strong>${$3} <`);
};

export const defaultAutocompleteConfig = {
  emojis: true,
  members: true,
  issues: true,
  mergeRequests: true,
  epics: true,
  iterations: true,
  milestones: true,
  labels: true,
  snippets: true,
  vulnerabilities: true,
  contacts: true,
};

class GfmAutoComplete {
  constructor(dataSources = {}) {
    this.dataSources = dataSources;
    this.cachedData = {};
    this.isLoadingData = {};
    this.previousQuery = undefined;
  }

  setup(input, enableMap = defaultAutocompleteConfig) {
    // Add GFM auto-completion to all input fields, that accept GFM input.
    this.input = input || $('.js-gfm-input');
    this.enableMap = enableMap;
    this.setupLifecycle();
  }

  setupLifecycle() {
    this.input.each((i, input) => {
      const $input = $(input);
      if (!$input.hasClass('js-gfm-input-initialized')) {
        // eslint-disable-next-line @gitlab/no-global-event-off
        $input.off('focus.setupAtWho').on('focus.setupAtWho', this.setupAtWho.bind(this, $input));
        $input.on('change.atwho', () => input.dispatchEvent(new Event('input')));
        // This triggers at.js again
        // Needed for quick actions with suffixes (ex: /label ~)
        $input.on('inserted-commands.atwho', $input.trigger.bind($input, 'keyup'));
        $input.on('clear-commands-cache.atwho', () => this.clearCache());
        $input.addClass('js-gfm-input-initialized');
      }
    });
  }

  setupAtWho($input) {
    if (this.enableMap.emojis) this.setupEmoji($input);
    if (this.enableMap.members) this.setupMembers($input);
    if (this.enableMap.issues) this.setupIssues($input);
    if (this.enableMap.milestones) this.setupMilestones($input);
    if (this.enableMap.mergeRequests) this.setupMergeRequests($input);
    if (this.enableMap.labels) this.setupLabels($input);
    if (this.enableMap.snippets) this.setupSnippets($input);
    if (this.enableMap.contacts) this.setupContacts($input);

    $input.filter('[data-supports-quick-actions="true"]').atwho({
      at: '/',
      alias: 'commands',
      searchKey: 'search',
      limit: 100,
      skipSpecialCharacterTest: true,
      skipMarkdownCharacterTest: true,
      data: GfmAutoComplete.defaultLoadingData,
      displayTpl(value) {
        const cssClasses = [];

        if (GfmAutoComplete.isLoading(value)) return GfmAutoComplete.Loading.template;
        // eslint-disable-next-line no-template-curly-in-string
        let tpl = '<li class="<%- className %>"><span class="name">/${name}</span>';
        if (value.aliases.length > 0) {
          tpl += ' <small class="aliases">(or /<%- aliases.join(", /") %>)</small>';
        }
        if (value.params.length > 0) {
          tpl += ' <small class="params"><%- params.join(" ") %></small>';
        }
        if (value.warning && value.icon && value.icon === 'confidential') {
          tpl += `<small class="description gl-display-flex gl-align-items-center">${spriteIcon(
            'eye-slash',
            's16 gl-mr-2',
          )}<em><%- warning %></em></small>`;
        } else if (value.warning) {
          tpl += '<small class="description"><em><%- warning %></em></small>';
        } else if (value.description !== '') {
          tpl += '<small class="description"><em><%- description %></em></small>';
        }
        tpl += '</li>';

        if (value.warning) {
          cssClasses.push('has-warning');
        }

        return template(tpl)({
          ...value,
          className: cssClasses.join(' '),
        });
      },
      insertTpl(value) {
        // eslint-disable-next-line no-template-curly-in-string
        let tpl = '/${name} ';
        let referencePrefix = null;
        if (value.params.length > 0) {
          const regexp = /\[[a-z]+:/;
          const match = regexp.exec(value.params);
          if (match) {
            [referencePrefix] = match;
            tpl += '<%- referencePrefix %>';
          } else {
            [[referencePrefix]] = value.params;
            if (/^[@%~]/.test(referencePrefix)) {
              tpl += '<%- referencePrefix %>';
            } else if (/^[*]/.test(referencePrefix)) {
              // EE-ONLY
              referencePrefix = '*iteration:';
              tpl += '<%- referencePrefix %>';
            }
          }
        }
        return template(tpl, { interpolate: /<%=([\s\S]+?)%>/g })({ referencePrefix });
      },
      suffix: '',
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(commands) {
          if (GfmAutoComplete.isLoading(commands)) return commands;
          return $.map(commands, (c) => {
            let search = c.name;
            if (c.aliases.length > 0) {
              search = `${search} ${c.aliases.join(' ')}`;
            }
            return {
              name: c.name,
              aliases: c.aliases,
              params: c.params,
              description: c.description,
              warning: c.warning,
              icon: c.icon,
              search,
            };
          });
        },
        matcher(flag, subtext) {
          const regexp = /(?:^|\n)\/([A-Za-z_]*)$/gi;
          const match = regexp.exec(subtext);
          if (match) {
            return match[1];
          }
          return null;
        },
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setSubmitReviewStates($input) {
    if (!window.gon.features?.mrRequestChanges) return;

    const REVIEW_STATES = {
      reviewed: {
        header: __('Comment'),
        description: __('Submit general feedback without explicit approval.'),
      },
      approve: {
        header: __('Approve'),
        description: __('Submit feedback and approve these changes.'),
      },
      requested_changes: {
        header: __('Request changes'),
        description: __('Submit feedback that should be addressed before merging.'),
      },
    };

    $input.filter('[data-supports-quick-actions="true"]').atwho({
      // Always keep the trailing space otherwise the command won't display correctly
      at: '/submit_review ',
      alias: 'submit_review',
      data: Object.keys(REVIEW_STATES),
      displayTpl({ name }) {
        const reviewState = REVIEW_STATES[name];

        return `<li><span class="gl-font-weight-bold gl-display-block">${reviewState.header}</span><small class="description gl-display-block gl-w-full gl-float-left! gl-px-0!">${reviewState.description}</small></li>`;
      },
    });
  }

  setupEmoji($input) {
    const fetchData = this.fetchData.bind(this);

    // Emoji
    $input.atwho({
      at: ':',
      displayTpl: GfmAutoComplete.Emoji.templateFunction,
      insertTpl: GfmAutoComplete.Emoji.insertTemplateFunction,
      skipSpecialCharacterTest: true,
      data: GfmAutoComplete.defaultLoadingData,
      callbacks: {
        ...this.getDefaultCallbacks(),
        matcher(flag, subtext) {
          const regexp = new RegExp(`(?:[^${unicodeLetters}0-9:]|\n|^):([^ :][^:]*)?$`, 'gi');
          const match = regexp.exec(subtext);

          if (match && match.length) {
            // Since we have "?" on the group, it's possible it is undefined
            return match[1] || '';
          }

          return null;
        },
        filter(query, items) {
          if (GfmAutoComplete.isLoading(items)) {
            fetchData(this.$inputor, this.at);
            return items;
          }

          return GfmAutoComplete.Emoji.filter(query);
        },
        sorter(query, items) {
          this.setting.highlightFirst = this.setting.alwaysHighlightFirst || query.length > 0;
          if (GfmAutoComplete.isLoading(items)) {
            this.setting.highlightFirst = false;
            return items;
          }

          if (query.length === 0) {
            return items;
          }

          return GfmAutoComplete.Emoji.sorter(items);
        },
      },
    });
    showAndHideHelper($input);
  }

  setupMembers($input) {
    const fetchData = this.fetchData.bind(this);
    const MEMBER_COMMAND = {
      ASSIGN: '/assign',
      UNASSIGN: '/unassign',
      ASSIGN_REVIEWER: '/assign_reviewer',
      UNASSIGN_REVIEWER: '/unassign_reviewer',
      REASSIGN: '/reassign',
      CC: '/cc',
    };
    let assignees = [];
    let reviewers = [];
    let command = '';

    // Team Members
    $input.atwho({
      at: '@',
      alias: USERS_ALIAS,
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Loading.template;
        const { avatarTag, username, title, icon, availability } = value;
        if (username != null) {
          tmpl = GfmAutoComplete.Members.templateFunction({
            avatarTag,
            username,
            title,
            icon,
            availabilityStatus:
              availability && isUserBusy(availability)
                ? `<span class="badge badge-warning badge-pill gl-badge sm gl-ml-2"> ${s__(
                    'UserProfile|Busy',
                  )}</span>`
                : '',
          });
        }
        return tmpl;
      },
      // eslint-disable-next-line no-template-curly-in-string
      insertTpl: '${atwho-at}${username}',
      limit: 10,
      searchKey: 'search',
      alwaysHighlightFirst: true,
      skipSpecialCharacterTest: true,
      data: GfmAutoComplete.defaultLoadingData,
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave: membersBeforeSave,
        matcher(flag, subtext) {
          const subtextNodes = subtext.split(/\n+/g).pop().split(GfmAutoComplete.regexSubtext);

          // Check if @ is followed by '/assign', '/reassign', '/unassign' or '/cc' commands.
          command = subtextNodes.find((node) => {
            if (Object.values(MEMBER_COMMAND).includes(node)) {
              return node;
            }
            return null;
          });

          // Cache assignees & reviewers list for easier filtering later
          assignees =
            SidebarMediator.singleton?.store?.assignees?.map(createMemberSearchString) || [];
          reviewers = state.issuable?.reviewers?.nodes?.map(createMemberSearchString) || [];

          const match = GfmAutoComplete.defaultMatcher(flag, subtext, this.app.controllers);
          return match && match.length ? match[1] : null;
        },
        filter(query, data, searchKey) {
          if (GfmAutoComplete.isLoading(data)) {
            fetchData(this.$inputor, this.at);
            return data;
          }

          if (data === GfmAutoComplete.defaultLoadingData) {
            return $.fn.atwho.default.callbacks.filter(query, data, searchKey);
          }

          if (command === MEMBER_COMMAND.ASSIGN) {
            // Only include members which are not assigned to Issuable currently
            return data.filter((member) => !assignees.includes(member.search));
          }
          if (command === MEMBER_COMMAND.UNASSIGN) {
            // Only include members which are assigned to Issuable currently
            return data.filter((member) => assignees.includes(member.search));
          }
          if (command === MEMBER_COMMAND.ASSIGN_REVIEWER) {
            // Only include members which are not assigned as a reviewer to Issuable currently
            return data.filter((member) => !reviewers.includes(member.search));
          }
          if (command === MEMBER_COMMAND.UNASSIGN_REVIEWER) {
            // Only include members which are not assigned as a reviewer to Issuable currently
            return data.filter((member) => reviewers.includes(member.search));
          }

          return data;
        },
        sorter(query, items) {
          // Disable auto-selecting the loading icon
          this.setting.highlightFirst = this.setting.alwaysHighlightFirst;
          if (GfmAutoComplete.isLoading(items)) {
            this.setting.highlightFirst = false;
            return items;
          }

          if (!query) {
            return items;
          }

          return GfmAutoComplete.Members.sort(query, items);
        },
      },
    });
    showAndHideHelper($input, USERS_ALIAS);
  }

  setupIssues($input) {
    $input.atwho({
      at: '#',
      alias: ISSUES_ALIAS,
      searchKey: 'search',
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Loading.template;
        if (value.title != null) {
          tmpl = GfmAutoComplete.Issues.templateFunction(value);
        }
        return tmpl;
      },
      data: GfmAutoComplete.defaultLoadingData,
      insertTpl: GfmAutoComplete.Issues.insertTemplateFunction,
      skipSpecialCharacterTest: true,
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(issues) {
          return $.map(issues, (i) => {
            if (i.title == null) {
              return i;
            }
            return {
              id: i.iid,
              title: i.title,
              reference: i.reference,
              search: `${i.iid} ${i.title}`,
            };
          });
        },
      },
    });
    showAndHideHelper($input, ISSUES_ALIAS);
  }

  setupMilestones($input) {
    $input.atwho({
      at: '%',
      alias: MILESTONES_ALIAS,
      searchKey: 'search',
      // eslint-disable-next-line no-template-curly-in-string
      insertTpl: '${atwho-at}${title}',
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Loading.template;
        if (value.title != null) {
          tmpl = GfmAutoComplete.Milestones.templateFunction(value.title, value.expired);
        }
        return tmpl;
      },
      data: GfmAutoComplete.defaultLoadingData,
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(milestones) {
          const parsedMilestones = $.map(milestones, (m) => {
            if (m.title == null) {
              return m;
            }

            const dueDate = m.due_date ? parsePikadayDate(m.due_date) : null;
            const expired = dueDate ? Date.now() > dueDate.getTime() : false;

            return {
              id: m.iid,
              title: m.title,
              search: m.title,
              expired,
              dueDate,
            };
          });

          // Sort milestones by due date when present.
          if (typeof parsedMilestones[0] === 'object') {
            return parsedMilestones.sort((mA, mB) => {
              // Move all expired milestones to the bottom.
              if (mA.expired) return 1;
              if (mB.expired) return -1;

              // Move milestones without due dates just above expired milestones.
              if (!mA.dueDate) return 1;
              if (!mB.dueDate) return -1;

              // Sort by due date in ascending order.
              return mA.dueDate - mB.dueDate;
            });
          }
          return parsedMilestones;
        },
      },
    });
    showAndHideHelper($input, MILESTONES_ALIAS);
  }

  setupMergeRequests($input) {
    $input.atwho({
      at: '!',
      alias: MERGEREQUESTS_ALIAS,
      searchKey: 'search',
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Loading.template;
        if (value.title != null) {
          tmpl = GfmAutoComplete.Issues.templateFunction(value);
        }
        return tmpl;
      },
      data: GfmAutoComplete.defaultLoadingData,
      insertTpl: GfmAutoComplete.Issues.insertTemplateFunction,
      skipSpecialCharacterTest: true,
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(merges) {
          return $.map(merges, (m) => {
            if (m.title == null) {
              return m;
            }
            return {
              id: m.iid,
              title: m.title,
              reference: m.reference,
              search: `${m.iid} ${m.title}`,
            };
          });
        },
      },
    });
    showAndHideHelper($input, MERGEREQUESTS_ALIAS);
  }

  setupLabels($input) {
    const instance = this;
    const fetchData = this.fetchData.bind(this);
    const LABEL_COMMAND = {
      LABEL: '/label',
      LABELS: '/labels',
      UNLABEL: '/unlabel',
      RELABEL: '/relabel',
    };
    let command = '';

    $input.atwho({
      at: '~',
      alias: LABELS_ALIAS,
      searchKey: 'search',
      data: GfmAutoComplete.defaultLoadingData,
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Labels.templateFunction(value.color, value.title);
        if (GfmAutoComplete.isLoading(value)) {
          tmpl = GfmAutoComplete.Loading.template;
        }
        return tmpl;
      },
      // eslint-disable-next-line no-template-curly-in-string
      insertTpl: '${atwho-at}${title}',
      limit: 20,
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(merges) {
          if (GfmAutoComplete.isLoading(merges)) return merges;
          return $.map(merges, (m) => ({
            title: m.title,
            color: m.color,
            search: m.title,
            set: m.set,
          }));
        },
        matcher(flag, subtext) {
          const subtextNodes = subtext.split(/\n+/g).pop().split(GfmAutoComplete.regexSubtext);

          // Check if ~ is followed by '/label', '/labels', '/relabel' or '/unlabel' commands.
          command = subtextNodes.find((node) => {
            if (Object.values(LABEL_COMMAND).includes(node)) {
              return node;
            }
            return null;
          });

          // If any label matches the inserted text after the last `~`, suggest those labels,
          // even if any spaces or funky characters were typed.
          // This allows matching labels like "Accepting merge requests".
          const labels = instance.cachedData[flag];
          if (labels) {
            if (!subtext.includes(flag)) {
              // Do not match if there is no `~` before the cursor
              return null;
            }
            if (subtext.endsWith('~~')) {
              // Do not match if there are two consecutive `~` characters (strikethrough) before the cursor
              return null;
            }
            const lastCandidate = subtext.split(flag).pop();
            if (labels.find((label) => label.title.startsWith(lastCandidate))) {
              return lastCandidate;
            }
          }

          const match = GfmAutoComplete.defaultMatcher(flag, subtext, this.app.controllers);
          return match && match.length ? match[1] : null;
        },
        filter(query, data, searchKey) {
          if (GfmAutoComplete.isLoading(data)) {
            fetchData(this.$inputor, this.at);
            return data;
          }

          if (data === GfmAutoComplete.defaultLoadingData) {
            return $.fn.atwho.default.callbacks.filter(query, data, searchKey);
          }

          // The `LABEL_COMMAND.RELABEL` is intentionally skipped
          // because we want to return all the labels (unfiltered) for that command.
          if (command === LABEL_COMMAND.LABEL || command === LABEL_COMMAND.LABELS) {
            // Return labels with set: undefined.
            return data.filter((label) => !label.set);
          }
          if (command === LABEL_COMMAND.UNLABEL) {
            // Return labels with set: true.
            return data.filter((label) => label.set);
          }

          return data;
        },
      },
    });
    showAndHideHelper($input, LABELS_ALIAS);
  }

  setupSnippets($input) {
    $input.atwho({
      at: '$',
      alias: SNIPPETS_ALIAS,
      searchKey: 'search',
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Loading.template;
        if (value.title != null) {
          tmpl = GfmAutoComplete.Issues.templateFunction(value);
        }
        return tmpl;
      },
      data: GfmAutoComplete.defaultLoadingData,
      // eslint-disable-next-line no-template-curly-in-string
      insertTpl: '${atwho-at}${id}',
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(snippets) {
          return $.map(snippets, (m) => {
            if (m.title == null) {
              return m;
            }
            return {
              id: m.id,
              title: m.title,
              search: `${m.id} ${m.title}`,
            };
          });
        },
      },
    });
    showAndHideHelper($input, SNIPPETS_ALIAS);
  }

  setupContacts($input) {
    const fetchData = this.fetchData.bind(this);
    let command = '';

    $input.atwho({
      at: '[contact:',
      suffix: ']',
      alias: CONTACTS_ALIAS,
      searchKey: 'search',
      displayTpl(value) {
        let tmpl = GfmAutoComplete.Loading.template;
        if (value.email != null) {
          tmpl = GfmAutoComplete.Contacts.templateFunction(value);
        }
        return tmpl;
      },
      data: GfmAutoComplete.defaultLoadingData,
      // eslint-disable-next-line no-template-curly-in-string
      insertTpl: '${atwho-at}${email}',
      callbacks: {
        ...this.getDefaultCallbacks(),
        beforeSave(contacts) {
          return $.map(contacts, (m) => {
            if (m.email == null) {
              return m;
            }
            return {
              id: m.id,
              email: m.email,
              firstName: m.first_name,
              lastName: m.last_name,
              search: `${m.email}`,
              state: m.state,
              set: m.set,
            };
          });
        },
        matcher(flag, subtext) {
          const subtextNodes = subtext.split(/\n+/g).pop().split(GfmAutoComplete.regexSubtext);

          command = subtextNodes.find((node) => {
            if (node === CONTACTS_ADD_COMMAND || node === CONTACTS_REMOVE_COMMAND) {
              return node;
            }
            return null;
          });

          const match = GfmAutoComplete.defaultMatcher(flag, subtext, this.app.controllers);
          return match?.length ? match[1] : null;
        },
        filter(query, data, searchKey) {
          if (GfmAutoComplete.isLoading(data)) {
            fetchData(this.$inputor, this.at);
            return data;
          }

          if (data === GfmAutoComplete.defaultLoadingData) {
            return $.fn.atwho.default.callbacks.filter(query, data, searchKey);
          }

          if (command === CONTACTS_ADD_COMMAND) {
            // Return contacts that are active and not already on the issue
            return data.filter((contact) => contact.state === CONTACT_STATE_ACTIVE && !contact.set);
          }
          if (command === CONTACTS_REMOVE_COMMAND) {
            // Return contacts already on the issue
            return data.filter((contact) => contact.set);
          }

          return data;
        },
      },
    });
    showAndHideHelper($input, CONTACTS_ALIAS);
  }

  getDefaultCallbacks() {
    const self = this;

    return {
      sorter(query, items, searchKey) {
        this.setting.highlightFirst = this.setting.alwaysHighlightFirst || query.length > 0;
        if (GfmAutoComplete.isLoading(items)) {
          this.setting.highlightFirst = false;
          return items;
        }
        return $.fn.atwho.default.callbacks.sorter(query, items, searchKey);
      },
      filter(query, data, searchKey) {
        if (GfmAutoComplete.isTypeWithBackendFiltering(this.at)) {
          if (GfmAutoComplete.isLoading(data) || self.previousQuery !== query) {
            self.previousQuery = query;
            self.fetchData(this.$inputor, this.at, query);
            return data;
          }
        }

        if (GfmAutoComplete.isLoading(data)) {
          self.fetchData(this.$inputor, this.at);
          return data;
        }

        return $.fn.atwho.default.callbacks.filter(query, data, searchKey);
      },
      beforeInsert(value) {
        let withoutAt = value.substring(1);
        const at = value.charAt();

        if (value && !this.setting.skipSpecialCharacterTest) {
          const regex = at === '~' ? /\W|^\d+$/ : /\W/;
          if (withoutAt && regex.test(withoutAt)) {
            withoutAt = `"${withoutAt}"`;
          }
        }

        // We can ignore this for quick actions because they are processed
        // before Markdown.
        if (!this.setting.skipMarkdownCharacterTest) {
          withoutAt = withoutAt
            .replace(/(~~|`|\*)/g, '\\$1')
            .replace(/(\b)(_+)/g, '$1\\$2') // only escape underscores at the start
            .replace(/(_+)(\b)/g, '\\$1$2'); // or end of words
        }

        return `${at}${withoutAt}`;
      },
      matcher(flag, subtext) {
        const match = GfmAutoComplete.defaultMatcher(flag, subtext, this.app.controllers);

        if (match) {
          return match[1];
        }
        return null;
      },
      highlighter,
    };
  }

  fetchData($input, at, search) {
    if (this.isLoadingData[at]) return;

    this.isLoadingData[at] = true;
    const dataSource = this.dataSources[GfmAutoComplete.atTypeMap[at]];

    if (GfmAutoComplete.isTypeWithBackendFiltering(at)) {
      if (this.cachedData[at]?.[search]) {
        this.loadData($input, at, this.cachedData[at][search], { search });
      } else {
        axios
          .get(dataSource, { params: { search } })
          .then(({ data }) => {
            this.loadData($input, at, data, { search });
          })
          .catch(() => {
            this.isLoadingData[at] = false;
          });
      }
    } else if (this.cachedData[at]) {
      this.loadData($input, at, this.cachedData[at]);
    } else if (GfmAutoComplete.atTypeMap[at] === 'emojis') {
      this.loadEmojiData($input, at).catch(() => {});
    } else if (dataSource) {
      AjaxCache.retrieve(dataSource, true)
        .then((data) => {
          if (data.some((c) => c.name === 'submit_review')) {
            this.setSubmitReviewStates($input);
          }
          this.loadData($input, at, data);
        })
        .catch(() => {
          this.isLoadingData[at] = false;
        });
    } else {
      this.isLoadingData[at] = false;
    }
  }

  loadData($input, at, data, { search } = {}) {
    this.isLoadingData[at] = false;

    if (search !== undefined) {
      if (this.cachedData[at] === undefined) {
        this.cachedData[at] = {};
      }

      this.cachedData[at][search] = data;
    } else {
      this.cachedData[at] = data;
    }

    $input.atwho('load', at, data);
    // This trigger at.js again
    // otherwise we would be stuck with loading until the user types
    return $input.trigger('keyup');
  }

  async loadEmojiData($input, at) {
    await Emoji.initEmojiMap();

    this.loadData($input, at, ['loaded']);

    GfmAutoComplete.glEmojiTag = Emoji.glEmojiTag;
  }

  clearCache() {
    this.cachedData = {};
  }

  destroy() {
    this.input.each((i, input) => {
      const $input = $(input);
      $input.atwho('destroy');
    });
  }

  static isLoading(data) {
    let dataToInspect = data;
    if (data && data.length > 0) {
      [dataToInspect] = data;
    }

    const loadingState = GfmAutoComplete.defaultLoadingData[0];
    return dataToInspect && (dataToInspect === loadingState || dataToInspect.name === loadingState);
  }

  static defaultMatcher(flag, subtext, controllers) {
    // The below is taken from At.js source
    // Tweaked to commands to start without a space only if char before is a non-word character
    // https://github.com/ichord/At.js
    const atSymbolsWithBar = Object.keys(controllers)
      .join('|')
      .replace(/[$]/, '\\$&')
      .replace(/([[\]:])/g, '\\$1')
      .replace(/([*])/g, '\\$1');

    const atSymbolsWithoutBar = Object.keys(controllers).join('');
    const targetSubtext = subtext.split(GfmAutoComplete.regexSubtext).pop();
    const resultantFlag = flag.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

    const accentAChar = decodeURI('%C3%80');
    const accentYChar = decodeURI('%C3%BF');

    // Holy regex, batman!
    const regexp = new RegExp(
      `^(?:\\B|[^a-zA-Z0-9_\`${atSymbolsWithoutBar}]|\\s)${resultantFlag}(?!${atSymbolsWithBar})((?:[A-Za-z${accentAChar}-${accentYChar}0-9_'.+-:]|[^\\x00-\\x7a])*)$`,
      'gi',
    );

    return regexp.exec(targetSubtext);
  }
}

GfmAutoComplete.regexSubtext = /\s+/g;

GfmAutoComplete.defaultLoadingData = ['loading'];

GfmAutoComplete.atTypeMap = {
  ':': 'emojis',
  '@': 'members',
  '#': 'issues',
  '!': 'mergeRequests',
  '&': 'epics',
  '*iteration:': 'iterations',
  '~': 'labels',
  '%': 'milestones',
  '/': 'commands',
  '[vulnerability:': 'vulnerabilities',
  $: 'snippets',
  '[contact:': 'contacts',
};

GfmAutoComplete.typesWithBackendFiltering = ['vulnerabilities'];
GfmAutoComplete.isTypeWithBackendFiltering = (type) =>
  GfmAutoComplete.typesWithBackendFiltering.includes(GfmAutoComplete.atTypeMap[type]);

// Emoji
GfmAutoComplete.glEmojiTag = null;
GfmAutoComplete.Emoji = {
  insertTemplateFunction(value) {
    return `:${value.emoji.name}:`;
  },
  templateFunction(item) {
    if (GfmAutoComplete.isLoading(item)) {
      return GfmAutoComplete.Loading.template;
    }

    const escapedFieldValue = escape(item.fieldValue);
    if (!GfmAutoComplete.glEmojiTag) {
      return `<li>${escapedFieldValue}</li>`;
    }

    return `<li>${GfmAutoComplete.glEmojiTag(item.emoji.name)} ${escapedFieldValue}</li>`;
  },
  filter(query) {
    if (query.length === 0) {
      return Emoji.getAllEmoji()
        .map((emoji) => ({
          emoji,
          fieldValue: emoji.name,
        }))
        .slice(0, 20);
    }

    return Emoji.searchEmoji(query);
  },
  sorter(items) {
    return items.sort(Emoji.sortEmoji);
  },
};
// Team Members
GfmAutoComplete.Members = {
  templateFunction({ avatarTag, username, title, icon, availabilityStatus }) {
    return `<li>${avatarTag} ${username} <small>${escape(
      title,
    )}${availabilityStatus}</small> ${icon}</li>`;
  },
  nameOrUsernameStartsWith(member, query) {
    // `member.search` is a name:username string like `MargeSimpson msimpson`
    return member.search.split(' ').some((name) => name.toLowerCase().startsWith(query));
  },
  nameOrUsernameIncludes(member, query) {
    // `member.search` is a name:username string like `MargeSimpson msimpson`
    return member.search.toLowerCase().includes(query);
  },
  sort(query, members) {
    const lowercaseQuery = query.toLowerCase();
    const { nameOrUsernameStartsWith, nameOrUsernameIncludes } = GfmAutoComplete.Members;

    return sortBy(
      members.filter((member) => nameOrUsernameIncludes(member, lowercaseQuery)),
      (member) => (nameOrUsernameStartsWith(member, lowercaseQuery) ? -1 : 0),
    );
  },
};
GfmAutoComplete.Labels = {
  templateFunction(color, title) {
    return `<li><span class="dropdown-label-box" style="background: ${escape(
      color,
    )}"></span> ${escape(title)}</li>`;
  },
};
// Issues, MergeRequests and Snippets
GfmAutoComplete.Issues = {
  insertTemplateFunction(value) {
    // eslint-disable-next-line no-template-curly-in-string
    return value.reference || '${atwho-at}${id}';
  },
  templateFunction({ id, title, reference }) {
    return `<li><small>${escape(reference || id)}</small> ${escape(title)}</li>`;
  },
};
// Milestones
GfmAutoComplete.Milestones = {
  templateFunction(title, expired) {
    if (expired) {
      return `<li>${sprintf(__('%{milestone} (expired)'), {
        milestone: escape(title),
      })}</li>`;
    }
    return `<li>${escape(title)}</li>`;
  },
};
GfmAutoComplete.Contacts = {
  templateFunction({ email, firstName, lastName }) {
    return `<li><small>${escape(firstName)} ${escape(lastName)}</small> ${escape(email)}</li>`;
  },
};

const loadingSpinner = loadingIconForLegacyJS({
  inline: true,
  classes: ['gl-mr-2'],
}).outerHTML;

GfmAutoComplete.Loading = {
  template: `<li style="pointer-events: none;">${loadingSpinner}Loading...</li>`,
};

export default GfmAutoComplete;
