import { NodeServiceClient } from "@selfage/node_service_client";
import { ENV_VARS } from "./env_vars";

export let SERVICE_CLIENT = NodeServiceClient.create(ENV_VARS.internalOrigin);
