import { ReviewEnum, SubCategroriesEnum } from "@/types/users.types";

export const toStars = (reviews?: ReviewEnum[] | null): { avg: number; filled: number } => {
    if (!reviews || reviews.length === 0) return { avg: 0, filled: 0 }
    const score = reviews.reduce((acc, r) => acc + (r === ReviewEnum.EXCELLENT ? 5 : r === ReviewEnum.GOOD ? 3 : 1), 0)
    const avg = score / reviews.length
    const filled = Math.round(avg)
    return { avg, filled }
}

export const getSubcategoryCounts = (subs?: SubCategroriesEnum[] | null) => {
    const map: Partial<Record<SubCategroriesEnum, number>> = {}
    if (!subs || subs.length === 0) return map
    for (const s of subs) {
        map[s] = (map[s] ?? 0) + 1
    }
    return map

}

export const subLabel = (sub: SubCategroriesEnum) =>
    sub === SubCategroriesEnum.PUNCTUALITY
        ? "Puntualidad"
        : sub === SubCategroriesEnum.QUALITY
        ? "Calidad"
        : sub === SubCategroriesEnum.PRICE
        ? "Precio"
        : sub === SubCategroriesEnum.ATTITUDE
        ? "Actitud"
        : "Claridad"