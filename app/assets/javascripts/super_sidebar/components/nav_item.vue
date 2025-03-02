<script>
import { GlAvatar, GlButton, GlIcon, GlBadge, GlTooltipDirective } from '@gitlab/ui';
import { s__, sprintf } from '~/locale';
import {
  CLICK_MENU_ITEM_ACTION,
  CLICK_PINNED_MENU_ITEM_ACTION,
  TRACKING_UNKNOWN_ID,
  TRACKING_UNKNOWN_PANEL,
} from '~/super_sidebar/constants';
import eventHub from '../event_hub';
import NavItemLink from './nav_item_link.vue';
import NavItemRouterLink from './nav_item_router_link.vue';

export default {
  i18n: {
    pin: s__('Navigation|Pin %{title}'),
    pinItem: s__('Navigation|Pin item'),
    unpin: s__('Navigation|Unpin %{title}'),
    unpinItem: s__('Navigation|Unpin item'),
  },
  name: 'NavItem',
  components: {
    GlAvatar,
    GlButton,
    GlIcon,
    GlBadge,
    NavItemLink,
    NavItemRouterLink,
  },
  directives: {
    GlTooltip: GlTooltipDirective,
  },
  inject: {
    pinnedItemIds: { default: { ids: [] } },
    panelSupportsPins: { default: false },
    panelType: { default: '' },
  },
  props: {
    isInPinnedSection: {
      type: Boolean,
      required: false,
      default: false,
    },
    isStatic: {
      type: Boolean,
      required: false,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
    linkClasses: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isSubitem: {
      type: Boolean,
      required: false,
      default: false,
    },
    isFlyout: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isMouseIn: false,
      canClickPinButton: false,
    };
  },
  computed: {
    pillData() {
      return this.item.pill_count;
    },
    hasPill() {
      return (
        Number.isFinite(this.pillData) ||
        (typeof this.pillData === 'string' && this.pillData !== '')
      );
    },
    isPinnable() {
      return this.panelSupportsPins && !this.isStatic;
    },
    isPinned() {
      return this.pinnedItemIds.ids.includes(this.item.id);
    },
    trackingProps() {
      // Set extra event data to debug missing IDs / Panel Types
      const extraData =
        !this.item.id || !this.panelType
          ? { 'data-track-extra': JSON.stringify({ title: this.item.title }) }
          : {};

      return {
        'data-track-action': this.isInPinnedSection
          ? CLICK_PINNED_MENU_ITEM_ACTION
          : CLICK_MENU_ITEM_ACTION,
        'data-track-label': this.item.id ?? TRACKING_UNKNOWN_ID,
        'data-track-property': this.panelType
          ? `nav_panel_${this.panelType}`
          : TRACKING_UNKNOWN_PANEL,
        ...extraData,
      };
    },
    /**
     * Some QA specs rely on a stable "Project overview"/"Group overview" nav
     * item data-qa-submenu-item attribute value.
     *
     * This computed ensures that those particular nav items use the `id` of
     * the item rather than its title for that QA attribute.
     *
     * In future, probably all nav items should do this, for consistency.
     * See https://gitlab.com/gitlab-org/gitlab/-/issues/422925.
     */
    qaSubMenuItem() {
      const { id } = this.item;
      if (id === 'project_overview' || id === 'group_overview') return id.replace(/_/g, '-');
      return this.item.title;
    },
    linkProps() {
      return {
        ...this.$attrs,
        ...this.trackingProps,
        item: this.item,
        'data-qa-submenu-item': this.qaSubMenuItem,
        'data-method': this.item.data_method ?? null,
      };
    },
    computedLinkClasses() {
      return {
        'gl-px-2 gl-mx-2 gl-line-height-normal': this.isSubitem,
        'gl-px-3': !this.isSubitem,
        'gl-pl-5! gl-rounded-small': this.isFlyout,
        'gl-rounded-base': !this.isFlyout,
        [this.item.link_classes]: this.item.link_classes,
        ...this.linkClasses,
      };
    },
    navItemLinkComponent() {
      return this.item.to ? NavItemRouterLink : NavItemLink;
    },
    hasAvatar() {
      return Boolean(this.item.entity_id);
    },
    hasEndSpace() {
      return this.hasPill || this.isPinnable || this.isFlyout;
    },
    avatarShape() {
      return this.item.avatar_shape || 'rect';
    },
    pinAriaLabel() {
      return sprintf(this.$options.i18n.pin, {
        title: this.item.title,
      });
    },
    unpinAriaLabel() {
      return sprintf(this.$options.i18n.unpin, {
        title: this.item.title,
      });
    },
    activeIndicatorStyle() {
      const style = {
        width: '3px',
        borderRadius: '3px',
        marginRight: '1px',
      };

      // The active indicator is too close to the avatar for items with one, so shift
      // it left by 1px.
      //
      // The indicator is absolutely positioned using rem units. This tweak for this
      // edge case is in pixel units, so that it does not scale with root font size.
      if (this.hasAvatar) style.transform = 'translateX(-1px)';

      return style;
    },
  },
  mounted() {
    if (this.item.is_active) {
      this.$el.scrollIntoView(false);
    }

    eventHub.$on('updatePillValue', this.updatePillValue);
  },
  destroyed() {
    eventHub.$off('updatePillValue', this.updatePillValue);
  },
  methods: {
    pinAdd() {
      this.$emit('pin-add', this.item.id, this.item.title);
    },
    pinRemove() {
      this.$emit('pin-remove', this.item.id, this.item.title);
    },
    togglePointerEvents() {
      this.canClickPinButton = this.isMouseIn;
    },
    updatePillValue({ value, itemId }) {
      if (this.item.id === itemId) {
        // https://gitlab.com/gitlab-org/gitlab/-/issues/428246
        // fixing this linting issue is causing the pills not to async update
        //
        // eslint-disable-next-line vue/no-mutating-props
        this.item.pill_count = value;
      }
    },
  },
};
</script>

<template>
  <li
    class="gl-relative show-on-focus-or-hover--context hide-on-focus-or-hover--context transition-opacity-on-hover--context"
    data-testid="nav-item"
    @mouseenter="isMouseIn = true"
    @mouseleave="isMouseIn = false"
  >
    <component
      :is="navItemLinkComponent"
      #default="{ isActive }"
      v-bind="linkProps"
      class="gl-relative gl-display-flex gl-align-items-center gl-min-h-7 gl-gap-3 gl-mb-1 gl-py-2 gl-text-black-normal! gl-hover-bg-t-gray-a-08 gl-focus-bg-t-gray-a-08 gl-text-decoration-none! gl-focus--focus show-on-focus-or-hover--control hide-on-focus-or-hover--control"
      :class="computedLinkClasses"
      data-testid="nav-item-link"
    >
      <div
        :class="[isActive ? 'gl-opacity-10' : 'gl-opacity-0']"
        class="active-indicator gl-absolute gl-left-2 gl-top-2 gl-bottom-2 gl-transition-slow"
        aria-hidden="true"
        :style="activeIndicatorStyle"
        data-testid="active-indicator"
      ></div>
      <div v-if="!isFlyout" class="gl-flex-shrink-0 gl-w-6 gl-display-flex">
        <slot name="icon">
          <gl-icon v-if="item.icon" :name="item.icon" class="gl-m-auto item-icon" />
          <gl-icon
            v-else-if="isInPinnedSection"
            name="grip"
            class="gl-m-auto gl-text-gray-400 js-draggable-icon gl-cursor-grab show-on-focus-or-hover--target"
          />
          <gl-avatar
            v-else-if="hasAvatar"
            :size="24"
            :shape="avatarShape"
            :entity-name="item.title"
            :entity-id="item.entity_id"
            :src="item.avatar"
          />
        </slot>
      </div>
      <div class="gl-flex-grow-1 gl-text-gray-900 gl-truncate-end">
        {{ item.title }}
        <div v-if="item.subtitle" class="gl-font-sm gl-text-gray-500 gl-truncate-end">
          {{ item.subtitle }}
        </div>
      </div>
      <slot name="actions"></slot>
      <span v-if="hasEndSpace" class="gl-text-right gl-relative gl-min-w-6">
        <gl-badge
          v-if="hasPill"
          size="sm"
          variant="neutral"
          class="gl-bg-t-gray-a-08!"
          :class="{
            'hide-on-focus-or-hover--target transition-opacity-on-hover--target': isPinnable,
          }"
        >
          {{ pillData }}
        </gl-badge>
      </span>
    </component>
    <template v-if="isPinnable">
      <gl-button
        v-if="isPinned"
        v-gl-tooltip.noninteractive.right.viewport="$options.i18n.unpinItem"
        :aria-label="unpinAriaLabel"
        category="tertiary"
        class="show-on-focus-or-hover--target transition-opacity-on-hover--target always-animate gl-absolute gl-right-3 gl-top-2"
        :class="{ 'gl-pointer-events-none': !canClickPinButton }"
        data-testid="nav-item-unpin"
        icon="thumbtack-solid"
        size="small"
        @click="pinRemove"
        @transitionend="togglePointerEvents"
      />
      <gl-button
        v-else
        v-gl-tooltip.noninteractive.right.viewport="$options.i18n.pinItem"
        :aria-label="pinAriaLabel"
        category="tertiary"
        class="show-on-focus-or-hover--target transition-opacity-on-hover--target always-animate gl-absolute gl-right-3 gl-top-2"
        :class="{ 'gl-pointer-events-none': !canClickPinButton }"
        data-testid="nav-item-pin"
        icon="thumbtack"
        size="small"
        @click="pinAdd"
        @transitionend="togglePointerEvents"
      />
    </template>
  </li>
</template>
