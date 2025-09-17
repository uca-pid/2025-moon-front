import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Container } from "@/components/Container";

export const Shifts = () => {

  const shifts = [
    {
      time: "10:00",
      client: "Juan Perez",
      vehicle: "Toyota Corolla",
      serivce: "Reparación de auto",
    },
    {
      time: "10:00",
      client: "Juan Perez",
      vehicle: "Toyota Corolla",
      serivce: "Reparación de auto",
    },
    {
      time: "10:00",
      client: "Juan Perez",
      vehicle: "Toyota Corolla",
      serivce: "Reparación de auto",
    },
    {
      time: "10:00",
      client: "Juan Perez",
      vehicle: "Toyota Corolla",
      serivce: "Reparación de auto",
    },
    {
      time: "10:00",
      client: "Juan Perez",
      vehicle: "Toyota Corolla",
      serivce: "Reparación de auto",
    },
    {
      time: "10:00",
      client: "Juan Perez",
      vehicle: "Toyota Corolla",
      serivce: "Reparación de auto",
    },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-10 w-[90%]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Servicio</TableHead>
            </TableRow>
            {
              shifts.map((shift) => (
                <TableRow>
                  <TableCell>{shift.time}</TableCell>
                  <TableCell>{shift.client}</TableCell>
                  <TableCell>{shift.vehicle}</TableCell>
                  <TableCell>{shift.serivce}</TableCell>
                </TableRow>
              ))
            }
          </TableHeader>
        </Table>

        <Pagination className="flex justify-between items-center w-full">
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
      
    </Container>
  )
};