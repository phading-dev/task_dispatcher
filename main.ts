import http = require("http");
import { Dispatcher } from "./dispatcher";
import { ENV_VARS } from "./env_vars";
import {
  newListPaymentMethodNeedsUpdateNotifyingTasksRequest,
  newListPaymentProfileStateSyncingTasksRequest,
  newListPaymentProfileSuspendingDueToPastDueTasksRequest,
  newListPaymentProfileSuspensionNotifyingTasksRequest,
  newListPaymentTasksRequest,
  newListPayoutTasksRequest,
  newListStripeConnectedAccountCreatingTasksRequest,
  newListStripeConnectedAccountNeedsSetupNotifyingTasksRequest,
  newListStripePaymentCustomerCreatingTasksRequest,
  newProcessPaymentMethodNeedsUpdateNotifyingTaskRequest,
  newProcessPaymentProfileStateSyncingTaskRequest,
  newProcessPaymentProfileSuspendingDueToPastDueTaskRequest,
  newProcessPaymentProfileSuspensionNotifyingTaskRequest,
  newProcessPaymentTaskRequest,
  newProcessPayoutTaskRequest,
  newProcessStripeConnectedAccountCreatingTaskRequest,
  newProcessStripeConnectedAccountNeedsSetupNotifyingTaskRequest,
  newProcessStripePaymentCustomerCreatingTaskRequest,
} from "@phading/commerce_service_interface/node/client";
import {
  newListCoverImageDeletingTasksRequest,
  newListSeasonRecentPremiereTimeUpdatingTasksRequest,
  newListVideoContainerDeletingTasksRequest,
  newProcessCoverImageDeletingTaskRequest,
  newProcessSeasonRecentPremiereTimeUpdatingTaskRequest,
  newProcessVideoContainerDeletingTaskRequest,
} from "@phading/product_service_interface/show/node/client";
import {
  newListAccountCapabilitiesUpdatingTasksRequest,
  newListAvatarImageDeletingTasksRequest,
  newListPaymentProfileCreatingTasksRequest,
  newListPayoutProfileCreatingTasksRequest,
  newProcessAccountCapabilitiesUpdatingTaskRequest,
  newProcessAvatarImageDeletingTaskRequest,
  newProcessPaymentProfileCreatingTaskRequest,
  newProcessPayoutProfileCreatingTaskRequest,
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
    newListPaymentMethodNeedsUpdateNotifyingTasksRequest,
    newProcessPaymentMethodNeedsUpdateNotifyingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentProfileSuspendingDueToPastDueTasksRequest,
    newProcessPaymentProfileSuspendingDueToPastDueTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentProfileSuspensionNotifyingTasksRequest,
    newProcessPaymentProfileSuspensionNotifyingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentProfileStateSyncingTasksRequest,
    newProcessPaymentProfileStateSyncingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentTasksRequest,
    newProcessPaymentTaskRequest,
  ).start();
  Dispatcher.create(
    newListPayoutTasksRequest,
    newProcessPayoutTaskRequest,
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
    newListStripePaymentCustomerCreatingTasksRequest,
    newProcessStripePaymentCustomerCreatingTaskRequest,
  ).start();

  // Product service
  Dispatcher.create(
    newListCoverImageDeletingTasksRequest,
    newProcessCoverImageDeletingTaskRequest,
  ).start();
  Dispatcher.create(
    newListSeasonRecentPremiereTimeUpdatingTasksRequest,
    newProcessSeasonRecentPremiereTimeUpdatingTaskRequest,
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
    newListAvatarImageDeletingTasksRequest,
    newProcessAvatarImageDeletingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPaymentProfileCreatingTasksRequest,
    newProcessPaymentProfileCreatingTaskRequest,
  ).start();
  Dispatcher.create(
    newListPayoutProfileCreatingTasksRequest,
    newProcessPayoutProfileCreatingTaskRequest,
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
