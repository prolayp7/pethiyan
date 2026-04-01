@extends('layouts.admin.app', ['page' => $menuAdmin['state_shipping_rates']['active'] ?? '', 'sub_page' => ''])

@section('title', 'State Shipping Rates')

@section('header_data')
    @php $page_title = 'State Shipping Rates'; $page_pretitle = 'Logistics'; @endphp
@endsection

@php
$breadcrumbs = [
    ['title' => __('labels.home'), 'url' => route('admin.dashboard')],
    ['title' => 'State Shipping Rates', 'url' => null],
];
@endphp

@section('admin-content')
<div class="page-header d-print-none">
    <div class="row g-2 align-items-center">
        <div class="col">
            <h2 class="page-title">State Shipping Rates</h2>
            <x-breadcrumb :items="$breadcrumbs"/>
        </div>
        <div class="col-auto ms-auto">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRateModal">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Shipping Rate
            </button>
        </div>
    </div>
</div>

<div class="page-body">
    <div class="container-xl">
        {{-- Info card --}}
        <div class="alert alert-info mb-4">
            <div class="d-flex">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12.01" y2="8"/><polyline points="11 12 12 12 12 16 13 16"/></svg>
                </div>
                <div>
                    Define state-wise flat shipping rates. If a customer's delivery state matches a rate, it will override the default delivery zone charges.
                    The <strong>Free Shipping Above</strong> threshold waives the shipping fee entirely if the order total exceeds it.
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h4 class="card-title">All State Rates</h4>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="ratesTable" class="table table-vcenter card-table datatable">
                        <thead>
                            <tr>
                                @foreach($columns as $col)
                                    <th>{{ $col['title'] }}</th>
                                @endforeach
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- ====================== ADD MODAL ====================== --}}
<div class="modal modal-blur fade" id="addRateModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Shipping Rate</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="addRateForm" class="form-submit" action="{{ route('admin.state-shipping-rates.store') }}" method="POST">
                @csrf
                <div class="modal-body">
                    @include('admin.state-shipping-rates._form', ['rate' => null, 'states' => $states])
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Rate</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- ====================== EDIT MODAL ====================== --}}
<div class="modal modal-blur fade" id="editRateModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Shipping Rate</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="editRateForm" class="form-submit" method="POST">
                @csrf
                <div class="modal-body" id="editRateBody">
                    @include('admin.state-shipping-rates._form', ['rate' => null, 'states' => $states])
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Rate</button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
window.addEventListener('load', function () {
@php
    $dtColumns = array_map(fn($c) => ['data' => $c['data'], 'name' => $c['name'], 'orderable' => $c['orderable'] ?? true, 'searchable' => $c['searchable'] ?? true], $columns);
@endphp
const dtColumns = @json($dtColumns);

const table = $('#ratesTable').DataTable({
    processing: true,
    serverSide: true,
    ajax: '{{ route('admin.state-shipping-rates.datatable') }}',
    columns: dtColumns,
    order: [[0, 'asc']],
});

// ---- Edit ----
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-edit-rate');
    if (!btn) return;

    const d = btn.dataset;
    const form = document.getElementById('editRateForm');
    form.action = `/admin/state-shipping-rates/${d.id}`;

    Object.entries({
        state_name: d.state_name, state_code: d.state_code,
        base_rate: d.base_rate, per_kg_rate: d.per_kg_rate,
        free_shipping_above: d.free_shipping_above,
        estimated_days_min: d.estimated_days_min,
        estimated_days_max: d.estimated_days_max,
        is_active: d.is_active, notes: d.notes,
    }).forEach(([k, v]) => {
        const el = form.querySelector(`[name="${k}"]`);
        if (!el) return;
        if (el.type === 'checkbox') { el.checked = v == '1'; }
        else { el.value = v ?? ''; }
    });

    new bootstrap.Modal(document.getElementById('editRateModal')).show();
});

// ---- Delete ----
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-delete-rate');
    if (!btn) return;
    if (!confirm(`Delete shipping rate for "${btn.dataset.name}"?`)) return;

    fetch(`/admin/state-shipping-rates/${btn.dataset.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
    }).then(r => r.json()).then(res => {
        if (res.success) { table.ajax.reload(); }
        else { alert(res.message || 'Delete failed.'); }
    });
});

// ---- Form submit (add + edit) ----
document.querySelectorAll('.form-submit').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = new FormData(form);
        fetch(form.action, { method: 'POST', body: data })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    bootstrap.Modal.getInstance(form.closest('.modal'))?.hide();
                    table.ajax.reload();
                    form.reset();
                } else {
                    alert(res.message || 'Error saving rate.');
                }
            });
    });
});
}); // window load
</script>
@endpush
