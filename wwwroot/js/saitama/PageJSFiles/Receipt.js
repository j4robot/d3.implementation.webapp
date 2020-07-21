$(document).ready(function () {

    document.querySelector('#btnOpenUploadReceiptModal').addEventListener('click', function () {
        $('#uploadReceiptModal').modal('toggle');
    });

    document.querySelector('#btnUploadReceiptFile').addEventListener('click', function () {
        document.querySelector('#txtUploadReceiptfile').click();
    });

    $('#txtUploadReceiptfile').on('change', function (event) {

        $('#contractFileName').text(event.target.files[0].name);
    });

    document.querySelector('#btnSendReceiptFile').addEventListener('click', function () {
        document.querySelector('#btnSumbitReceipt').click();
    });

    document.querySelector('#btnSumbitReceipt').addEventListener('click', function (evnt) {
        evnt.preventDefault();
        if (true) {

            const files = document.querySelector('#txtUploadReceiptfile').files;
            const formData = new FormData();

            // Append files to files array
            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                formData.append('file', file);
            }

            postMasterFile(formData, createReceiptMap, 'uploadReceiptModal');
            $('#txtUploadReceiptfile').val("");
        }

    });

    function createReceiptMap(fileName, oldFileName) {
        return {
            "filename": fileName,
            "sourceCategory": "281340d3-9914-465e-8427-8505e2718395",
            "sourceId": "<source to be replaced>",
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
});