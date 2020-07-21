$(document).ready(function () {

    document.querySelector('#btnOpenUploadFileModal').addEventListener('click', function () {
        $('#uploadFileModal').modal('toggle');
    });

    document.querySelector('#btnOpenFileSearchModal').addEventListener('click', function () {
        $('#fileSearchModal').modal('toggle');
    });

    document.querySelector('#btnUploadFile').addEventListener('click', function () {
        document.querySelector('#txtUploadfile').click();
    });

    $('#txtUploadfile').on('change', function (event) {

        let fileName = event.target.files[0].name;
        let fileType = event.target.files[0].type;
        let fileExtension = getFileExtension(fileName);

        $('#pSelectedFileName').text(fileName);
        $('#pSelectedFileExt').text(fileExtension);
        $('#pSelectedFileType').text(fileType);
    });

    document.querySelector('#btnSendFile').addEventListener('click', function () {
        document.querySelector('#btnSumbit').click();
    });

    //

    document.querySelector('#btnSumbit').addEventListener('click', function (evnt) {
        evnt.preventDefault();
        if (document.querySelector('#selectUser').value != -1 && document.querySelector('#selectCategory').value != -1 ) {

            const files = document.querySelector('[type=file]').files;
            const formData = new FormData();

            // Append files to files array
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                formData.append('file', file);
            }

            postFile(formData);
            $('#txtUploadfile').val("");
        }
        else {
            console.log('Select User and Category');
        }
       
    });


    function getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    }

    function postFile(formData) {
        try {
            
            makeAPIRequest('/api/dvelop/uploadfile', 'FILE', formData, function (data) {
                
                try {
                    data = JSON.parse(data);
                    postFileToD3(data)

                } catch (error) {
                    console.log(error);
                }
                
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function postFileToD3(data) {
        pageLoader('show');

        makeAPIRequest('/api/dvelop/savefile', 'POST', { map: JSON.stringify(createMap(data.fileName, data.oldFileName)), filePath: data.filePath }, function (res) {
            try {
                console.log({ res });

                if (res != "D3 sessionId error") {
                    $('#uploadFileModal').modal('hide');
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

    function searchForDocument(category, userName) {

        let searchFor = `?sourceid=/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source&";
        searchFor += "sourcecategories=[\"${category}\"]";
        searchFor += "&sourceproperties={\"ffa22f8c-787f-4c40-9b3f-b5f358e3a4cb\":[\"${userName}\"]}`;

        return { query: searchFor };
    }

    function createMap(fileName, oldFileName) {

        return  {
            "filename": fileName,
            "sourceCategory": document.querySelector("#selectCategory").value,
            "sourceId": "/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source",
            "contentLocationUri": "<to be replaced>",
            "sourceProperties": {
                "properties": [
                    {
                        "key": "a075b366-2c42-48d7-8269-4619de2ab29c",
                        "values": [`${getTodayDate()}`]
                    },
                    {
                        "key": "9b861559-2ab9-41e1-943e-c362d03bb2ae",
                        "values": [oldFileName]
                    },
                    {
                        "key": "ffa22f8c-787f-4c40-9b3f-b5f358e3a4cb",
                        "values": [`${document.querySelector(`#selectUser`).value}`]
                    }
                ]
            }
        }

    }

    function createReceiptMap(fileName, oldFileName) {
        return {
            "filename": fileName,
            "sourceCategory": document.querySelector("#selectCategory").value,
            "sourceId": "/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source",
            "contentLocationUri": "<to be replaced>",
            "sourceProperties": {
                "properties": [
                    {
                        "key": "fe508723-4bad-43ff-91e5-3811ebc73dbd", //Receipt Date
                        "values": [`${getTodayDate()}`]
                    },
                    {
                        "key": "9b861559-2ab9-41e1-943e-c362d03bb2ae", //File Name
                        "values": [oldFileName]
                    },
                    {
                        "key": "a51f3728-9fb7-4e3a-8397-f3445f593e33", //Reference ID
                        "values": [`${codeGenerator(`PSL_RECPT`, 15)}`]
                    },
                    {
                        "key": "03c15d36-1e46-41b8-a538-874064b6beac", // Receipt Type
                        "values": [``]
                    },
                    {
                        "key": "7638820e-cf51-4b72-acf4-1f48ced69c7c", // Amount Paid
                        "values": [``]
                    },
                    {
                        "key": "23df1a2a-f22c-43a5-b270-f569cc1688b5", // Other Party Name / Business Partner ID
                        "values": [``]
                    }
                ]
            }
        }
    }

    function createContractMap(fileName, oldFileName) {
        return {
            "filename": fileName,
            "sourceCategory": document.querySelector("#selectCategory").value,
            "sourceId": "/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source",
            "contentLocationUri": "<to be replaced>",
            "sourceProperties": {
                "properties": [
                    {
                        "key": "d6d30bfa-a201-458b-903f-88489b32f9d6", //Contract Date
                        "values": [`${getTodayDate()}`]
                    },
                    {
                        "key": "9b861559-2ab9-41e1-943e-c362d03bb2ae", //File Name
                        "values": [oldFileName]
                    },
                    {
                        "key": "2f959c20-94b4-4b7b-85c2-961182f2c247", //Contract ID
                        "values": [`${codeGenerator(`PSL_RECPT`, 15)}`]
                    },
                    {
                        "key": "7b8a7392-3c4d-4470-9b03-93d346fa5506", // Contract Name
                        "values": [``]
                    },
                    {
                        "key": "b2ac9f9d-e765-4d61-b30d-038f705d24ea", // Contract Amount
                        "values": [``]
                    },
                    {
                        "key": "23df1a2a-f22c-43a5-b270-f569cc1688b5", // Other Party Name / Business Partner ID
                        "values": [``]
                    },
                    {
                        "key": "91232b04-6003-43b1-8f3a-e91b4a92bf49", // Type of Contract
                        "values": [``]
                    },
                ]
            }
        }
    }

    document.querySelector('#catId').addEventListener('change', function () {
    });

    document.querySelector('#btnSearcDoc').addEventListener('click', function () {

        let userName = document.querySelector('#selectSearchUser').value;
        let category = document.querySelector('#catId').value;
        let favicon = {
            pdf: 'fa fa-file-pdf', docx: 'fa fa-file-word', doc: 'fa fa-file-word', xlsx: 'fa fa-file-excel',
            xls: 'fa fa-file-excel', png: 'fa fa-file-image', jpg: 'fa fa-file-image', jpeg: 'fa fa-file-image',
            txt: 'fa fa-file'
        }

        makeAPIRequest('/api/dvelop/searhDocument/', 'POST', searchForDocument(category, userName), function (res) {
            try {
                let { _links, items, page } = JSON.parse(res);
                
                $('#ul-all-files').html('');

                if (items.length > 0) {

                    let view = '';
                    items.forEach(data => {
                        if (data.sourceCategories[1] === category) {
                            view += `<li class="list-group-item">Document ID: <span id="doc-id-${data.sourceProperties[8].value}">${data.sourceProperties[8].value}</span></li>
                                 <li class="list-group-item">File Name: <span id="file-name-${data.sourceProperties[23].value}">${data.sourceProperties[23].value}</span></li>
                                 <li class="list-group-item">File Type: <span id="file-name-${data.sourceProperties[10].value}"> <span style="font-size: 15px" class="text-primary ${favicon[data.sourceProperties[10].value.toLowerCase()]}"></span> _________ </span> 
                                      <a href="${`https://achanademo.d-velop.cloud/` + data._links.mainblobcontent.href}" class="btn btn-sm btn-success text-right">Download</a></li>`;
                        }
                        
                    });

                    $('#ul-all-files').html(view);
                }
                else {
                    $('#ul-all-files').html(`<li class="list-group-item">No Data Available for This User</li>`);
                }
               
            } catch (error) {
                console.log(error);
            }

        });
    });

    

});