import { SelectableListScopeInternalContext } from '@/ui/layout/selectable-list/scopes/scope-internal-context/SelectableListScopeInternalContext';
import { getSelectableListScopedStates } from '@/ui/layout/selectable-list/utils/internal/getSelectableListScopedStates';
import { useAvailableScopeIdOrThrow } from '@/ui/utilities/recoil-scope/scopes-internal/hooks/useAvailableScopeId';

type UseSelectableListScopedStatesProps = {
  selectableListScopeId?: string;
};

export const useSelectableListScopedStates = (
  args?: UseSelectableListScopedStatesProps,
) => {
  const { selectableListScopeId } = args ?? {};
  const scopeId = useAvailableScopeIdOrThrow(
    SelectableListScopeInternalContext,
    selectableListScopeId,
  );

  const {
    selectedItemIdState,
    selectableItemIdsState,
    selectableListOnEnterState,
  } = getSelectableListScopedStates({
    selectableListScopeId: scopeId,
  });

  return {
    scopeId,
    selectableItemIdsState,
    selectedItemIdState,
    selectableListOnEnterState,
  };
};
