import styled from '@emotion/styled';

import { BoardContext } from '@/companies/states/contexts/BoardContext';
import { mapBoardFieldDefinitionsToViewFields } from '@/companies/utils/mapBoardFieldDefinitionsToViewFields';
import { RecordBoardActionBar } from '@/object-record/record-board/action-bar/components/RecordBoardActionBar';
import { BoardOptionsDropdownId } from '@/object-record/record-board/components/constants/BoardOptionsDropdownId';
import {
  RecordBoard,
  RecordBoardProps,
} from '@/object-record/record-board/components/RecordBoard';
import { RecordBoardContextMenu } from '@/object-record/record-board/context-menu/components/RecordBoardContextMenu';
import { BoardOptionsDropdown } from '@/object-record/record-board/options/components/BoardOptionsDropdown';
import { ViewBar } from '@/views/components/ViewBar';
import { useViewFields } from '@/views/hooks/internal/useViewFields';
import { opportunitiesBoardOptions } from '~/pages/opportunities/opportunitiesBoardOptions';

import { HooksCompanyBoardEffect } from '../../components/HooksCompanyBoardEffect';
import { CompanyBoardRecoilScopeContext } from '../../states/recoil-scope-contexts/CompanyBoardRecoilScopeContext';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  width: 100%;
`;

type CompanyBoardProps = Pick<
  RecordBoardProps,
  'onColumnAdd' | 'onColumnDelete' | 'onEditColumnTitle'
>;

export const CompanyBoard = ({
  onColumnAdd,
  onColumnDelete,
  onEditColumnTitle,
}: CompanyBoardProps) => {
  const viewBarId = 'company-board-view';

  const { persistViewFields } = useViewFields(viewBarId);

  return (
    <StyledContainer>
      <BoardContext.Provider
        value={{
          BoardRecoilScopeContext: CompanyBoardRecoilScopeContext,
          onFieldsChange: (fields) => {
            persistViewFields(mapBoardFieldDefinitionsToViewFields(fields));
          },
        }}
      >
        <ViewBar
          viewBarId={viewBarId}
          optionsDropdownButton={<BoardOptionsDropdown />}
          optionsDropdownScopeId={BoardOptionsDropdownId}
        />
        <HooksCompanyBoardEffect viewBarId={viewBarId} />
        <RecordBoard
          boardOptions={opportunitiesBoardOptions}
          onColumnAdd={onColumnAdd}
          onColumnDelete={onColumnDelete}
          onEditColumnTitle={onEditColumnTitle}
        />
        <RecordBoardActionBar />
        <RecordBoardContextMenu />
      </BoardContext.Provider>
    </StyledContainer>
  );
};
