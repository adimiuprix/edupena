<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtracurricularAttendance extends Model
{
    protected $fillable = [
        'student_id',
        'semester',
        'extracurricular_category_id',
        'predikat',
        'sakit',
        'ijin',
        'alpa',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ExtracurricularCategory::class, 'extracurricular_category_id');
    }
}
