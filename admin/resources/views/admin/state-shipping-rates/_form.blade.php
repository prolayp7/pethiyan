<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label required">State Name</label>
        @if($states && $states->count())
            <select class="form-select" name="state_name" id="stateNameSelect_{{ $rate?->id ?? 'new' }}">
                <option value="">Select State…</option>
                @foreach($states as $s)
                    <option value="{{ $s['name'] }}" data-code="{{ $s['code'] }}"
                        {{ ($rate?->state_name ?? '') === $s['name'] ? 'selected' : '' }}>
                        {{ $s['name'] }} ({{ $s['code'] }})
                    </option>
                @endforeach
            </select>
        @else
            <input type="text" class="form-control" name="state_name"
                   value="{{ $rate?->state_name ?? '' }}" placeholder="e.g. Maharashtra">
        @endif
    </div>
    <div class="col-md-3">
        <label class="form-label required">State Code</label>
        <input type="text" class="form-control text-uppercase" name="state_code"
               value="{{ $rate?->state_code ?? '' }}" maxlength="5" placeholder="MH">
        <small class="form-hint">2-letter ISO code</small>
    </div>
    <div class="col-md-3">
        <label class="form-label">Status</label>
        <div class="mt-2">
            <label class="form-check form-switch">
                <input class="form-check-input" type="checkbox" name="is_active" value="1"
                    {{ ($rate?->is_active ?? true) ? 'checked' : '' }}>
                <span class="form-check-label">Active</span>
            </label>
        </div>
    </div>

    <div class="col-md-4">
        <label class="form-label required">Base Rate (₹)</label>
        <div class="input-group">
            <span class="input-group-text">₹</span>
            <input type="number" class="form-control" name="base_rate" step="0.01" min="0"
                   value="{{ $rate?->base_rate ?? 0 }}" placeholder="50.00">
        </div>
        <small class="form-hint">Flat fee per order</small>
    </div>
    <div class="col-md-4">
        <label class="form-label">Per KG Rate (₹)</label>
        <div class="input-group">
            <span class="input-group-text">₹</span>
            <input type="number" class="form-control" name="per_kg_rate" step="0.01" min="0"
                   value="{{ $rate?->per_kg_rate ?? 0 }}" placeholder="0.00">
        </div>
        <small class="form-hint">Additional charge per kg</small>
    </div>
    <div class="col-md-4">
        <label class="form-label">Free Shipping Above (₹)</label>
        <div class="input-group">
            <span class="input-group-text">₹</span>
            <input type="number" class="form-control" name="free_shipping_above" step="0.01" min="0"
                   value="{{ $rate?->free_shipping_above ?? '' }}" placeholder="999">
        </div>
        <small class="form-hint">Leave blank to disable</small>
    </div>

    <div class="col-md-6">
        <label class="form-label required">Estimated Days (Min)</label>
        <input type="number" class="form-control" name="estimated_days_min" min="1"
               value="{{ $rate?->estimated_days_min ?? 3 }}">
    </div>
    <div class="col-md-6">
        <label class="form-label required">Estimated Days (Max)</label>
        <input type="number" class="form-control" name="estimated_days_max" min="1"
               value="{{ $rate?->estimated_days_max ?? 7 }}">
    </div>

    <div class="col-12">
        <label class="form-label">Notes</label>
        <textarea class="form-control" name="notes" rows="2" placeholder="Optional notes…">{{ $rate?->notes ?? '' }}</textarea>
    </div>
</div>

@once
<script>
document.addEventListener('change', function(e) {
    const sel = e.target.closest('select[name="state_name"]');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    const codeInput = sel.closest('form')?.querySelector('input[name="state_code"]');
    if (codeInput && opt?.dataset?.code) {
        codeInput.value = opt.dataset.code;
    }
});
</script>
@endonce
