import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { useSelectableListScopedStates } from '@/ui/layout/selectable-list/hooks/internal/useSelectableListScopedStates';

type SelectableItemProps = {
  itemId: string;
  children: React.ReactElement;
};

export const SelectableItem = ({ itemId, children }: SelectableItemProps) => {
  const { selectedItemIdState } = useSelectableListScopedStates();

  const [selectedItemId] = useRecoilState(selectedItemIdState);

  const isSelectedItemId = selectedItemId === itemId;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelectedItemId) {
      scrollRef.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [isSelectedItemId]);

  return <div ref={scrollRef}>{children}</div>;
};
