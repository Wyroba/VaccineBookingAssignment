$( () => { 
    date = new Date();
    dateString = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

    // Class used to store appointments
    class Appointment {
       // class constructor
        constructor (bookingDate,aDate,aTime,ohip,email = null,phone = null) {
            this.bookingDate = bookingDate;
            this.aDate = aDate;
            this.aTime = aTime;
            this.ohip = ohip;
            this.email = email;
            this.phone = phone; } 
    }

    // functions that will be used in an event listener
    // will be used to store an appointment in localstorage
    function makeAppointment(){
        let a = new Appointment(dateString, $('#aDate').val(), $('#aTime').val(), 
        $('#ohip').val(), $('#email').val(), $('#phone').val());

        localStorage.setItem(a.ohip, JSON.stringify(
            { 'bookingDate': a.bookingDate,
            'aDate': a.aDate,
            'aTime': a.aTime,
            'ohip': a.ohip,
            'email': a.email,
            'phone': a.phone} ) );

        alert("Appointment has been made.");
    }

    //function to validate data that isnt validated by the HTML
    function validateForm(){
        if ($('#email').val() == "" && $('#phone').val() == "")
        {
            alert(`Error! 
Either an email or a Phone Number must be entered! 
Please try again.`);
            return 1;
        }
        let attemptedDate = new Date($('#aDate').val());
        attemptedDate.setTime(attemptedDate.getTime() + 4 * 60 * 60 * 1000);
        let attemptedDate2 = new Date();
        attemptedDate2.setHours(0,0,0,0);
        if (attemptedDate < attemptedDate2)
        {
            alert(`Error! 
Date entered was before today!  
Please try again.`);
            return 1;
        }
        if ((attemptedDate == attemptedDate2) && ($('#aTime').val() < date.toTimeString()) )
        {
            alert(`Error! 
Must pick a time after now! 
Please try again.`);
            return 1;
        }
        if($('#aTime').val() < "08:00" || $('#aTime').val() > "19:00")
        {
            alert(`Error! 
Must pick a time between 8AM and 7PM!
Please try again.`);
            return 1;
        }
        if($('#phone').val() != "" && isNaN($('#phone').val()))
        {
            alert(`Error! 
Invalid Phone Number!
Please try again.`);
            return 1;
        }
        if(isNaN($('#ohip').val()))
        {
            alert(`Error! 
Invalid OHIP Number!
Please try again.`);
            return 1;
        }
    }

    $('#aForm').submit( () => {
        if (!validateForm()){
        makeAppointment();
        }
    });

    // function to be called in an event listener
    // the function takes the data from local storage and prints
    // it to the page
    function showAppointments() {
        appointmentArray = new Array();
        if (localStorage.length < 1)
        {
            alert("There are currenly no scheduled appointments!");
            return 1;
        }
        for (let i = 0; i < localStorage.length; i++){
            let ohip= localStorage.key(i);
            let appoint = JSON.parse(localStorage.getItem(ohip));
            appointmentArray.push(appoint);
        }
        
        $('#aList').append(`<h4>Appointments</h4>
        <ul>`);
        for (let a of  appointmentArray)
        {
            
            $('#aList').append(`<script>function deleteMe(){
                if (confirm("Are you sure you want to delete this appointment?!")) {
                    localStorage.removeItem(${a.ohip});
                    alert("The appointment was deleted!");
                    $('#aList').toggle();
                    $('#aList').html("");
                  } else {
                    alert("The Appointment was not deleted!");
                  }
                }</script>
            <section onclick="deleteMe()"><strong>${a.ohip}</strong><section id="cDelete">(click to delete)</section></section><ul>
            <li>Appointment Day: ${a.aDate}</li>
            <li>Appointment Time(24H): ${a.aTime}</li>
            <li>Email: ${a.email}</li>
            <li>Phone: ${a.phone}</li>
            </ul>`);
        }
        $('#aList').append(`</ul>`);    
        }

    // event listener for the View Appointment Button
    $('#view').click( () => {
        $('#aList').toggle();
        $('#aList').html("");
        showAppointments() });
    
    // event listener for the Delete all appointment buttons
    $('#deleteAll').click( () => {
        if (confirm("Are you sure you want to delete this appointment?!")) {
            localStorage.clear();
            alert("All appointments were deleted!")
          } else {
            alert("All appointments were not deleted!");
          }
          $('#aList').html("");
         });
 })
