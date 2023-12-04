import { useRecoilCallback } from 'recoil';

import { currentPipelineStepsState } from '@/pipeline/states/currentPipelineStepsState';
import { Opportunity } from '@/pipeline/types/Opportunity';
import { PipelineStep } from '@/pipeline/types/PipelineStep';
import { entityFieldsFamilyState } from '@/object-record/field/states/entityFieldsFamilyState';
import { boardCardIdsByColumnIdFamilyState } from '@/object-record/record-board/states/boardCardIdsByColumnIdFamilyState';
import { boardColumnsState } from '@/object-record/record-board/states/boardColumnsState';
import { savedBoardColumnsState } from '@/object-record/record-board/states/savedBoardColumnsState';
import { BoardColumnDefinition } from '@/object-record/record-board/types/BoardColumnDefinition';
import { themeColorSchema } from '@/ui/theme/utils/themeColorSchema';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';
import { logError } from '~/utils/logError';

import { companyProgressesFamilyState } from '../states/companyProgressesFamilyState';
import { CompanyForBoard, CompanyProgressDict } from '../types/CompanyProgress';

export const useUpdateCompanyBoard = () =>
  useRecoilCallback(
    ({ set, snapshot }) =>
      (
        pipelineSteps: PipelineStep[],
        opportunities: Opportunity[],
        companies: CompanyForBoard[],
      ) => {
        const indexCompanyByIdReducer = (
          acc: { [key: string]: CompanyForBoard },
          company: CompanyForBoard,
        ) => ({
          ...acc,
          [company.id]: company,
        });

        const companiesDict =
          companies.reduce(
            indexCompanyByIdReducer,
            {} as { [key: string]: CompanyForBoard },
          ) ?? {};

        const indexOpportunityByIdReducer = (
          acc: CompanyProgressDict,
          opportunity: Opportunity,
        ) => {
          const company =
            opportunity.companyId && companiesDict[opportunity.companyId];

          if (!company) return acc;

          return {
            ...acc,
            [opportunity.id]: {
              opportunity,
              company,
            },
          };
        };

        const companyBoardIndex = opportunities.reduce(
          indexOpportunityByIdReducer,
          {} as CompanyProgressDict,
        );

        for (const [id, companyProgress] of Object.entries(companyBoardIndex)) {
          const currentCompanyProgress = snapshot
            .getLoadable(companyProgressesFamilyState(id))
            .valueOrThrow();

          if (!isDeeplyEqual(currentCompanyProgress, companyProgress)) {
            set(companyProgressesFamilyState(id), companyProgress);
            set(entityFieldsFamilyState(id), companyProgress.opportunity);
          }
        }

        const currentPipelineSteps = snapshot
          .getLoadable(currentPipelineStepsState)
          .valueOrThrow();

        const currentBoardColumns = snapshot
          .getLoadable(boardColumnsState)
          .valueOrThrow();

        if (!isDeeplyEqual(pipelineSteps, currentPipelineSteps)) {
          set(currentPipelineStepsState, pipelineSteps);
        }

        const orderedPipelineSteps = [...pipelineSteps].sort((a, b) => {
          if (!a.position || !b.position) return 0;
          return a.position - b.position;
        });

        const newBoardColumns: BoardColumnDefinition[] =
          orderedPipelineSteps?.map((pipelineStep) => {
            const colorValidationResult = themeColorSchema.safeParse(
              pipelineStep.color,
            );

            if (!colorValidationResult.success) {
              logError(
                `Color ${pipelineStep.color} is not recognized in useUpdateCompanyBoard.`,
              );
            }

            return {
              id: pipelineStep.id,
              title: pipelineStep.name,
              colorCode: colorValidationResult.success
                ? colorValidationResult.data
                : undefined,
              position: pipelineStep.position ?? 0,
            };
          });
        if (
          currentBoardColumns.length === 0 &&
          !isDeeplyEqual(newBoardColumns, currentBoardColumns)
        ) {
          set(boardColumnsState, newBoardColumns);
          set(savedBoardColumnsState, newBoardColumns);
        }
        for (const boardColumn of newBoardColumns) {
          const boardCardIds = opportunities
            .filter(
              (opportunityToFilter) =>
                opportunityToFilter.pipelineStepId === boardColumn.id,
            )
            .map((opportunity) => opportunity.id);

          const currentBoardCardIds = snapshot
            .getLoadable(boardCardIdsByColumnIdFamilyState(boardColumn.id))
            .valueOrThrow();

          if (!isDeeplyEqual(currentBoardCardIds, boardCardIds)) {
            set(
              boardCardIdsByColumnIdFamilyState(boardColumn.id),
              boardCardIds,
            );
          }
        }
      },
    [],
  );
