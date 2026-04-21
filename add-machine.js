const machine_id = document.getElementById('machineId');
const machine_name = document.getElementById('machineName');
const machine_model  = document.getElementById('machineModel');
const checking_cycle = document.getElementById('checkingCycle');
const machine_maker = document.getElementById('machineMaker');
const installation_area = document.getElementById('installationArea');
const record_btn = document.getElementById('record-btn');
const token = localStorage.getItem('token');

record_btn.addEventListener('click',function(e){
    e.preventDefault(); // Chặn trang web load lại
    machine = {};
    machine.id = machine_id.value;
    machine.name = machine_name.value;
    machine.model = machine_model.value;
    machine.checkingcycle = checking_cycle.value;
    machine.maker = machine_maker.value;
    machine.area = installation_area.value;
    const now = new Date();
    // Trả về dạng: "2026-03-28T09:19:22.000Z"
    machine.installationtime = now.toISOString();
    machine.nhanvien = sessionStorage.getItem('user_name');
    console.log(machine);

    //Gởi các thông tin record lên database
    let request_string = 'http://localhost:3001/addmachine';
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
    .then(function(data) {
        alert("✅ Thêm máy thành công!");
        console.log("Dữ liệu đã lưu:", data);
    })
    .catch(function(error) {
        // Ở đây, error.message chính là "Không tìm thấy tên máy" hoặc "Mã máy không tồn tại"
        // mà Server đã gửi về qua lệnh res.status(404).send(...)
        alert("❌ Thất bại: " + error.message);
        console.error('Chi tiết lỗi:', error.message);
    });
})