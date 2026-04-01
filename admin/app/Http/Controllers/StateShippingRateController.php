<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\StateShippingRate;
use App\Services\GstService;
use App\Traits\PanelAware;
use App\Types\Api\ApiResponseType;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class StateShippingRateController extends Controller
{
    use AuthorizesRequests, PanelAware;

    public function index(): View
    {
        $columns = [
            ['data' => 'id',                 'name' => 'id',                 'title' => __('labels.id')],
            ['data' => 'state_name',         'name' => 'state_name',         'title' => 'State'],
            ['data' => 'state_code',         'name' => 'state_code',         'title' => 'Code'],
            ['data' => 'base_rate',          'name' => 'base_rate',          'title' => 'Base Rate (₹)'],
            ['data' => 'per_kg_rate',        'name' => 'per_kg_rate',        'title' => 'Per KG (₹)'],
            ['data' => 'free_shipping_above','name' => 'free_shipping_above','title' => 'Free Above (₹)', 'orderable' => false],
            ['data' => 'estimated_days',     'name' => 'estimated_days',     'title' => 'Est. Days', 'orderable' => false, 'searchable' => false],
            ['data' => 'is_active',          'name' => 'is_active',          'title' => __('labels.status'), 'orderable' => false, 'searchable' => false],
            ['data' => 'action',             'name' => 'action',             'title' => __('labels.action'), 'orderable' => false, 'searchable' => false],
        ];

        // Pre-populate state list from GstService constants
        // STATE_CODES is keyed 'CODE' => 'Name'
        $states = collect(GstService::STATE_CODES)->map(fn($name, $code) => [
            'name' => $name,
            'code' => $code,
        ])->values();

        return view('admin.state-shipping-rates.index', compact('columns', 'states'));
    }

    public function datatable(Request $request): JsonResponse
    {
        $query = StateShippingRate::query();

        $search = $request->input('search.value');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('state_name', 'like', "%{$search}%")
                  ->orWhere('state_code', 'like', "%{$search}%");
            });
        }

        $total    = $query->count();
        $filtered = $total;

        $orderCol = ['id', 'state_name', 'state_code', 'base_rate', 'per_kg_rate'][$request->input('order.0.column', 0)] ?? 'id';
        $orderDir = $request->input('order.0.dir', 'asc');
        $query->orderBy($orderCol, $orderDir);

        $query->skip($request->input('start', 0))->take($request->input('length', 15));

        $rows = $query->get()->map(function (StateShippingRate $r) {
            return [
                'id'                  => $r->id,
                'state_name'          => $r->state_name,
                'state_code'          => '<span class="badge bg-blue-lt">' . $r->state_code . '</span>',
                'base_rate'           => '₹' . number_format((float)$r->base_rate, 2),
                'per_kg_rate'         => '₹' . number_format((float)$r->per_kg_rate, 2),
                'free_shipping_above' => $r->free_shipping_above ? '₹' . number_format((float)$r->free_shipping_above, 2) : '<span class="text-muted">—</span>',
                'estimated_days'      => $r->estimated_days_min . '–' . $r->estimated_days_max . ' days',
                'is_active'           => $r->is_active
                    ? '<span class="badge bg-success">Active</span>'
                    : '<span class="badge bg-secondary">Inactive</span>',
                'action' => view('admin.state-shipping-rates._actions', ['rate' => $r])->render(),
            ];
        });

        return response()->json([
            'draw'            => (int)$request->input('draw'),
            'recordsTotal'    => $total,
            'recordsFiltered' => $filtered,
            'data'            => $rows,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'state_name'          => 'required|string|max:100',
            'state_code'          => 'required|string|max:5|unique:state_shipping_rates,state_code',
            'base_rate'           => 'required|numeric|min:0',
            'per_kg_rate'         => 'nullable|numeric|min:0',
            'free_shipping_above' => 'nullable|numeric|min:0',
            'estimated_days_min'  => 'required|integer|min:1',
            'estimated_days_max'  => 'required|integer|min:1|gte:estimated_days_min',
            'is_active'           => 'nullable|boolean',
            'notes'               => 'nullable|string|max:500',
        ]);

        $validated['state_code'] = strtoupper($validated['state_code']);
        $validated['is_active']  = $request->boolean('is_active', true);

        $rate = StateShippingRate::create($validated);

        return ApiResponseType::sendJsonResponse(true, 'Shipping rate created.', $rate);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $rate = StateShippingRate::findOrFail($id);

        $validated = $request->validate([
            'state_name'          => 'required|string|max:100',
            'state_code'          => 'required|string|max:5|unique:state_shipping_rates,state_code,' . $id,
            'base_rate'           => 'required|numeric|min:0',
            'per_kg_rate'         => 'nullable|numeric|min:0',
            'free_shipping_above' => 'nullable|numeric|min:0',
            'estimated_days_min'  => 'required|integer|min:1',
            'estimated_days_max'  => 'required|integer|min:1|gte:estimated_days_min',
            'is_active'           => 'nullable|boolean',
            'notes'               => 'nullable|string|max:500',
        ]);

        $validated['state_code'] = strtoupper($validated['state_code']);
        $validated['is_active']  = $request->boolean('is_active', true);

        $rate->update($validated);

        return ApiResponseType::sendJsonResponse(true, 'Shipping rate updated.', $rate);
    }

    public function destroy(int $id): JsonResponse
    {
        $rate = StateShippingRate::findOrFail($id);
        $rate->delete();
        return ApiResponseType::sendJsonResponse(true, 'Shipping rate deleted.');
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponseType::sendJsonResponse(true, '', StateShippingRate::findOrFail($id));
    }
}
