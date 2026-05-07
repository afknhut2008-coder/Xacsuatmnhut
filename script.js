/**
 * MathLab 12B2 - Hệ thống xử lý toán học tối ưu
 * Thực hiện bởi Minh Nhựt
 */

document.addEventListener('input', (e) => {
    const targetId = e.target.id;
    const errorEl = document.getElementById('prob-error');
    const okEl = document.getElementById('prob-ok');
    
    if (errorEl) errorEl.innerText = ""; 

    // --- 1. LOGIC XÁC SUẤT THƯỜNG (probability.html) ---
    if (document.getElementById('pA')) {
        let pA = parseFloat(document.getElementById('pA').value) || 0;
        let pB = parseFloat(document.getElementById('pB').value) || 0;
        let pAnB = parseFloat(document.getElementById('pAnB').value) || 0;
        const mode = document.querySelector('input[name="mode"]:checked').value;

        // Xử lý logic theo chế độ chọn
        if (mode === 'xungkhac') {
            pAnB = 0;
            document.getElementById('pAnB').value = 0;
        } else if (mode === 'doclap') {
            pAnB = pA * pB;
            document.getElementById('pAnB').value = smartRound(pAnB);
        }

        // Tính toán các giá trị phụ thuộc
        const pNotA = 1 - pA;
        const pNotB = 1 - pB;
        const pAuB = pA + pB - pAnB;

        // Cập nhật ngược lại các ô Input để đồng bộ (nếu người dùng nhập pA thì tự tính pNotA)
        if (targetId === 'pA') document.getElementById('pNotA').value = smartRound(pNotA);
        if (targetId === 'pNotA') {
            pA = 1 - (parseFloat(document.getElementById('pNotA').value) || 0);
            document.getElementById('pA').value = smartRound(pA);
        }
        if (targetId === 'pB') document.getElementById('pNotB').value = smartRound(pNotB);
        if (targetId === 'pNotB') {
            pB = 1 - (parseFloat(document.getElementById('pNotB').value) || 0);
            document.getElementById('pB').value = smartRound(pB);
        }

        // HIỂN THỊ KẾT QUẢ XUỐNG CÁC BOX (Sửa ID khớp với HTML)
        setVal('res-pA', pA);
        setVal('res-pB', pB);
        setVal('res-pNotA', pNotA);
        setVal('res-pNotB', pNotB);
        setVal('res-pAnB', pAnB);
        setVal('res-pAuB', pAuB);
        
        // Các công thức mở rộng
        setVal('res-pAnBnot', pA - pAnB);          // P(A ∩ B')
        setVal('res-pNotAnB', pB - pAnB);          // P(A' ∩ B)
        setVal('res-pNotAnBnot', 1 - pAuB);        // P(A' ∩ B')
        setVal('res-pAxB', (pA - pAnB) + (pB - pAnB)); // Hiệu xứng

        // Kiểm tra quan hệ thực tế
        const isXungKhac = pAnB === 0;
        const isDocLap = Math.abs(pAnB - (pA * pB)) < 1e-6;

        document.getElementById('res-xungkhac').innerText = isXungKhac ? "Có ✅" : "Không ❌";
        document.getElementById('res-doclap').innerText = isDocLap ? "Có ✅" : "Không ❌";
        
        document.getElementById('prob-status').innerText = "Đã cập nhật dữ liệu.";
    }

    // --- 2. LOGIC TẦN SỐ (Giữ nguyên cấu trúc cũ của bạn) ---
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
});

/**
 * Hàm Reset riêng cho trang Xác suất thường
 */
function resetProb() {
    const ids = ['pA', 'pB', 'pAnB', 'pNotA', 'pNotB', 'pAuB'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    
    const resSpans = document.querySelectorAll('.val');
    resSpans.forEach(span => span.innerText = "—");
    
    document.getElementById('prob-status').innerText = "Sẵn sàng nhận dữ liệu.";
}

function smartRound(num) {
    return Math.round(num * 10000) / 10000;
}

function setVal(id, v) { 
    const el = document.getElementById(id); 
    if (el) {
        el.innerText = smartRound(v); 
    }
}