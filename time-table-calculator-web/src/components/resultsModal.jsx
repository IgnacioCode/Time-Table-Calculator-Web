"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - results: array of Horario instances
 *  - currentPage: number
 *  - totalPages: number
 *  - onPrevPage: () => void
 *  - onNextPage: () => void
 */
export function ResultsModal({
  isOpen,
  onClose,
  results,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) {
  const timeSlotLabels = ["Mañana", "Tarde", "Noche"];
  const dayLabels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Paginación de 4 resultados por página
  const startIndex = currentPage * 4;
  const currentResults = results.slice(startIndex, startIndex + 4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resultados</DialogTitle>
        </DialogHeader>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentResults.map((result, idx) => {
                const optionNumber = startIndex + idx + 1;
                return (
                  <div key={idx} className="overflow-x-auto">
                    <h3 className="font-medium mb-2">Opción {optionNumber}</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-muted">Horario</th>
                          {dayLabels.map((day, di) => (
                            <th key={di} className="border p-2 bg-muted">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlotLabels.map((slotLabel, ti) => (
                          <tr key={ti}>
                            <td className="border p-2 font-medium">{slotLabel}</td>
                            {dayLabels.map((_, di) => {
                              const timeSlot = ti.toString();
                              const day = (di + 1).toString();
                              // Filtrar materias que tienen un turno coincidente
                              const subjectsInSlot = result.materias_nombres.filter((name, mi) => {
                                const comision = result.comisiones[mi];
                                return comision.turnos.some(
                                  (t) => t.horario === timeSlot && t.dia === day
                                );
                              });
                              return (
                                <td
                                  key={di}
                                  className="border p-2 min-w-[100px] h-[60px] align-top"
                                >
                                  {subjectsInSlot.map((name, si) => (
                                    <div key={si} className="text-s font-medium">
                                      {name}
                                    </div>
                                  ))}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={onPrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Página {currentPage + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={onNextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay resultados disponibles.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
