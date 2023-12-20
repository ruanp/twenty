import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { FetchMessagesJob } from 'src/workspace/messaging/jobs/fetch-messages.job';
import { CallWebhookJob } from 'src/workspace/workspace-query-runner/jobs/call-webhook.job';

@Module({
  providers: [
    {
      provide: FetchMessagesJob.name,
      useClass: FetchMessagesJob,
    },
    {
      provide: CallWebhookJob.name,
      useClass: CallWebhookJob,
    },
  ],
})
export class JobsModule {
  static moduleRef: ModuleRef;

  constructor(private moduleRef: ModuleRef) {
    JobsModule.moduleRef = this.moduleRef;
  }
}
