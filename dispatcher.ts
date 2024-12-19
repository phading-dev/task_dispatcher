import { SERVICE_CLIENT } from "./service_client";
import {
  listGcsFileDeleteTasks,
  listMediaFormattingTasks,
  listR2KeyDeleteTasks,
  listSubtitleFormattingTasks,
  listVideoContainerSyncingTasks,
  listVideoContainerWritingToFileTasks,
  processGcsFileDeleteTask,
  processMediaFormattingTask,
  processR2KeyDeleteTask,
  processSubtitleFormattingTask,
  processVideoContainerSyncingTask,
  processVideoContainerWritingToFileTask,
} from "@phading/video_service_interface/node/client";
import { NodeServiceClient } from "@selfage/node_service_client";

export class Dispatcher {
  public static create(): Dispatcher {
    return new Dispatcher(SERVICE_CLIENT, setTimeout);
  }

  public constructor(
    private serviceClient: NodeServiceClient,
    private setTimeout: (callback: Function, ms: number) => NodeJS.Timeout,
  ) {}

  public start(): this {
    this.dispatch();
    return this;
  }

  private async dispatch(): Promise<void> {
    await Promise.all([
      this.dispatchWritingToFileTasks(),
      this.dispatchSyncingTasks(),
      this.dispatchMediaFormattingTasks(),
      this.dispatchSubtitleFormattingTasks(),
      this.dispatchGcsFileDeleteTasks(),
      this.dispatchR2KeyDeleteTasks(),
    ]);
    this.setTimeout(() => this.dispatch(), 1000);
  }

  private async dispatchWritingToFileTasks(): Promise<void> {
    let { tasks } = await listVideoContainerWritingToFileTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) => {
        processVideoContainerWritingToFileTask(this.serviceClient, task);
      }),
    );
  }

  private async dispatchSyncingTasks(): Promise<void> {
    let { tasks } = await listVideoContainerSyncingTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) => {
        processVideoContainerSyncingTask(this.serviceClient, task);
      }),
    );
  }

  private async dispatchMediaFormattingTasks(): Promise<void> {
    let { tasks } = await listMediaFormattingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) => {
        processMediaFormattingTask(this.serviceClient, task);
      }),
    );
  }

  private async dispatchSubtitleFormattingTasks(): Promise<void> {
    let { tasks } = await listSubtitleFormattingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) => {
        processSubtitleFormattingTask(this.serviceClient, task);
      }),
    );
  }

  private async dispatchGcsFileDeleteTasks(): Promise<void> {
    let { tasks } = await listGcsFileDeleteTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) => {
        processGcsFileDeleteTask(this.serviceClient, task);
      }),
    );
  }

  private async dispatchR2KeyDeleteTasks(): Promise<void> {
    let { tasks } = await listR2KeyDeleteTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) => {
        processR2KeyDeleteTask(this.serviceClient, task);
      }),
    );
  }
}
