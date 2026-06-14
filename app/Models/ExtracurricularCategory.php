<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExtracurricularCategory extends Model
{
    protected $fillable = [
        'nama_ekskul',
        'jenis',
        'mapel_id',
    ];

    /**
     * Mapel yang berkaitan — relasi eksplisit pengganti matching nama string.
     */
    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(ExtracurricularAttendance::class);
    }
}
