<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mapel extends Model
{
    protected $fillable = [
        'category_mapels_id',
        'mata_pelajaran',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CategoryMapel::class, 'category_mapels_id');
    }

    public function targets(): HasMany
    {
        return $this->hasMany(Target::class, 'mapel_id');
    }

    public function learningAchievementCriteria(): HasMany
    {
        return $this->hasMany(LearningAchievementCriterion::class, 'mapel_id');
    }
}
