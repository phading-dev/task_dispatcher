import promClient = require("prom-client");
import { SERVICE_CLIENT } from "./service_client";
import { StatusCode } from "@selfage/http_error";
import { NodeServiceClient } from "@selfage/node_service_client";
import { ClientRequestInterface } from "@selfage/service_descriptor/client_request_interface";

let LIST_TOTAL_COUNTER = new promClient.Counter({
  name: "list_tasks_total",
  help: "The total number of requests to list tasks.",
  labelNames: ["path"],
});
let LIST_FAILURE_COUNTER = new promClient.Counter({
  name: "list_tasks_failure",
  help: "The number of requests to list tasks that failed.",
  labelNames: ["path", "errorCode"],
});
let DISPATCH_TOTAL_COUNTER = new promClient.Counter({
  name: "dispatch_tasks_total",
  help: "The total number of tasks being dispatched.",
  labelNames: ["path"],
});
let DISPATCH_FAILURE_COUNTER = new promClient.Counter({
  name: "dispatch_tasks_failure",
  help: "The number of tasks failed to be processed.",
  labelNames: ["path", "errorCode"],
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
    let listRequest = this.newListTasksRequest({});
    LIST_TOTAL_COUNTER.inc({
      path: listRequest.descriptor.service.path + listRequest.descriptor.name,
    });
    let tasks: Array<ProcessRequest>;
    try {
      ({ tasks } = await this.serviceClient.send(listRequest));
    } catch (e) {
      LIST_FAILURE_COUNTER.inc({
        path: listRequest.descriptor.service.path + listRequest.descriptor.name,
        errorCode: e.statusCode ?? StatusCode.InternalServerError,
      });
      console.error(
        `Failed to list tasks for ${listRequest.descriptor.name}:`,
        e,
      );
      return;
    }

    await Promise.all(
      tasks.map(async (task): Promise<void> => {
        let dispatchRequest = this.newProcessTaskRequest(task);
        DISPATCH_TOTAL_COUNTER.inc({
          path:
            dispatchRequest.descriptor.service.path +
            dispatchRequest.descriptor.name,
        });
        try {
          await this.serviceClient.send(dispatchRequest);
        } catch (e) {
          DISPATCH_FAILURE_COUNTER.inc({
            path:
              dispatchRequest.descriptor.service.path +
              dispatchRequest.descriptor.name,
            errorCode: e.statusCode ?? StatusCode.InternalServerError,
          });
          console.error(
            `Failed to process task for ${dispatchRequest.descriptor.name}:`,
            e,
          );
        }
      }),
    );
  }
}
