//Preview js file for referencing.
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
