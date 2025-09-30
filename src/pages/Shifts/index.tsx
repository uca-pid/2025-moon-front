import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Container } from "@/components/Container";
import { useEffect, useState } from "react";
import type { Shift } from "@/types/appointments.types";
import { getNextAppointmentsOfMechanic } from "@/services/appointments";
import { sortAppointments } from "@/helpers/sort-appointments";

export const Shifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const fetchShifts = async () => {
      const shifts = await getNextAppointmentsOfMechanic();
      console.log("shifts", shifts)
      setShifts(shifts);
    };
    fetchShifts();
  }, []);

  return (
    <Container>
      <div className="flex flex-col items-center justify-center p-6 gap-10">
        <h1 className="text-2xl font-bold text-primary w-full text-left">Turnos</h1>
        <div className="flex flex-col gap-10 w-[90%]">
          <Table className="text-foreground">
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Servicio</TableHead>
              </TableRow>
              {
                shifts.length > 0 ? (
                sortAppointments(shifts).map((shift) => (
                  <TableRow>
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.time}</TableCell>
                    <TableCell>{shift.type === 'shift' && shift.user.fullName}</TableCell>
                    <TableCell>AG 192 QZ</TableCell>
                    <TableCell>{shift.services.map((s) => s.name).join(', ')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="text-center">
                  <TableCell colSpan={5}>No hay turnos</TableCell>
                </TableRow>
              )}
            </TableHeader>
          </Table>

          <Pagination className="flex justify-between items-center w-full text-foreground">
            <PaginationPrevious>
              <PaginationLink>1</PaginationLink>
            </PaginationPrevious>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
            </PaginationContent>
            <PaginationNext>
              <PaginationLink>1</PaginationLink>
            </PaginationNext>
          </Pagination>
        </div>
      </div>
      
    </Container>
  )
};