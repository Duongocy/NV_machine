const token = localStorage.getItem('token');

// 1. Gọi API lấy danh sách máy
// Thông thường lấy danh sách sẽ dùng phương thức GET
let request_string = 'https://nv-machine-api.onrender.com/machine-list'; 

fetch(request_string, {
    method: 'POST', // Hoặc 'POST' tùy vào cấu hình Server của bạn
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then(function(response) {
    if (response.ok) {
        return response.json();
    }
    return response.text().then(function(text) {
        try {
            const errorObj = JSON.parse(text);
            throw new Error(errorObj.message || text);
        } catch (e) {
            throw new Error(text || 'Lỗi không xác định từ hệ thống');
        }
    });
})
.then(function(data) {
    console.log("Danh sách máy nhận được:", data);
    displayMachineList(data);
})
.catch(function(error) {
    alert("❌ Không thể lấy danh sách máy: " + error.message);
    console.error('Chi tiết lỗi:', error.message);
});

////////////////////////////////////////////////////
// 2. Hàm hiển thị danh sách máy ra màn hình
function displayMachineList(machines) {
    // Giả sử bạn có một tbody với id là 'machine-list-body'
    const listBody = document.getElementById('machine-list-body');
    
    if (!listBody) return;

    // Xóa nội dung cũ trước khi chèn mới
    listBody.innerHTML = '';

    // Duyệt qua mảng machines để tạo các dòng <tr>
    // index + 1 dùng để làm Số Thứ Tự (STT)
    listBody.innerHTML = machines.map((m, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${m.machine_name}</td>
            <td> <a href="machine-history.html?id=${encodeURIComponent(m.machine_id)}" style="color: #007bff; font-weight: bold; text-decoration: none;">
                    ${m.machine_id}
            </a> </td>
            <td>${m.acc_num}</td>
            <td>${m.installation_area}</td>
        </tr>
    `).join('');
}