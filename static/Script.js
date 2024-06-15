function validation() {
    const inputElements = Array.from(document.querySelectorAll('input')); // Get all input elements
    const validationMessage = document.getElementsByClassName("validation-message")[0]; // Get the first validation message element
    const successMessage = document.getElementsByClassName("success-message")[0]; // Get the first success message element
    let isVal = true;
    console.log(inputElements[4].value)
    console.log(inputElements[5].value)
    inputElements.forEach(function(element) {
        let elementValue = element.value;
        let elementType = element.type;

        if (elementValue.length === 0) { // first check if the current field contains something.
            validationMessage.textContent = "*Please fill all of the fields";
            isVal = false;
            return; // Exit the loop
        }

        switch (elementType) { //divide the validations by current element type.
            case 'email':
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email Regular Expression form.
                if (!emailPattern.test(elementValue)) {
                    validationMessage.textContent = "*Invalid email";
                    isVal = false;
                }
                break;
            case 'number':
                const phonePattern = /^[0-9]*$/;// phone-number Regular Expression form.
                if (!phonePattern.test(elementValue) || elementValue.length < 10 ) {
                    validationMessage.textContent = "*Invalid phone number";
                    isVal = false;
                }
                break;
            case 'password':// Passwords will get inner divider by the name of the placeholder.
                let passwordType = element.placeholder
                if (elementValue.length < 8 && passwordType === "Password") {
                    validationMessage.textContent = "*Password must be at least 8 characters";
                    isVal = false;
                }

                if( elementValue !== inputElements[4].value && passwordType === "Confirm password" ) {
                    validationMessage.textContent = "*confirmed password do not compatible with password";
                    isVal = false
                }
                break;
        }
    });

    if (isVal) { //isVal summarizing all conditions are passed as expected.
        validationMessage.classList.add('success');
        validationMessage.textContent = ""//in case of everything is valid it will clear the error message.
        successMessage.textContent = "Submission of private details succeeded.";
        console.log("Submission of private details succeeded.");
    } else {
        successMessage.textContent = "";//in case of some field is invalid it will clear the success message.
        console.log("Submission of private details did not succeed.");
    }
}
