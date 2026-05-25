<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $fillable = [
        'category_mapels_id',
        'mata_pelajaran',
    ];

    public function category()
    {
        return $this->belongsTo(CategoryMapel::class, 'category_mapels_id');
    }
}
