<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use App\Models\HeroTrustBadge;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class HeroSectionApiController extends Controller
{
    public function index(): JsonResponse
    {
        $slides = HeroSlide::active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn($s) => [
                'id'                   => $s->id,
                'image'                => $s->image_url,
                'eyebrow'              => $s->eyebrow,
                'heading'              => $s->heading,
                'description'          => $s->description,
                'primaryCta'           => ['label' => $s->primary_cta_label,   'href' => $s->primary_cta_href],
                'secondaryCta'         => ['label' => $s->secondary_cta_label, 'href' => $s->secondary_cta_href],
            ]);

        $badges = HeroTrustBadge::active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn($b) => [
                'id'       => $b->id,
                'iconName' => $b->icon_name,
                'label'    => $b->label,
            ]);

        $setting  = Setting::where('variable', 'hero_section')->first();
        $settings = $setting ? json_decode($setting->value, true) : [];

        return response()->json([
            'slides'   => $slides,
            'badges'   => $badges,
            'settings' => [
                'autoplayEnabled' => $settings['autoplay_enabled'] ?? true,
                'autoplayDelay'   => $settings['autoplay_delay']   ?? 5000,
            ],
        ]);
    }
}
