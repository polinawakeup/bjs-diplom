let message;
let logoutButton = new LogoutButton();
let anotherUsers = [];

logoutCallback = function(response){
    if(response.success){
        location.reload();
    };
};

logoutButton.action = function(){
    ApiConnector.logout(logoutCallback);
};

ApiConnector.current(function(response){
    if(response.success){
        ProfileWidget.showProfile(response.data);
    };
});

let ratesBoard = new RatesBoard();

function getExchangeRate(){
    ApiConnector.getStocks(function(response){
        if(response.success){
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        };
    });
};

getExchangeRate();
setInterval(getExchangeRate, 60000);

let moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function(data){
    ApiConnector.addMoney(data, function(response){
        if(response.success){
            ProfileWidget.showProfile(response.data);
            message = `Сумма ${data.amount} ${data.currency} успешно зачислена на счет`;
        } else {
            message = response.error;
        };
        let isSuccess = response.success;
        moneyManager.setMessage(isSuccess, message);
    });
};

moneyManager.conversionMoneyCallback = function(data){
    ApiConnector.convertMoney(data, function(response){
        if(response.success){
            ProfileWidget.showProfile(response.data);
            message = `Сумма ${data.fromAmount} ${data.fromCurrency} успешно конвертирована в ${data.targetCurrency}`;
        } else {
            message = response.error;
        };
        let isSuccess = response.success;
        moneyManager.setMessage(isSuccess, message);
    });
};

moneyManager.sendMoneyCallback = function(transaction){
    ApiConnector.transferMoney(transaction, function(response){
        if(response.success){
            let recipient = anotherUsers.find(user => user.userId === transaction.to);

            ProfileWidget.showProfile(response.data);

            message = `Сумма ${transaction.amount} ${transaction.currency} успешно переведена пользователю ${recipient.userName}`;
        } else {
            message = response.error;
        };
        let isSuccess = response.success;
        moneyManager.setMessage(isSuccess, message);
    });
};

let favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(function(response){
    if(response.success){
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);

        let dataKeys = Object.keys(response.data);
        dataKeys.forEach(key => anotherUsers.push({ userId: parseInt(key), userName: response.data[key] }));
    };
});

favoritesWidget.addUserCallback = function(user){
    ApiConnector.addUserToFavorites(user, function(response){
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            message = `Пользователь ${user.name} (ID: ${user.id}) добавлен в список избранного`;
        } else {
            message = response.error;
        };
        favoritesWidget.setMessage(response.success, message);
    });
};

favoritesWidget.removeUserCallback = function(id){
    ApiConnector.removeUserFromFavorites(id, function(response){
        if(response.success){
            let userToDelete = anotherUsers.find(user => user.userId === parseInt(id));

            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            message = `Пользователь ${userToDelete.userName} удален из списка избранного`;
        } else {
            message = response.error;
        };
        favoritesWidget.setMessage(response.success, message);
    })
}