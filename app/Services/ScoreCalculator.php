<?php

namespace App\Services;

class ScoreCalculator
{
    public const HARIAN_WEIGHT = 0.6;

    public const AKHIR_WEIGHT = 0.4;

    /**
     * Nilai rapor per TP: 60% sumatif harian + 40% sumatif akhir (logika eraport.xlsm).
     */
    public static function nilaiRaporTp(?int $sumatifHarian, ?int $sumatifAkhir): ?float
    {
        if ($sumatifHarian === null && $sumatifAkhir === null) {
            return null;
        }

        $harian = $sumatifHarian ?? 0;
        $akhir = $sumatifAkhir ?? 0;

        return round(($harian * self::HARIAN_WEIGHT) + ($akhir * self::AKHIR_WEIGHT), 2);
    }

    /**
     * Nilai rapor mapel: rata-rata nilai rapor semua TP yang terisi.
     *
     * @param  array<int, float|null>  $nilaiRaporPerTp
     */
    public static function nilaiRaporMapel(array $nilaiRaporPerTp): ?float
    {
        $filled = array_values(array_filter($nilaiRaporPerTp, fn ($v) => $v !== null));

        if ($filled === []) {
            return null;
        }

        return round(array_sum($filled) / count($filled), 2);
    }
}
