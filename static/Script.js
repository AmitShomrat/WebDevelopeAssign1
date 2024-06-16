function validation() {
    const inputElements = Array.from(document.querySelectorAll('input')); // Get all input elements
    const validationMessages = Array.from(document.getElementsByClassName("validation-message")); // Get all 'validation-message' elements
    const successMessage = document.getElementsByClassName("success-message")[0]; // Get the first 'success-message' element
    let isVal = true;

    // Clear all previous validation messages
    validationMessages.forEach(function(message) {
        message.textContent = "";
    });

    inputElements.forEach(function(element, index) {
        let elementValue = element.value;
        let elementType = element.type;
        let validationMessage = validationMessages[index];

        if (elementValue.length === 0) { // first check if the current field contains something.
            validationMessage.textContent = "This field is required";
            isVal = false;
            return; // Exit the loop
        }

        switch (elementType) { //divide the validations by current element type.
            case 'text':
                const textPattern = /^[a-zA-Z]+$/
                if(!textPattern.test(elementValue)) {
                    validationMessage.textContent = "Only alphabetic characters are allowed";
                    isVal = false;
                }
                break;
            case 'email':
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email Regular Expression form.
                if (!emailPattern.test(elementValue)) {
                    validationMessage.textContent = "Invalid email";
                    isVal = false;
                }
                break;
            case 'number':
                const phonePattern = /^[0-9]*$/;// phone-number Regular Expression form.
                if (!phonePattern.test(elementValue) || elementValue.length < 10 ) {
                    validationMessage.textContent = "Invalid phone number";
                    isVal = false;
                }
                break;
            case 'password':// Passwords will get inner divider by the name of the placeholder.
                let passwordType = element.placeholder;
                if (elementValue.length < 8 && passwordType === "Password") {
                    validationMessage.textContent = "Password must be at least 8 characters";
                    isVal = false;
                }

                if(elementValue !== inputElements[4].value && passwordType === "Confirm password" ) {
                    validationMessage.textContent = "Confirmed password does not match password";
                    isVal = false;
                }
                break;
        }
    });

    if (isVal) { //isVal summarizing all conditions are passed as expected.
        successMessage.textContent = "Submission of private details succeeded.";
        alert("Submission of private details succeeded.");
        let response =  { // BUILDING: in case of everything passed validation we will pass it through Data field.
            'first_name': inputElements[0].value,
            'last_name': inputElements[1].value,
            'phone_number': inputElements[2].value,
            'email': inputElements[3].value,
            'password': inputElements[4].value,
            'confirm_password': inputElements[5].value,
        }
        return { //passing new user details. and status of validation
            isValid: true,
            Data: response
        }

    } else {
        successMessage.textContent = "";//in case of some field is invalid it will clear the success message.
        alert("Submission of private details did not succeed.");
        return {//status of validation is false, thus nothing will pass further.
            isValid : false,
            Data : null
        }
    }
}

const BTN = document.getElementById("button");

BTN.addEventListener('click', function (event){
    event.preventDefault(); // Prevent the default form submission
    const validationResult = validation();
    if(validationResult.isValid) {
        fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(validationResult.Data)
        })
            .then(response => {
                if(!response.ok) {
                    if(response.status === 400) {
                        document.getElementById('email-msg').textContent =  "Email is already registered.";
                        document.getElementById('button').disabled = true;
                        throw new Error("User registration has failed");
                    }
                    else {
                        throw new Error("User registration has failed");
                    }
                }
            })
            .then(data => {
                console.log('Success:', data);
                document.querySelector('.success-message').textContent = "User registered successfully!";
            })
            .catch(error => {
                console.log(error);
            })
    }
});