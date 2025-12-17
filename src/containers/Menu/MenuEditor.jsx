"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import MenuItem from "./MenuItem";
import { nanoid } from "nanoid";
import {
  findItemPath,
  getItemByPath,
  removeItemById,
  insertItemAtPath,
  flattenLevelIds,
} from "../../lib/treeUtils";
import UIModal from "@/components/UIModal/UIModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenus } from "@/store/actions/menus";

const initialMenu = [
  { id: "home", title: "Home", url: "/", children: [] },
  { id: "menu", title: "Menu", url: "/menu", children: [] },
  { id: "brunch", title: "Brunch", url: "/brunch", children: [] },
  { id: "location", title: "Location", url: "/location", children: [] },
  { id: "events", title: "Events", url: "/events", children: [] },
  { id: "contact", title: "Contact", url: "/contact", children: [] },
];

export default function MenuEditor() {
  const dispatch = useDispatch();
  const menuDataReducer = useSelector(
    (state) => state?.GetAllMenusReducer?.res
  );

  const [tree, setTree] = useState(initialMenu);
  const [activeId, setActiveId] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableMenus, setAvailableMenus] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const levelIds = useMemo(() => flattenLevelIds(tree), [tree]);

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    // If dropped onto a "child-drop zone", its id will be child-drop:<parentId>
    const overId = over.id;
    const isChildDrop = String(overId).startsWith("child-drop:");
    const targetParentId = isChildDrop ? String(overId).split(":")[1] : null;

    // Avoid self-nesting
    if (targetParentId && targetParentId === active.id) return;

    setTree((prevTree) => {
      // Remove active from current location
      const { newTree, removedItem } = removeItemById(prevTree, active.id);
      if (!removedItem) return prevTree;

      if (isChildDrop) {
        // Drop into another item as a child
        const parentPath = findItemPath(newTree, targetParentId);
        if (!parentPath) return prevTree;
        const parent = getItemByPath(newTree, parentPath);
        // Prevent circular nesting by ensuring active isn't an ancestor of target
        const activePathBefore = findItemPath(prevTree, active.id);
        const targetPathBefore = findItemPath(prevTree, targetParentId);
        if (
          targetPathBefore &&
          activePathBefore &&
          targetPathBefore.join(".").startsWith(activePathBefore.join("."))
        ) {
          // Trying to drop a parent into its own descendant — ignore
          return prevTree;
        }
        parent.children = parent.children || [];
        parent.children.push(removedItem);
        return [...newTree];
      }

      // Otherwise, reorder within same level using SortableContext order
      const topLevelOrder = levelIds.root; // ids at root
      const levelKey = Object.keys(levelIds).find(
        (k) => levelIds[k].includes(active.id) && levelIds[k].includes(overId)
      );
      if (!levelKey) {
        // If we cannot identify same-level, just append to root
        return [...newTree, removedItem];
      }

      const idsAtLevel = levelIds[levelKey];
      const oldIndex = idsAtLevel.findIndex((id) => id === active.id);
      const newIndex = idsAtLevel.findIndex((id) => id === overId);

      // Place active back into that level in the new order
      const pathParts = levelKey === "root" ? [] : levelKey.split("."); // path to that level
      const parent = pathParts.length
        ? getItemByPath(newTree, pathParts)
        : null;

      console.log("parent", parent);
      console.log("newTree", newTree);
      const levelArr = parent ? parent.children : newTree;
      console.log("levelArr", levelArr);
      // Because active is already removed, we splice it in newIndex
      levelArr.splice(newIndex, 0, removedItem);

      // If over index < old index we already handle; for safety, we could normalize but arrayMove not needed since we removed and inserted.
      return [...newTree];
    });
  };

  const onSave = async () => {
    try {
      // Replace with your API endpoint
      await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tree),
      });
      alert("Menu saved");
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    }
  };

  const handleCheckboxChange = (menuId) => {
    setSelectedItems((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSaveSelectedItems = () => {
    // Add selected items to tree
    const itemsToAdd = availableMenus.filter((menu) =>
      selectedItems.includes(menu.id)
    );

    setTree((prev) => [
      ...prev,
      ...itemsToAdd.map((item) => ({
        ...item,
        children: [],
      })),
    ]);

    setSelectedItems([]);
  };

  const handleDelete = (id) => {
  setTree((prevTree) => {
    const { newTree } = removeItemById(prevTree, id);
    return [...newTree];
  });
};

  useEffect(() => {
    dispatch(getAllMenus());
  }, [dispatch]);

  useEffect(() => {
    if (menuDataReducer?.data && Array.isArray(menuDataReducer.data)) {
      const menus = menuDataReducer.data
        .sort((a, b) => a.orderNum - b.orderNum)
        .map((item) => ({
          id: item.id.toString(),
          title: item.name,
          url: `/${item.slug}`,
        }));
      setAvailableMenus(menus);
    }
  }, [menuDataReducer]);

  console.log("availableMenus", availableMenus);
  console.log("selectedItems", selectedItems);
  console.log("tree", tree);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.h2}>Menu editor</h2>
      </div>

      <div className="p-4">
        <div className="relative w-full">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
          >
            <span>
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : "Select menu items"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {availableMenus.length > 0 ? (
                availableMenus.map((menu) => (
                  <label
                    key={menu.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(menu.id)}
                      onChange={() => handleCheckboxChange(menu.id)}
                      className="w-4 h-4 mr-2 cursor-pointer"
                      disabled={tree.some((item) => item.id === menu.id)}
                    />
                    <span className="text-sm">{menu.title}</span>
                  </label>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No menus available
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <button
            onClick={handleSaveSelectedItems}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Selected Items
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableLevel items={tree} pathKey="root">
          {tree.map((item) => (
            <MenuItem key={item.id} item={item} pathKey="root" onDelete={handleDelete} />
          ))}
        </SortableLevel>

        <DragOverlay>
          {activeId ? (
            <div style={styles.dragOverlay}>{getTitleById(tree, activeId)}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <div className="flex justify-end mt-4">
        <div style={styles.actions}>
          <button
            onClick={onSave}
            style={styles.btnPrimary}
            className="bg-main text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableLevel({ items, pathKey, children }) {
  // Each level has its own SortableContext scoped to the ids at that level
  const ids = items.map((i) => i.id);
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <div style={styles.level}>{children}</div>
    </SortableContext>
  );
}

function getTitleById(tree, id) {
  const walk = (arr) => {
    for (const it of arr) {
      if (it.id === id) return it.title;
      if (it.children?.length) {
        const r = walk(it.children);
        if (r) return r;
      }
    }
    return null;
  };
  return walk(tree);
}

const styles = {
  wrapper: { maxWidth: "100%", margin: "24px auto", padding: "0 16px" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0",
  },
  h2: { margin: 0 },
  actions: { display: "flex", gap: 8 },
  btn: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  level: { display: "flex", flexDirection: "column", gap: 8 },
  dragOverlay: {
    padding: "8px 12px",
    background: "#f0f3ff",
    border: "1px solid #bfc9ff",
    borderRadius: 6,
  },
};
