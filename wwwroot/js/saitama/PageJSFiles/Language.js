$(document).ready(function () {

    let dt = new DateHandler();
    let saveLoadedData = [];
    let saveOrUpdate = 0;
    let projects = [];
    let LangTransId = '';
    let sub = {
        1: { color: 'success', state: 'Active' },
        0: { color: 'danger', state: 'Inactive' }
    };

    document.querySelector('#srchTerm').addEventListener('keyup', function (e) {

        let value = this.value.toLowerCase();

        value != '' ? document.querySelector('#btnSearch').disabled = false : document.querySelector('#btnSearch').disabled = true;

        if (e.which === 13 && this.value !== '') {
            $('#btnSearch').click();
            return false;
        }

    });

    document.querySelector('#btnSearch').addEventListener('click', function (e) {
        let value = document.querySelector('#srchTerm').value.toLowerCase();
        if (value.length > 0) {
            loadLanguages(value.trim(), document.querySelector('#page-size').value, 1);
        }
    });

    makeAPIRequest('/api/project/getprojects/*', 'GET', '', loadForSelectBox);

    
    function loadForSelectBox(data) {

        let options = '<option value="-1" disabled selected >Select Project</option>';

        try {
            data = JSON.parse(data);

            data.forEach((element) => {
                projects.push(element);
                options += '<option value="' + element.id + '">' + element.projectName + '</option>';
            });

            document.querySelector('#slctProject').innerHTML = options;
        } catch (ex) {
            console.log('An error occurred : ' + ex);
            document.querySelector('#slctProject').innerHTML = options;
        }

    }

    function loadLanguages(searchQuery, page_size, page_number) {

        makeAPIRequest(`/api/LanTrans/spGetAllLanguageTrans/${page_size}/${page_number}/` + searchQuery, 'GET', '', function(data){
            if (data) {
                data = JSON.parse(data);

                createLanguageTable(JSON.parse(data.data).data, '#language-tbody');

                let count_helper = data.headers[2].Value[0];
                handleLanguageTablePagination(count_helper);
            }
        });
    }

    document.querySelector('#page-size').addEventListener('change', function (e) {
        $('#btnSearch').click();
    });

    function handleLanguageTablePagination(data){

        try {
            data = JSON.parse(data);
            let {totalCount, pageSize, currentPage, totalPages} = data;

            $('#next-li, #prev-li').addClass('disabled');

            if (currentPage > 0 && currentPage < totalPages) {
                $('#next-li').removeClass("disabled").attr("data-mypage", currentPage + 1);
            }

            if(currentPage > 1 && currentPage < totalPages){
                $('#prev-li').removeClass("disabled").attr("data-mypage", currentPage - 1);
            }

            /*
            let firstNum = dataHeader.currentPage * dataHeader.pageSize + 1 - dataHeader.pageSize,
                    lastNum = dataHeader.pageSize * dataHeader.currentPage,
                    entry = Number(dataHeader.totalCount) === 1 ? 'entry' : 'entries';

                $('.dataTables_info').text(`Showing ${firstNum} to ${lastNum <= dataHeader.totalCount ? lastNum : dataHeader.totalCount} of ${dataHeader.totalCount} ${entry}`);
            */

        } catch (e) {
            console.log(e)
        }

    }

    $(document).on('click', '#next-li, #prev-li', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('disabled')) {
            if (document.querySelector('#srchTerm').value.length > 0) {
                let value = document.querySelector('#srchTerm').value.toLowerCase();
                loadLanguages(value.trim(), document.querySelector('#page-size').value, $(this).data("mypage"));
            }
        }
    });

    function createLanguageTable(data, tableId) {
        let view = ''

        saveLoadedData = [];

        const getProjectName = (id) => {
            // console.log(projects.filter(x => x.id == id)[0].projectName)
            // if(projects.filter(x => x.id == id)[0].projectName != undefined){
            //     return projects.filter(x => x.id == id)[0].projectName
            // }
            return 'Unavailable'
        }
        
        data.forEach(element => {
            saveLoadedData.push(element);
            view += `
                    <tr>
                        <td>
                            ${getProjectName(element.projectId)}
                        </td>
                        <td>
                            ${element.code}
                        </td>
                        <td>
                            ${element.english}
                        </td>
                        <td>
                            <span class="badge badge-dot mr-4">
                                <i class="bg-${element.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[element.status].color} btn-sm" disabled>${sub[element.status].state}</span>
                            </span>
                        </td>
                        <td class="text-center">
                            <a href="#" class="text-inverse editButton" id="${element.id}" title="Edit"><i class="fas fa-edit"></i></a>
                        </td>
                    </tr>
                    `
        });

        // Render the tbody.
        document.querySelector(tableId).innerHTML = `${view}`
        bindButtonsToDOM()
    }

    if(document.querySelector('#btnAddLanguage')){
        document.querySelector('#btnAddLanguage').addEventListener('click', function () {
            $('#languageModal').modal('toggle');
            saveOrUpdate = 0;
            document.querySelector('#btnSave').innerText = 'Save';
            clearFields();
        });
    }

    function clearFields() {
        //document.querySelector('textarea').value = "";
        document.querySelector('select').value = -1;
        displayStatus(1, '#switch');
        //document.querySelector('#description').value = "";
        // document.querySelector('#txtCode').value = "";
        document.querySelector('#english').value = "";
        document.querySelector('#french').value = "";
        document.querySelector('#spanish').value = "";
        document.querySelector('#portuguese').value = "";
        document.querySelector('#german').value = "";
    }

    function bindButtonsToDOM() {
        let elements = document.getElementsByClassName('editButton');

        for (let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', function (e) {
                getRowData(this.id)
            });
        }
    }

    function getRowData(rowId) {
        projectId = rowId;
        let data = saveLoadedData.filter((ele) => ele.id === rowId);
        populateInputFields(data[0]);
        saveOrUpdate = 1;
    }

    //language
    let selectedLangCode = '';
    function populateInputFields(data) {
        // document.querySelector('#txtCode').value = data.code;
        LangTransId = data.id;
        selectedLangCode = data.code;
        document.querySelector('#english').value = data.english;
        document.querySelector('#french').value = data.french;
        document.querySelector('#spanish').value = data.spanish;
        document.querySelector('#portuguese').value = data.portuguese;
        document.querySelector('#german').value = data.german;
        displayStatus(data.status, '#switch');

        document.querySelector('#btnSave').innerText = 'Update';
        $('#languageModal').modal('toggle');
    }

    document.querySelector('#btnSave').addEventListener('click', function () {
        let postData = {
            projectId: document.querySelector('#slctProject').value,
            code: codeGenerator('HCM', 20),
            english: document.querySelector('#english').value,
            french: document.querySelector('#french').value,
            spanish: document.querySelector('#spanish').value,
            portuguese: document.querySelector('#portuguese').value,
            german: document.querySelector('#german').value,
            status: document.querySelector('#switch').checked ? 1 : 0,
            type: "string",
            parent: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        }

        if(document.querySelector('#slctProject').value != -1 && (document.querySelector('#english').value || document.querySelector('#french').value ||
         document.querySelector('#spanish').value || document.querySelector('#portuguese').value || document.querySelector('#german').value)){
            saveOrUpdate != 1 ? createLanguage(`/api/LanTrans/CreateLangTrans`, postData) : updateLanguage(`/api/LanTrans/UpdateLangTrans/${LangTransId}`, postData)
         }
         else{
            messenger('validate');
         }
    });

    
    function createLanguage(url, data) {
        makeAPIRequest(url, 'POST', data, function (response) {
            $('#btnSearch').click();
            $('#languageModal').modal('toggle');
            messenger('success');
        });
    }

    function updateLanguage(url, data) {
        data.code = selectedLangCode;
        makeAPIRequest(url, 'PUT', data, function (response) {
            $('#btnSearch').click();
            $('#languageModal').modal('toggle');
            messenger('success');
        });
    }

    //Pls work on psl
});