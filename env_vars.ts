import { CLUSTER_ENV_VARS, ClusterEnvVars } from "@phading/cluster/env_vars";

export interface EnvVars extends ClusterEnvVars {
  releaseServiceName?: string;
  port?: number;
  builderAccount?: string;
  serviceAccount?: string;
  cpu?: string;
  memory?: string;
}

export let ENV_VARS: EnvVars = CLUSTER_ENV_VARS;
