<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\RombelController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\TargetController;
use App\Http\Controllers\ExtracurricularAttendanceController;
use App\Http\Controllers\LearningAchievementCriterionController;
use App\Http\Controllers\RecapController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticationController::class, 'index'])->name('login');
    Route::post('/login', [AuthenticationController::class, 'login']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticationController::class, 'logout'])->name('logout');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('students', StudentController::class);
    Route::resource('mapels', MapelController::class);
    Route::resource('teachers', TeacherController::class);
    Route::resource('rombels', RombelController::class);
    
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    Route::get('/scores', [ScoreController::class, 'index'])->name('scores.index');
    Route::post('/scores', [ScoreController::class, 'store'])->name('scores.store');

    Route::resource('targets', TargetController::class)->except(['show']);

    Route::get('/recaps', [RecapController::class, 'index'])->name('recaps.index');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{student}', [ReportController::class, 'show'])->name('reports.show');

    Route::get('/attendances', [ExtracurricularAttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/attendances/create', [ExtracurricularAttendanceController::class, 'create'])->name('attendances.create');
    Route::post('/attendances', [ExtracurricularAttendanceController::class, 'store'])->name('attendances.store');

    Route::get('/learning-achievement-criteria', [LearningAchievementCriterionController::class, 'index'])
        ->name('learning-achievement-criteria.index');
    Route::post('/learning-achievement-criteria', [LearningAchievementCriterionController::class, 'store'])
        ->name('learning-achievement-criteria.store');
});

