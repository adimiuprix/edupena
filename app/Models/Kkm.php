<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kkm extends Model
{
    protected $table = 'kkm';

    protected $fillable = [
        'mapel_id',
        'rombel_id',
        'nilai_kkm',
        'semester',
    ];

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class);
    }

    public function rombel(): BelongsTo
    {
        return $this->belongsTo(Rombel::class);
    }
}
