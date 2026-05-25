<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function waliKelas()
    {
        return $this->hasOne(Teacher::class, 'rombel_id')->where('jenis_guru', 'Wali Kelas');
    }
}
