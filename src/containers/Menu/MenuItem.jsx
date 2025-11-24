import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import SortableLevel from './SortableLevelProxy'; // proxy for level context
// We’ll inline children level using SortableContext from parent

export default function MenuItem({ item, pathKey }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  // A droppable zone inside the item to accept drops as children
  const { setNodeRef: setChildDropRef, isOver } = useDroppable({
    id: `child-drop:${item.id}`,
  });

  return (
    <div style={{ ...styles.item, ...style }} ref={setNodeRef} {...attributes}>
      <div style={styles.row}>
        <div style={styles.dragHandle} {...listeners} title="Drag to reorder or nest">
          ☰
        </div>
        <div style={styles.titleBlock}>
          <div style={styles.title}>{item.title}</div>
          <div style={styles.url}>{item.url}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {/* Extend with edit/remove actions */}
          <button style={styles.smallBtn} onClick={() => alert('Edit not implemented')}>Edit</button>
        </div>
      </div>

      <div
        ref={setChildDropRef}
        style={{
          ...styles.childDrop,
          background: isOver ? '#eef9ff' : '#f8fafc',
          borderColor: isOver ? '#3b82f6' : '#e5e7eb',
        }}
      >
        Drop here to make a child
      </div>

      {item.children && item.children.length > 0 && (
        <div style={styles.children}>
          <SortableLevel items={item.children} pathKey={`${pathKey}.${item.id}`}>
            {item.children.map(child => (
              <MenuItem key={child.id} item={child} pathKey={`${pathKey}.${item.id}`} />
            ))}
          </SortableLevel>
        </div>
      )}
    </div>
  );
}

const styles = {
  item: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    padding: 8,
  },
  row: { display: 'flex', alignItems: 'center', gap: 12 },
  dragHandle: {
    cursor: 'grab',
    userSelect: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: '4px 8px',
    background: '#f9fafb',
    fontSize: 12,
  },
  titleBlock: { display: 'flex', flexDirection: 'column' },
  title: { fontWeight: 600 },
  url: { fontSize: 12, color: '#64748b' },
  smallBtn: {
    padding: '4px 8px',
    fontSize: 12,
    border: '1px solid #e5e7eb',
    background: '#fff',
    borderRadius: 6,
    cursor: 'pointer',
  },
  childDrop: {
    marginTop: 8,
    border: '1px dashed',
    borderRadius: 6,
    fontSize: 12,
    color: '#334155',
    padding: '8px 10px',
  },
  children: {
    marginTop: 8,
    marginLeft: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
};
