<?php

namespace App\Services;

/**
 * Logika KKTP dari sheet eraport.xlsm (KKTP + PP).
 */
class LearningAchievementCriterionService
{
    public const MAX_OFFSET = 10;

    /**
     * Hitung rata-rata nilai KKTP per mapel (baris 59 di Excel).
     *
     * @param  array<int, array<int, int|null>>  $nilaiByStudentMapel  [student_id => [mapel_id => nilai]]
     * @return array<int, float>  [mapel_id => rata-rata]
     */
    public static function averagesPerMapel(array $nilaiByStudentMapel, array $mapelIds): array
    {
        $averages = [];

        foreach ($mapelIds as $mapelId) {
            $values = [];

            foreach ($nilaiByStudentMapel as $perMapel) {
                if (isset($perMapel[$mapelId]) && $perMapel[$mapelId] !== null) {
                    $values[] = (float) $perMapel[$mapelId];
                }
            }

            $averages[$mapelId] = $values !== [] ? round(array_sum($values) / count($values), 2) : null;
        }

        return $averages;
    }

    /**
     * Ambang kelas: Min = MIN(rata mapel), Max = Min + 10, Mid = (Min+Max)/2.
     *
     * @param  array<int, float|null>  $averagesPerMapel
     * @return array{min: ?float, max: ?float, mid: ?float, averages_per_mapel: array<int, float|null>}
     */
    public static function classThresholds(array $averagesPerMapel): array
    {
        $filled = array_values(array_filter($averagesPerMapel, fn ($v) => $v !== null));

        if ($filled === []) {
            return [
                'min' => null,
                'max' => null,
                'mid' => null,
                'averages_per_mapel' => $averagesPerMapel,
            ];
        }

        $min = round(min($filled), 2);
        $max = round($min + self::MAX_OFFSET, 2);
        $mid = round(($min + $max) / 2, 2);

        return [
            'min' => $min,
            'max' => $max,
            'mid' => $mid,
            'averages_per_mapel' => $averagesPerMapel,
        ];
    }

    /**
     * Awalan deskripsi capaian (PP sheet AK5/AL5) berdasarkan nilai TP vs ambang KKTP.
     */
    public static function descriptionPrefix(float $nilai, float $min, float $max): string
    {
        if ($nilai < $min) {
            return 'perlu bimbingan dalam ';
        }

        if ($nilai <= $max) {
            return 'baik dalam ';
        }

        return 'sangat baik dalam ';
    }
}
