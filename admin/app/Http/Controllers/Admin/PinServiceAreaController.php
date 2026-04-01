<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PinServiceArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PinServiceAreaController extends Controller
{
    public function index()
    {
        $totalPins    = PinServiceArea::count();
        $serviceable  = PinServiceArea::where('is_serviceable', true)->count();
        $states       = PinServiceArea::select('state')->distinct()->orderBy('state')->pluck('state');
        $zones        = ['A' => '1-2 Days', 'B' => '3-4 Days', 'C' => '4-6 Days', 'D' => '5-7 Days', 'E' => '6-8 Days'];

        return view('admin.pin-service.index', compact('totalPins', 'serviceable', 'states', 'zones'));
    }

    public function datatable(Request $request)
    {
        $query = PinServiceArea::query();

        // Global search
        if ($search = $request->input('search.value')) {
            $query->where(function ($q) use ($search) {
                $q->where('pincode', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%")
                  ->orWhere('district', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Column filters
        if ($state = $request->input('filter_state')) {
            $query->where('state', $state);
        }
        if ($zone = $request->input('filter_zone')) {
            $query->where('zone', $zone);
        }
        if ($request->input('filter_serviceable') !== null && $request->input('filter_serviceable') !== '') {
            $query->where('is_serviceable', (bool) $request->input('filter_serviceable'));
        }

        $total    = PinServiceArea::count();
        $filtered = $query->count();

        $columns = ['pincode', 'state', 'district', 'city', 'zone', 'delivery_time', 'is_serviceable'];
        $orderCol = $columns[$request->input('order.0.column', 0)] ?? 'pincode';
        $orderDir = $request->input('order.0.dir', 'asc');

        $data = $query->orderBy($orderCol, $orderDir)
            ->skip($request->input('start', 0))
            ->take($request->input('length', 25))
            ->get()
            ->map(fn($p) => [
                'id'             => $p->id,
                'pincode'        => $p->pincode,
                'state'          => $p->state,
                'district'       => $p->district,
                'city'           => $p->city,
                'zone'           => $p->zone,
                'delivery_time'  => $p->delivery_time,
                'is_serviceable' => $p->is_serviceable,
            ]);

        return response()->json([
            'draw'            => $request->input('draw'),
            'recordsTotal'    => $total,
            'recordsFiltered' => $filtered,
            'data'            => $data,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pincode'        => 'required|digits:6|unique:pin_service_areas,pincode',
            'state'          => 'required|string|max:100',
            'district'       => 'nullable|string|max:100',
            'city'           => 'nullable|string|max:100',
            'zone'           => 'required|in:A,B,C,D,E',
            'zone1'          => 'nullable|string|max:50',
            'delivery_time'  => 'nullable|string|max:30',
            'is_serviceable' => 'boolean',
        ]);

        $pin = PinServiceArea::create($data);

        return response()->json(['success' => true, 'data' => $pin]);
    }

    public function show(int $id)
    {
        return response()->json(PinServiceArea::findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $pin = PinServiceArea::findOrFail($id);

        $data = $request->validate([
            'pincode'        => 'required|digits:6|unique:pin_service_areas,pincode,' . $id,
            'state'          => 'required|string|max:100',
            'district'       => 'nullable|string|max:100',
            'city'           => 'nullable|string|max:100',
            'zone'           => 'required|in:A,B,C,D,E',
            'zone1'          => 'nullable|string|max:50',
            'delivery_time'  => 'nullable|string|max:30',
            'is_serviceable' => 'boolean',
        ]);

        $pin->update($data);

        return response()->json(['success' => true, 'data' => $pin]);
    }

    public function toggleServiceable(int $id)
    {
        $pin = PinServiceArea::findOrFail($id);
        $pin->update(['is_serviceable' => !$pin->is_serviceable]);

        return response()->json(['success' => true, 'is_serviceable' => $pin->is_serviceable]);
    }

    public function destroy(int $id)
    {
        PinServiceArea::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    public function bulkToggle(Request $request)
    {
        $request->validate([
            'ids'            => 'required|array',
            'ids.*'          => 'integer',
            'is_serviceable' => 'required|boolean',
        ]);

        PinServiceArea::whereIn('id', $request->ids)->update([
            'is_serviceable' => $request->is_serviceable,
        ]);

        return response()->json(['success' => true]);
    }

    public function importCsv(Request $request)
    {
        $request->validate(['csv_file' => 'required|file|mimes:csv,txt']);

        $file   = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), 'r');
        fgetcsv($handle); // skip header

        $chunk  = [];
        $count  = 0;
        $now    = now()->toDateTimeString();

        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) < 7) continue;

            // Support both 7-col (no id) and 8-col (with id) formats
            $offset   = count($row) >= 8 ? 1 : 0;
            $pincode  = trim($row[$offset]);
            $state    = trim($row[$offset + 1]);
            $district = trim($row[$offset + 2]);
            $city     = trim($row[$offset + 3]);
            $zone     = strtoupper(trim($row[$offset + 4]));
            $zone1    = trim($row[$offset + 5]);
            $dtime    = trim($row[$offset + 6]);

            if (!$pincode || !in_array($zone, ['A','B','C','D','E'])) continue;

            $chunk[] = [
                'pincode'        => $pincode,
                'state'          => $state,
                'district'       => $district,
                'city'           => $city,
                'zone'           => $zone,
                'zone1'          => $zone1,
                'delivery_time'  => $dtime,
                'is_serviceable' => true,
                'created_at'     => $now,
                'updated_at'     => $now,
            ];

            $count++;

            if (count($chunk) >= 500) {
                DB::table('pin_service_areas')->upsert($chunk, ['pincode'], [
                    'state','district','city','zone','zone1','delivery_time','updated_at',
                ]);
                $chunk = [];
            }
        }

        if (!empty($chunk)) {
            DB::table('pin_service_areas')->upsert($chunk, ['pincode'], [
                'state','district','city','zone','zone1','delivery_time','updated_at',
            ]);
        }

        fclose($handle);

        return response()->json(['success' => true, 'imported' => $count]);
    }
}
