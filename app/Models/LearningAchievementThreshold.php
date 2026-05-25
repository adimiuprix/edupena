<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningAchievementThreshold extends Model
{
    protected $fillable = [
        'rombel_id',
        'semester',
        'min_nilai',
        'max_nilai',
        'mid_nilai',
    ];

    protected function casts(): array
    {
        return [
            'min_nilai' => 'decimal:2',
            'max_nilai' => 'decimal:2',
            'mid_nilai' => 'decimal:2',
        ];
    }

    public function rombel(): BelongsTo
    {
        return $this->belongsTo(Rombel::class);
    }
}
