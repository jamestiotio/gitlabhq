<script>
import { GlAlert } from '@gitlab/ui';
import * as Sentry from '~/sentry/sentry_browser_wrapper';
import getCurrentUserOrganizationsQuery from '~/organizations/shared/graphql/queries/organizations.query.graphql';
import getOrganizationQuery from '~/organizations/shared/graphql/queries/organization.query.graphql';
import { getIdFromGraphQLId, convertToGraphQLId } from '~/graphql_shared/utils';
import { TYPE_ORGANIZATION } from '~/graphql_shared/constants';
import { DEFAULT_PER_PAGE } from '~/api';
import {
  ORGANIZATION_TOGGLE_TEXT,
  ORGANIZATION_HEADER_TEXT,
  FETCH_ORGANIZATIONS_ERROR,
  FETCH_ORGANIZATION_ERROR,
} from './constants';
import EntitySelect from './entity_select.vue';

export default {
  name: 'OrganizationSelect',
  components: {
    GlAlert,
    EntitySelect,
  },
  props: {
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    inputName: {
      type: String,
      required: true,
    },
    inputId: {
      type: String,
      required: true,
    },
    initialSelection: {
      type: [String, Number],
      required: false,
      default: null,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    toggleClass: {
      type: [String, Array, Object],
      required: false,
      default: '',
    },
  },
  data() {
    return {
      errorMessage: '',
      endCursor: null,
    };
  },
  methods: {
    async fetchOrganizations(search, page = 1) {
      if (page === 1) {
        this.endCursor = null;
      }

      try {
        const {
          data: {
            currentUser: {
              organizations: { nodes, pageInfo },
            },
          },
        } = await this.$apollo.query({
          query: getCurrentUserOrganizationsQuery,
          // TODO: implement search support - https://gitlab.com/gitlab-org/gitlab/-/issues/433954.
          variables: { after: this.endCursor, first: DEFAULT_PER_PAGE },
        });

        this.endCursor = pageInfo.endCursor;

        return {
          items: nodes.map((organization) => ({
            text: organization.name,
            value: getIdFromGraphQLId(organization.id),
          })),
          // `EntitySelect` expects a `totalPages` key but GraphQL requests don't provide this data
          // because it uses keyset pagination. Since the dropdown uses infinite scroll it
          // only needs to know if there is a next page. We pass `page + 1` if there is a next page,
          // otherwise we just set this to the current page.
          totalPages: pageInfo.hasNextPage ? page + 1 : page,
        };
      } catch (error) {
        this.endCursor = null;
        this.handleError({ message: FETCH_ORGANIZATIONS_ERROR, error });

        return { items: [], totalPages: 0 };
      }
    },
    async fetchOrganizationName(id) {
      try {
        const {
          data: {
            organization: { name },
          },
        } = await this.$apollo.query({
          query: getOrganizationQuery,
          variables: { id: convertToGraphQLId(TYPE_ORGANIZATION, id) },
        });

        return name;
      } catch (error) {
        this.handleError({ message: FETCH_ORGANIZATION_ERROR, error });

        return '';
      }
    },
    handleError({ message, error }) {
      Sentry.captureException(error);
      this.errorMessage = message;
    },
    dismissError() {
      this.errorMessage = '';
    },
  },
  i18n: {
    toggleText: ORGANIZATION_TOGGLE_TEXT,
    selectGroup: ORGANIZATION_HEADER_TEXT,
  },
};
</script>

<template>
  <entity-select
    :block="block"
    :label="label"
    :description="description"
    :input-name="inputName"
    :input-id="inputId"
    :initial-selection="initialSelection"
    :clearable="clearable"
    :header-text="$options.i18n.selectGroup"
    :default-toggle-text="$options.i18n.toggleText"
    :fetch-items="fetchOrganizations"
    :fetch-initial-selection-text="fetchOrganizationName"
    :toggle-class="toggleClass"
    v-on="$listeners"
  >
    <template #error>
      <gl-alert v-if="errorMessage" class="gl-mb-3" variant="danger" @dismiss="dismissError">{{
        errorMessage
      }}</gl-alert>
    </template>
  </entity-select>
</template>
