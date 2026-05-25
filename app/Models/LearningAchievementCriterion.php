<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) per siswa & mapel.
 */
class LearningAchievementCriterion extends Model
{
    protected $table = 'learning_achievement_criteria';

    protected $fillable = [
        'student_id',
        'mapel_id',
        'semester',
        'nilai',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }
}
