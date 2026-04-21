const token = localStorage.getItem('token');

    //Gởi các thông tin record lên database
    let request_string = 'https://nv-machine-api.onrender.com/maintenance-schedule';
    fetch(request_string, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // báo cho sever biết kiểu dữ liệu sẽ gởi đến
        'Authorization': `Bearer ${token}`
        // 'Authorization': `Bearer`
        }
    })

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
    .then(function(data) {
        alert("✅ Mời bạn xem lịch bảo trì!");
        console.log("Dữ liệu đã lưu:", data);
        displayMaintenanceReport(data);
    })
    .catch(function(error) {
        // Ở đây, error.message chính là "Không tìm thấy tên máy" hoặc "Mã máy không tồn tại"
        // mà Server đã gửi về qua lệnh res.status(404).send(...)
        alert("❌ Thất bại: " + error.message);
        console.error('Chi tiết lỗi:', error.message);
    });

////////////////////////////////////////////////////
function displayMaintenanceReport(report) {
    // 1. Hiển thị máy hôm nay
    const todayDiv = document.getElementById('today-body');
    todayDiv.innerHTML = report.today.map(m => `
        <tr>
            <td>${m.machine_id}</td>
            <td>${m.machine_name}</td>
            <td>${m.installation_area}</td>
        </tr>
    `).join('');

    // 2. Hiển thị máy trong 7 ngày tới (Sắp xếp 1 -> 7)
    const upcomingTable = document.getElementById('upcoming-body');
    upcomingTable.innerHTML = report.upcoming.map(m => `
        <tr>
            <td>${m.machine_id}</td>
            <td>${m.machine_name}</td>
            <td>Khu vực ${m.installation_area}</td>
            <td style="color: blue;">Còn ${m.day_offset} ngày nữa</td>
        </tr>
    `).join('');

    // 3. Hiển thị máy quá hạn trong 7 ngày qua (Sắp xếp -1 -> -7)
    const pastTable = document.getElementById('past-body');
    pastTable.innerHTML = report.past.map(m => `
        <tr>
            <td>${m.machine_id}</td>
            <td>${m.machine_name}</td>
            <td>${m.installation_area}</td>
            <td style="color: red;"> ${Math.abs(m.day_offset)} ngày</td>
        </tr>
    `).join('');
}