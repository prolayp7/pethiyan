<?php

namespace App\Http\Requests\Category;

use App\Enums\Category\CategoryBackgroundTypeEnum;
use App\Enums\CategoryStatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled in the controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'parent_id' => 'nullable|integer|exists:categories,id',
            'title' => 'required|string|max:255|unique:categories,title,' . $this->route('id'),
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'icon' => 'nullable|mimes:jpeg,png,jpg,webp,svg',
            'active_icon' => 'nullable|mimes:jpeg,png,jpg,webp,svg',
            'background_type' => ['nullable', new Enum(CategoryBackgroundTypeEnum::class)],
            'background_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'font_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'background_image' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,webp|max:5120',
            'status' => ['nullable', new Enum(CategoryStatusEnum::class)],
            'requires_approval' => 'boolean',
            'commission' => 'nullable|numeric|min:0|max:100',
            'metadata' => 'nullable|array',
            'metadata.seo_title' => 'nullable|string|max:255',
            'metadata.seo_description' => 'nullable|string|max:500',
            'metadata.seo_keywords' => 'nullable|string|max:255',
            'is_indexable' => 'nullable|boolean',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'status'            => $this->status ?? CategoryStatusEnum::INACTIVE->value,
            'requires_approval' => false, // always auto-approved
            'commission'        => $this->commission !== '' ? $this->commission : null,
            'background_color'  => $this->background_color ?: null,
            'font_color'        => $this->font_color ?: null,
            'metadata'          => array_merge($this->metadata ?? [], [
                'seo_title'       => $this->input('seo_title') ?: null,
                'seo_description' => $this->input('seo_description') ?: null,
                'seo_keywords'    => $this->input('seo_keywords') ?: null,
            ]),
            'is_indexable' => $this->has('is_indexable') ? (bool)$this->input('is_indexable') : true,
        ]);
    }
}
