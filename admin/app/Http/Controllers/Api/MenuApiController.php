<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Types\Api\ApiResponseType;
use Illuminate\Http\JsonResponse;

class MenuApiController extends Controller
{
    /**
     * Return ALL active footer menus as simple link lists.
     * GET /api/footer-menus
     */
    public function footer(): JsonResponse
    {
        $menus = Menu::where('is_active', true)
            ->where('location', 'footer')
            ->with([
                'items' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
            ])
            ->orderBy('id')
            ->get()
            ->map(fn ($menu) => [
                'id'    => $menu->id,
                'name'  => $menu->name,
                'slug'  => $menu->slug,
                'links' => $menu->items->map(fn ($item) => [
                    'id'     => $item->id,
                    'label'  => $item->label,
                    'href'   => $item->href,
                    'target' => $item->target ?? '_self',
                ])->values(),
            ]);

        return ApiResponseType::sendJsonResponse(true, 'Footer menus retrieved successfully.', $menus->values());
    }

    /**
     * Return ALL active menus with their full navigation tree.
     * GET /api/menus
     *
     * Response shape:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Main Navigation",
     *       "slug": "header_main",
     *       "nav_items": [
     *         { "id":1, "label":"Home", "href":"/", "type":"link", ... },
     *         { "id":2, "label":"Shop", "type":"shop_dropdown", "shop_dropdown_items":[...] },
     *         { "id":3, "label":"Categories", "type":"mega_menu", "mega_menu_panels":[
     *             { "label":"Stand-Up Pouches", "columns":[
     *                 { "heading":"By Closure", "links":[...] }
     *             ]}
     *         ]}
     *       ]
     *     }
     *   ]
     * }
     */
    public function index(): JsonResponse
    {
        $menus = Menu::where('is_active', true)
            ->with($this->eagerLoads())
            ->orderBy('id')
            ->get()
            ->map(fn ($menu) => $this->formatMenu($menu));

        return ApiResponseType::sendJsonResponse(true, 'Menus retrieved successfully.', $menus->values());
    }

    /**
     * Return a single active menu by slug.
     * GET /api/menus/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $menu = Menu::where('slug', $slug)
            ->where('is_active', true)
            ->with($this->eagerLoads())
            ->first();

        if (!$menu) {
            return ApiResponseType::sendJsonResponse(false, 'Menu not found.', [], 404);
        }

        return ApiResponseType::sendJsonResponse(true, 'Menu retrieved successfully.', $this->formatMenu($menu));
    }

    /* ─── Private helpers ──────────────────────────────────────────────── */

    /**
     * Shared eager-load definition.
     * Loads top-level items → their dropdown children → their mega menu panels → columns → links.
     * Using Menu::items() which already scopes to whereNull('parent_id').
     */
    private function eagerLoads(): array
    {
        return [
            // Top-level nav items (no parent)
            'items' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),

            // Children of shop_dropdown items
            'items.children' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),

            // Mega menu panels for mega_menu items
            'items.megaMenuPanels' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),

            // Columns inside each panel
            'items.megaMenuPanels.columns' => fn ($q) => $q->orderBy('sort_order'),

            // Links inside each column
            'items.megaMenuPanels.columns.links' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
        ];
    }

    private function formatMenu(Menu $menu): array
    {
        return [
            'id'        => $menu->id,
            'name'      => $menu->name,
            'slug'      => $menu->slug,
            'location'  => $menu->location,
            'nav_items' => $menu->items->map(fn ($item) => $this->formatItem($item))->values(),
        ];
    }

    private function formatItem($item): array
    {
        $type = $item->type->value ?? $item->type;

        $node = [
            'id'           => $item->id,
            'label'        => $item->label,
            'href'         => $item->href,
            'type'         => $type,
            'target'       => $item->target ?? '_self',
            'icon'         => $item->icon,
            'description'  => $item->description,
            'accent_color' => $item->accent_color,
            'badge'        => $item->badge,
            'sort_order'   => $item->sort_order,
        ];

        // Shop dropdown: attach children as quick-link cards
        if ($type === 'shop_dropdown') {
            $node['shop_dropdown_items'] = $item->children
                ->map(fn ($child) => [
                    'id'           => $child->id,
                    'label'        => $child->label,
                    'href'         => $child->href,
                    'target'       => $child->target ?? '_self',
                    'icon'         => $child->icon,
                    'description'  => $child->description,
                    'accent_color' => $child->accent_color,
                    'badge'        => $child->badge,
                ])->values();
        }

        // Mega menu: attach panels → columns → links
        if ($type === 'mega_menu') {
            $node['mega_menu_panels'] = $item->megaMenuPanels
                ->map(fn ($panel) => [
                    'id'           => $panel->id,
                    'label'        => $panel->label,
                    'href'         => $panel->href,
                    'accent_color' => $panel->accent_color,
                    'image_path'   => $panel->image_path,
                    'tagline'      => $panel->tagline,
                    'sort_order'   => $panel->sort_order,
                    'columns'      => $panel->columns->map(fn ($col) => [
                        'id'      => $col->id,
                        'heading' => $col->heading,
                        'links'   => $col->links->map(fn ($link) => [
                            'id'     => $link->id,
                            'label'  => $link->label,
                            'href'   => $link->href,
                            'target' => $link->target ?? '_self',
                        ])->values(),
                    ])->values(),
                ])->values();
        }

        return $node;
    }
}
