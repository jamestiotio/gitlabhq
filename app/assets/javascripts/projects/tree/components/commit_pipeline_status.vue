<script>
import { GlLoadingIcon, GlTooltipDirective } from '@gitlab/ui';
import Visibility from 'visibilityjs';
import { createAlert } from '~/alert';
import Poll from '~/lib/utils/poll';
import { __, s__, sprintf } from '~/locale';
import CiIcon from '~/vue_shared/components/ci_icon.vue';
import CommitPipelineService from '../services/commit_pipeline_service';

export default {
  directives: {
    GlTooltip: GlTooltipDirective,
  },
  components: {
    CiIcon,
    GlLoadingIcon,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ciStatus: {},
      isLoading: true,
    };
  },
  computed: {
    statusTitle() {
      return sprintf(s__('PipelineStatusTooltip|Pipeline: %{ciStatus}'), {
        ciStatus: this.ciStatus.text,
      });
    },
  },
  mounted() {
    this.service = new CommitPipelineService(this.endpoint);
    this.initPolling();
  },
  beforeDestroy() {
    this.poll.stop();
  },
  methods: {
    successCallback(res) {
      const { pipelines } = res.data;
      if (pipelines.length > 0) {
        // The pipeline entity always keeps the latest pipeline info on the `details.status`
        this.ciStatus = pipelines[0].details.status;
      }
      this.isLoading = false;
    },
    errorCallback() {
      this.ciStatus = {
        text: __('not found'),
        icon: 'status_notfound',
        group: 'notfound',
      };
      this.isLoading = false;
      createAlert({
        message: __('Something went wrong on our end'),
      });
    },
    initPolling() {
      this.poll = new Poll({
        resource: this.service,
        method: 'fetchData',
        successCallback: (response) => this.successCallback(response),
        errorCallback: this.errorCallback,
      });

      if (!Visibility.hidden()) {
        this.isLoading = true;
        this.poll.makeRequest();
      } else {
        this.fetchPipelineCommitData();
      }

      Visibility.change(() => {
        if (!Visibility.hidden()) {
          this.poll.restart();
        } else {
          this.poll.stop();
        }
      });
    },
    fetchPipelineCommitData() {
      this.service.fetchData().then(this.successCallback).catch(this.errorCallback);
    },
  },
};
</script>
<template>
  <div class="gl-ml-5">
    <gl-loading-icon v-if="isLoading" size="sm" label="Loading pipeline status" />
    <a v-else :href="ciStatus.details_path">
      <ci-icon :status="ciStatus" :title="statusTitle" :aria-label="statusTitle" />
    </a>
  </div>
</template>
