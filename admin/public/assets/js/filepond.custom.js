document.addEventListener('DOMContentLoaded', () => {
    $(function () {
        const normalizeLocalhostOrigin = (url) => {
            if (!url || typeof url !== 'string') return url;

            try {
                const parsed = new URL(url, window.location.origin);
                const isLoopback = ['localhost', '127.0.0.1'].includes(parsed.hostname);
                const currentIsLoopback = ['localhost', '127.0.0.1'].includes(window.location.hostname);

                if (isLoopback && currentIsLoopback) {
                    return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
                }

                return parsed.toString();
            } catch (_e) {
                return url;
            }
        };

        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateType);
        FilePond.registerPlugin(FilePondPluginFileValidateSize);
        // Initialize FilePond for serviceAccountFile
        const serviceAccountInput = document.querySelector('[name="serviceAccountFile"]');
        const serviceAccountUrl = serviceAccountInput
            ? normalizeLocalhostOrigin(serviceAccountInput.getAttribute('data-service-url'))
            : '';
        FilePond.create(serviceAccountInput, {
            allowImagePreview: false, // Disable image preview for non-image files
            credits: false, storeAsFile: true, acceptedFileTypes: ['application/json', 'text/plain'], // Adjust based on expected file types
            files: serviceAccountUrl ? [{
                source: serviceAccountUrl,
                options: {
                    type: 'remote'
                }
            }] : []
        });

        const systemUpdateInput = document.querySelector('[name="package"]');

        FilePond.create(systemUpdateInput, {
            allowImagePreview: false, // Disable image preview for non-image files
            credits: false,
            storeAsFile: true,
            acceptedFileTypes: [
                'application/zip',
                'application/x-zip-compressed',
                'multipart/x-zip',
            ],
            maxFileSize: '100MB',
            files: []
        })

        const filePondServerLoad = {
            load: (source, load, error, progress, abort) => {
                fetch(normalizeLocalhostOrigin(source))
                    .then(response => response.blob())
                    .then(blob => load(blob))
                    .catch(err => error(err));
                return { abort: () => {} };
            }
        };

        function initializeFilePond(inputName, allowFileTypes = ['image/*'], maxFileSize = null) {
            const input = document.querySelector(`[name="${inputName}"]`);
            if (!input) return;

            const imageUrl = normalizeLocalhostOrigin(input.getAttribute('data-image-url') || '');
            FilePond.create(input, {
                allowImagePreview: true,
                credits: false,
                storeAsFile: true,
                maxFileSize: maxFileSize,
                acceptedFileTypes: allowFileTypes,
                server: filePondServerLoad,
                files: imageUrl ? [{
                    source: imageUrl,
                    options: {type: 'local'}
                }] : []
            });
        }

        initializeFilePond('backgroundImage', ['image/jpeg','image/png','image/jpg','image/webp']);
        initializeFilePond('banner');
        initializeFilePond('profile_image');
        initializeFilePond('address_proof');
        initializeFilePond('voided_check');
        initializeFilePond('activeIcon');
        initializeFilePond('image');
        initializeFilePond('active_icon');
        initializeFilePond('icon');
        initializeFilePond('desktop_4k_background_image');
        initializeFilePond('desktop_fdh_background_image');
        initializeFilePond('tablet_background_image');
        initializeFilePond('mobile_background_image');
        initializeFilePond('product_video', ['video/mp4', 'video/mkv', 'video/webm'], '20MB');
        initializeFilePond('siteFavicon');
        initializeFilePond('siteHeaderDarkLogo');
        initializeFilePond('siteHeaderLogo');
        initializeFilePond('siteFooterLogo');
        initializeFilePond('banner_image');
        initializeFilePond('favicon', ['image/png']);
        initializeFilePond('logo');
        initializeFilePond('store_logo');
        initializeFilePond('store_banner');
        initializeFilePond('adminSignature')

        const input = document.querySelector(`[name="additional_images[]"]`);
        if (input) {
            const imagesJson = input.getAttribute('data-images');
            let imageUrls = [];
            if (imagesJson !== null && imagesJson !== '' && imagesJson !== undefined) {
                imageUrls = imagesJson ? JSON.parse(imagesJson).map(normalizeLocalhostOrigin) : [];
            }

            FilePond.create(input, {
                allowImagePreview: true,
                credits: false,
                storeAsFile: true,
                maxFileSize: '2MB',
                acceptedFileTypes: ['image/*'],
                server: filePondServerLoad,
                files: imageUrls.map(url => ({
                    source: url,
                    options: {
                        type: 'local'
                    }
                }))
            });
        }
    });
});
