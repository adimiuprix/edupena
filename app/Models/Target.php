<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Target extends Model
{
    protected $fillable = [
        'mapel_id',
        'kelas',
        'semester',
        'nomor_tp',
        'deskripsi_target_pencapaian',
        'jumlah_karakter',
    ];

    protected static function booted(): void
    {
        static::saving(function (Target $target) {
            if ($target->deskripsi_target_pencapaian) {
                $target->jumlah_karakter = mb_strlen($target->deskripsi_target_pencapaian);
            }
        });
    }

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function studentScores(): HasMany
    {
        return $this->hasMany(StudentScore::class);
    }
}
