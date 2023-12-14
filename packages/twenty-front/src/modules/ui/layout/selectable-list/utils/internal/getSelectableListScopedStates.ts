import { selectableItemIdsScopedState } from '@/ui/layout/selectable-list/states/selectableItemIdsScopedState';
import { selectableListOnEnterScopedState } from '@/ui/layout/selectable-list/states/selectableListOnEnterScopedState';
import { selectedItemIdScopedState } from '@/ui/layout/selectable-list/states/selectedItemIdScopedState';
import { getScopedState } from '@/ui/utilities/recoil-scope/utils/getScopedState';

const UNDEFINED_SELECTABLE_ITEM_ID = 'UNDEFINED_SELECTABLE_ITEM_ID';

export const getSelectableListScopedStates = ({
  selectableListScopeId,
}: {
  selectableListScopeId: string;
}) => {
  const selectedItemIdState = getScopedState(
    selectedItemIdScopedState,
    selectableListScopeId,
  );

  const selectableItemIdsState = getScopedState(
    selectableItemIdsScopedState,
    selectableListScopeId,
  );

  const selectableListOnEnterState = getScopedState(
    selectableListOnEnterScopedState,
    selectableListScopeId,
  );

  return {
    selectableItemIdsState,
    selectedItemIdState,
    selectableListOnEnterState,
  };
};
