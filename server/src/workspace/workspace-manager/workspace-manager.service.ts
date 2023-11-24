import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { DataSourceService } from 'src/metadata/data-source/data-source.service';
import { FieldMetadataService } from 'src/metadata/field-metadata/field-metadata.service';
import { ObjectMetadataService } from 'src/metadata/object-metadata/object-metadata.service';
import { WorkspaceMigrationRunnerService } from 'src/workspace/workspace-migration-runner/workspace-migration-runner.service';
import { WorkspaceMigrationService } from 'src/metadata/workspace-migration/workspace-migration.service';
import { standardObjectsPrefillData } from 'src/workspace/workspace-manager/standard-objects-prefill-data/standard-objects-prefill-data';
import { WorkspaceDataSourceService } from 'src/workspace/workspace-datasource/workspace-datasource.service';
import { DataSourceEntity } from 'src/metadata/data-source/data-source.entity';
import { RelationMetadataService } from 'src/metadata/relation-metadata/relation-metadata.service';
import { standardObjectRelationMetadata } from 'src/workspace/workspace-manager/standard-objects/standard-object-relation-metadata';
import { ObjectMetadataEntity } from 'src/metadata/object-metadata/object-metadata.entity';
import {
  FieldMetadataEntity,
  FieldMetadataType,
} from 'src/metadata/field-metadata/field-metadata.entity';

import {
  basicFieldsMetadata,
  standardObjectsMetadata,
} from './standard-objects/standard-object-metadata';

@Injectable()
export class WorkspaceManagerService {
  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly workspaceMigrationService: WorkspaceMigrationService,
    private readonly workspaceMigrationRunnerService: WorkspaceMigrationRunnerService,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
    private readonly dataSourceService: DataSourceService,
    private readonly relationMetadataService: RelationMetadataService,
  ) {}

  /**
   * Init a workspace by creating a new data source and running all migrations
   * @params workspaceId, prefillSeedData
   * @returns Promise<void>
   */
  public async init(
    workspaceId: string,
    prefillViewData = false,
  ): Promise<void> {
    const schemaName =
      await this.workspaceDataSourceService.createWorkspaceDBSchema(
        workspaceId,
      );

    const dataSourceMetadata =
      await this.dataSourceService.createDataSourceMetadata(
        workspaceId,
        schemaName,
      );

    await this.setWorkspaceMaxRow(workspaceId, schemaName);

    await this.workspaceMigrationService.insertStandardMigrations(workspaceId);

    await this.workspaceMigrationRunnerService.executeMigrationFromPendingMigrations(
      workspaceId,
    );

    const createdObjectMetadata =
      await this.createStandardObjectsAndFieldsMetadata(
        dataSourceMetadata.id,
        workspaceId,
      );
    await this.prefillWorkspaceWithStandardObjects(
      dataSourceMetadata,
      workspaceId,
      createdObjectMetadata,
      prefillViewData,
    );
  }

  /**
   *
   * Create all standard objects and fields metadata for a given workspace
   *
   * @param dataSourceId
   * @param workspaceId
   */
  public async createStandardObjectsAndFieldsMetadata(
    dataSourceId: string,
    workspaceId: string,
  ): Promise<ObjectMetadataEntity[]> {
    const createdObjectMetadata = await this.objectMetadataService.createMany(
      Object.values(standardObjectsMetadata).map((objectMetadata: any) => ({
        ...objectMetadata,
        dataSourceId,
        workspaceId,
        isCustom: false,
        isActive: true,
        fields: [...basicFieldsMetadata, ...objectMetadata.fields].map(
          (field) => ({
            ...field,
            workspaceId,
            isCustom: false,
            isActive: true,
          }),
        ),
      })),
    );

    await this.relationMetadataService.createMany(
      Object.values(standardObjectRelationMetadata).map((relationMetadata) =>
        this.createStandardObjectRelations(
          workspaceId,
          createdObjectMetadata,
          relationMetadata,
        ),
      ),
    );

    return createdObjectMetadata;
  }

  /**
   *
   * @param workspaceId
   * @param createdObjectMetadata
   * @param relationMetadata
   * @returns Partial<RelationMetadataEntity>
   */
  private createStandardObjectRelations(
    workspaceId: string,
    createdObjectMetadata: ObjectMetadataEntity[],
    relationMetadata: any,
  ) {
    const createdObjectMetadataByNameSingular = createdObjectMetadata.reduce(
      (acc, curr) => {
        acc[curr.nameSingular] = curr;
        return acc;
      },
      {},
    );

    const fromObjectMetadata =
      createdObjectMetadataByNameSingular[
        relationMetadata.fromObjectNameSingular
      ];
    const toObjectMetadata =
      createdObjectMetadataByNameSingular[
        relationMetadata.toObjectNameSingular
      ];

    if (!fromObjectMetadata) {
      throw new Error(
        `Could not find created object metadata with 
          fromObjectNameSingular: ${relationMetadata.fromObjectNameSingular}`,
      );
    }

    if (!toObjectMetadata) {
      throw new Error(
        `Could not find created object metadata with
          toObjectNameSingular: ${relationMetadata.toObjectNameSingular}`,
      );
    }

    const fromFieldMetadata = createdObjectMetadataByNameSingular[
      relationMetadata.fromObjectNameSingular
    ]?.fields.find(
      (field: FieldMetadataEntity) =>
        field.type === FieldMetadataType.RELATION &&
        field.name === relationMetadata.fromFieldMetadataName,
    );

    const toFieldMetadata = createdObjectMetadataByNameSingular[
      relationMetadata.toObjectNameSingular
    ]?.fields.find(
      (field: FieldMetadataEntity) =>
        field.type === FieldMetadataType.RELATION &&
        field.name === relationMetadata.toFieldMetadataName,
    );

    if (!fromFieldMetadata) {
      throw new Error(
        `Could not find created field metadata with 
          fromFieldMetadataName: ${relationMetadata.fromFieldMetadataName}
          for object: ${relationMetadata.fromObjectNameSingular}`,
      );
    }

    if (!toFieldMetadata) {
      throw new Error(
        `Could not find created field metadata with 
          toFieldMetadataName: ${relationMetadata.toFieldMetadataName}
          for object: ${relationMetadata.toObjectNameSingular}`,
      );
    }

    return {
      fromObjectMetadataId: fromObjectMetadata.id,
      toObjectMetadataId: toObjectMetadata.id,
      workspaceId,
      relationType: relationMetadata.type,
      fromFieldMetadataId: fromFieldMetadata.id,
      toFieldMetadataId: toFieldMetadata.id,
    };
  }

  /**
   *
   * Reset all standard objects and fields metadata for a given workspace
   *
   * @param dataSourceId
   * @param workspaceId
   */
  public async resetStandardObjectsAndFieldsMetadata(
    dataSourceId: string,
    workspaceId: string,
  ) {
    await this.objectMetadataService.deleteMany({
      workspaceId: { eq: workspaceId },
    });

    await this.createStandardObjectsAndFieldsMetadata(
      dataSourceId,
      workspaceId,
    );
  }

  /**
   *
   * We are updating the pg_graphql max_rows from 30 (default value) to 60
   *
   * @params workspaceId, schemaName
   * @param workspaceId
   */
  private async setWorkspaceMaxRow(workspaceId, schemaName) {
    const workspaceDataSource =
      await this.workspaceDataSourceService.connectToWorkspaceDataSource(
        workspaceId,
      );
    await workspaceDataSource.query(
      `comment on schema ${schemaName} is e'@graphql({"max_rows": 60})'`,
    );
  }

  /**
   *
   * We are prefilling a few standard objects with data to make it easier for the user to get started.
   *
   * @param dataSourceMetadata
   * @param workspaceId
   */
  private async prefillWorkspaceWithStandardObjects(
    dataSourceMetadata: DataSourceEntity,
    workspaceId: string,
    createdObjectMetadata: ObjectMetadataEntity[],
    prefillViewsOnly = false,
  ) {
    const workspaceDataSource =
      await this.workspaceDataSourceService.connectToWorkspaceDataSource(
        workspaceId,
      );

    if (!workspaceDataSource) {
      throw new Error('Could not connect to workspace data source');
    }

    standardObjectsPrefillData(
      workspaceDataSource,
      dataSourceMetadata.schema,
      createdObjectMetadata,
      prefillViewsOnly,
    );
  }

  public async injectWorkspaceData(
    table: string,
    workspaceId: string,
    values,
    columns,
  ) {
    if (!(await this.workspaceDataSourceService.hasSchema(workspaceId))) {
      await this.init(workspaceId, true);
    }
    const schema = this.workspaceDataSourceService.getSchemaName(workspaceId);
    const workspaceDataSource =
      await this.workspaceDataSourceService.connectToWorkspaceDataSource(
        workspaceId,
      );

    await workspaceDataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager
          .createQueryBuilder()
          .insert()
          .into(`${schema}.${table}`, columns)
          .orIgnore()
          .values(values)
          .execute();
      },
    );
  }

  public async injectPublicData(table: string, values, columns) {
    const workspaceDataSource =
      await this.workspaceDataSourceService.connectToMainSchemaDataSource();

    // https://stackoverflow.com/questions/8495687/split-array-into-chunks
    const chunk = (array, perChunk) => {
      return array.reduce((all, one, i) => {
        const ch = Math.floor(i / perChunk);
        all[ch] = [].concat(all[ch] || [], one);
        return all;
      }, []);
    };

    await workspaceDataSource.transaction(
      async (entityManager: EntityManager) => {
        for (const chunkValues of chunk(values, 1000)) {
          await entityManager
            .createQueryBuilder()
            .insert()
            .into(`core.${table}`, columns)
            .orIgnore()
            .values(chunkValues)
            .execute();
        }
      },
    );
  }

  public async updateDefaultWorkspaceIds(
    values: { id: string; defaultWorkspaceId: string }[],
  ) {
    const workspaceDataSource =
      await this.workspaceDataSourceService.connectToMainSchemaDataSource();
    for (const value of values) {
      if (value.defaultWorkspaceId !== null) {
        await workspaceDataSource.transaction(
          async (entityManager: EntityManager) => {
            await entityManager.query(
              `UPDATE core.user
            SET "defaultWorkspaceId"='${value.defaultWorkspaceId}'
            WHERE id='${value.id}'
            `,
            );
          },
        );
      }
    }
  }

  /**
   *
   * Delete a workspace by deleting all metadata and the schema
   *
   * @param workspaceId
   */
  public async delete(workspaceId: string): Promise<void> {
    // Delete data from metadata tables
    await this.objectMetadataService.deleteObjectsMetadata(workspaceId);
    await this.workspaceMigrationService.delete(workspaceId);
    await this.dataSourceService.delete(workspaceId);
    // Delete schema
    await this.workspaceDataSourceService.deleteWorkspaceDBSchema(workspaceId);
  }
}
