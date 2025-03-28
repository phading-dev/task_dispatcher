import http = require("http");
import { Dispatcher } from "./dispatcher";
import { ENV_VARS } from "./env_vars";
import {
  newListBillingProfileStateSyncingTasksRequest,
  newListBillingProfileSuspendingDueToPastDueTasksRequest,
  newListBillingProfileSuspensionNotifyingTasksRequest,
  newListPaymentMethodNeedsUpdateNotifyingTasksRequest,
  newListPaymentTasksRequest,
  newListPayoutTasksRequest,
  newListStripeConnectedAccountCreatingTasksRequest,
  newListStripeConnectedAccountNeedsSetupNotifyingTasksRequest,
  newListStripePaymentCustomerCreatingTasksRequest,
  newProcessBillingProfileStateSyncingTaskRequest,
  newProcessBillingProfileSuspendingDueToPastDueTaskRequest,
  newProcessBillingProfileSuspensionNotifyingTaskRequest,
  newProcessPaymentMethodNeedsUpdateNotifyingTaskRequest,
  newProcessPaymentTaskRequest,
  newProcessPayoutTaskRequest,
  newProcessStripeConnectedAccountCreatingTaskRequest,
  newProcessStripeConnectedAccountNeedsSetupNotifyingTaskRequest,
  newProcessStripePaymentCustomerCreatingTaskRequest,
} from "@phading/commerce_service_interface/node/client";
import {
  newListCoverImageDeletingTasksRequest,
  newListVideoContainerCreatingTasksRequest,
  newListVideoContainerDeletingTasksRequest,
  newProcessCoverImageDeletingTaskRequest,
  newProcessVideoContainerCreatingTaskRequest,
  newProcessVideoContainerDeletingTaskRequest,
} from "@phading/product_service_interface/show/node/client";
import {
  newListAccountCapabilitiesUpdatingTasksRequest,
  newListBillingProfileCreatingTasksRequest,
  newListEarningsProfileCreatingTasksRequest,
  newProcessAccountCapabilitiesUpdatingTaskRequest,
  newProcessBillingProfileCreatingTaskRequest,
  newProcessEarningsProfileCreatingTaskRequest,
} from "@phading/user_service_interface/node/client";
import {
  newListGcsFileDeletingTasksRequest,
  newListMediaFormattingTasksRequest,
  newListR2KeyDeletingTasksRequest,
  newListStorageEndRecordingTasksRequest,
  newListStorageStartRecordingTasksRequest,
  newListSubtitleFormattingTasksRequest,
  newListUploadedRecordingTasksRequest,
  newListVideoContainerSyncingTasksRequest,
  newListVideoContainerWritingToFileTasksRequest,
  newProcessGcsFileDeletingTaskRequest,
  newProcessMediaFormattingTaskRequest,
  newProcessR2KeyDeletingTaskRequest,
  newProcessStorageEndRecordingTaskRequest,
  newProcessStorageStartRecordingTaskRequest,
  newProcessSubtitleFormattingTaskRequest,
  newProcessUploadedRecordingTaskRequest,
  newProcessVideoContainerSyncingTaskRequest,
  newProcessVideoContainerWritingToFileTaskRequest,
} from "@phading/video_service_interface/node/client";
import { ServiceHandler } from "@selfage/service_handler/service_handler";

async function main() {
  // Commerce service
  Dispatcher.create(
    newListStripePaymentCustomerCreatingTasksRequest,
    newProcessStripePaymentCustomerCreatingTaskRequest,
  ).start();
  Dispatcher.create(
    newListStripeConnectedAccountCreatingTasksRequest,
    newProcessStripeConnectedAccountCreatingTaskRequest,
  ).start();
  Dispatcher.create(
    newListStripeConnectedAccountNeedsSetupNotifyingTasksRequest,
    newProcessStripeConnectedAccountNeedsSetupNotifyingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentTasksRequest,
    newProcessPaymentTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentMethodNeedsUpdateNotifyingTasksRequest,
    newProcessPaymentMethodNeedsUpdateNotifyingTaskRequest,
  ).start();
  Dispatcher.create(
    newListBillingProfileSuspendingDueToPastDueTasksRequest,
    newProcessBillingProfileSuspendingDueToPastDueTaskRequest,
  ).start();
  Dispatcher.create(
    newListBillingProfileSuspensionNotifyingTasksRequest,
    newProcessBillingProfileSuspensionNotifyingTaskRequest,
  ).start();
  Dispatcher.create(
    newListBillingProfileStateSyncingTasksRequest,
    newProcessBillingProfileStateSyncingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPayoutTasksRequest,
    newProcessPayoutTaskRequest,
  ).start();

  // Product service
  Dispatcher.create(
    newListCoverImageDeletingTasksRequest,
    newProcessCoverImageDeletingTaskRequest,
  ).start();
  Dispatcher.create(
    newListVideoContainerCreatingTasksRequest,
    newProcessVideoContainerCreatingTaskRequest,
  ).start();
  Dispatcher.create(
    newListVideoContainerDeletingTasksRequest,
    newProcessVideoContainerDeletingTaskRequest,
  ).start();

  // User service
  Dispatcher.create(
    newListAccountCapabilitiesUpdatingTasksRequest,
    newProcessAccountCapabilitiesUpdatingTaskRequest,
  ).start();
  Dispatcher.create(
    newListBillingProfileCreatingTasksRequest,
    newProcessBillingProfileCreatingTaskRequest,
  ).start();
  Dispatcher.create(
    newListEarningsProfileCreatingTasksRequest,
    newProcessEarningsProfileCreatingTaskRequest,
  ).start();

  // Video service
  Dispatcher.create(
    newListGcsFileDeletingTasksRequest,
    newProcessGcsFileDeletingTaskRequest,
  ).start();
  Dispatcher.create(
    newListMediaFormattingTasksRequest,
    newProcessMediaFormattingTaskRequest,
  ).start();
  Dispatcher.create(
    newListR2KeyDeletingTasksRequest,
    newProcessR2KeyDeletingTaskRequest,
  ).start();
  Dispatcher.create(
    newListStorageEndRecordingTasksRequest,
    newProcessStorageEndRecordingTaskRequest,
  ).start();
  Dispatcher.create(
    newListStorageStartRecordingTasksRequest,
    newProcessStorageStartRecordingTaskRequest,
  ).start();
  Dispatcher.create(
    newListSubtitleFormattingTasksRequest,
    newProcessSubtitleFormattingTaskRequest,
  ).start();
  Dispatcher.create(
    newListUploadedRecordingTasksRequest,
    newProcessUploadedRecordingTaskRequest,
  ).start();
  Dispatcher.create(
    newListVideoContainerSyncingTasksRequest,
    newProcessVideoContainerSyncingTaskRequest,
  ).start();
  Dispatcher.create(
    newListVideoContainerWritingToFileTasksRequest,
    newProcessVideoContainerWritingToFileTaskRequest,
  ).start();

  await ServiceHandler.create(http.createServer())
    .addHealthCheckHandler()
    .addMetricsHandler()
    .start(ENV_VARS.port);
}

main();
