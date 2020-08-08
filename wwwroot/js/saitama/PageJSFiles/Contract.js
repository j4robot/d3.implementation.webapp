$(document).ready(function () {

    document.querySelector('#btnOpenUploadContractModal').addEventListener('click', function () {
        $('#uploadContractModal').modal('toggle');
        document.querySelector(`#contractID`).value = codeGenerator(`PSL_RECPT`, 10);
    });

    document.querySelector('#btnUploadContractFile').addEventListener('click', function () {
        document.querySelector('#txtUploadContractfile').click();
    });

    $('#txtUploadContractfile').on('change', function (event) {

        $('#contractFileName').text(event.target.files[0].name);
    });

    document.querySelector('#btnSendContractFile').addEventListener('click', function () {
        document.querySelector('#btnSumbitContract').click();
    });

    document.querySelector('#btnSumbitContract').addEventListener('click', function (evnt) {
        evnt.preventDefault();
        if (true) {

            const files = document.querySelector('#txtUploadContractfile').files;
            const formData = new FormData();

            // Append files to files array
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                formData.append('file', file);
            }

            postMasterFile(formData, createContractMap, 'uploadContractModal');
            $('#txtUploadContractfile').val("");
        }

    });

    function createContractMap(fileName, oldFileName) {
        return {
            "filename": fileName,
            "sourceCategory": "55c3fc23-89d7-46d8-af5f-fbc3ca3260f3",
            "sourceId": "<source to be replaced>",
            "contentLocationUri": "<to be replaced>",
            "sourceProperties": {
                "properties": [
                    {
                        "key": "71cf0e44-2822-4843-83f9-42335b937694", //Contract Date
                        "values": [`${formatDate(document.querySelector(`#contractDate`).value)}`]
                    },
                    {
                        "key": "f6d948fb-f757-4c88-83bd-6e1e7da9e2f0", //File Name
                        "values": [oldFileName]
                    },
                    {
                        "key": "3dc5e9c1-cb1f-401a-9a10-d60dd4aa3e9e", //Contract ID
                        "values": [`${document.querySelector(`#contractID`).value}`]
                    },
                    {
                        "key": "803c3412-f1f2-4ca4-8a94-186018c77c7b", // Contract Name
                        "values": [`${document.querySelector(`#contractName`).value}`]
                    },
                    {
                        "key": "7bad7561-d75e-4419-bcf0-f93bc5368482", // Contract Amount
                        "values": [`${document.querySelector(`#contractAmount`).value}`]
                    },
                    {
                        "key": "9826cdb6-7523-4aac-a92a-58a5914e7bf6", // Other Party Name / Business Partner ID
                        "values": [`${document.querySelector(`#contractPartner`).value}`]
                    },
                    {
                        "key": "0f003620-42eb-4b6e-9a21-9556bca1a567", // Type of Contract
                        "values": [`${document.querySelector(`#contractType`).value}`]
                    },
                ]
            }
        }
    }

    document.querySelector('#btnOpenContractSearchModal').addEventListener('click', function () {
        $('#contractSearchModal').modal('toggle');
    });

    function searchForDocument(date, recieptType, contractID) {

        let searchFor = `?sourceid=/dms/r/44d69246-11b3-40e1-810b-1e746d219515/source&";
        searchFor += "sourcecategories=[\"55c3fc23-89d7-46d8-af5f-fbc3ca3260f3\"]";
        searchFor += "&sourceproperties={\"71cf0e44-2822-4843-83f9-42335b937694\":[\"${date}\"]\,"0f003620-42eb-4b6e-9a21-9556bca1a567\":[\"${recieptType}\"]\,
                        "3dc5e9c1-cb1f-401a-9a10-d60dd4aa3e9e\":[\"${contractID}\"]}`;

        return { query: searchFor };
    }

    document.querySelector('#btnSearcContractDoc').addEventListener('click', function () {
        let date = document.querySelector(`#contractDateSearch`).value
        let recieptType = document.querySelector(`#contractTypeSearch`).value
        let clientName = document.querySelector(`#contractPartnerSearch`).value

        let favicon = {
            pdf: 'fa fa-file-pdf', docx: 'fa fa-file-word', doc: 'fa fa-file-word', xlsx: 'fa fa-file-excel',
            xls: 'fa fa-file-excel', png: 'fa fa-file-image', jpg: 'fa fa-file-image', jpeg: 'fa fa-file-image',
            txt: 'fa fa-file'
        }

        makeAPIRequest('/api/dvelop/searhDocument/', 'POST', searchForDocument(date, recieptType, clientName), function (res) {
            try {
                let { _links, items, page } = JSON.parse(res);

                console.log({ _links, items, page });

                $('#ul-contract-files').html('');

                if (items.length > 0) {

                    let view = '';
                    items.forEach(data => {
                        let documentId = data.sourceProperties.filter(x => x.key === 'property_document_id')[0].value;
                        let fileName = data.sourceProperties.filter(x => x.key === 'f6d948fb-f757-4c88-83bd-6e1e7da9e2f0')[0].value;
                        let fileType = data.sourceProperties.filter(x => x.key === 'property_filetype')[0].value;

                        view += `<li class="list-group-item">Document ID: <span id="doc-id-${documentId}">${documentId}</span></li>
                                 <li class="list-group-item">File Name: <span id="file-name-${fileName}">${fileName}</span></li>
                                 <li class="list-group-item">File Type: <span id="file-name-${fileType}"> <span style="font-size: 15px" class="text-primary ${favicon[fileType.toLowerCase()]}"></span> _________ </span> 
                                      <a id="${data._links.self.href}" class="btn btn-sm btn-primary text-right preview-document-contract">Preview</a> 
                                      <a id="${data._links.self.href}" class="btn btn-sm btn-success text-right download-document-contract">Download</a></li>`;

                    });

                    $('#ul-contract-files').html(view);
                }
                else {
                    $('#ul-contract-files').html(`<li class="list-group-item">No Data Available for This User</li>`);
                }

            } catch (error) {
                console.log(error);
            }

        });
    });

    $(document).on('click', '.preview-document-contract', function () {

        makeAPIRequest('/api/dvelop/preview-document', 'POST', { query: this.id }, function (res) {
            try {
                console.log(res);
                initiatePreviewFile(res);
            } catch (error) {
                console.log(error);
            }

        });

    });

    $(document).on('click', '.download-document-contract', function () {
        console.log(true, 'download');
        makeAPIRequest('/api/dvelop/download-document', 'POST', { query: this.id }, function (res) {
            try {
                console.log(res);
                initiateDownloadFile(res);
            } catch (error) {
                console.log(error);
            }

        });

    });

    function initiateDownloadFile(fileName) {

        let element = document.createElement('a');
        element.setAttribute('href', path_u_ + 'Data/D3_Downloads/' + fileName);
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function initiatePreviewFile(fileName) {

        let pageUrl = path_u_ + 'Home/Language?PreviewFile=' + fileName;

        window.open(pageUrl, "_blank");
    }

});