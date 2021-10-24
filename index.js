var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const data = document.querySelector('#test')
const laoding = document.querySelector('#loading')
const updateDiv = document.querySelector('#updateDiv')
const getAllDataBtn = document.getElementById('getAllDataBtn')
const form_id = document.getElementById('form_id')

form_id.hidden = true;

var id;
let count = 0;
// data.innerHTML = `<h1>Hello Yan</h1>`

const insertData = () => {

 const raw = JSON.stringify({"first_name":"Yannick","last_name":"Loembet","email":"yannick@something.com","gender":"male","street_address":"21 ballon rd"});
 
 const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      

   fetch("https://apprentice-server.herokuapp.com/insert", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

const getAllData = async() => {
    console.log('clicked')
    laoding.innerHTML = 'Loading Data...'
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      if(count !== 1){
          fetch("https://apprentice-server.herokuapp.com/all", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
               let tableData = JSON.parse(result)
            //    console.log(data.length)
                // data.innerHTML = result
             tableData.map(async(field)=>{
                    let tableDetails = `
                    <tr>
                        <td>${field.first_name}</td>
                        <td>${field.last_name}</td>
                        <td>${field.email}</td>
                        <td>${field.gender}</td>
                        <td><button onclick="deleteRecord(${field.id})" id="${field.id}"> Delete </button></td>
                        <td><button id="${field.id}" onclick="updateUser(${field.id})"> Update</button></td>
                    </tr>
                    `
                    data.innerHTML += tableDetails 
                })           
            })
            .then(()=>{
                laoding.innerHTML = null
                count++
            })
            .catch(error => console.log('error', error));
      } else {
          laoding.innerHTML = `<span><div>You data is already loaded <button onclick="clearMessage()">x</button></div></span>`
      }
}

const clearMessage = () => {
    laoding.innerHTML = null
}

const deleteRecord = (e) => {
    console.log(e)
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      
      fetch(`https://apprentice-server.herokuapp.com/delete/${e}`, requestOptions)
        .then(response => response.text())
        .then(()=>{
            window.location.reload();
            count = 0;
        })
        .catch(error => console.log('error', error));
        

}

const updateUser = (e) => {
    // var raw = JSON.stringify({"userid":"test1@test.com","columnValue":"first_name","updatedValue":"Yannick"});
    // console.log(e)
    form_id.hidden = false
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

    fetch(`https://apprentice-server.herokuapp.com/user/${e}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      
       let tableData = JSON.parse(result)
       tableData.map((val,index)=>{
           document.getElementById('first_name').value = val.first_name;
           id = val.id 
       })
    })
   
}

const update = async() => {
    let t = document.getElementById('first_name').value
    //document.getElementById('first_name').innerHTML

    console.log(t)
    console.log(id)
    var raw = await JSON.stringify({"id":`${id}`,"columnValue":"first_name","updatedValue":`${t}`});
    console.log(raw)

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://apprentice-server.herokuapp.com/update/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}
