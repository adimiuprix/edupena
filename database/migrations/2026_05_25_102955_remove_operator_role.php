<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $operatorRole = DB::table('roles')->where('slug', 'operator')->first();

        if (! $operatorRole) {
            return;
        }

        $guruRoleId = DB::table('roles')->where('slug', 'guru')->value('id');

        if ($guruRoleId) {
            DB::table('users')
                ->where('role_id', $operatorRole->id)
                ->update(['role_id' => $guruRoleId]);
        }

        DB::table('roles')->where('slug', 'operator')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('roles')->updateOrInsert(
            ['slug' => 'operator'],
            [
                'name' => 'Operator',
                'description' => 'Mengelola data akademik dan operasional',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
};
