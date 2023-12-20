import { Injectable } from '@nestjs/common';

import { MessageQueueJob } from 'src/integrations/message-queue/interfaces/message-queue-job.interface';

export enum WebhookOperation {
  create = 'create',
}

export type CallWebhookJobData = {
  workspaceId: string;
  objectNameSingular: string;
  recordData: any;
  operation: WebhookOperation;
};

@Injectable()
export class CallWebhookJob implements MessageQueueJob<CallWebhookJobData> {
  async handle(data: CallWebhookJobData): Promise<void> {
    console.log('CallWebhookJob called with data:', data);
  }
}
