document.addEventListener("DOMContentLoaded",function(){
    const studentSubmit=document.getElementById("studentLogin")
    studentSubmit.addEventListener("click",function () {
        window.location.href = "/HTML/studentLogin.html"; 
    });
    const teacherSubmit=document.getElementById("teacherLogin")
    teacherSubmit.addEventListener("click",function () {
        window.location.href = "/HTML/teacherLogin.html";
    });
    const adminSubmit=document.getElementById("adminLogin")
    adminSubmit.addEventListener("click",function () {
        window.location.href = "/HTML/adminLogin.html";
    });

})
