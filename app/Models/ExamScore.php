<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamScore extends Model
{
    protected $fillable = [
        'student_id',
        'mapel_id',
        'semester',
        'bulan',
        'minggu_1',
        'minggu_2',
        'minggu_3',
        'minggu_4',
    ];
}
