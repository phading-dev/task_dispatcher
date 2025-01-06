import { INTERVAL_MS } from "./params";
import { SERVICE_CLIENT } from "./service_client";
import {
  listCoverImageDeletingTasks,
  listVideoContainerCreatingTasks,
  listVideoContainerDeletingTasks,
  processCoverImageDeletingTask,
  processVideoContainerCreatingTask,
  processVideoContainerDeletingTask,
} from "@phading/product_service_interface/show/node/client";
import {
  listGcsFileDeletingTasks,
  listMediaFormattingTasks,
  listR2KeyDeletingTasks,
  listStorageEndRecordingTasks,
  listStorageStartRecordingTasks,
  listSubtitleFormattingTasks,
  listUploadedRecordingTasks,
  listVideoContainerSyncingTasks,
  listVideoContainerWritingToFileTasks,
  processGcsFileDeletingTask,
  processMediaFormattingTask,
  processR2KeyDeletingTask,
  processStorageEndRecordingTask,
  processStorageStartRecordingTask,
  processSubtitleFormattingTask,
  processUploadedRecordingTask,
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
      this.dispatchVideoContainerCreatingTasks(),
      this.dispatchVideoContainerDeletingTasks(),
      this.dispatchCoverImageDeletingTasks(),
      this.dispatchWritingToFileTasks(),
      this.dispatchSyncingTasks(),
      this.dispatchUploadedRecordingTasks(),
      this.dispatchMediaFormattingTasks(),
      this.dispatchSubtitleFormattingTasks(),
      this.dispatchStorageStartRecordingTasks(),
      this.dispatchStorageEndRecordingTasks(),
      this.dispatchGcsFileDeletingTasks(),
      this.dispatchR2KeyDeletingTasks(),
    ]);
    this.setTimeout(() => this.dispatch(), INTERVAL_MS);
  }

  private async dispatchVideoContainerCreatingTasks(): Promise<void> {
    let { tasks } = await listVideoContainerCreatingTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) =>
        processVideoContainerCreatingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchVideoContainerDeletingTasks(): Promise<void> {
    let { tasks } = await listVideoContainerDeletingTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) =>
        processVideoContainerDeletingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchCoverImageDeletingTasks(): Promise<void> {
    let { tasks } = await listCoverImageDeletingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processCoverImageDeletingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchWritingToFileTasks(): Promise<void> {
    let { tasks } = await listVideoContainerWritingToFileTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) =>
        processVideoContainerWritingToFileTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchSyncingTasks(): Promise<void> {
    let { tasks } = await listVideoContainerSyncingTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) =>
        processVideoContainerSyncingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchUploadedRecordingTasks(): Promise<void> {
    let { tasks } = await listUploadedRecordingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processUploadedRecordingTask(this.serviceClient, task).catch((e) => {}),
      ),
    );
  }

  private async dispatchMediaFormattingTasks(): Promise<void> {
    let { tasks } = await listMediaFormattingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processMediaFormattingTask(this.serviceClient, task).catch((e) => {}),
      ),
    );
  }

  private async dispatchSubtitleFormattingTasks(): Promise<void> {
    let { tasks } = await listSubtitleFormattingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processSubtitleFormattingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchStorageStartRecordingTasks(): Promise<void> {
    let { tasks } = await listStorageStartRecordingTasks(
      this.serviceClient,
      {},
    );
    await Promise.all(
      tasks.map((task) =>
        processStorageStartRecordingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchStorageEndRecordingTasks(): Promise<void> {
    let { tasks } = await listStorageEndRecordingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processStorageEndRecordingTask(this.serviceClient, task).catch(
          (e) => {},
        ),
      ),
    );
  }

  private async dispatchGcsFileDeletingTasks(): Promise<void> {
    let { tasks } = await listGcsFileDeletingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processGcsFileDeletingTask(this.serviceClient, task).catch((e) => {}),
      ),
    );
  }

  private async dispatchR2KeyDeletingTasks(): Promise<void> {
    let { tasks } = await listR2KeyDeletingTasks(this.serviceClient, {});
    await Promise.all(
      tasks.map((task) =>
        processR2KeyDeletingTask(this.serviceClient, task).catch((e) => {}),
      ),
    );
  }
}
