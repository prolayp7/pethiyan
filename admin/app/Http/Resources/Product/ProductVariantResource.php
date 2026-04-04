<?php

namespace App\Http\Resources\Product;

use App\Services\CurrencyService;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray($request): array
    {
        // Format attributes as key-value pairs
        $attributes = [];

        // Try to get the variant attributes directly from the variant
        if ($this->relationLoaded('attributes')) {
            foreach ($this->attributes as $attribute) {
                if ($attribute->attribute && $attribute->attributeValue) {
                    $attributeSlug = $attribute->attribute->slug;
                    $attributeValue = $attribute->attributeValue->title;
                    $attributes[$attributeSlug] = $attributeValue;
                }
            }
        } else {
            // If attributes aren't loaded, load them now
            $this->load(['attributes.attribute', 'attributes.attributeValue']);

            foreach ($this->attributes as $attribute) {
                if ($attribute->attribute && $attribute->attributeValue) {
                    $attributeSlug = $attribute->attribute->slug;
                    $attributeValue = $attribute->attributeValue->title;
                    $attributes[$attributeSlug] = $attributeValue;
                }
            }
        }

        $cartItem = $this->isInUserCart();
        $currency = app(CurrencyService::class);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'image' => $this->image ?? '',
            'weight' => (float)$this->weight ?? 0,
            'height' => (float)$this->height ?? 0,
            'breadth' => (float)$this->breadth ?? 0,
            'length' => (float)$this->length ?? 0,
            'availability' => $this->availability,
            'cart_item' => $cartItem,
            'barcode' => $this->barcode,
            'is_default' => $this->is_default,
            'price' => $this->storeProductVariants->first()->price ?? null,
            'special_price' => $this->storeProductVariants->first()->special_price ?? null,
            'store_id' => $this->storeProductVariants->first()->store_id ?? null,
            'store_slug' => $this->storeProductVariants->first()->store->slug ?? null,
            'store_name' => $this->storeProductVariants->first()->store->name ?? null,
            'stock' => $this->storeProductVariants->first()->stock ?? null,
            'sku' => $this->storeProductVariants->first()->sku ?? null,
            'currency_symbol' => $currency->getSymbol(),
            'currency_code' => $currency->getCode(),
            'attributes' => $attributes,
        ];
    }
}
