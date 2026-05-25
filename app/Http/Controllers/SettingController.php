<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settingsData = $request->except(['_token', '_method']);

        foreach ($settingsData as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return redirect()->back()->with('message', 'Pengaturan berhasil diperbarui');
    }
}
