// Burada nesne kullanmadan programı yazabiliriz ve güzelde çalışır.
// Ama dikkat etmemiz gereken şey daha sonra veritabanı eklendiğinde bunu
// yönetebilmemiz için nesne tabanlı yazmalıyız ve bunu kontrol etmeliyiz..
//veritabanıdan gelen objeleri html etiketleri içerisine aktarmak için bu şekilde tasarlamalıyız..

class Course{
    constructor(title,instructor,image){
        this.id=Math.floor(Math.random()*1000);
        this.title=title;
        this.instructor=instructor;
        this.image=image;
    }
}

// Local Storage için class olusturuyoruz ve bunu instance üzerinden değil
// direket olarak nesne üzerinden ulaşacağız..bunun için static methotlar kullanacağız

class Storage{
    static getCourses(){
        let courses;
        if (localStorage.getItem("courses")===null){
            courses=[];
        }else{
            courses=JSON.parse(localStorage.getItem("courses"));
        }
        return courses;
    }
    static showCourses(){
        let courses=Storage.getCourses();
        courses.forEach(element => {
            let ui=new UI();
            ui.addCourseToList(element);
        });

    }
    static addCourse(course){
        let courses=Storage.getCourses();
        courses.push(course);
        localStorage.setItem("courses",JSON.stringify(courses));

    }
    static deleteCourse(target){
        let id=target.getAttribute("data-id");
        let courses=Storage.getCourses();
        courses.forEach((course,index) => {
            if(course.id==id){
            courses.splice(index,1);
            }
        });
        localStorage.setItem("courses",JSON.stringify(courses));
    }
}


// tasatım kolaylığı, erişim kolaylığı için fonksiyonları biryerde topluyoruz
// bunun için bir ui class oluşturuyoruz. herhangi bir işlem yamayacağız classla
// sadece gruplama yapmak için kullanacağız..

class UI{

    addCourseToList(course){
        let list=document.getElementById("table_body");
        let html=`<tr>
        <th><img src="image/${course.image}" alt=""></th>
        <th>${course.title}</th>
        <th>${course.instructor}</th>
        <th><button id="btn_delete" class="btn" data-id="${course.id}">Delete</button></th>
      </tr> `;
        list.innerHTML+=html;
    }
    clearControls(){
        document.getElementById("title").value="";
        document.getElementById("instructor").value="";
        document.getElementById("image").value="";
    }
    deleteCourseFromList(target){
        if(target.id=="btn_delete"){
           target.parentElement.parentElement.remove();
        }   
    }
}

//  start

// ilk html elementler yüklendiğinde ilk olarak storage da olan bilgiler 
// yüklenmeli..

document.addEventListener("DOMContentLoaded",Storage.showCourses);

// event listener
document.getElementById("btn_save").addEventListener("click",(e)=>{
    let title=document.getElementById("title").value;
    let instructor=document.getElementById("instructor").value;
    let image=document.getElementById("image").value;  

// create an course object
    let course=new Course(title,instructor,image);
    let ui=new UI();
    if(title==""||instructor==""||image==""){
        alert("Please complete all form!");
        ui.clearControls();
    }else{
 // burada static methodla farkı görebiliriz..
        ui.addCourseToList(course);
        Storage.addCourse(course);
        ui.clearControls();
       
    }
    e.preventDefault();
});

// event listener

document.getElementById("table_body").addEventListener("click",(e)=>{
    let ui=new UI();
    ui.deleteCourseFromList(e.target)
    Storage.deleteCourse(e.target);
    e.preventDefault();
});