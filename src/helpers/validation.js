export function signUpValidation(values) {
    const errors = {};
    // validate email
    if (!values.email) {
        errors.email = "Required field"
    }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
        if (values.email.includes(" ")) {
            errors.email = "Invalid email address and whitespaces are not allowed"
        }
    }
    // validate name
    if (!values.username) {
        errors.username = "Required field"
    }
    else if (values.username.length<3||values.username.length>20) {
        errors.username= "username should be greater or equal to 3 characters long and less than 20 characters long"
    } else if (values.username.includes(" ")) {
        errors.username = "whitespaces are not allowed"
    }
    // validate password
    if (values.password.length<6||values.password.length>20) {
        errors.password = "Password must be greater than 6 characters long or less than 20 characters long"
    } else if (values.password.includes(" ")) {
        errors.password = "whitespaces are not allowed"
    }

    console.log(errors);
    return errors
}