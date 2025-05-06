"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Minus, Trash2 } from "lucide-react";

export function SubjectCard({ subject, onSelect, onEdit, onDelete, isSelected }) {
  return (
    <Card className="overflow-hidden pt-0 pb-3 gap-3">
      <CardHeader className="bg-secondary py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{subject.nombre}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Borrar</span>
            </Button>
            <Button
              variant={isSelected ? "destructive" : "default"}
              size="icon"
              onClick={onSelect}
              className="h-8 w-8"
            >
              {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span className="sr-only">{isSelected ? "Quitar" : "Agregar"}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="text-sm text-muted-foreground">
          <p>{countCommissions(subject)} comisiones configuradas</p>
        </div>
      </CardContent>
    </Card>
  );
}

function countCommissions(subject) {
  let count = 0;
  subject.comisiones?.forEach((comision) => {
    count += 1;
  });
  return count;
}
