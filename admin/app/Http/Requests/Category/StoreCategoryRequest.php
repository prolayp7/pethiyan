<?php

namespace App\Http\Requests\Category;

use App\Enums\Category\CategoryBackgroundTypeEnum;
use App\Enums\CategoryStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreCategoryRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'parent_id' => 'nullable|integer|exists:categories,id',
            'title' => 'required|string|max:255|unique:categories,title',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg',
            'active_icon' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg',
            'background_type' => ['nullable', new Enum(CategoryBackgroundTypeEnum::class)],
            'background_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'background_image' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,webp|max:5120',
            'font_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'status' => ['nullable', new Enum(CategoryStatusEnum::class)],
            'requires_approval' => 'boolean',
            'commission' => 'nullable|numeric|min:0|max:100',
            'meta_title' => 'nullable|string|max:255',
            'meta_keywords' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'status'             => $this->status ?? CategoryStatusEnum::INACTIVE->value,
            'requires_approval'  => false, // always auto-approved
            'commission'         => $this->commission !== '' ? $this->commission : null,
            'background_color'   => $this->background_color ?: null,
            'font_color'         => $this->font_color ?: null,
        ]);
    }
}
