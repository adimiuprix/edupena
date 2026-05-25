<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Rombel extends Model
{
    protected $fillable = [
        'tingkat',
        'nama_rombel',
        'tahun_ajaran',
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function waliKelas(): HasOne
    {
        return $this->hasOne(User::class, 'rombel_id')
            ->whereHas('role', fn ($query) => $query->where('slug', 'walikelas'));
    }

    public function learningAchievementThresholds()
    {
        return $this->hasMany(LearningAchievementThreshold::class);
    }
}
