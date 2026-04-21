const machine_id = document.getElementById('machine-id');
const cause = document.getElementById('cause');
const action  = document.getElementById('action');
const replacement_part = document.getElementById('replacement-part');
const record_btn = document.getElementById('record-btn');
const token = localStorage.getItem('token');

record_btn.addEventListener('click',function(e){
    e.preventDefault(); // Chặn trang web load lại
    mc_id = machine_id.value;
    nguyen_nhan=cause.value;
    giai_phap = action.value;
    thay_the = replacement_part.value;
    su_kien_may={};
    su_kien_may.machineid = mc_id;
    su_kien_may.nguyennhan = nguyen_nhan;
    su_kien_may.giaiphap = giai_phap;
    su_kien_may.replacementpart = thay_the;
    const now = new Date();
    su_kien_may.thoigian = now.toISOString();
    su_kien_may.nhanvien = sessionStorage.getItem('user_name');
    console.log(su_kien_may);

    //Gởi các thông tin record lên database
    let request_string = 'https://nv-machine-api.onrender.com/saveevent';
    fetch(request_string, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // báo cho sever biết kiểu dữ liệu sẽ gởi đến
        'Authorization': `Bearer ${token}`
        // 'Authorization': `Bearer`
        },
        body: JSON.stringify(su_kien_may) // Chuyển đổi mảng thành chuỗi JSON
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
        alert("✅ Lưu sự kiện thành công!");
        console.log("Dữ liệu đã lưu:", data);
    })
    .catch(function(error) {
        // Ở đây, error.message chính là "Không tìm thấy tên máy" hoặc "Mã máy không tồn tại"
        // mà Server đã gửi về qua lệnh res.status(404).send(...)
        alert("❌ Thất bại: " + error.message);
        console.error('Chi tiết lỗi:', error.message);
});
})