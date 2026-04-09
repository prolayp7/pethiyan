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
        $rules = [
            'parent_id' => 'nullable|integer|exists:categories,id',
            'title' => 'required|string|max:255|unique:categories,title,' . $this->route('id'),
            'description' => 'nullable|string',
            'status' => ['nullable', new Enum(CategoryStatusEnum::class)],
            'requires_approval' => 'boolean',
            'commission' => 'nullable|numeric|min:0|max:100',
            'metadata' => 'nullable|array',
            'metadata.seo_title' => 'nullable|string|max:255',
            'metadata.seo_description' => 'nullable|string|max:500',
            'metadata.seo_keywords' => 'nullable|string|max:255',
            'is_indexable' => 'nullable|boolean',
        ];

        // Conditionally validate file fields only if a real file is uploaded
        $hasImage = $this->hasFile('image') && $this->file('image')->getSize() > 0;
        $rules['image'] = $hasImage ? 'image|mimes:jpeg,png,jpg,webp|max:10240' : 'nullable';

        $hasBanner = $this->hasFile('banner') && $this->file('banner')->getSize() > 0;
        $rules['banner'] = $hasBanner ? 'image|mimes:jpeg,png,jpg,webp|max:10240' : 'nullable';

        $hasIcon = $this->hasFile('icon') && $this->file('icon')->getSize() > 0;
        $rules['icon'] = $hasIcon ? 'mimes:jpeg,png,jpg,webp,svg' : 'nullable';

        $hasActiveIcon = $this->hasFile('active_icon') && $this->file('active_icon')->getSize() > 0;
        $rules['active_icon'] = $hasActiveIcon ? 'mimes:jpeg,png,jpg,webp,svg' : 'nullable';

        $hasBackgroundImage = $this->hasFile('background_image') && $this->file('background_image')->getSize() > 0;
        $rules['background_image'] = $hasBackgroundImage ? 'image|mimes:jpeg,png,jpg,webp|max:5120' : 'nullable';

        return $rules;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'status'            => $this->status ?? CategoryStatusEnum::INACTIVE->value,
            'requires_approval' => false, // always auto-approved
            'metadata'          => array_merge($this->metadata ?? [], [
                'seo_title'       => $this->input('seo_title') ?: null,
                'seo_description' => $this->input('seo_description') ?: null,
                'seo_keywords'    => $this->input('seo_keywords') ?: null,
            ]),
            'is_indexable' => $this->has('is_indexable') ? (bool)$this->input('is_indexable') : true,
        ]);
    }
}
