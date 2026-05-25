<?php

namespace App\Models;

use App\Services\ScoreCalculator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentScore extends Model
{
    protected $fillable = [
        'student_id',
        'mapel_id',
        'target_id',
        'sumatif_harian',
        'sumatif_akhir',
        'nilai_rapor_tp',
    ];

    protected static function booted(): void
    {
        static::saving(function (StudentScore $score) {
            $score->nilai_rapor_tp = ScoreCalculator::nilaiRaporTp(
                $score->sumatif_harian,
                $score->sumatif_akhir
            );
        });
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(Target::class);
    }
}
