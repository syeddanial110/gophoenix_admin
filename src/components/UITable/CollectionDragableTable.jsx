"use client";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PencilLine, Trash } from "lucide-react";
import UIPopover from "../UIPopover/UIPopover";
import UIModal from "../UIModal/UIModal";
import EditCategoryDataForm from "@/containers/Category/EditCategoryDataForm";
import Image from "next/image";
import { apiPut } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { toast } from "sonner";

const CollectionDragableTable = ({
  handleDeleteClick,
  handleEditClick,
  columns,
  rows,
  setRows,
}) => {
  // const columns = [
  //   { field: "name", label: "Name" },
  //   { field: "url", label: "URL" },
  //   { field: "image", label: "Image" },
  //   { field: "actions", label: "Actions" },
  // ];

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  // const [rows, setRows] = useState([
  //   {
  //     id: 1,
  //     name: "Carlsbad Toddler Soccer",
  //     url: "carlsbad-toddler-soccer",
  //     image: "/images/carlsbad.png",
  //   },
  //   {
  //     id: 2,
  //     name: "Oceanside Toddler Soccer",
  //     url: "oceanside-toddler-soccer",
  //     image: "/images/oceanside.png",
  //   },
  // ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedRows = Array.from(rows);
    const [removed] = updatedRows.splice(result.source.index, 1);
    updatedRows.splice(result.destination.index, 0, removed);
    console.log("result", result);
    const dataObj = updatedRows.map((elm, ind) => {
      return {
        id: elm.id,
        orderNum: ind,
      };
    });
    console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.categories.base}${ApiEndpoints.categories.updateOrder}`,
      dataObj,
      (res) => {
        toast.success(res?.message)
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      }
    );
    setRows(updatedRows);
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-5">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="table-body">
          {(provided) => (
            <table
              className="min-w-full border border-gray-200"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.field}
                      className="text-left px-4 py-2 font-medium text-gray-700 border-b"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <Draggable
                    key={row.id}
                    draggableId={row.id.toString()}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: snapshot.isDragging
                            ? "#f9fafb"
                            : "white",
                          cursor: "grab",
                        }}
                      >
                        <td className="px-4 py-2 border-b">{row.name}</td>
                        <td className="px-4 py-2 border-b">{row.slug}</td>
                        <td className="px-4 py-2 border-b">
                          <Image
                            src={row.image}
                            alt={row.name}
                            height={50}
                            width={50}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2 border-b space-x-2">
                          <UIModal
                            onOpenChange={handleModalOpen}
                            open={modalOpen}
                            modalBtnText={<PencilLine />}
                            btnClassName="hover:cursor-pointer"
                            btnTriggerOnClick={() => handleEditClick(row)}
                            modalHeaderTitle="Edit Collection"
                          >
                            <EditCategoryDataForm setModalOpen={setModalOpen} />
                          </UIModal>

                          <UIPopover
                            title="Are you sure you want to delete this collection?"
                            btnTrigger={<Trash />}
                            onBtnClick={() => handleDeleteClick(row)}
                          ></UIPopover>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CollectionDragableTable;
