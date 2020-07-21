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


});