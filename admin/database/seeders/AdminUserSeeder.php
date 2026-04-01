<?php

namespace Database\Seeders;

use App\Enums\DefaultSystemRolesEnum;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@pethiyan.com'],
            [
                'name'              => 'Super Admin',
                'mobile'            => '9000000000',
                'status'            => 'active',
                'access_panel'      => 'admin',
                'password'          => bcrypt('Admin@1234'),
                'email_verified_at' => now(),
            ]
        );

        // Assign Super Admin role (guard: admin) if not already assigned
        if (!$user->hasRole(DefaultSystemRolesEnum::SUPER_ADMIN())) {
            $user->assignRole(DefaultSystemRolesEnum::SUPER_ADMIN());
        }

        $this->command->info('Admin user ready — email: admin@pethiyan.com | password: Admin@1234');
    }
}
