import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Star, User as UserIcon, Wrench } from "lucide-react";
import { getUserReviews, reviewMechanic, getUserById } from "@/services/users";
import { getAppointmentById } from "@/services/appointments";
import type { UserReviewResponse, User } from "@/types/users.types";
import { ReviewEnum, SubCategroriesEnum } from "@/types/users.types";
import type { Appointment } from "@/types/appointments.types";
import { CustomPagination } from "@/components/CustomPagination";
import type { PaginatedQueryDto } from "@/types/paginated.types";

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
    const [selectedReviews, setSelectedReviews] = useState<Record<number, ReviewEnum | null>>({});
    const [selectedSubcategories, setSelectedSubcategories] = useState<Record<number, Set<SubCategroriesEnum>>>({});
    const [historyPagination, setHistoryPagination] = useState<PaginatedQueryDto>({
        page: 1,
        pageSize: 3,
        search: "",
        orderBy: "",
        orderDir: "",
    });

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

    const historyTotalPages = useMemo(() => {
        const total = Math.ceil((history.length || 0) / (historyPagination.pageSize || 1));
        return Math.max(1, total);
    }, [history.length, historyPagination.pageSize]);

    const pagedHistory = useMemo(() => {
        if (history.length === 0) return [];
        const total = Math.ceil(history.length / historyPagination.pageSize) || 1;
        const currentPage = Math.min(historyPagination.page, total);
        const start = (currentPage - 1) * historyPagination.pageSize;
        return history.slice(start, start + historyPagination.pageSize);
    }, [history, historyPagination]);

    useEffect(() => {
        const total = Math.ceil((history.length || 0) / (historyPagination.pageSize || 1)) || 1;
        if (historyPagination.page > total) {
            setHistoryPagination((prev) => ({ ...prev, page: total }));
        }
    }, [history.length, historyPagination.pageSize, historyPagination.page]);

    const goToPage = (page: number) => {
        const total = Math.ceil((history.length || 0) / (historyPagination.pageSize || 1)) || 1;
        const clamped = Math.max(1, Math.min(total, page));
        setHistoryPagination((prev) => ({ ...prev, page: clamped }));
    };

    const goPrev = () => goToPage(historyPagination.page - 1);
    const goNext = () => goToPage(historyPagination.page + 1);

    const selectReview = (appointmentId: number, review: ReviewEnum) => {
        setSelectedReviews((prev) => {
            const current = prev[appointmentId] ?? null;
            const nextValue = current === review ? null : review;
            return { ...prev, [appointmentId]: nextValue };
        });
    };

    const toggleSubcategory = (appointmentId: number, sub: SubCategroriesEnum) => {
        setSelectedSubcategories((prev) => {
            const current = new Set(prev[appointmentId] ?? []);
            if (current.has(sub)) {
                current.delete(sub);
            } else {
                if (current.size >= 3) {
                    return prev; // do not allow more than 3
                }
                current.add(sub);
            }
            return { ...prev, [appointmentId]: current };
        });
    };

    const handleSubmit = async (appointmentId: number, mechanicId: number) => {
        const review = selectedReviews[appointmentId] ?? null;
        if (!review) return;
        const subsSet = selectedSubcategories[appointmentId];
        const subCategories = subsSet && subsSet.size > 0 ? Array.from(subsSet) : undefined;
        setIsRefreshing(true);
        try {
            await reviewMechanic(mechanicId, review, subCategories);
            setSelectedReviews((prev) => ({ ...prev, [appointmentId]: null }));
            setSelectedSubcategories((prev) => {
                const copy = { ...prev };
                delete copy[appointmentId];
                return copy;
            });
            await loadReviews();
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <Container>
            <div className="max-w-4xl space-y-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Calificar mecánicos
                </h1>
              </div>
                    <p className="text-muted-foreground">
                    Deja tu reseña de cada turno y mira tu historial.
                </p>

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
                                                                    variant="warning"
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

                                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <Button
                                                        variant={selectedReviews[base.appointmentId] === ReviewEnum.BAD ? "destructive" : "outline"}
                                                        className="rounded-2xl"
                                                        onClick={() =>
                                                            selectReview(base.appointmentId, ReviewEnum.BAD)
                                                        }
                                                    >
                                                        MALO
                                                    </Button>
                                                    <Button
                                                        variant={selectedReviews[base.appointmentId] === ReviewEnum.GOOD ? "foreground" : "outline"}
                                                        className="rounded-2xl"
                                                        onClick={() =>
                                                            selectReview(base.appointmentId, ReviewEnum.GOOD)
                                                        }
                                                    >
                                                        BUENO
                                                    </Button>
                                                    <Button
                                                        variant={selectedReviews[base.appointmentId] === ReviewEnum.EXCELLENT ? "success" : "outline"}
                                                        className="rounded-2xl"
                                                        onClick={() =>
                                                            selectReview(base.appointmentId, ReviewEnum.EXCELLENT)
                                                        }
                                                    >
                                                        EXCELENTE
                                                    </Button>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {(
                                                        [
                                                            SubCategroriesEnum.PUNCTUALITY,
                                                            SubCategroriesEnum.QUALITY,
                                                            SubCategroriesEnum.PRICE,
                                                            SubCategroriesEnum.ATTITUDE,
                                                            SubCategroriesEnum.CLARITY,
                                                        ] as SubCategroriesEnum[]
                                                    ).map((sub) => {
                                                        const selected = selectedSubcategories[base.appointmentId]?.has(sub);
                                                        const selectedCount = selectedSubcategories[base.appointmentId]?.size ?? 0;
                                                        const limitReached = selectedCount >= 3;
                                                        type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "purple";
                                                        const variant: BadgeVariant = selected
                                                            ? (sub === SubCategroriesEnum.PUNCTUALITY
                                                                ? "purple"
                                                                : sub === SubCategroriesEnum.QUALITY
                                                                ? "purple"
                                                                : sub === SubCategroriesEnum.PRICE
                                                                ? "purple"
                                                                : sub === SubCategroriesEnum.ATTITUDE
                                                                ? "purple"
                                                                : "purple")
                                                            : "outline";
                                                        const label =
                                                            sub === SubCategroriesEnum.PUNCTUALITY
                                                                ? "Puntualidad"
                                                                : sub === SubCategroriesEnum.QUALITY
                                                                ? "Calidad"
                                                                : sub === SubCategroriesEnum.PRICE
                                                                ? "Precio"
                                                                : sub === SubCategroriesEnum.ATTITUDE
                                                                ? "Actitud"
                                                                : "Claridad";
                                                        return (
                                                            <Badge
                                                                key={sub}
                                                                variant={variant}
                                                                className={`rounded-full cursor-pointer select-none ${!selected && limitReached ? "pointer-events-none opacity-50" : ""}`}
                                                                onClick={() => toggleSubcategory(base.appointmentId, sub)}
                                                            >
                                                                {label}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="default"
                                                        className="rounded-2xl"
                                                        disabled={!selectedReviews[base.appointmentId]}
                                                        onClick={() => handleSubmit(base.appointmentId, base.mechanicId)}
                                                    >
                                                        Subir Review
                                                    </Button>
                                                </div>
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
                            {pagedHistory.map(({ base, appointment, mechanic }) => (
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
                                                                    variant="warning"
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

                                            <div className="flex items-center gap-3">
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
                                                {Array.isArray(base.subCategories) && base.subCategories.length > 0 ? (
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {base.subCategories.map((sub) => {
                                                            const label =
                                                                sub === SubCategroriesEnum.PUNCTUALITY
                                                                    ? "Puntualidad"
                                                                    : sub === SubCategroriesEnum.QUALITY
                                                                    ? "Calidad"
                                                                    : sub === SubCategroriesEnum.PRICE
                                                                    ? "Precio"
                                                                    : sub === SubCategroriesEnum.ATTITUDE
                                                                    ? "Actitud"
                                                                    : "Claridad";
                                                            return (
                                                                <Badge key={sub} variant="purple" className="rounded-full">
                                                                    {label}
                                                                </Badge>
                                                            );
                                                        })}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {historyTotalPages > 1 ? (
                                <div className="pt-2">
                                    <CustomPagination
                                        goPrev={goPrev}
                                        isFirstPage={historyPagination.page === 1}
                                        totalPages={historyTotalPages}
                                        pagination={historyPagination}
                                        goToPage={goToPage}
                                        goNext={goNext}
                                        isLastPage={historyPagination.page >= historyTotalPages}
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}
                </section>
            </div>
        </Container>
    );
}
