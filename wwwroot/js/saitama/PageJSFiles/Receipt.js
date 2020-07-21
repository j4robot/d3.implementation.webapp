$(document).ready(function () {

    document.querySelector('#btnOpenUploadReceiptModal').addEventListener('click', function () {
        $('#uploadReceiptModal').modal('toggle');
    });

    document.querySelector('#btnUploadReceiptFile').addEventListener('click', function () {
        document.querySelector('#txtUploadReceiptfile').click();
    });

    $('#txtUploadReceiptfile').on('change', function (event) {

        $('#receiptFileName').text(event.target.files[0].name);
    });

    document.querySelector('#btnSendReceiptFile').addEventListener('click', function () {
        document.querySelector('#btnSumbitReceipt').click();
    });

    document.querySelector('#btnSumbitReceipt').addEventListener('click', function (evnt) {
        evnt.preventDefault();

        const files = document.querySelector('#txtUploadReceiptfile').files;
        const formData = new FormData();

        // Append files to files array
        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            formData.append('file', file);
        }

        postMasterFile(formData, createReceiptMap, 'uploadReceiptModal');
        $('#txtUploadReceiptfile').val("");

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
                        "values": [`${formatDate(document.querySelector(`#receiptDate`).value)}`]
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
                        "values": [`${document.querySelector(`#receiptType`).value}`]
                    },
                    {
                        "key": "b172bd7a-27f7-442d-bf4b-8ea7439dcca5", // Amount
                        "values": [`${document.querySelector(`#receiptAmount`).value}`]
                    },
                    {
                        "key": "23df1a2a-f22c-43a5-b270-f569cc1688b5", // Other Party Name / Business Partner ID
                        "values": [`${document.querySelector(`#receiptPartner`).value}`]
                    }
                ]
            }
        }
    }

    document.querySelector('#btnOpenReceiptSearchModal').addEventListener('click', function () {
        $('#receiptSearchModal').modal('toggle');
    });
    
    function searchForDocument(date, recieptType, clientName) {

        let searchFor = `?sourceid=/dms/r/73215d3a-ea55-4555-9817-9fb1d79abc59/source&";
        searchFor += "sourcecategories=[\"281340d3-9914-465e-8427-8505e2718395\"]";
        searchFor += "&sourceproperties={\"fe508723-4bad-43ff-91e5-3811ebc73dbd\":[\"${date}\"]\,"03c15d36-1e46-41b8-a538-874064b6beac\":[\"${recieptType}\"]\,
                        "23df1a2a-f22c-43a5-b270-f569cc1688b5\":[\"${clientName}\"]}`;

        return { query: searchFor };
    }

    document.querySelector('#btnSearcDoc').addEventListener('click', function () {
        let date = document.querySelector(`#receiptDateSearch`).value
        let recieptType = document.querySelector(`#receiptTypeSearch`).value
        let clientName = document.querySelector(`#receiptPartnerSearch`).value
        
        let favicon = {
            pdf: 'fa fa-file-pdf', docx: 'fa fa-file-word', doc: 'fa fa-file-word', xlsx: 'fa fa-file-excel',
            xls: 'fa fa-file-excel', png: 'fa fa-file-image', jpg: 'fa fa-file-image', jpeg: 'fa fa-file-image',
            txt: 'fa fa-file'
        }

        makeAPIRequest('/api/dvelop/searhDocument/', 'POST', searchForDocument(date, recieptType, clientName), function (res) {
            try {
                let { _links, items, page } = JSON.parse(res);

                console.log({ _links, items, page });

                $('#ul-receipt-files').html('');

                if (items.length > 0) {

                    let view = '';
                    items.forEach(data => {
                        view += `<li class="list-group-item">Document ID: <span id="doc-id-${data.sourceProperties[8].value}">${data.sourceProperties[8].value}</span></li>
                                 <li class="list-group-item">File Name: <span id="file-name-${data.sourceProperties[24].value}">${data.sourceProperties[24].value}</span></li>
                                 <li class="list-group-item">File Type: <span id="file-name-${data.sourceProperties[10].value}"> <span style="font-size: 15px" class="text-primary ${favicon[data.sourceProperties[10].value.toLowerCase()]}"></span> _________ </span> 
                                      <a target="_blank" href="${`https://achanademo.d-velop.cloud/` + data._links.self.href}" class="btn btn-sm btn-primary text-right">Preview</a> 
                                      <a href="${`https://achanademo.d-velop.cloud/` + data._links.mainblobcontent.href}" class="btn btn-sm btn-success text-right">Download</a></li>`;

                    });

                    $('#ul-receipt-files').html(view);
                    //<iframe src="https://www.w3schools.com" title="W3Schools Free Online Web Tutorials"></iframe>
                }
                else {
                    $('#ul-receipt-files').html(`<li class="list-group-item">No Data Available for This User</li>`);
                }

            } catch (error) {
                console.log(error);
            }

        });
    });

});