const user_id = sessionStorage.getItem('user_id');
const user_name = sessionStorage.getItem('user_name');
const machine_head = document.getElementById('machineHead');
const record_machine_event_btn = document.getElementById('btn01');
const add_machine_btn = document.getElementById('btn04');
const history_machine_btn = document.getElementById('btn03');
const maintenance_machine_btn = document.getElementById('btn02');



machine_head.textContent = `NV machine - ${user_id} - ${user_name}`

record_machine_event_btn.addEventListener('click', function(){
    window.location.href = 'machine-record.html'; // Chuyển hướng đến trang ghi sự kiện máy

})

add_machine_btn.addEventListener('click', function(){
    window.location.href = 'add-machine.html'; // Chuyển hướng đến trang ghi sự kiện máy

})

history_machine_btn.addEventListener('click', function(){
    window.location.href = 'machine-history.html'; // Chuyển hướng đến trang ghi sự kiện máy

})

maintenance_machine_btn.addEventListener('click', function(){
    window.location.href = 'maintenance-schedule.html'; // Chuyển hướng đến trang ghi sự kiện máy

})