<?php

namespace App\Support;

use Illuminate\Support\Facades\Schema;

class InstallationState
{
    public static function isInstalled(): bool
    {
        if (file_exists(storage_path('installed'))) {
            return true;
        }

        try {
            return Schema::hasTable('migrations');
        } catch (\Throwable) {
            return false;
        }
    }
}
