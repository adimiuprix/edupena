<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $guarded = [];

    public function rombel()
    {
        return $this->belongsTo(Rombel::class);
    }

    public function studentScores()
    {
        return $this->hasMany(StudentScore::class);
    }
}
