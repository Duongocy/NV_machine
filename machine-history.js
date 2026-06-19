const machine_id = document.getElementById('machineId');
const record_btn = document.getElementById('record-btn');
const token = localStorage.getItem('token');

record_btn.addEventListener('click',function(e){
    e.preventDefault(); // Chặn trang web load lại
    machine = {};
    machine.id = machine_id.value;
    machine.nhanvien = sessionStorage.getItem('user_name');
    console.log(machine);

    //Gởi các thông tin record lên database
    let request_string = 'https://nv-machine-api.onrender.com/machinehistory';
    fetch(request_string, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // báo cho sever biết kiểu dữ liệu sẽ gởi đến
        'Authorization': `Bearer ${token}`
        // 'Authorization': `Bearer`
        },
        body: JSON.stringify(machine) // Chuyển đổi mảng thành chuỗi JSON
    })

    /////////////////////////////////////////////////////////////////////////
    // .then(function(response) {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(function (data) {
    //     //nếu lưu thành công
    //     alert("Lưu sự kiện thành công!");
    // })
    // .catch(function(error) {
    //     alert("Lưu sự kiện thất bại.");
    //     console.error('Error:', error.message); // In ra thông điệp lỗi
    // });
    /////////////////////////////////////////////////////////////////////////

    .then(function(response) {
    // Nếu phản hồi OK (200-299)
    if (response.ok) {
        return response.json();
    }

    // Nếu có lỗi (400, 404, 500...), ta đọc nội dung phản hồi từ Server
    // Server đang dùng res.send('Nội dung lỗi') hoặc res.json()
    return response.text().then(function(text) {
        // Kiểm tra xem Server gửi về chuỗi thuần túy hay JSON
        try {
            const errorObj = JSON.parse(text);
            throw new Error(errorObj.message || text);
        } catch (e) {
            // Nếu không phải JSON, dùng chính đoạn text đó làm thông báo lỗi
            throw new Error(text || 'Lỗi không xác định từ hệ thống');
        }
        });
    })
    ///////////////////////////////////////////////////////////
    .then(function (data) {
        console.log(data);
        // 1. Hiển thị thông tin cơ bản của máy vào vùng DIV
        displayMachineInfo(data);

        // 2. Hiển thị lịch sử bảo trì vào bảng
        displayMaintenanceHistory(data.history_records);

        // Báo thành công (nếu muốn)
        // alert("Đã tải lịch sử máy thành công!");
        })
    .catch(function (error) {
        alert("❌ Lỗi: " + error.message);
});

// --- CÁC HÀM PHỤ ĐỂ ĐỔ DỮ LIỆU LÊN GIAO DIỆN ---

// Hàm 1: Đổ thông tin máy vào DIV
function displayMachineInfo(machineData) {
    // Lấy các thẻ HTML
    const infoDisplay = document.getElementById('machine-info-display');
    const idSpan = document.getElementById('info-id');
    const nameSpan = document.getElementById('info-name');
    const dateSpan = document.getElementById('info-install-date');
    const areaSpan = document.getElementById('info-area');

    // Điền dữ liệu vào các thẻ
    idSpan.innerText = machineData.id;
    nameSpan.innerText = machineData.name;
    
    // Định dạng lại ngày lắp đặt (ISO -> Tiếng Việt)
    if (machineData.install_date) {
        dateSpan.innerText = new Date(machineData.install_date).toLocaleDateString('vi-VN');
    } else {
        dateSpan.innerText = "Chưa rõ";
    }
    
    areaSpan.innerText = machineData.area;

    // Hiển thị vùng DIV (sau khi đã điền đủ dữ liệu)
    infoDisplay.style.display = 'block';
}

// Hàm 2: Tạo các dòng bảng cho lịch sử bảo trì
function displayMaintenanceHistory(historyRecords) {
    // Lấy các thẻ HTML
    const tableContainer = document.getElementById('history-table-container');
    const tableBody = document.getElementById('history-table-body');
    const noHistoryMsg = document.getElementById('no-history-message');

    // Bước quan trọng: Xóa sạch dữ liệu cũ trong bảng (nếu có)
    tableBody.innerHTML = '';

    // Kiểm tra nếu mảng history_records rỗng (chưa có lần sửa nào)
    if (!historyRecords || historyRecords.length === 0) {
        tableBody.parentElement.style.display = 'none'; // Ẩn bảng
        noHistoryMsg.style.display = 'block';           // Hiện thông báo rỗng
    } else {
        tableBody.parentElement.style.display = 'table'; // Hiện bảng
        noHistoryMsg.style.display = 'none';            // Ẩn thông báo rỗng

        // Vòng lặp để tạo từng dòng (tr) cho bảng
        historyRecords.forEach(function (record) {
            // 1. Tạo một dòng (tr) mới
            const row = document.createElement('tr');

            // 2. Định dạng ngày sự kiện (chỉ lấy ngày/tháng/năm)
            const eventDateFormatted = new Date(record.event_date).toLocaleDateString('vi-VN');

            // 3. Tạo nội dung cho các ô (td) bằng Template Literal (`)
            row.innerHTML = `
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${eventDateFormatted}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${record.cause}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${record.solution}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${record.pic || record.nhanvien}</td>
            `;
            // 4. Thêm dòng vừa tạo vào thân bảng (tbody)
            tableBody.appendChild(row);
        });
    }
    // Hiển thị khu vực bảng (sau khi đã xử lý xong)
    tableContainer.style.display = 'block';
}
    ///////////////////////////////////////////////////////////
})

// --- ĐOẠN CODE TỰ ĐỘNG LẤY ID TỪ URL VÀ TRA CỨU ---
window.addEventListener('DOMContentLoaded', function() {
    // 1. Phân tích URL để lấy tham số 'id'
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');

    // 2. Nếu tìm thấy ID trên URL và các thẻ HTML cần thiết tồn tại
    if (idFromUrl && machine_id && record_btn) {
        // Tự động điền ID vào ô input tra cứu
        machine_id.value = idFromUrl;
        
        // Tự động kích hoạt sự kiện click vào nút "Xem lịch sử"
        record_btn.click();
    }
});