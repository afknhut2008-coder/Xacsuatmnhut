/**
 * MathLab 12B2 - Hệ thống xử lý toán học tối ưu
 * Thực hiện bởi Minh Nhựt
 */

document.addEventListener('input', (e) => {
    const targetId = e.target.id;
    const errorEl = document.getElementById('msg-error');
    if(errorEl) errorEl.innerText = ""; // Xóa lỗi cũ khi người dùng nhập mới

    // --- 1. LOGIC XÁC SUẤT THƯỜNG ---
    if (document.getElementById('pA')) {
        const pA = parseFloat(document.getElementById('pA').value) || 0;
        const pB = parseFloat(document.getElementById('pB').value) || 0;
        const mode = document.querySelector('input[name="mode"]:checked').value;
        const inAnB = document.getElementById('pAnB');
        let pAnB = parseFloat(inAnB.value) || 0;

        if (mode === 'xungkhac') { pAnB = 0; inAnB.value = 0; }
        else if (mode === 'doclap') { pAnB = pA * pB; inAnB.value = smartRound(pAnB); }

        setVal('resNotA', 1 - pA); 
        setVal('resNotB', 1 - pB); 
        setVal('resAorB', pA + pB - pAnB);
    }

    // --- 2. LOGIC TẦN SỐ ---
    if (document.getElementById('nOmega')) {
        const nO = parseFloat(document.getElementById('nOmega').value) || 0;
        const nA = parseFloat(document.getElementById('nA').value) || 0;
        const nB = parseFloat(document.getElementById('nB').value) || 0;
        const nAnB = parseFloat(document.getElementById('nAnB_f').value) || 0;
        if (nO > 0) {
            setVal('pA_f', nA / nO); 
            setVal('pB_f', nB / nO);
            const nU = nA + nB - nAnB;
            const elNU = document.getElementById('nU');
            if (elNU) elNU.innerText = nU;
            setVal('pU', nU / nO);
        }
    }

    // --- 3. LOGIC ĐIỀU KIỆN (MỤC TỐI ƯU) ---
    if (document.getElementById('cA')) {
        let pA = parseFloat(document.getElementById('cA').value) || 0;
        let pBgA = parseFloat(document.getElementById('cB_A').value) || 0;
        let pBgNotA = parseFloat(document.getElementById('cB_notA').value) || 0;

        try {
            if (targetId === 'pAgB_input') {
                const pAgB_val = parseFloat(e.target.value);
                if (!isNaN(pAgB_val)) {
                    const tu = pAgB_val * pBgNotA;
                    const mau = pBgA - pAgB_val * (pBgA - pBgNotA);
                    if (Math.abs(mau) > 1e-6) {
                        pA = Math.max(0, Math.min(1, tu / mau));
                        syncA(pA);
                    } else {
                        throw "Không thể tính ngược (Dữ liệu gây lỗi chia cho 0)";
                    }
                }
            } 
            else if (targetId === 'pBT_input') {
                const pB_target = parseFloat(e.target.value);
                if (!isNaN(pB_target)) {
                    if (Math.abs(pBgA - pBgNotA) > 1e-6) {
                        pA = Math.max(0, Math.min(1, (pB_target - pBgNotA) / (pBgA - pBgNotA)));
                        syncA(pA);
                    } else {
                        throw "Không thể tính ngược khi P(B|A) = P(B|A')";
                    }
                }
            } 
            else {
                // Nhập liệu thông thường
                if (targetId === 'cA') syncA(pA, false);
                if (targetId === 'cNotA') syncA(1 - parseFloat(e.target.value), true);
                
                // Tự động bù trừ nhánh B
                if (targetId === 'cB_A') document.getElementById('cNotB_A').value = smartRound(1 - pBgA);
                if (targetId === 'cNotB_A') document.getElementById('cB_A').value = smartRound(1 - parseFloat(e.target.value));
                if (targetId === 'cB_notA') document.getElementById('cNotB_notA').value = smartRound(1 - pBgNotA);
                if (targetId === 'cNotB_notA') document.getElementById('cB_notA').value = smartRound(1 - parseFloat(e.target.value));
            }

            // Cập nhật kết quả cuối
            const pBT = (pA * pBgA) + ((1 - pA) * pBgNotA);
            const pAgB = pBT > 0 ? (pA * pBgA) / pBT : 0;

            setVal('rAB', pA * pBgA);
            setVal('rAnBnot', pA * (1 - pBgA));
            setVal('rnotAB', (1 - pA) * pBgNotA);
            setVal('rnotAnBnot', (1 - pA) * (1 - pBgNotA));

            if (targetId !== 'pBT_input') document.getElementById('pBT_input').value = smartRound(pBT);
            if (targetId !== 'pAgB_input') document.getElementById('pAgB_input').value = smartRound(pAgB);

        } catch (err) {
            if(errorEl) errorEl.innerText = "⚠️ " + err;
        }
    }
});

// Hàm đồng bộ P(A) và P(A')
function syncA(val, updateMainInput = true) {
    const v = Math.max(0, Math.min(1, val));
    if (updateMainInput) document.getElementById('cA').value = smartRound(v);
    document.getElementById('cNotA').value = smartRound(1 - v);
}

// Hàm reset sơ đồ
function resetTree() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(i => i.value = "");
    const results = document.querySelectorAll('.neon-text, .emerald-text');
    results.forEach(r => r.innerText = "0");
    const errorEl = document.getElementById('msg-error');
    if(errorEl) errorEl.innerText = "";
}

// Làm tròn thông minh (ví dụ 0.6000 -> 0.6)
function smartRound(num) {
    return Math.round(num * 10000) / 10000;
}

// Hiển thị text lên màn hình
function setVal(id, v) { 
    const el = document.getElementById(id); 
    if (el) el.innerText = smartRound(v); 
}