"use strict";

let userForm = new UserForm();

function loginCallback(response){
    if(response.success){
        location.reload();
    } else {
        userForm.setLoginErrorMessage(response.error);
    };
}

userForm.loginFormCallback = function(data){
    ApiConnector.login(data, loginCallback);
};

function registerCallback(response){
    if(response.success){
        location.reload();
    } else {
        userForm.setRegisterErrorMessage(response.error);
    };
}

userForm.registerFormCallback = function(data){
    ApiConnector.register(data, registerCallback);
}
