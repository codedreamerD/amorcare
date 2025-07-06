// Scroll halus dan mencegah halaman balik ke atas saat klik menu nav
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.offcanvas .nav-link[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href').slice(1);
            var target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                // Tutup offcanvas menu
                var offcanvasEl = document.getElementById('offcanvasNavbar');
                var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (offcanvas) offcanvas.hide();
                // Scroll ke section yang dituju dengan halus, offset untuk navbar fixed
                setTimeout(function() {
                    var y = target.getBoundingClientRect().top + window.pageYOffset - 72;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }, 300); // Tunggu offcanvas tertutup dulu
            }
        });
    });
});

// Upload Image Skin Check form
document.getElementById('skinCheckForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const agree = document.getElementById('agreeTerms');
    if (!agree.checked) {
        alert('Kamu harus menyetujui Kebijakan Privasi dan Ketentuan Penggunaan.');
        return;
    }
    const fileInput = document.getElementById('skinImageInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Pilih gambar terlebih dahulu.');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar harus kurang dari 2MB.');
        return;
    }
    // Show loading
    document.getElementById('uploadBtnText').classList.add('d-none');
    document.getElementById('uploadLoading').classList.remove('d-none');
    // Simulasi upload
    setTimeout(function () {
        document.getElementById('uploadBtnText').classList.remove('d-none');
        document.getElementById('uploadLoading').classList.add('d-none');
        // Show kenalan modal
        var kenalanModal = new bootstrap.Modal(document.getElementById('kenalanModal'));
        kenalanModal.show();
    }, 1000);
});

// Preview image
document.getElementById('skinImageInput').addEventListener('change', function () {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '180px';
            img.className = 'mb-2 mt-2 rounded shadow';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('sendFeedbackBtn');
    const sendText = document.getElementById('sendFeedbackText');
    const sendLoading = document.getElementById('sendFeedbackLoading');
    const feedbackInput = document.getElementById('feedbackInput');
    const feedbackError = document.getElementById('feedbackError');

    sendBtn?.addEventListener('click', function() {
        const value = feedbackInput.value.trim();
        if (!value || value.length > 200) {
            feedbackInput.classList.add('is-invalid');
            feedbackError.style.display = 'block';
            feedbackInput.focus();
            return;
        }
        feedbackInput.classList.remove('is-invalid');
        feedbackError.style.display = 'none';
        sendBtn.disabled = true;
        sendLoading.classList.remove('d-none');
        sendText.textContent = 'Mengirim...';
        setTimeout(function() {
            sendBtn.disabled = false;
            sendLoading.classList.add('d-none');
            sendText.textContent = 'Kirim';
            feedbackInput.value = '';
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('feedbackThanksModal'));
            modal.show();
        }, 1500);
    });

    feedbackInput.addEventListener('input', function() {
        if (feedbackInput.value.trim().length > 0 && feedbackInput.value.trim().length <= 200) {
            feedbackInput.classList.remove('is-invalid');
            feedbackError.style.display = 'none';
        }
    });
});

// Gender selection
let selectedGender = null;
document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedGender = this.getAttribute('data-gender');
    });
});

// Skin condition selection
let selectedCond = null;
document.querySelectorAll('.skin-cond-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.skin-cond-card').forEach(c => c.classList.remove('active-cond'));
        this.classList.add('active-cond');
        selectedCond = this.getAttribute('data-cond');
    });
});

// Age validation
const ageInput = document.getElementById('userAgeInput');
const ageError = document.getElementById('ageError');
ageInput.addEventListener('input', function () {
    if (parseInt(this.value) >= 13) {
        ageError.classList.add('d-none');
    }
});

// Toggle detail collapse
document.getElementById('toggleSkinDetail').addEventListener('click', function () {
    const detail = document.getElementById('skinResultDetail');
    detail.classList.toggle('show');
    const icon = document.getElementById('chevronIcon');
    if (detail.classList.contains('show')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = '';
    }
});

// Submit modal with loading animation
document.getElementById('kenalanSubmitBtn').addEventListener('click', function () {
    const age = parseInt(ageInput.value);
    if (!selectedGender) {
        alert('Pilih jenis kelamin terlebih dahulu.');
        return;
    }
    if (!age || age < 13) {
        ageError.classList.remove('d-none');
        ageInput.focus();
        return;
    }
    if (!selectedCond) {
        alert('Pilih kondisi kulit terlebih dahulu.');
        return;
    }
    // Show loading overlay & button spinner
    document.getElementById('kenalanLoadingOverlay').style.display = 'flex';
    document.getElementById('kenalanSubmitBtn').disabled = true;
    document.getElementById('kenalanLoading').classList.remove('d-none');
    document.getElementById('kenalanSubmitText').textContent = 'Mendeteksi...';

    setTimeout(function () {
        // Hide loading overlay & reset button
        document.getElementById('kenalanLoadingOverlay').style.display = 'none';
        document.getElementById('kenalanSubmitBtn').disabled = false;
        document.getElementById('kenalanLoading').classList.add('d-none');
        document.getElementById('kenalanSubmitText').textContent = 'Submit dan Lanjutkan';

        // Tutup modal kenalan
        bootstrap.Modal.getInstance(document.getElementById('kenalanModal')).hide();

        // Isi data hasil sesuai pilihan
        const data = skinResultData[selectedCond] || skinResultData.normal;
        document.getElementById('skinResultImage').src = data.img;
        document.getElementById('skinResultImage').alt = data.label;
        document.getElementById('skinResultLabel').textContent = data.label;
        document.getElementById('skinResultTitle').textContent = data.title;
        document.getElementById('skinResultDescTips').innerHTML =
            `<div>${data.desc}</div><div class="mt-2"><span style="font-style:italic;">Tips:</span> ${data.tips.replace(/^Tips:\s*/, '')}</div>`;
        // Produk
        const recs = document.getElementById('skinProductRecs');
        recs.innerHTML = '';
        data.products.forEach(function (prod) {
            const card = document.createElement('div');
            card.className = 'card border-0 shadow-sm';
            card.style.width = '280px';
            card.style.background = '#FFFFFF';
            card.style.borderRadius = '12px';
            card.innerHTML = `
                <img src="${prod.img}" class="card-img-top" alt="${prod.name}" style="border-top-left-radius:12px; border-top-right-radius:12px;">
                <div class="card-body">
                    <div class="fw-semibold mb-1">${prod.name}</div>
                    <div class="small text-muted mb-4">${prod.brand}</div>
                    <div class="small">${prod.desc}</div>
                </div>
            `;
            recs.appendChild(card);
        });
        // Reset detail collapse
        document.getElementById('skinResultDetail').classList.remove('show');
        document.getElementById('chevronIcon').style.transform = '';
        // Show modal
        var resultModal = new bootstrap.Modal(document.getElementById('skinCheckResultModal'));
        resultModal.show();
    }, 7000);
});

// Dummy data for skin result
const skinResultData = {
    normal: {
        img: 'img/skin-normal.png',
        label: 'Kulit Normal',
        title: 'Kulit Normal',
        desc: 'Kulitmu seimbang, tidak terlalu berminyak atau kering. Pori-pori kecil dan jarang bermasalah.',
        tips: 'Tips: Gunakan pembersih lembut, pelembap ringan, dan sunscreen setiap hari.',
        products: [
            {
                img: 'img/fw-normal.png',
                name: 'Wardah Lightening Micellar Gentle Wash',
                brand: 'Facial Wash',
                desc: '<a href="https://www.wardahbeauty.com/id/product/face/lightening-micellar-gentle-wash" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/toner-normal.png',
                name: 'Wardah Lightening Face Toner',
                brand: 'Toner',
                desc: '<a href="https://www.wardahbeauty.com/id/product/skincare/wardah-lightening-face-toner" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/serum-normal.png',
                name: 'Wardah Crystal Secret 3% Tranexamic Complex α-Arbutin Dark Spot Corrector Serum',
                brand: 'Serum',
                desc: '<a href="http://sociolla.com/essence/8034-crystal-secret-3-tranexamic-complex-arbutin-dark-spot-corrector-serum" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/moist-normal.png',
                name: 'Wardah Crystal Secret Alpha Arbutin + 5% Niacinamide Hyperpigmentation Expert Day Moisturizer',
                brand: 'Moisturizer',
                desc: '<a href="https://www.sociolla.com/face-cream-lotion/10721-crystal-secret-arbutin-5-niacinamide-hyperpigmentation-expert-spf-35-pa-day-moisturizer" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/sunscreen-normal.png',
                name: 'Emina Sun Battle Bright Glow Honestly Comfy Brighten & Repair Barrier Airy Sun Protection SPF 35 PA+++',
                brand: 'Toner',
                desc: '<a href="https://www.sociolla.com/sunscreen/3587-sun-battle-bright-glow-honestly-comfy-brighten-and-repair-barrier-airy-sun-protection-spf-35-pa" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herb-normal.png',
                name: 'Masker Bengkoang',
                brand: 'Mengandung berbagai nutrisi penting, seperti serat, vitamin C, dan vitamin E.',
                desc: '<a href="https://www.alodokter.com/masker-bengkoang-inilah-6-manfaat-dan-cara-membuatnya" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herbs-normal.png',
                name: 'Lidah Buaya',
                brand: 'Melembapkan kulit, mengatasi iritasi kulit, mencegah dan meredakan gejala sunburn, dan mencegah penuaan dini di wajah.',
                desc: '<a href="https://www.alodokter.com/4-cara-memutihkan-wajah-dengan-lidah-buaya" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            }
        ]
    },
    dry: {
        img: 'img/skin-dry.png',
        label: 'Kulit Kering',
        title: 'Kulit Kering',
        desc: 'Kulitmu cenderung terasa kaku, bersisik, dan mudah iritasi. Perlu hidrasi ekstra.',
        tips: 'Tips: Pilih pembersih lembut, pelembap kaya, dan hindari air panas.',
        products: [
            {
                img: 'img/fw-dry.png',
                name: 'Wardah Perfect Bright Creamy Foam Bright + Oil Control',
                brand: 'Facial Wash',
                desc: '<a href="https://www.wardahbeauty.com/id/product/skincare/perfect-bright-creamy-foam-bright-oil-control" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/toner-dry.png',
                name: 'Wardah Nature Daily Hydramild Toner Essence',
                brand: 'Toner',
                desc: '<a href="https://www.wardahbeauty.com/id/product/skincare/wardah-nature-daily-hydramild-toner-essence" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/serum-dry.png',
                name: 'Labore Barrier Repair Serum',
                brand: 'Serum',
                desc: '<a href="https://www.laboreskinexpert.com/barrier-repair-serum.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/moist-dry.png',
                name: 'Wardah Nature Daily Aloe Hydramild Moisturizer Cream',
                brand: 'Moisturizer',
                desc: '<a href="https://www.wardahbeauty.com/id/product/skincare/wardah-nature-daily-aloe-hydramild-moisturizer-cream" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/sunscreen-dry.png',
                name: 'Emina Sun Battle Bright Glow Honestly Comfy Brighten & Repair Barrier Airy Sun Protection SPF 35 PA+++',
                brand: 'Toner',
                desc: '<a href="https://www.sociolla.com/sunscreen/3587-sun-battle-bright-glow-honestly-comfy-brighten-and-repair-barrier-airy-sun-protection-spf-35-pa" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herb-dry.png',
                name: 'Mentimun',
                brand: 'Mengandung air, vitamin A, vitamin C, asam folat, dan asam kafeat yang bersifat antioksidan dan antiradang.',
                desc: '<a href="https://www.siloamhospitals.com/informasi-siloam/artikel/manfaat-timun-untuk-wajah" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herbs-dry.png',
                name: 'Minyak Zaitun',
                brand: 'Mengandung antioksidan karena mengandung squalene, oleocanthal, dan vitamin E.',
                desc: '<a href="https://www.alodokter.com/manfaat-minyak-zaitun-untuk-wajah-dan-kulit-tubuh" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            }
        ]
    },
    oily: {
        img: 'img/skin-oily.png',
        label: 'Kulit Berminyak',
        title: 'Kulit Berminyak',
        desc: 'Kulitmu mudah berminyak, terutama di area T-zone. Pori-pori tampak besar.',
        tips: 'Tips: Gunakan pembersih berbusa, pelembap ringan, dan sunscreen bebas minyak.',
        products: [
            {
                img: 'img/fw-oily.png',
                name: 'Wardah Perfect Bright Creamy Foam Bright + Oil Control',
                brand: 'Facial Wash',
                desc: '<a href="https://www.wardahbeauty.com/id/product/skincare/perfect-bright-creamy-foam-bright-oil-control" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/toner-oily.png',
                name: 'Wardah Hydra Rose Petal Infused Toner',
                brand: 'Toner',
                desc: '<a href="https://www.wardahbeauty.com/en/product/skincare/wardah-hydra-rose-petal-infused-toner" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/serum-oily.png',
                name: 'LABORÉ Barrier Revive Serum',
                brand: 'Serum',
                desc: '<a href="https://www.laboreskinexpert.com/labore-barrier-revive-serum.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/moist-oily.png',
                name: 'Labore Barrier Revive Cream',
                brand: 'Moisturizer',
                desc: '<a href="https://www.laboreskinexpert.com/barrier-revive-cream.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/sunscreen-oily.png',
                name: 'LABORÉ Sensitive Skin Care BiomeProtect Physical Sunscreen',
                brand: 'Sunscreen',
                desc: '<a href="https://www.laboreskinexpert.com/biomeprotect-physical-sunscreen.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herb-oily.png',
                name: 'Oatmeal dan Madu',
                brand: 'Oatmeal memiliki efek antiinflamasi, kaya akan antioksidan, dan membantu meringankan banyak kondisi dermatologis. Sedangkan madu memiliki sifat antimikroba dan menghidrasi kulit serta menjaga kulit tetap sehat dan lembab.',
                desc: '<a href="https://www.haibunda.com/moms-life/20220524104932-72-274637/5-skincare-alami-untuk-merawat-kulit-berminyak-manfaatkan-madu-dan-oatmeal" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herbs-oily.png',
                name: 'Tomat',
                brand: 'Kandungan antioksidan likopennya bermanfaat untuk membantu melindungi dari kerusakan sel. Vitamin A dan vitamin C yang ada pada tomat juga baik untuk kesehatan kulit.',
                desc: '<a href="https://www.okadoc.com/id-id/blog/kecantikan/masker-alami-untuk-kulit-berminyak" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            }
        ]
    },
    acne: {
        img: 'img/skin-acne.png',
        label: 'Kulit Berjerawat',
        title: 'Kulit Berjerawat',
        desc: 'Kulitmu rentan berjerawat, komedo, dan kemerahan. Perlu perawatan khusus.',
        tips: 'Tips: Pilih produk non-komedogenik, gunakan spot treatment, dan jangan lupa sunscreen.',
        products: [
            {
                img: 'img/fw-acne.png',
                name: 'Labore Mild Cleanser',
                brand: 'Facial Wash',
                desc: '<a href="https://www.laboreskinexpert.com/mild-cleanser.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/toner-acne.png',
                name: 'Wardah Hydra Rose Petal Infused Toner',
                brand: 'Toner',
                desc: '<a href="https://www.wardahbeauty.com/en/product/skincare/wardah-hydra-rose-petal-infused-toner" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/serum-acne.png',
                name: 'LABORÉ Sensitive Skin Care Intensive Acne Serum',
                brand: 'Serum',
                desc: '<a href="https://www.laboreskinexpert.com/labore-sensitive-skin-care-intensive-acne-serum-20-ml.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/moist-acne.png',
                name: 'Labore Barrier Revive Cream',
                brand: 'Moisturizer',
                desc: '<a href="https://www.laboreskinexpert.com/barrier-revive-cream.html" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/sunscreen-acne.png',
                name: 'Emina Sun Battle Bright Glow Honestly Comfy Brighten & Repair Barrier Airy Sun Protection SPF 35 PA+++',
                brand: 'Toner',
                desc: '<a href="https://www.sociolla.com/sunscreen/3587-sun-battle-bright-glow-honestly-comfy-brighten-and-repair-barrier-airy-sun-protection-spf-35-pa" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herb-acne.png',
                name: 'Teh Hijau',
                brand: 'Vitamin B, vitamin C, vitamin E, kalsium, magnesium, zinc, serta antioksidan polifenol dan EGCG (epigallocatechin gallateI) yang terkandung di dalamnya.',
                desc: '<a href="https://www.alodokter.com/mengenal-manfaat-teh-hijau-untuk-kecantikan" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            },
            {
                img: 'img/herbs-acne.png',
                name: 'Tea Tree Oil',
                brand: 'Mengandung antiinflamasi dan antimikroba yang mengatasi kemerahan, kulit bengkak, hingga mencegah dan meredakan jerawat.',
                desc: '<a href="https://www.wardahbeauty.com/en/news/apa-itu-tea-tree-oil-ternyata-cocok-untuk-oily-dan-acne-prone-skin" target="_blank" style="color:#508D69;text-decoration:underline;">Kunjungi →</a>'
            }
        ]
    }
};

// Close skin check result modal and reload page
document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('skinCheckResultCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeBtn.style.animation = 'bounceOut 0.5s forwards';
            setTimeout(() => {
                window.location.reload();
            }, 480);
        });
    }
});