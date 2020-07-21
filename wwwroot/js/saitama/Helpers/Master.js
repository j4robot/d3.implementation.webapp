let pageLoader = (strType) => {
    return strType.toLowerCase() == 'show' ? $("body").LoadingOverlay("show", { background: "rgba(0,0,0,0.6)" }) :
        strType.toLowerCase() == 'hide' ? $("body").LoadingOverlay("hide", true) : console.log('Contact CoderBot if Loader does not work!');

}

function readExternalFile(file, mime, callback) {
    let overrideMime = ''

    mime === 'json' ? overrideMime = "application/json" : mime === 'html' ? overrideMime = "text/html" : overrideMime = "text/plain"

    let dataFile = new XMLHttpRequest();
    dataFile.overrideMimeType(overrideMime);
    dataFile.open("GET", file, true);
    dataFile.onreadystatechange = function() {
        if (dataFile.readyState === 4 && dataFile.status == "200") {
            callback(dataFile.responseText);
        }
    }
    dataFile.send(null);
}

function makeAPIRequest(url, method, data = "", callback) {
    pageLoader('show');

    url = window.location.href.indexOf("localhost") > -1 ? url : `/hcm-apps-controls${url}`;
    
    switch (method) {
        case 'GET':
            getRequest(url, callback)
            break;
        case 'POST':
        case 'PUT':
            postOtPutRequest(url, method, data, callback)
            break
        case 'FILE':
            fileUploadRequest(url, method, data, callback)
            break
        case 'DELETE':
            deleteRequest(url, callback)
            break;
    }

    function getRequest(url, callback) {
        
        fetch(url).then(data => data.text()).then(data => {
            pageLoader('hide');
            callback(data)
        }).catch((error) => {
            pageLoader('hide');
            callback(error)
        });
    }

    function deleteRequest(url, callback) {
        fetch(url, {
            method: 'DELETE',
        }).then(res => res.text()).then(data => {
            pageLoader('hide');
            callback(data)
        }).catch((error) => {
            pageLoader('hide');
            callback(error)
        });
    }

    function postOtPutRequest(url, method, data, callback) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(data => data.text()).then(data => {
            pageLoader('hide');
            callback(data)
        }).catch((error) => {
            pageLoader('hide');
            callback(error)
        });
    }

    function fileUploadRequest(url, method, data, callback) {
        fetch(url, {
            method: 'POST',
            body: data,
        }).then(data => data.text()).then(data => {
            callback(data)
        }).catch((error) => {
            callback(error)
        });
    }

}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function setColorToToastr(state) {
    if (state == true) {
        $('.iziToast-theme-light').addClass('success-color');
    } else {
        $('.iziToast-theme-light').removeClass('success-color');
    }
}

function messenger(message, mssge = '') {
    switch (message.toLowerCase()) {
        case 'success':
            setColorToToastr(true);
            iziToast.show({
                color: color,
                icon: 'fa fa-check',
                position: 'topRight',
                message: 'Data submitted successfully'
            });
            break;
        case 'error':
            setColorToToastr(false)
            iziToast.show({
                color: 'red',
                icon: 'fa fa-times',
                position: 'topRight',
                message: 'An error occured'
            });
            break;
        case 'warning':
            setColorToToastr(false)
            iziToast.show({
                color: 'yellow',
                icon: 'fa fa-warning',
                position: 'topRight',
                message: 'Something went wrong'
            });
            break;
        case 'unknown':
            iziToast.show({
                color: 'blue',
                icon: 'fa fa-info',
                position: 'topRight',
                message: 'No match found!'
            });
            break;
        case 'validate':
            iziToast.show({
                color: 'blue',
                icon: 'fa fa-info',
                position: 'topRight',
                message: 'Provide required data!'
            });
            break;
        case 'custom_success':
            iziToast.show({
                color: color,
                icon: 'fa fa-check',
                position: 'topRight',
                message: mssge
            });
            break;
    }
}

function moneyInTxt(value, standard, dec = 0) {
    nf = new Intl.NumberFormat(standard, {
        minimumFractionDigits: dec,
        maximumFractionDigits: 2
    });
    return nf.format(Number(value) ? value : 0.00);
};

function commaRemover(value) {
    value = value.replace(/,/g, '');
    return parseFloat(value);
};

$('.moneyformat').focusout(function () {
    $(this).val(commaRemover($(this).val()));
    $(this).val(moneyInTxt($(this).val(), 'en', 2));
});


$('.moneyformat').focus(function () {
    $(this).val(Number($(this).val()) === 0 ? "" : commaRemover($(this).val()));
});

$('.moneyformat').keydown(function (e) {
    if (!e.key.match(/^[0-9.()]+$/) && Number(e.key.length) === 1) {
        e.preventDefault();
        return;
    }
});

function GetCurrentPageName() {
    var url = window.location.pathname;
    return url.substring(url.lastIndexOf('/') + 1);
}

lightMenu(GetCurrentPageName().toLowerCase());

function lightMenu(page) {
    page ? page : page = 'dashboard'
    $('#' + page).addClass('active');
    $('#' + page + ' > a').addClass('active');
}

function SortMenusLoaded(menus, parent) {
    let nodes = [];

    menus = menus.filter(x => x.id !== '00000000-0000-0000-0000-000000000000');

    menus.filter(function(d) { return d.parent === parent }).forEach(function(d) {
        let cd = d;
        cd.child = SortMenusLoaded(menus, d.id);
        cd.child = cd.child.length < 1 ? null : cd.child;
        return nodes.push(cd);
    });
    return nodes;
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function displayStatus(state, element) {
    state ? document.querySelector(element).checked = true : document.querySelector(element).checked = false;
}

validateUser();
function validateUser(){
    //Check User Login Access

    if(localStorage.getItem("chairman")){
        let {state, expires, name} = JSON.parse(localStorage.getItem("chairman"));

        if(expires < Date.now() && state){
            window.location = window.location.href.indexOf("localhost") > -1 ? `${window.location.origin}` : `${window.location.origin}/hcm-apps-controls/`;
        }
        
    }
    else{
        window.location = window.location.href.indexOf("localhost") > -1 ? `${window.location.origin}` : `${window.location.origin}/hcm-apps-controls/`;
    }
}

let codeGenerator = (str, len) => `${str}-${Math.random().toString(36).substr(2, len).toUpperCase()}`;

let getTodayDate = function () {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;

    day.toString().length > 1 ? day = day : day = '0' + day
    month.toString().length > 1 ? month = month : month = '0' + month

    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

let formatDate = function (psDate) {
    let date = new Date(psDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;

    day.toString().length > 1 ? day = day : day = '0' + day
    month.toString().length > 1 ? month = month : month = '0' + month

    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function postMasterFile(formData, metaData, modalName) {
    try {

        makeAPIRequest('/api/dvelop/uploadfile', 'FILE', formData, function (data) {

            try {
                data = JSON.parse(data);
                postMasterFileToD3(data, metaData, modalName)

            } catch (error) {
                console.log(error);
            }

        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function postMasterFileToD3(data, metaData, modalName) {
    pageLoader('show');

    makeAPIRequest('/api/dvelop/savefile', 'POST', { map: JSON.stringify(metaData(data.fileName, data.oldFileName)), filePath: data.filePath }, function (res) {
        try {
            console.log({ res });

            if (res != "D3 sessionId error") {
                $('#' + modalName).modal('hide');
                messenger('success');
            }
            else {
                messenger('warning');
            }

        } catch (error) {
            console.log(error);
        }

    });
}