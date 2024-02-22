// Get all cookies
let allCookies = document.cookie;

// Function to get a specific cookie
function getCookie(name) {
    var cookieArr = allCookies.split(";");

    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if the cookie wasn't found
    return null;
}


// getting user ID from cookie
let myID = getCookie('id');
// myID=myID.slice(3,myID.length-1)
console.log(myID)
if(!(myID)){
    window.location.href = "/login.html";
}

async function showDetails(){
    let user;
    try {
        const response = await fetch('/getuser');
        user = await response.json();
        console.log(user);
    } catch (error) {
        console.error(error);
        return;
    }
    //show all details in profile statics
    let candidateName=user.details.name
    let applied=user.details.Applied
    let processing=user.details.Processing
    let rejected=user.details.Rejected
    let total_applications=applied+processing+rejected
    document.querySelector('#candidate').innerHTML=`Candidate Name: ${candidateName}`
    document.querySelector('#applied').innerHTML=`Job Applied ${applied}`
    document.querySelector('#processing').innerHTML=`Under Procesing ${processing}`
    document.querySelector('#rejected').innerHTML=`Applications Rejected ${rejected}`
    document.querySelector('#totalApplications').innerHTML=`Total Jobs Applied ${total_applications}`
    document.querySelector('#display-welcome').innerHTML=`Welcome ${candidateName}`
}

showDetails()
getjobs()

//logout
async function logout() {
    try {
        const response = await fetch('/logout');
        const data = await response.json();
        console.log(data);
        location.reload();

    } catch (error) {
        console.error('Error:', error);
    }
}

//login
async function login() {
    try {
        let url = '/login';
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
        let data = {"email": email, "password": password};
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            let error = await response.json();
            document.getElementById('display-error').innerHTML = error.msg;
            return;
        }

        let responseData = await response.json();
        console.log('Success:', responseData);

    } catch (error) {
        console.error('Error:', error);
    }
}



//setting date to current date in form

const date = new Date();

const yyyy = date.getFullYear();
let mm = date.getMonth() + 1;
let dd = date.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const currentDate = yyyy + '-' + mm + '-' +  dd;

// This arrangement can be altered based on how we want the date's format to appear.
document.querySelector('#AppliedDate').value=currentDate


async function addjob() {
    try {
        if(CompanyName!=null & JobLink!=null){
            let CompanyName=document.querySelector('#CompanyName').value
            let JobLink=document.querySelector('#JobLink').value
            let AppliedDate=document.querySelector('#AppliedDate').value
            let Role = document.querySelector('#Role').value
            let Notes= document.querySelector('#Notes').value
            let Status="Applied"
            let data={CompanyName,JobLink,AppliedDate,Status,Role,Notes}
            //send a post re add

        let url = '/add';
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        let responseData = await response.json();
        console.log('Success:', responseData);
    }
    else{
        alert("Please fill details correctly!")
    }

    } catch (error) {
        console.error('Error:', error);
    }
}


//adding to tracker
let form=document.querySelector('#form')
form.addEventListener('submit',async(e)=>{
    e.preventDefault()
    await addjob()
    form.reset()
    document.querySelector('#AppliedDate').value=currentDate
    getjobs()
    }
)



async function updatejob(id) {
        try {
            let job_id = id
            let updateStatus = document.getElementById(`update-status-${job_id}`).value
            let updateNotes = document.getElementById(`update-notes-${job_id}`).value
            let url = `/update?job_id=${job_id}&updateStatus=${updateStatus}&updateNotes=${updateNotes}`;
            let response = await fetch(url, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                let error = await response.json();
                console.log(error)
            }
    
        let responseData = await response.json();
        console.log('Success:', responseData);
        let ele=document.getElementById(`${job_id}`)
        ele.classList.add('update_track');
        document.getElementById(job_id).style.display = 'none';
        getjobs()

        } catch (error) {
        console.error('Error:', error);
    }
}


function showupdate(job_id){
    document.getElementById(job_id).style.display = 'block';
}

//using this no need to refresh page
async function getjobs(){
        try {  
            let jobs;
            let url = `/search`
            const response = await fetch(url);
            jobs = await response.json();
            let displayjobs=document.querySelector('.display-jobs')
            displayjobs.style.visibility = jobs.length>0 ? "visible":"hidden"
            showJobs(jobs)
            showDetails()
        } catch (error) {
            console.error(error);
            return;
        }
}

async function search(){
    try {  
        let jobs;
        let CompanyName=document.querySelector('#search-bar').value
        let Role=document.querySelector('#search-bar').value
        let url = `/search?companyname=${CompanyName}&jobrole=${Role}`
        const response = await fetch(url);
        jobs = await response.json();
        showJobs(jobs)
    } catch (error) {
        console.error(error);
        return;
    }
}


function showJobs(jobs){
    console.log(jobs)
    //show according to search by default show all jobs
    let total_applications = document.querySelector('#ApplicationsList')
    total_applications.innerHTML = '';
    for(let i=0;i<jobs.length;i++){
        let div1=document.createElement('div');
        div1.setAttribute('class','company-name')
        div1.setAttribute('class','col-12 col-md-3')
        div1.innerHTML=`<h2>${jobs[i].CompanyName}</h2>`
        let div2= document.createElement('div')

        let data =`<p>Role :${jobs[i].Role}</p>
        <p>Status :${jobs[i].Status}</p>
        <p>Applied Date :${jobs[i].AppliedDate}</p>
        <p>Notes :${jobs[i].Notes}</p>
        <div class="update_track" id="${jobs[i]._id}" style="display: none;">
        <label for="update-notes-${jobs[i]._id}">Update Notes</label>
        <input class="form-control" type="text" id="update-notes-${jobs[i]._id}" placeholder="Ex: Selected for Next round of Interview"><br>
        <label for="update-status-${jobs[i]._id}">Update Status</label>
        <select class="form-select" id="update-status-${jobs[i]._id}" aria-label="Default select example">
            <option selected disabled value="">-- Change Track --</option>
            <option value="Applied">Applied</option>
            <option value="Processing">Under processing</option>
            <option value="Rejected">Rejected</option>
        </select>
        <br>
        <button class="btn btn-info" onclick='updatejob("${jobs[i]._id}")'>Save Changes</button>
        <br><br>
        </div>
        <div class="allbtns">
            <a class="btn btn-secondary" href='${jobs[i].JobLink}' target='_blank'>Job Link</a>
            <button class='editbtn btn btn-info' onclick='showupdate("${jobs[i]._id}")' >Edit</button>
            <button class='deletebtn btn btn-danger' onclick='deletejob("${jobs[i]._id}")'>Remove</button>
        </div><hr><br>`

            div2.innerHTML=data
            div1.appendChild(div2)
            total_applications.appendChild(div1)
        }
}

function loadjobs(){
    let loadjobs=document.querySelector('#loadjobs')
    loadjobs.classList.remove("load")
}
function loadjobsoff(){
    let loadjobs=document.querySelector('#loadjobs')
    loadjobs.classList.add("load")
}

let searchbar=document.querySelector('#search-bar')
searchbar.addEventListener('input',(e)=>{
    loadjobs()
    search()
    loadjobsoff()
})


//deleting job application
async function deletejob(job_id){
        try {
            let url = `/delete/${job_id}`;
            let response = await fetch(url);
            if (!response.ok) {
                let error = await response.json();
                document.getElementById('display-error').innerHTML = error.msg;
                return;
            }
    
            let responseData = await response.json();
            console.log('Success:', responseData);
            getjobs()
    
        } catch (error) {
            console.error('Error:', error);
        }

}
