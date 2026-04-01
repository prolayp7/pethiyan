@php use Illuminate\Support\Str; @endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tax Invoice - {{ $systemSettings['appName'] }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #222; background: #fff; }
        h2 { font-size: 18px; }
        h4 { font-size: 13px; margin-bottom: 4px; }
        h5 { font-size: 12px; margin: 8px 0 4px; }
        p  { margin: 2px 0; }

        .page { padding: 24px; width: 100%; }
        .page-break { page-break-before: always; }

        /* ── Header grid ── */
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .header-table td { vertical-align: top; padding: 6px; width: 33%; }

        /* ── Generic tables ── */
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 11px; }
        th { background: #f0f0f0; font-weight: bold; }
        tfoot td { background: #fafafa; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .no-border td { border: none; }

        /* ── GST badges ── */
        .badge-intra { color: #155724; background: #d4edda; border-radius: 3px; padding: 1px 5px; }
        .badge-inter { color: #004085; background: #cce5ff; border-radius: 3px; padding: 1px 5px; }

        /* ── Totals summary box ── */
        .totals-table { width: 340px; margin-left: auto; margin-top: 12px; }
        .totals-table td { border: 1px solid #ccc; padding: 5px 8px; font-size: 11px; }
        .totals-table .label { text-align: right; color: #555; }
        .totals-table .grand { font-weight: bold; font-size: 12px; background: #f0f0f0; }

        .section-title { font-size: 13px; font-weight: bold; margin: 14px 0 6px; border-bottom: 2px solid #333; padding-bottom: 4px; }

        .signatory { float: right; text-align: center; width: 220px; margin-top: 30px; }
        .signatory-line { border-top: 1px solid #000; margin-top: 8px; padding-top: 4px; font-weight: bold; font-size: 11px; }
        .clearfix::after { content: ""; display: table; clear: both; }

        .footer-note { margin-top: 20px; text-align: center; font-size: 10px; color: #555; border-top: 1px solid #ddd; padding-top: 8px; }
    </style>
</head>
<body>
@php
    $currency   = $systemSettings['currencySymbol'] ?? '₹';
    $supplyType = $order['supply_type'] ?? 'intra';
    $isIntra    = $supplyType === 'intra';
@endphp

<div class="page">

    {{-- ══ PAGE 1: CONSOLIDATED INVOICE ══════════════════════════════════ --}}
    <h2 class="text-center">TAX INVOICE</h2>
    <p class="text-center" style="font-size:10px; margin-bottom:12px;">
        Supply Type:
        @if($isIntra)
            <span class="badge-intra">Intra-State (CGST + SGST)</span>
        @else
            <span class="badge-inter">Inter-State (IGST)</span>
        @endif
    </p>

    {{-- Header: Seller / Invoice Info / Buyer ─────────────────────────── --}}
    <table class="header-table">
        <tr>
            {{-- Supplier --}}
            <td style="border:1px solid #ccc; border-radius:4px;">
                @if(!empty($systemSettings['logo']))
                    <img src="{{ $systemSettings['logo'] }}" alt="Logo" style="height:40px; margin-bottom:6px;"><br>
                @endif
                <strong>{{ $systemSettings['appName'] }}</strong><br>
                @if(!empty($systemSettings['companyAddress']))
                    {!! nl2br(e($systemSettings['companyAddress'])) !!}<br>
                @endif
                @if(!empty($systemSettings['sellerSupportEmail']))
                    Email: {{ $systemSettings['sellerSupportEmail'] }}<br>
                @endif
                @if(!empty($systemSettings['sellerSupportNumber']))
                    Phone: {{ $systemSettings['sellerSupportNumber'] }}<br>
                @endif
                @if(!empty($systemSettings['gstin'] ?? null))
                    <strong>GSTIN:</strong> {{ $systemSettings['gstin'] }}
                @endif
            </td>

            {{-- Invoice Meta --}}
            <td style="border:1px solid #ccc; border-radius:4px;">
                <strong>Invoice #:</strong> {{ $order['uuid'] }}<br>
                <strong>Order Date:</strong> {{ $order['created_at']->format('d M Y H:i') }}<br>
                <strong>Payment:</strong> {{ strtoupper(str_replace('_',' ',$order['payment_method'] ?? 'N/A')) }}<br>
                @if(!empty($order['customer_state']))
                    <strong>Ship-to State:</strong> {{ $order['customer_state'] }}
                    @if(!empty($order['customer_state_code']))
                        ({{ $order['customer_state_code'] }})
                    @endif
                @endif
            </td>

            {{-- Buyer --}}
            <td style="border:1px solid #ccc; border-radius:4px;">
                <strong>Bill To:</strong><br>
                {{ $order['shipping_name'] }}<br>
                {{ $order['shipping_address_1'] }}
                @if(!empty($order['shipping_landmark'])), {{ $order['shipping_landmark'] }}@endif<br>
                {{ $order['shipping_city'] }}, {{ $order['shipping_state'] }} - {{ $order['shipping_zip'] }}<br>
                {{ $order['shipping_country'] }}<br>
                Phone: {{ $order['shipping_phone'] }}<br>
                Email: {{ $order['email'] }}
            </td>
        </tr>
    </table>

    {{-- ── Order Items (consolidated) ─────────────────────────────────── --}}
    <div class="section-title">Order Summary</div>

    @foreach($sellerOrder as $vendor)
        @php $store = $vendor['items'][0]['orderItem']['store'] ?? null; @endphp

        <h5>
            Sold by: {{ $store['name'] ?? ($vendor['seller']['stores'][0]['name'] ?? 'N/A') }}
            @if($store && !empty($store['gstin']))
                &nbsp;|&nbsp; GSTIN: <strong>{{ $store['gstin'] }}</strong>
            @elseif($store)
                &nbsp;|&nbsp; Tax No: {{ $store['tax_number'] ?? 'N/A' }}
            @endif
            @if($store && !empty($store['state_code']))
                &nbsp;|&nbsp; State: {{ $store['state_name'] ?? $store['state'] ?? '' }} ({{ $store['state_code'] }})
            @endif
        </h5>

        <table style="margin-bottom:10px;">
            <thead>
            <tr>
                <th style="width:22%">Item</th>
                <th style="width:8%">HSN</th>
                <th style="width:5%">Qty</th>
                <th style="width:9%">Unit Price</th>
                <th style="width:9%">Taxable Amt</th>
                <th style="width:6%">GST%</th>
                @if($isIntra)
                    <th style="width:7%">CGST</th>
                    <th style="width:7%">SGST</th>
                @else
                    <th style="width:10%">IGST</th>
                @endif
                <th style="width:9%">Tax Amt</th>
                <th style="width:9%">Total</th>
            </tr>
            </thead>
            <tbody>
            @foreach($vendor['items'] as $item)
                @php
                    $oi  = $item['orderItem'];
                    $qty = (float)($item['quantity'] ?? 1);
                    $taxableAmt = (float)($oi['taxable_amount'] ?? ($item['price'] * $qty));
                    $gstRate    = (float)($oi['gst_rate']       ?? 0);
                    $cgst       = (float)($oi['cgst_amount']    ?? 0);
                    $sgst       = (float)($oi['sgst_amount']    ?? 0);
                    $igst       = (float)($oi['igst_amount']    ?? 0);
                    $totalTax   = (float)($oi['total_tax_amount'] ?? ($cgst + $sgst + $igst));
                    $lineTotal  = $taxableAmt + $totalTax;
                    $hsn        = $oi['hsn_code'] ?? ($item['product']['hsn_code'] ?? '—');
                @endphp
                <tr>
                    <td>{{ $item['product']['title'] }}<br>
                        <small style="color:#666;">{{ $item['variant']['title'] ?? '' }}</small>
                    </td>
                    <td>{{ $hsn }}</td>
                    <td class="text-center">{{ $qty }}</td>
                    <td class="text-right">{{ $currency }}{{ number_format($item['price'], 2) }}</td>
                    <td class="text-right">{{ $currency }}{{ number_format($taxableAmt, 2) }}</td>
                    <td class="text-center">{{ $gstRate }}%</td>
                    @if($isIntra)
                        <td class="text-right">{{ $currency }}{{ number_format($cgst, 2) }}<br><small>({{ $gstRate/2 }}%)</small></td>
                        <td class="text-right">{{ $currency }}{{ number_format($sgst, 2) }}<br><small>({{ $gstRate/2 }}%)</small></td>
                    @else
                        <td class="text-right">{{ $currency }}{{ number_format($igst, 2) }}<br><small>({{ $gstRate }}%)</small></td>
                    @endif
                    <td class="text-right">{{ $currency }}{{ number_format($totalTax, 2) }}</td>
                    <td class="text-right"><strong>{{ $currency }}{{ number_format($lineTotal, 2) }}</strong></td>
                </tr>
            @endforeach
            </tbody>
            <tfoot>
            <tr>
                <td colspan="{{ $isIntra ? 9 : 8 }}" class="text-right"><strong>Store Subtotal:</strong></td>
                <td class="text-right"><strong>{{ $currency }}{{ number_format($vendor['total_price'], 2) }}</strong></td>
            </tr>
            </tfoot>
        </table>
    @endforeach

    {{-- ── GST + Payment Summary ────────────────────────────────────────── --}}
    <table class="totals-table">
        <tr>
            <td class="label">Items Subtotal:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['subtotal'], 2) }}</td>
        </tr>
        @if(($order['total_taxable_amount'] ?? 0) > 0)
        <tr>
            <td class="label">Taxable Amount:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['total_taxable_amount'], 2) }}</td>
        </tr>
        @endif
        @if($isIntra && ($order['total_cgst'] ?? 0) > 0)
        <tr>
            <td class="label">CGST:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['total_cgst'], 2) }}</td>
        </tr>
        <tr>
            <td class="label">SGST:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['total_sgst'], 2) }}</td>
        </tr>
        @elseif(!$isIntra && ($order['total_igst'] ?? 0) > 0)
        <tr>
            <td class="label">IGST:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['total_igst'], 2) }}</td>
        </tr>
        @endif
        @if(($order['total_gst'] ?? 0) > 0)
        <tr>
            <td class="label"><strong>Total GST:</strong></td>
            <td class="text-right"><strong>{{ $currency }}{{ number_format($order['total_gst'], 2) }}</strong></td>
        </tr>
        @endif
        @if(($order['delivery_charge'] ?? 0) > 0)
        <tr>
            <td class="label">Shipping:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['delivery_charge'], 2) }}</td>
        </tr>
        @endif
        @if(($order['handling_charges'] ?? 0) > 0)
        <tr>
            <td class="label">Handling:</td>
            <td class="text-right">{{ $currency }}{{ number_format($order['handling_charges'], 2) }}</td>
        </tr>
        @endif
        @if(($order['promo_discount'] ?? 0) > 0)
        <tr>
            <td class="label">Promo ({{ $order['promo_code'] ?? '' }}):</td>
            <td class="text-right">- {{ $currency }}{{ number_format($order['promo_discount'], 2) }}</td>
        </tr>
        @endif
        @if(($order['wallet_balance'] ?? 0) > 0)
        <tr>
            <td class="label">Wallet Used:</td>
            <td class="text-right">- {{ $currency }}{{ number_format($order['wallet_balance'], 2) }}</td>
        </tr>
        @endif
        <tr class="grand">
            <td class="label grand">Amount Payable:</td>
            <td class="text-right grand">{{ $currency }}{{ number_format($order['total_payable'], 2) }}</td>
        </tr>
    </table>

    {{-- Signatory --}}
    <div class="clearfix" style="margin-top:30px;">
        <div class="signatory">
            @if(!empty($systemSettings['adminSignature']))
                <img src="{{ $systemSettings['adminSignature'] }}" style="max-height:60px; max-width:180px;">
            @else
                <div style="height:50px;"></div>
            @endif
            <div class="signatory-line">Authorized Signatory</div>
        </div>
    </div>

    <div class="footer-note">
        Thank you for shopping with {{ $systemSettings['appName'] }}!
        @if(!empty($systemSettings['sellerSupportEmail']))
            &nbsp;|&nbsp; {{ $systemSettings['sellerSupportEmail'] }}
        @endif
        <br>{{ $systemSettings['copyrightDetails'] ?? '' }}
    </div>

    {{-- ══ STORE-WISE DETAILED INVOICES ════════════════════════════════════ --}}
    @foreach($sellerOrder as $vendor)
        @php $store = $vendor['items'][0]['orderItem']['store'] ?? null; @endphp

        <div class="page-break"></div>

        <h2 class="text-center">TAX INVOICE</h2>
        <p class="text-center" style="font-size:10px; margin-bottom:10px;">
            Supply Type:
            @if($isIntra)
                <span class="badge-intra">Intra-State (CGST + SGST)</span>
            @else
                <span class="badge-inter">Inter-State (IGST)</span>
            @endif
        </p>

        <table class="header-table">
            <tr>
                {{-- Seller / Store --}}
                <td style="border:1px solid #ccc; border-radius:4px;">
                    <strong>Sold by:</strong> {{ $store['name'] ?? ($vendor['seller']['stores'][0]['name'] ?? 'N/A') }}<br>
                    @if($store)
                        {{ $store['address'] ?? '' }}
                        @if(!empty($store['landmark'])), {{ $store['landmark'] }}@endif<br>
                        {{ $store['city'] ?? '' }}, {{ $store['state'] ?? '' }}
                        @if(!empty($store['zipcode'])) - {{ $store['zipcode'] }}@endif<br>
                        {{ $store['country'] ?? '' }}<br>
                    @endif
                    @if(!empty($store['gstin']))
                        <strong>GSTIN:</strong> {{ $store['gstin'] }}<br>
                    @else
                        Tax No: {{ $store['tax_number'] ?? 'N/A' }}<br>
                    @endif
                    @if(!empty($store['state_code']))
                        State Code: {{ $store['state_code'] }}
                    @endif
                </td>

                {{-- Invoice Meta --}}
                <td style="border:1px solid #ccc; border-radius:4px;">
                    <strong>Invoice #:</strong> {{ $order['uuid'] }}<br>
                    <strong>Order Date:</strong> {{ $order['created_at']->format('d M Y H:i') }}<br>
                    <strong>Payment:</strong> {{ strtoupper(str_replace('_',' ',$order['payment_method'] ?? 'N/A')) }}<br>
                    @if(!empty($order['customer_state']))
                        <strong>Ship-to State:</strong> {{ $order['customer_state'] }}
                        ({{ $order['customer_state_code'] ?? '' }})
                    @endif
                </td>

                {{-- Buyer --}}
                <td style="border:1px solid #ccc; border-radius:4px;">
                    <strong>Bill To:</strong><br>
                    {{ $order['shipping_name'] }}<br>
                    {{ $order['shipping_address_1'] }}<br>
                    {{ $order['shipping_city'] }}, {{ $order['shipping_state'] }} - {{ $order['shipping_zip'] }}<br>
                    Phone: {{ $order['shipping_phone'] }}
                </td>
            </tr>
        </table>

        {{-- Line Items --}}
        <div class="section-title">Items</div>
        <table>
            <thead>
            <tr>
                <th style="width:22%">Item</th>
                <th style="width:8%">HSN</th>
                <th style="width:5%">Qty</th>
                <th style="width:9%">Unit Price</th>
                <th style="width:9%">Taxable Amt</th>
                <th style="width:6%">GST%</th>
                @if($isIntra)
                    <th style="width:7%">CGST</th>
                    <th style="width:7%">SGST</th>
                @else
                    <th style="width:10%">IGST</th>
                @endif
                <th style="width:9%">Tax Amt</th>
                <th style="width:9%">Total</th>
            </tr>
            </thead>
            <tbody>
            @foreach($vendor['items'] as $item)
                @php
                    $oi         = $item['orderItem'];
                    $qty        = (float)($item['quantity'] ?? 1);
                    $taxableAmt = (float)($oi['taxable_amount']   ?? ($item['price'] * $qty));
                    $gstRate    = (float)($oi['gst_rate']         ?? 0);
                    $cgst       = (float)($oi['cgst_amount']      ?? 0);
                    $sgst       = (float)($oi['sgst_amount']      ?? 0);
                    $igst       = (float)($oi['igst_amount']      ?? 0);
                    $totalTax   = (float)($oi['total_tax_amount'] ?? ($cgst + $sgst + $igst));
                    $lineTotal  = $taxableAmt + $totalTax;
                    $hsn        = $oi['hsn_code'] ?? ($item['product']['hsn_code'] ?? '—');
                @endphp
                <tr>
                    <td>{{ $item['product']['title'] }}<br>
                        <small style="color:#666;">{{ $item['variant']['title'] ?? '' }}</small>
                    </td>
                    <td>{{ $hsn }}</td>
                    <td class="text-center">{{ $qty }}</td>
                    <td class="text-right">{{ $currency }}{{ number_format($item['price'], 2) }}</td>
                    <td class="text-right">{{ $currency }}{{ number_format($taxableAmt, 2) }}</td>
                    <td class="text-center">{{ $gstRate }}%</td>
                    @if($isIntra)
                        <td class="text-right">{{ $currency }}{{ number_format($cgst, 2) }}<br><small>({{ $gstRate/2 }}%)</small></td>
                        <td class="text-right">{{ $currency }}{{ number_format($sgst, 2) }}<br><small>({{ $gstRate/2 }}%)</small></td>
                    @else
                        <td class="text-right">{{ $currency }}{{ number_format($igst, 2) }}<br><small>({{ $gstRate }}%)</small></td>
                    @endif
                    <td class="text-right">{{ $currency }}{{ number_format($totalTax, 2) }}</td>
                    <td class="text-right"><strong>{{ $currency }}{{ number_format($lineTotal, 2) }}</strong></td>
                </tr>
            @endforeach
            </tbody>
            <tfoot>
            <tr>
                <td colspan="{{ $isIntra ? 9 : 8 }}" class="text-right"><strong>Store Total:</strong></td>
                <td class="text-right"><strong>{{ $currency }}{{ number_format($vendor['total_price'], 2) }}</strong></td>
            </tr>
            </tfoot>
        </table>

        {{-- Store signatory --}}
        <div class="clearfix" style="margin-top:30px;">
            <div class="signatory">
                @if(!empty($vendor['seller']['authorized_signature']))
                    <img src="{{ $vendor['seller']['authorized_signature'] }}" style="max-height:60px; max-width:180px;">
                @else
                    <div style="height:50px;"></div>
                @endif
                <div class="signatory-line">Authorized Signatory</div>
            </div>
        </div>

        <div class="footer-note">
            {{ $systemSettings['appName'] }} &nbsp;|&nbsp; {{ $systemSettings['copyrightDetails'] ?? '' }}
        </div>
    @endforeach

</div>
</body>
</html>
