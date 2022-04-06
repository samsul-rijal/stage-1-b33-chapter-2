// Variabel

// Sync

// var namaDepan = 'Ichsan';
// namaDepan = "Adam";
// console.log(nama);

// let name2 = "Caca"
//  name2 = "Sherly"
// console.log(name2)

// const name3 = "William"
// name3 = "Abdul"
// console.log(name3)

// --------------------------------------------------

// Type Data

// let nama = "William"
// let umur = 15

// console.log("Nama saya adalah "+nama+" umur saya "+umur+" tahun")
// console.log("Nama saya adalah", nama, "umur saya", umur, "tahun")
// console.log(`Nama saya adalah ${nama} umur saya ${umur} tahun`);

// let bil1 = "20"
// let bil2 = 5

// console.log(bil1-bil2);


// Condition

// let nama = "2"

// if(nama === 2){
//     console.log("benar");
// } else {
//     console.log("salah");
// }
// ---------------------------------------------------------

// Function

// function bilangan() {

//     let bil1 = 20
//     let bil2 = 30

//     let hasil = bil1 + bil2

//     // return hasil
//     console.log(hasil);
// }
// bilangan()

// function bilangan(bil1 = 20, bil2 = 50, bil3 = 20) {

//     let hasil = bil1 + bil2 + bil3

//     // return hasil
//     console.log(hasil);
// }
// bilangan()



// ------------------------------------------------------------------------Materi


function submitData() {
    let name = document.getElementById('input-name').value
    let email = document.getElementById('input-email').value
    let phone = document.getElementById('input-phone').value
    let subject = document.getElementById('input-subject').value
    let message = document.getElementById('input-message').value

    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(subject);
    console.log(message);

    if (name == '') {
        return alert('Nama wajib diisi')
    } else if (email == '') {
        return alert('Email wajib diisi')
    } else if (phone == '') {
        return alert('Phone wajib diisi')
    } else if (subject == '') {
        return alert('Subject wajib diisi')
    } else if (message == '') {
        return alert('Message wajib diisi')
    }

    let emailReceiver = 'ichsan@mail.com'

    let a = document.createElement('a')

    a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo my name ${name} 
    ${message} please call me ${phone}`

    a.click() // untk menjalankan tag anchor


    let dataObject = {
        namaBelakang: name,
        email: email,
        phoneNumber: phone,
        subject: subject,
        message: message
    }

    console.log(dataObject);


}









