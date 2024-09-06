
function launch_toast(message) {
  var x = document.getElementById("toast");
  x.className = "show";
  document.getElementById("desc").innerHTML = message;
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
 
function handleSubmit(event) {  
  event.preventDefault();   
  const id = receiptId;  
  let invoiceType = '';
  const date = document.getElementById('date').value;
  if(document.querySelector('input[name="invoiceType"]:checked')){
    invoiceType = document.querySelector('input[name="invoiceType"]:checked').value;
  }
  const description = document.getElementById('description').value;
 
  if(!date && !invoiceType && !description){ 
    launch_toast('Please add some details'); 
    return; 
  } 

    var formData = new FormData();
    formData.append("date", date);
    formData.append("invoiceType", invoiceType);
    formData.append("description", description); 

 
     fetch(`/update/receipt/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        let data = responseData;   
        launch_toast(data?.message);
        showSuccessCheck(data.receipt);        
      })
      .catch((error) => {
        console.log(error, "Error");
        launch_toast(error?.message); 
      });
 
}

function showSuccessCheck(receipt) {   
  document.getElementById("receipt-form").style.display = "none";
  document.getElementsByClassName("message-info")[0].innerText = `Invoice ${receipt.receipt_id} Updated!`;
  document.getElementById("success-check").style.display = "block";
}
