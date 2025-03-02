<script>
import { s__ } from '~/locale';
import { getAge, calculateDeploymentStatus } from '../helpers/k8s_integration_helper';
import WorkloadLayout from '../components/workload_layout.vue';
import k8sDeploymentsQuery from '../graphql/queries/k8s_dashboard_deployments.query.graphql';
import { PHASE_FAILED, PHASE_READY, PHASE_PENDING, STATUS_LABELS } from '../constants';

export default {
  components: {
    WorkloadLayout,
  },
  inject: ['configuration'],
  apollo: {
    k8sDeployments: {
      query: k8sDeploymentsQuery,
      variables() {
        return {
          configuration: this.configuration,
        };
      },
      update(data) {
        return (
          data?.k8sDeployments?.map((deployment) => {
            return {
              name: deployment.metadata?.name,
              namespace: deployment.metadata?.namespace,
              status: calculateDeploymentStatus(deployment),
              age: getAge(deployment.metadata?.creationTimestamp),
              labels: deployment.metadata?.labels,
              annotations: deployment.metadata?.annotations,
              kind: s__('KubernetesDashboard|Deployment'),
            };
          }) || []
        );
      },
      error(err) {
        this.errorMessage = err?.message;
      },
    },
  },
  data() {
    return {
      k8sDeployments: [],
      errorMessage: '',
    };
  },
  computed: {
    deploymentsStats() {
      return [
        {
          value: this.countDeploymentsByStatus(PHASE_READY),
          title: STATUS_LABELS[PHASE_READY],
        },
        {
          value: this.countDeploymentsByStatus(PHASE_FAILED),
          title: STATUS_LABELS[PHASE_FAILED],
        },
        {
          value: this.countDeploymentsByStatus(PHASE_PENDING),
          title: STATUS_LABELS[PHASE_PENDING],
        },
      ];
    },
    loading() {
      return this.$apollo.queries.k8sDeployments.loading;
    },
  },
  methods: {
    countDeploymentsByStatus(phase) {
      const filteredDeployments = this.k8sDeployments.filter((item) => item.status === phase) || [];

      return filteredDeployments.length;
    },
  },
};
</script>
<template>
  <workload-layout
    :loading="loading"
    :error-message="errorMessage"
    :stats="deploymentsStats"
    :items="k8sDeployments"
  />
</template>
