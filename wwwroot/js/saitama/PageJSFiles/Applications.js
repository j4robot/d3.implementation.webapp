$(document).ready(function () {

    let dt = new DateHandler();
    let saveLoadedData = [];
    let saveOrUpdate = 0; 
    let applicationId = null;
    let sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    };

    makeAPIRequest('/api/project/getprojects/*', 'GET', '', loadForSelectBox);

    function loadForSelectBox(data) {

        data = JSON.parse(data);

        var options = '<option value="-1" disabled selected >Select Project</option>';
        data.forEach((element) => {
            options += '<option value="' + element.id + '">' + element.projectName + '</option>';
        });

        document.querySelector('#slctProject').innerHTML = options;
    }

    document.querySelector('#slctProject').addEventListener('change', function () {
        makeAPIRequest('/api/application/getapplicationbyprojectid/' + this.value, 'GET', '', function (data) {
            if (data) {
                createAppsTable(JSON.parse(data), '#apps-tbody');
                document.querySelector('#srchTerm').disabled = false;
            }
        });
    });

    document.querySelector('#srchTerm').addEventListener('keyup', function (e) {

        let value = this.value.toLowerCase();
    
        value != '' ? document.querySelector('#btnSearch').disabled = false : document.querySelector('#btnSearch').disabled = true;
    
        if (value === '') createAppsTable(saveLoadedData, '#apps-tbody');
    
        if (e.which === 13 && this.value !== '') {
            $('#btnSearch').click();
            return false;
        }
    
    });
    
    document.querySelector('#btnSearch').addEventListener('click', function (e) {
        let value = document.querySelector('#srchTerm').value.toLowerCase();
        if (value !== '*') {
            $("#apps-tbody > tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        }
    });

    function createAppsTable(data, tableId) {
        let view = ''
        saveLoadedData = [];
        data.forEach(element => {
            saveLoadedData.push(element);
            view += `
                    <tr>
                        <td>
                            <i class=""></i>${element.prefix}
                        </td>
                        <td>
                            <i class=""></i>${element.name}
                        </td>
                        <td>
                            <span class="badge badge-dot mr-4">
                                <i class="bg-${element.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[element.status].color} btn-sm" disabled>${sub[element.status].state}</span>
                            </span>
                        </td>
                        <td class="">
                            ${dt.calendarFormat(element.createdAt, '-')}
                        </td>
                        <td class="text-center">
                            <a href="#" class="text-inverse editButton" id="${element.id}" title="Edit"><i class="fas fa-edit"></i></a>
                            
                        </td>
                    </tr>`
        });

        // Render the tbody.
        document.querySelector(tableId).innerHTML = `${view}`
        bindButtonsToDOM()
    }

    document.querySelector('#btnAddApp').addEventListener('click', function () {
        $('#appModal').modal('toggle');
        saveOrUpdate = 0;
        document.querySelector('#btnSave').innerText = 'Add';
        clearFields();
    });

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getDataByID(this.id)
            });
        }
    }

    function getDataByID(rowId) {
        applicationId = rowId;
        populateInputFields(saveLoadedData.filter((ele) => ele.id === rowId)[0]);
        saveOrUpdate = 1;
    }

    function clearFields() {
        document.querySelector('textarea').value = "";
        document.querySelector('#description').value = "";
        document.querySelector('#txtWebsite').value = "";
        document.querySelector('#txtPrefix').value = "";
        displayStatus(1, '#switch');
    }

    function populateInputFields(data) {
        document.querySelector('#description').value = data.name;
        document.querySelector('#notes').value = data.description != null ? data.description : 'Empty';
        document.querySelector('#txtWebsite').value = data.url;
        document.querySelector('#txtPrefix').value = data.prefix;
        displayStatus(data.status, '#switch');
        document.querySelector('#btnSave').innerText = 'Update';

        $('#appModal').modal('toggle');
    }

    
    document.querySelector('#btnSave').addEventListener('click', function () {

        let postData = {
            projectId: document.querySelector('#slctProject').value,
            description: document.querySelector('#notes').value,
            name: document.querySelector('#description').value,
            prefix: document.querySelector('#txtPrefix').value,
            url: document.querySelector('#txtWebsite').value,
            status: document.querySelector('#switch').checked ? 1 : 0
        }

        saveOrUpdate != 1 ? createApplication('/api/application/postapplication', postData) : updateApplication(`/api/application/putapplication/${applicationId}`, postData);

    });

    function reloadApplications() {
        makeAPIRequest('/api/application/getapplicationbyprojectid/' + document.querySelector('#slctProject').value, 'GET', '', function (data) {
            if (data) {
                createAppsTable(JSON.parse(data), '#apps-tbody');
            }
        });
    }

    function createApplication(url, data) {
        makeAPIRequest(url, 'POST', data, function (response) {
            response = JSON.parse(response)
            console.log(response);
            reloadApplications();
            $('#appModal').modal('toggle');
            messenger('success');
        });
    }

    function updateApplication(url, data) {
        makeAPIRequest(url, 'PUT', data, function (response) {
            reloadApplications();
            $('#appModal').modal('toggle');
            messenger('success');
        });
    }
});