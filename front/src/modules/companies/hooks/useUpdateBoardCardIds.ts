import { useRecoilCallback } from 'recoil';

import { boardCardIdsByColumnIdFamilyState } from '@/object-record/record-board/states/boardCardIdsByColumnIdFamilyState';
import { boardColumnsState } from '@/object-record/record-board/states/boardColumnsState';
import { Opportunity } from '@/pipeline/types/Opportunity';

export const useUpdateCompanyBoardCardIds = () =>
  useRecoilCallback(
    ({ snapshot, set }) =>
      (pipelineProgresses: Pick<Opportunity, 'pipelineStepId' | 'id'>[]) => {
        const boardColumns = snapshot
          .getLoadable(boardColumnsState)
          .valueOrThrow();

        for (const boardColumn of boardColumns) {
          const boardCardIds = pipelineProgresses
            .filter(
              (pipelineProgressToFilter) =>
                pipelineProgressToFilter.pipelineStepId === boardColumn.id,
            )
            .map((pipelineProgress) => pipelineProgress.id);

          set(boardCardIdsByColumnIdFamilyState(boardColumn.id), boardCardIds);
        }
      },
    [],
  );
