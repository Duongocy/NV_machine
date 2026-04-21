//Khai báo các phần tử html
const login_button = document.getElementById("login-button");
const input_name = document.getElementById("input-name");
const input_pass = document.getElementById("input-pass");

//Biến login_status để lưu trạng thái người dùng muốn đăng nhập hay đăng ký new user
let login_status = true; //true = đăng nhập

//Tạo user mới 
login_button.addEventListener('click', async function (event) {
    event.preventDefault(); //ngăn chặn việc trình duyệt của iphone đòi lưu mật khẩu
    if (input_name.checkValidity() && input_pass.value.length > 0 && login_status) {
        //Trường họp yêu cầu của client là login 
        console.log("Đăng nhập..");
        login_button.style.backgroundColor = "yellow";
        login_button.style.color = "blue";
        login_button.textContent = "Signin..";
        const ten_dang_nhap = input_name.value;
        const pass_dang_nhap = input_pass.value;
        try { 
            const phan_hoi_tu_api = await fetch('http://localhost:3001/login?kieuyeucau=dangnhap', {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json'
                        },
                body: JSON.stringify({ ten: ten_dang_nhap, password: pass_dang_nhap }) // Chuyển đổi mảng thành chuỗi JSON
            }); //gởi tên đó đến API   
            if (!phan_hoi_tu_api.ok) {
                throw new Error(`lỗi HTTP : ${phan_hoi_tu_api.status}`);
            }
            else {
                const data = await phan_hoi_tu_api.json(); //nhận lại phản hồi từ api  
                // console.log("Token nhận từ api nè :", data.token);                             
                console.log("ID : ", data.data.id);
                login_button.style.backgroundColor = "aqua";
                login_button.style.color = "white";
                login_button.textContent = "Sign In";
                localStorage.setItem('token', data.token);// Lưu JWT vào local storage   
                sessionStorage.setItem('user_id', data.data.id);//gán giá trị id cho biến user_id và truyền đến phiên làm việc để trang được điều hướng tiếp theo có thể truy cập
                sessionStorage.setItem('user_name', data.data.name);
                window.location.href = 'machine.html'; // Chuyển hướng đến trang hóa đơn
            }    
        }
        catch (loine) {
            console.error('Error fetching data:', loine);
            alert("Thông tin đăng nhập không đúng");
            login_button.style.backgroundColor = "aqua";
            login_button.style.color = "white";
            login_button.textContent = "Sign In";
        }
    }
    else {
        alert("Kiểm tra lại các thông tin.");
    }
})