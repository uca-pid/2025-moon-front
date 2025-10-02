import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Container } from "@/components/Container"
import { useEffect, useState } from "react"
import type { Shift, DateFilter } from "@/types/appointments.types"
import { getNextAppointmentsOfMechanic } from "@/services/appointments"
import { sortAppointments } from "@/helpers/sort-appointments"
import { Calendar, Clock, User, Car, Wrench, Search, ChevronLeft, ChevronRight } from "lucide-react"

export const Shifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDateTab, setSelectedDateTab] = useState<DateFilter>("today")
  const itemsPerPage = 10

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true)
      try {
        const shifts = await getNextAppointmentsOfMechanic(selectedDateTab)
        setShifts(
          shifts.map((shift: Shift) => ({
            ...shift,
            type: "shift",
          })),
        )
      } catch (error) {
        console.error("Error fetching shifts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchShifts()
  }, [selectedDateTab])

  const filteredShifts = shifts.filter((shift) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      shift.date.toLowerCase().includes(searchLower) ||
      shift.time.toLowerCase().includes(searchLower) ||
      (shift.type === "shift" && shift.user.fullName.toLowerCase().includes(searchLower)) ||
      shift.services.some((s) => s.name.toLowerCase().includes(searchLower))
    )
  })

  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentShifts = sortAppointments(filteredShifts).slice(startIndex, endIndex)

  return (
    <Container>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Administra y visualiza todos los turnos programados</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Próximos Turnos</CardTitle>
                <CardDescription>
                  {filteredShifts.length} {filteredShifts.length === 1 ? "turno programado" : "turnos programados"}
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, fecha o servicio..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs
              value={selectedDateTab}
              onValueChange={(value: string) => {
                setSelectedDateTab(value as DateFilter)
                setCurrentPage(1)
              }}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="past">PASADOS</TabsTrigger>
                <TabsTrigger value="today">HOY</TabsTrigger>
                <TabsTrigger value="future">FUTUROS</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Cargando turnos...</p>
                </div>
              </div>
            ) : currentShifts.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Hora
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Cliente
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Vehículo
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            Servicios
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentShifts.map((shift) => (
                        <TableRow key={shift.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{shift.date}</TableCell>
                          <TableCell>{shift.time}</TableCell>
                          <TableCell>{shift.type === "shift" && shift.user.fullName}</TableCell>
                          <TableCell className="text-muted-foreground">AG 192 QZ</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {shift.services.map((service) => (
                                <Badge key={service.id} variant="secondary" className="text-xs">
                                  {service.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredShifts.length)} de{" "}
                      {filteredShifts.length} turnos
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-9"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="rounded-full bg-muted p-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">No hay turnos programados</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm
                      ? "No se encontraron turnos con ese criterio de búsqueda"
                      : "Aún no tienes turnos agendados"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
