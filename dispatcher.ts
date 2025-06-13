import promClient = require("prom-client");
import { SERVICE_CLIENT } from "./service_client";
import { StatusCode } from "@selfage/http_error";
import { NodeServiceClient } from "@selfage/node_service_client";
import { ClientRequestInterface } from "@selfage/service_descriptor/client_request_interface";

let TOTAL_COUNTER = new promClient.Counter({
  name: "dispatched_tasks_total",
  help: "The total number of tasks being dispatched.",
  labelNames: ["taskName"],
});
let FAILURE_COUNTER = new promClient.Counter({
  name: "dispatched_tasks_failure",
  help: "The number of tasks failed to be processed.",
  labelNames: ["taskName", "errorCode"],
});

export interface ListRequest {}

export interface ListResponse<ProcessRequest> {
  tasks: ProcessRequest[];
}

export class Dispatcher<ProcessRequest, ProcessResponse> {
  public static create<ProcessRequest, ProcessResponse>(
    newListTasksRequest: (
      body: ListRequest,
    ) => ClientRequestInterface<ListResponse<ProcessRequest>>,
    newProcessTaskRequest: (
      body: ProcessRequest,
    ) => ClientRequestInterface<ProcessResponse>,
  ): Dispatcher<ProcessRequest, ProcessResponse> {
    return new Dispatcher(
      SERVICE_CLIENT,
      setTimeout,
      () => Date.now(),
      newListTasksRequest,
      newProcessTaskRequest,
    );
  }

  private static LEAST_INTERVAL_MS = 1000;

  public constructor(
    private serviceClient: NodeServiceClient,
    private setTimeout: (callback: Function, ms: number) => NodeJS.Timeout,
    private getNow: () => number,
    private newListTasksRequest: (
      body: ListRequest,
    ) => ClientRequestInterface<ListResponse<ProcessRequest>>,
    private newProcessTaskRequest: (
      body: ProcessRequest,
    ) => ClientRequestInterface<ProcessResponse>,
  ) {}

  public start(): this {
    this.dispatch();
    return this;
  }

  private async dispatch(): Promise<void> {
    let startTime = this.getNow();
    await this.dispatchOnce();
    let elaspedTime = this.getNow() - startTime;
    this.setTimeout(
      () => this.dispatch(),
      Math.max(0, Dispatcher.LEAST_INTERVAL_MS - elaspedTime),
    );
  }

  private async dispatchOnce(): Promise<void> {
    let { tasks } = await this.serviceClient.send(this.newListTasksRequest({}));
    await Promise.all(
      tasks.map(async (task): Promise<void> => {
        let request = this.newProcessTaskRequest(task);
        TOTAL_COUNTER.inc({ taskName: request.descriptor.name });
        try {
          await this.serviceClient.send(request);
        } catch (e) {
          FAILURE_COUNTER.inc({
            taskName: request.descriptor.name,
            errorCode: e.statusCode ?? StatusCode.InternalServerError,
          });
        }
      }),
    );
  }
}
