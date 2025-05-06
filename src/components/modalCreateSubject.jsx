"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Turno, Comision } from "@/lib/model";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

const ItemTypes = { COMMISSION: "commission" };

// Bloque de comisión arrastrable y removible
function CommissionBlock({ id, onRemove, disableRemove }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COMMISSION,
    item: { id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`group relative p-2 mb-2 rounded-lg text-center cursor-move flex justify-center items-center ${
        isDragging ? "opacity-50" : "bg-emerald-600 text-white"
      }`}
    >
      <span>Comisión {id}</span>
      {!disableRemove && (
        <span
          className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 cursor-pointer"
          onClick={() => onRemove(id)}
        >
          <X className="h-4 w-4 text-red-500" />
        </span>
      )}
    </div>
  );
}

// Celda droppable con posibilidad de eliminar asignaciones
function ScheduleCell({ timeSlot, day, assignment, onDrop, onRemove }) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COMMISSION,
    drop: (item) => onDrop(item.id, timeSlot, day),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  return (
    <td
      ref={drop}
      className={`border p-2 h-24 align-top ${isOver ? "bg-emerald-300" : ""}`}
    >
      <div className="flex flex-wrap">
        {assignment.map((cid) => (
          <div
            key={cid}
            className="relative flex items-center px-2 py-1 m-1 bg-emerald-600 rounded group"
          >
            <span className="text-sm text-white">{cid}</span>
            <span
              className="absolute top-0 right-0 p-0.5 opacity-0 group-hover:opacity-100 cursor-pointer"
              onClick={() => onRemove(cid, timeSlot, day)}
            >
              <X className="h-3 w-3 text-red-500" />
            </span>
          </div>
        ))}
      </div>
    </td>
  );
}

export function CreateSubjectModal({
  isOpen,
  onClose,
  onCreateSubject,
  onUpdateSubject,
  initialSubject,
}) {
  const [commissions, setCommissions] = useState([1]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialSubject) {
      // Cargar comisiones existentes
      const count = initialSubject.comisiones?.length || 0;
      const ids = Array.from({ length: count }, (_, i) => i + 1);
      setCommissions(ids);
      // Cargar asignaciones
      const loaded = {};
      initialSubject.comisiones.forEach((com, idx) => {
        const comId = idx + 1;
        com.turnos.forEach((turno) => {
          const key = `${turno.horario}-${turno.dia}`;
          if (!loaded[key]) loaded[key] = [];
          loaded[key].push(comId);
        });
      });
      setAssignments(loaded);
    } else {
      // Nuevo sujeto
      setCommissions([1]);
      setAssignments({});
    }
  }, [initialSubject, isOpen]);

  const addCommission = () => {
    setCommissions((prev) => [...prev, prev.length + 1]);
  };

  const removeCommissionBlock = (comId) => {
    if (commissions.length <= 1) return;
    const filtered = commissions.filter((id) => id !== comId);
    const oldToNew = {};
    filtered.forEach((oldId, idx) => { oldToNew[oldId] = idx + 1; });
    const newAssign = {};
    Object.entries(assignments).forEach(([key, ids]) => {
      const mapped = ids.filter((id) => id !== comId).map((id) => oldToNew[id]);
      if (mapped.length) newAssign[key] = mapped;
    });
    setCommissions(filtered.map((_, idx) => idx + 1));
    setAssignments(newAssign);
  };

  const handleDrop = (comId, timeSlot, day) => {
    const key = `${timeSlot}-${day}`;
    setAssignments((prev) => {
      const existing = prev[key] || [];
      if (existing.includes(comId)) return prev;
      return { ...prev, [key]: [...existing, comId] };
    });
  };

  const handleRemove = (comId, timeSlot, day) => {
    const key = `${timeSlot}-${day}`;
    setAssignments((prev) => {
      const existing = prev[key] || [];
      const updated = existing.filter((id) => id !== comId);
      if (updated.length) return { ...prev, [key]: updated };
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = () => {
    const built = commissions.map(() => new Comision([]));
    Object.entries(assignments).forEach(([key, ids]) => {
      const [timeSlot, day] = key.split("-");
      ids.forEach((cid) => {
        const turno = new Turno(day, timeSlot);
        built[cid - 1].turnos.push(turno);
      });
    });
    if (initialSubject) onUpdateSubject(initialSubject.nombre, built);
    else onCreateSubject(built);
  };

  const timeSlotLabels = ["Mañana", "Tarde", "Noche"];
  const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70vw] max-h-[90vh] flex overflow-hidden">
        <DndProvider backend={HTML5Backend}>
          <div className="w-1/4 p-4 border-r overflow-y-auto">
            <h3 className="font-semibold mb-2">Comisiones</h3>
            {commissions.map((cid) => (
              <CommissionBlock
                key={cid}
                id={cid}
                onRemove={removeCommissionBlock}
                disableRemove={commissions.length === 1}
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={addCommission}
            >
              + Agregar comisión
            </Button>
          </div>

          <div className="w-3/4 p-4 overflow-auto">
            <DialogHeader>
              <DialogTitle asChild><Label>Asignar turnos</Label></DialogTitle>
              <DialogDescription className={"mb-2"}>
                Arrastra la comisión desde la izquierda a la celda de día y franja horaria.
              </DialogDescription>
            </DialogHeader>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-secondary-foreground-100">Turno</th>
                  {dayLabels.map((d) => (
                    <th key={d} className="border p-2 bg-secondary-foreground-100">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlotLabels.map((label, ti) => (
                  <tr key={ti}>
                    <td className="border p-2 font-medium">{label}</td>
                    {dayLabels.map((_, di) => (
                      <ScheduleCell
                        key={di}
                        timeSlot={ti.toString()}
                        day={(di + 1).toString()}
                        assignment={assignments[`${ti}-${di + 1}`] || []}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleSubmit}>Guardar</Button>
            </DialogFooter>
          </div>
        </DndProvider>
      </DialogContent>
    </Dialog>
  );
}