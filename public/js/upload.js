let loader = document.getElementById("loading");
let modalLoading = document.getElementById("modalLoading");
let transactionDetails = document.getElementById("transactionDetails");
let transactionDetailsPdf = document.getElementById("transactionDetailsPdf");
let transactionDetailsEmpty = document.getElementById(
  "transactionDetailsEmpty"
);
let cropImagePopImageSave = document.getElementById("cropImagePopImageSave");
let allTransactions = document.getElementById("allTransactions");
let totalExpenses = document.getElementById("totalExpenses");
let singleCardName = document.getElementById("singleCardName");
let singleCardNumber = document.getElementById("singleCardNumber");
var imageTagCamera = document.getElementById("image-tag-camera");
var imageTag = document.getElementById("image-tag");

var vanillaResult = document.querySelector(".vanilla-result"),
  vanillaSave = document.querySelector(".vanilla-save"),
  vanillaRotate = document.querySelectorAll(".vanilla-rotate");

var $uploadCrop, tempFilename, rawImg, imageId;


var cropper;

let uploadScanFile;
let receiptId;


const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'id' parameter
const cardId = urlParams.get("id");

function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#cropImagePop").modal("hide");
      $("#cropImagePopImageSave").modal("hide");
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    swal("Sorry - you're browser doesn't support the FileReader API");
  }
}

function launch_toast(message) {
  var x = document.getElementById("toast");
  x.className = "show";
  document.getElementById("desc").innerHTML = message;
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

const fileInput = document.getElementById("imgInput");
fileInput.addEventListener("change", function () { 
  const file = fileInput.files[0];
  if(!file){
    imagePreviewClear();
  }
  const image = URL.createObjectURL(file);
  document.getElementById("Image-upload-box").style.display = "none";
  document.getElementById("image-preview-box").style.display = "block";
  document.getElementById("image-preview-img").src = image;
});

function imagePreviewClear() {
  document.getElementById("Image-upload-box").style.display = "block";
  document.getElementById("image-preview-box").style.display = "none";
  document.getElementById("image-preview-img").src = "";
  fileInput.value = "";
  windowReload();
}

let readedData;

let verifyData = [];

function getAllTransactions() {
  $("#cropImagePop").modal("hide");
  loader.style.display = "none";
}

getAllTransactions();
// getAllCards()

function showTransactionDetails(params, id) {
  if (params != "undefined") {
    receiptId = id;
    document.getElementById("dropAttachment").style.display = "block";

    if (params?.includes(".pdf")) {
      $("#cropImagePopDetailPdf").modal("show");
      transactionDetailsPdf.innerHTML = `<iframe src='${params}' style="cursor:pointer;object-fit:cover;height:100%;width:100%" frameborder="0"></iframe>`;
    } else {
      $("#cropImagePopDetail").modal("show");

      receiptImage.src = `${params}`;
    }
  } else {
    $("#cropImagePopDetailEmpty").modal("show");
    document.getElementById("dropAttachment").style.display = "none";
    transactionDetailsEmpty.innerHTML = `<h2 style="width:100%;text-align:center" >No Receipt</h2>`;
  }
}




function handleSubmit(event) { 
  event.preventDefault();   

  if(!fileInput.files[0] && !uploadScanFile){  
      launch_toast('Upload or Capture an image');
      return; 
  }
  loader.style.display = "block";

    var formData = new FormData(); 
    formData.append("receipt", fileInput.files[0] || uploadScanFile);
 
     fetch(`/store/receipt`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        let data = responseData;
        loader.style.display = "none";
        fileInput.value = ""
        uploadScanFile = {};
        imageTagCamera.src = "";
        launch_toast(data?.message);
        showSuccessCheck(data.receipt);        
      })
      .catch((error) => {
        console.log(error, "Error");
        launch_toast(error?.message);
        // modalLoading.style.display = "none";
      });
 
}

function showSuccessCheck(receipt) {  
  closeCamera();
  document.getElementById("receipt-form").style.display = "none";
  document.getElementsByClassName("message-info")[0].innerText = `Invoice ${receipt.receipt_id} Created!`;
  document.getElementById("details").href = `/upload/${receipt._id}`;
  document.getElementById("success-check").style.display = "block";
}

// Read Image
function sendPicturetoRead() {
  // loader.style.display = "block";
  $("#cropImagePop").modal("show");
  document.getElementById("modal-show-table").innerHTML = "";
  modalLoading.style.display = "block";

  const file = fileInput.files[0];
  // Create a FormData object to send the file in a POST request
  var formData = new FormData();
  formData.append("pdfFile", file, file.name);

  // Send the POST request using the Fetch API
  fetch("/expenses/api/read-file", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((responseData) => {
      let data = responseData.data;
      modalLoading.style.display = "none";

      let html_ = "";
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i]?.date || data[i]?.amount || data[i]?.description) {
            verifyData.push(data[i]);
            if (data[i]?.date != "Order") {
              html_ += `<tr>
                <th scope="row" style="text-align: center;">${i + 1}</th>
                <td>${data[i]?.date.split("T")[0]}</td> 
                <td>${data[i]?.description}</td> 
                <td>${data[i]?.amount}</td> 
              </tr>`;
            }
          }
        }
        document.getElementById("modal-show-table").innerHTML += html_;
      } else {
        // No data, display a message in the center of the modal
        document.getElementById("modal-show-table").innerHTML =
          "<p>No data available</p>";
      }
      // $("#cropImagePop").modal("hide");
      // getAllTransactions();
    })
    .catch((error) => {
      console.log(error, "Error");
      modalLoading.style.display = "none";
    });
}

function resultVanilla(result) {
  swal({
    title: "",
    html: true,
    text: '<img src="' + result + '" />',
    allowOutsideClick: true,
  });
}

function saveVanilla(result) {
  swal({
    title: "",
    html: true,
    text:
      '<a id="save" href="' +
      result +
      '" download="result"><img src="' +
      result +
      '" /><br><button>Download</button></a>',
    showConfirmButton: false,
    showCancelButton: true,
    allowOutsideClick: true,
  });
}

function sendReciptFile(file, id) {
  loader.style.display = "block";
  // Create a FormData object to send the file in a POST request
  var formData = new FormData();
  formData.append("receipt", file.files[0], file.files[0].name);

  // Send the POST request using the Fetch API
  fetch(`/expenses/api/upload-receipt/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((responseData) => {
      let data = responseData;
      loader.style.display = "none";
      launch_toast(data?.message);
      getAllTransactions();
    })
    .catch((error) => {
      console.log(error, "Error");
      modalLoading.style.display = "none";
    });
}

// Video Camera

const constraints = { video: { width: { exact: 120 } } };
var videoTag = document.getElementById("video-tag");
var zoomSlider = document.getElementById("zoom-slider");
var zoomSliderValue = document.getElementById("zoom-slider-value");
var videoArea = document.getElementById("video-area");
// var takeImage = document.getElementById("take-iamge"); // Note: There's a typo here, should be "take-image"
var imageCapturer;

function captureReceipt() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    $("#cropImagePopScan").modal("show");
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotMedia)
      .catch((e) => {
        console.error("getUserMedia() failed: ", e);
        alert(
          "Camera access is not supported in this browser. Please try using a different browser."
        );
      });
  } else {
    console.warn("getUserMedia is not supported in this browser.");
    alert(
      "Camera access is not supported in this browser. Please try using a different browser."
    );
  }
}

function uploadReceipt() {}

function gotMedia(mediastream) {
  videoTag.srcObject = mediastream;
  // document.getElementById("start").style.display = "none";
  videoArea.style.display = "block";
  // takeImage.style.display = "block";

  var videoTrack = mediastream.getVideoTracks()[0]; // Corrected method here
  imageCapturer = new ImageCapture(videoTrack);

  // Timeout needed in Chrome, see https://crbug.com/711524
  setTimeout(() => {
    const capabilities = videoTrack.getCapabilities();
    // Check whether zoom is supported or not.
    if (!capabilities.zoom) {
      return;
    }

    zoomSlider.min = capabilities.zoom.min;
    zoomSlider.max = capabilities.zoom.max;
    zoomSlider.step = capabilities.zoom.step;

    zoomSlider.value = zoomSliderValue.value = videoTrack.getSettings().zoom;
    zoomSliderValue.value = zoomSlider.value;

    zoomSlider.oninput = function () {
      zoomSliderValue.value = zoomSlider.value;
      videoTrack.applyConstraints({ advanced: [{ zoom: zoomSlider.value }] });
    };
  }, 500);
}

function closeCamera() {
  // Check if srcObject is not null
  if (videoTag.srcObject) {
    // Set srcObject to null

    // Get the video track
    var videoTrack = videoTag.srcObject.getVideoTracks()[0];

    // Stop the video track
    videoTrack.stop();
  }

  // Hide or remove any elements related to the camera (optional)
  //   document.getElementById("start").style.display = "block";
  videoArea.style.display = "none";
}

function windowReload() {
  location.reload();
  imageTagCamera.src = "";
}

// ... (Previous code)

// Rest of your code

var imageUrl = null;
var fileType = null;

function takePhoto() {
  // Check if the camera is available
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("Camera not available.");
    return;
  }

  document.getElementById("right-side").style.display = "none";
  document.getElementById("left-side").style.display = "block";
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediastream) => {
      var videoTrack = mediastream.getVideoTracks()[0];
      imageCapturer = new ImageCapture(videoTrack);
      imageCapturer
        .takePhoto()
        .then((blob) => {
          $("#cropImagePopScan").modal("hide");
          $("#cropImagePopImageSave").modal("show");
          showImage(blob);
          closeCamera();
        })
        .catch((err) => {
          console.error("takePhoto() failed: ", err);
        });
    })
    .catch((err) => {
      console.error("getUserMedia() failed: ", err);
    });
}

// Show Image
// Show Image

let dropper;
function showImage(blob) {
  let url = URL.createObjectURL(blob);
  imageTagCamera.src = url;

  $("#cropImagePopImageSave").on("shown.bs.modal", function () {
    // Initialize cropper and assign it to the cropper variable
    dropper = new Cropper(imageTagCamera, {
      autoCrop: true,
      aspectRatio: 16 / 9,
      viewMode: 3,
      crop: function (event) {
        // This function is called whenever the cropping area changes
        // Get the cropped canvas
        let croppedCanvas = dropper.getCroppedCanvas();
        if (croppedCanvas) {
          // Convert the cropped canvas to a blob
          croppedCanvas.toBlob(function (blob) {
            // Save or use the cropped image blob here
            uploadScanFile = blob;
          });
        } else {
          console.error("Failed to get cropped canvas.");
        }
      },
    });
  });
}

function sendReciptScanFile() {
  // loader.style.display = "block";
  if (uploadScanFile) {
    $("#cropImagePopImageSave").modal("hide");
    const image = URL.createObjectURL(uploadScanFile);
    document.getElementById("Image-upload-box").style.display = "none";
    document.getElementById("image-preview-box").style.display = "block";
    document.getElementById("image-preview-img").src = image;
  }
}

let receiptImage = document.getElementById("receiptImage");

let imageAngle = 0;
let imageScale = 1;
let isDragging = false;
let initialX;
let initialY;

function rotateImage() {
  imageAngle += 90;
  receiptImage.style.transform = `rotate(${imageAngle}deg) scale(${imageScale})`;
}

function zoomIn() {
  imageScale *= 1.2; // Increase the scale by 20%
  receiptImage.style.transform = `rotate(${imageAngle}deg) scale(${imageScale})`;
}

function zoomOut() {
  imageScale *= 0.8; // Decrease the scale by 20%
  receiptImage.style.transform = `rotate(${imageAngle}deg) scale(${imageScale})`;
}

function resetImage() {
  imageAngle = 0;
  imageScale = 1;
  receiptImage.style.transform = `rotate(${imageAngle}deg) scale(${imageScale})`;
  receiptImage.style.top = "0";
  receiptImage.style.left = "0";
}

receiptImage.addEventListener("mousedown", startDrag);
receiptImage.addEventListener("mouseup", endDrag);
receiptImage.addEventListener("mousemove", drag);
receiptImage.addEventListener("mouseleave", endDrag);

function startDrag(e) {
  isDragging = true;
  initialX = e.clientX - parseInt(receiptImage.style.left || 0);
  initialY = e.clientY - parseInt(receiptImage.style.top || 0);
}

function endDrag() {
  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    receiptImage.style.left = `${e.clientX - initialX}px`;
    receiptImage.style.top = `${e.clientY - initialY}px`;
  }
}
