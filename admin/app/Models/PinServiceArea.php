<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PinServiceArea extends Model
{
    protected $fillable = [
        'pincode',
        'state',
        'district',
        'city',
        'zone',
        'zone1',
        'delivery_time',
        'is_serviceable',
    ];

    protected $casts = [
        'is_serviceable' => 'boolean',
    ];

    /**
     * Check if a pincode is serviceable and return its details.
     */
    public static function check(string $pincode): ?self
    {
        return static::where('pincode', $pincode)
            ->where('is_serviceable', true)
            ->first();
    }
}
