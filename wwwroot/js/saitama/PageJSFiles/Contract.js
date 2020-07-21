$(document).ready(function () {

    document.querySelector('#btnOpenUploadContractModal').addEventListener('click', function () {
        $('#uploadContractModal').modal('toggle');
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
            "sourceCategory": "20d10859-02dc-4353-952c-4889ca9b88ea",
            "sourceId": "<source to be replaced>",
            "contentLocationUri": "<to be replaced>",
            "sourceProperties": {
                "properties": [
                    {
                        "key": "d6d30bfa-a201-458b-903f-88489b32f9d6", //Contract Date
                        "values": [`${formatDate(document.querySelector(`#contractDate`).value)}`]
                    },
                    {
                        "key": "9b861559-2ab9-41e1-943e-c362d03bb2ae", //File Name
                        "values": [oldFileName]
                    },
                    {
                        "key": "2f959c20-94b4-4b7b-85c2-961182f2c247", //Contract ID
                        "values": [`${codeGenerator(`PSL_CNTRT`, 15)}`]
                    },
                    {
                        "key": "7b8a7392-3c4d-4470-9b03-93d346fa5506", // Contract Name
                        "values": [`${document.querySelector(`#contractName`).value}`]
                    },
                    {
                        "key": "b2ac9f9d-e765-4d61-b30d-038f705d24ea", // Contract Amount
                        "values": [`${document.querySelector(`#contractAmount`).value}`]
                    },
                    {
                        "key": "23df1a2a-f22c-43a5-b270-f569cc1688b5", // Other Party Name / Business Partner ID
                        "values": [`${document.querySelector(`#contractPartner`).value}`]
                    },
                    {
                        "key": "91232b04-6003-43b1-8f3a-e91b4a92bf49", // Type of Contract
                        "values": [`${document.querySelector(`#contractType`).value}`]
                    },
                ]
            }
        }
    }

    document.querySelector('#btnOpenContractSearchModal').addEventListener('click', function () {
        $('#contractSearchModal').modal('toggle');
    });

    function searchForDocument(date, recieptType, clientName) {

        let searchFor = `?sourceid=/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source&";
        searchFor += "sourcecategories=[\"20d10859-02dc-4353-952c-4889ca9b88ea\"]";
        searchFor += "&sourceproperties={\"d6d30bfa-a201-458b-903f-88489b32f9d6\":[\"${date}\"]\,"91232b04-6003-43b1-8f3a-e91b4a92bf49\":[\"${recieptType}\"]\,
                        "7b8a7392-3c4d-4470-9b03-93d346fa5506\":[\"${clientName}\"]}`;

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
                        view += `<li class="list-group-item">Document ID: <span id="doc-id-${data.sourceProperties[8].value}">${data.sourceProperties[8].value}</span></li>
                                 <li class="list-group-item">File Name: <span id="file-name-${data.sourceProperties[28].value}">${data.sourceProperties[28].value}</span></li>
                                 <li class="list-group-item">File Type: <span id="file-name-${data.sourceProperties[10].value}"> <span style="font-size: 15px" class="text-primary ${favicon[data.sourceProperties[10].value.toLowerCase()]}"></span> _________ </span> 
                                      <a target="_blank" href="${`https://achanademo.d-velop.cloud/` + data._links.self.href}" class="btn btn-sm btn-primary text-right">Preview</a> 
                                      <a href="${`https://achanademo.d-velop.cloud/` + data._links.mainblobcontent.href}" class="btn btn-sm btn-success text-right">Download</a></li>`;

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

});