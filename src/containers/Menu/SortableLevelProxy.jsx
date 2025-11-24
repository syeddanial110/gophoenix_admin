// Small proxy so MenuItem can use a level without circular import
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function SortableLevel({ items, children }) {
  const ids = items.map(i => i.id);
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </SortableContext>
  );
}
