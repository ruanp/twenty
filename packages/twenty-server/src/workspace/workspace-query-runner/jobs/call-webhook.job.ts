import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { MessageQueueJob } from 'src/integrations/message-queue/interfaces/message-queue-job.interface';

import { WorkspaceDataSourceService } from 'src/workspace/workspace-datasource/workspace-datasource.service';
import { ObjectMetadataService } from 'src/metadata/object-metadata/object-metadata.service';
import { DataSourceService } from 'src/metadata/data-source/data-source.service';

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
  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly dataSourceService: DataSourceService,
    private readonly httpService: HttpService,
  ) {}

  async handle(data: CallWebhookJobData): Promise<void> {
    const objectMetadata =
      await this.objectMetadataService.findManyWithinWorkspace(
        data.workspaceId,
        { where: { nameSingular: data.objectNameSingular } },
      );
    const dataSourceMetadata =
      await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail(
        data.workspaceId,
      );
    const workspaceDataSource =
      await this.workspaceDataSourceService.connectToWorkspaceDataSource(
        data.workspaceId,
      );
    const namePlural = objectMetadata?.[0].namePlural;
    const webhooks: { targetUrl: string }[] = await workspaceDataSource?.query(
      `SELECT * FROM ${dataSourceMetadata.schema}."webhook" WHERE operation='${data.operation}.${namePlural}'`,
    );

    webhooks.forEach((webhook) => {
      this.httpService.axiosRef
        .post(webhook.targetUrl, data.recordData)
        .catch((err) =>
          console.log(`Error on webhook '${webhook.targetUrl}': ${err}`),
        );
    });

    console.log('CallWebhookJob called with data:', data);
  }
}
