<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExtracurricularCategory extends Model
{
    protected $fillable = [
        'nama_ekskul',
        'jenis',
    ];

    public function attendances(): HasMany
    {
        return $this->hasMany(ExtracurricularAttendance::class);
    }
}
