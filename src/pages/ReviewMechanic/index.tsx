import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User as UserIcon, Wrench } from "lucide-react";
import { getUserReviews, reviewMechanic, getUserById } from "@/services/users";
import { getAppointmentById } from "@/services/appointments";
import type { UserReviewResponse, User } from "@/types/users.types";
import { ReviewEnum } from "@/types/users.types";
import type { Appointment } from "@/types/appointments.types";

interface EnrichedReview {
    base: UserReviewResponse;
    appointment: Appointment;
    mechanic: User;
}

function translateReviewToLabel(review: ReviewEnum) {
    switch (review) {
        case ReviewEnum.BAD:
            return "MALO";
        case ReviewEnum.GOOD:
            return "BUENO";
        case ReviewEnum.EXCELLENT:
            return "EXCELENTE";
        case ReviewEnum.PENDING:
        default:
            return "PENDIENTE";
    }
}

export function ReviewMechanic() {
    const [enrichedReviews, setEnrichedReviews] = useState<EnrichedReview[]>(
        []
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const hasFetchedRef = useRef(false);

    const loadReviews = async (initial = false) => {
        if (initial) setIsLoading(true);
        try {
            const raw: unknown = await getUserReviews();
            type ReviewsObj = { reviews?: UserReviewResponse[] };
            const reviews: UserReviewResponse[] = Array.isArray(raw)
                ? (raw as UserReviewResponse[])
                : (raw as ReviewsObj)?.reviews ?? [];

            const mechanicCache = new Map<number, Promise<User>>();

            const results = await Promise.all(
                (reviews as UserReviewResponse[]).map(async (r) => {
                    const [appointment, mechanic] = await Promise.all([
                        getAppointmentById(
                            r.appointmentId
                        ) as Promise<Appointment>,
                        mechanicCache.get(r.mechanicId) ||
                            (async () => {
                                const p = getUserById(
                                    r.mechanicId
                                ) as Promise<User>;
                                mechanicCache.set(r.mechanicId, p);
                                return p;
                            })(),
                    ]);

                    return { base: r, appointment, mechanic };
                })
            );

            setEnrichedReviews(results);
        } finally {
            if (initial) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        void loadReviews(true);
    }, []);

    const [pending, history] = useMemo(() => {
        const p = enrichedReviews
            .filter((r) => r.base.review === ReviewEnum.PENDING)
            .sort((a, b) => a.base.appointmentId - b.base.appointmentId);
        const h = enrichedReviews
            .filter((r) => r.base.review !== ReviewEnum.PENDING)
            .sort((a, b) => b.base.appointmentId - a.base.appointmentId);
        return [p, h];
    }, [enrichedReviews]);

    const handleRate = async (mechanicId: number, review: ReviewEnum) => {
        setIsRefreshing(true);
        try {
            await reviewMechanic(mechanicId, review);
            await loadReviews();
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <Container>
            <div className="max-w-4xl space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Calificar mecánicos
                    </h1>
                    <p className="text-muted-foreground">
                        Deja tu reseña de cada turno y mira tu historial.
                    </p>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                            Pendientes
                        </h2>
                        {(isLoading || isRefreshing) && (
                            <span className="text-sm text-muted-foreground">
                                Actualizando…
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
                            Cargando reseñas…
                        </div>
                    ) : pending.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
                            No tienes reseñas pendientes.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pending.map(({ base, appointment, mechanic }) => (
                                <Card
                                    key={base.appointmentId}
                                    className="rounded-3xl bg-card shadow-sm"
                                >
                                    <CardContent className="p-5 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-full"
                                                    >
                                                        Turno #
                                                        {base.appointmentId}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            appointment.vehicle
                                                                ?.licensePlate
                                                        }{" "}
                                                        {
                                                            appointment.vehicle
                                                                ?.model
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {appointment.date}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {appointment.time}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Wrench className="h-4 w-4" />
                                                        {mechanic.workshopName ??
                                                            mechanic.fullName}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {appointment.services
                                                        ?.length > 0 ? (
                                                        appointment.services.map(
                                                            (s) => (
                                                                <Badge
                                                                    key={s.id}
                                                                    variant="outline"
                                                                    className="rounded-full"
                                                                >
                                                                    {s.name}
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full"
                                                        >
                                                            Sin servicios
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 md:gap-3">
                                                <Button
                                                    variant="destructive"
                                                    className="rounded-2xl"
                                                    onClick={() =>
                                                        handleRate(
                                                            base.mechanicId,
                                                            ReviewEnum.BAD
                                                        )
                                                    }
                                                >
                                                    MALO
                                                </Button>
                                                <Button
                                                    variant="foreground"
                                                    className="rounded-2xl"
                                                    onClick={() =>
                                                        handleRate(
                                                            base.mechanicId,
                                                            ReviewEnum.GOOD
                                                        )
                                                    }
                                                >
                                                    BUENO
                                                </Button>
                                                <Button
                                                    variant="success"
                                                    className="rounded-2xl"
                                                    onClick={() =>
                                                        handleRate(
                                                            base.mechanicId,
                                                            ReviewEnum.EXCELLENT
                                                        )
                                                    }
                                                >
                                                    EXCELENTE
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                <Separator className="my-2" />

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">
                        Historial
                    </h2>

                    {isLoading ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
                            Cargando historial…
                        </div>
                    ) : history.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
                            Todavía no tienes reseñas realizadas.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map(({ base, appointment, mechanic }) => (
                                <Card
                                    key={base.appointmentId}
                                    className="rounded-3xl bg-card shadow-sm"
                                >
                                    <CardContent className="p-5 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-full"
                                                    >
                                                        Turno #
                                                        {base.appointmentId}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            appointment.vehicle
                                                                ?.licensePlate
                                                        }{" "}
                                                        •{" "}
                                                        {
                                                            appointment.vehicle
                                                                ?.model
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {appointment.date}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {appointment.time}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <UserIcon className="h-4 w-4" />
                                                        {mechanic.workshopName ??
                                                            mechanic.fullName}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {appointment.services
                                                        ?.length > 0 ? (
                                                        appointment.services.map(
                                                            (s) => (
                                                                <Badge
                                                                    key={s.id}
                                                                    variant="outline"
                                                                    className="rounded-full"
                                                                >
                                                                    {s.name}
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full"
                                                        >
                                                            Sin servicios
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Badge
                                                    className="rounded-full px-3 py-1 text-sm"
                                                    variant={
                                                        base.review ===
                                                        ReviewEnum.EXCELLENT
                                                            ? "success"
                                                            : base.review ===
                                                              ReviewEnum.GOOD
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {translateReviewToLabel(
                                                        base.review
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </Container>
    );
}
