import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import SortableLevel from './SortableLevelProxy';

export default function MenuItem({ item, pathKey, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const { setNodeRef: setChildDropRef, isOver } = useDroppable({
    id: `child-drop:${item.id}`,
  });

  return (
    <div
      className="border rounded-md bg-white shadow-sm p-2"
      style={style}
      ref={setNodeRef}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab select-none border rounded px-2 py-1 bg-slate-50 text-xs"
          {...listeners}
          title="Drag to reorder or nest"
        >
          ☰
        </button>
        <div className="flex flex-col">
          <div className="font-semibold">{item.title}</div>
          <div className="text-xs text-slate-500">{item.url}</div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(item.id)}
          className="ml-auto px-2 py-1 text-xs border rounded bg-red-50 text-red-600 hover:bg-red-100"
        >
          Delete
        </button>
      </div>

      <div
        ref={setChildDropRef}
        className={`mt-2 border rounded text-xs px-2 py-2 ${
          isOver ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-200"
        }`}
      >
        Drop here to make a child
      </div>

      {item.children && item.children.length > 0 && (
        <div className="mt-2 ml-6 flex flex-col gap-2">
          <SortableLevel items={item.children} pathKey={`${pathKey}.${item.id}`}>
            {item.children.map((child) => (
              <MenuItem
                key={child.id}
                item={child}
                pathKey={`${pathKey}.${item.id}`}
                onDelete={onDelete}
              />
            ))}
          </SortableLevel>
        </div>
      )}
    </div>
  );
}
