$(document).ready(function () {

    document.querySelector('#btnOpenUploadReceiptModal').addEventListener('click', function () {
        document.querySelector(`#receiptID`).value = codeGenerator(`PSL_RECPT`, 10)
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
            "sourceCategory": "e19c9001-66cd-404e-b524-bb71ca19a4cd",
            "sourceId": "<source to be replaced>",
            "contentLocationUri": "<to be replaced>",
            "sourceProperties": {
                "properties": [
                    {
                        "key": "5ee78611-d4a1-458b-a872-8fef7dce9561", // --Receipt Date
                        "values": [`${formatDate(document.querySelector(`#receiptDate`).value)}`]
                    },
                    {
                        "key": "f6d948fb-f757-4c88-83bd-6e1e7da9e2f0", // --File Name
                        "values": [oldFileName]
                    },
                    {
                        "key": "12e326a2-109a-43d0-900e-ddf7bafbf794", // --Reference ID
                        "values": [`${codeGenerator(`PSL_RECPT`, 15)}`]
                    },
                    {
                        "key": "52bc288b-e7da-4542-ba95-48988ccd78b2", // --Receipt Type
                        "values": [`${document.querySelector(`#receiptType`).value}`]
                    },
                    {
                        "key": "5ba05b2b-6327-4dd1-b4fd-38fe15849cc0", // --Amount
                        "values": [`${document.querySelector(`#receiptAmount`).value}`]
                    },
                    {
                        "key": "9826cdb6-7523-4aac-a92a-58a5914e7bf6", // --Other Party Name / Business Partner ID
                        "values": [`${document.querySelector(`#receiptPartner`).value}`]
                    }
                ]
            }
        }
    }

    document.querySelector('#btnOpenReceiptSearchModal').addEventListener('click', function () {
        $('#receiptSearchModal').modal('toggle');
    });
    
    function searchForDocument(date, recieptType, RefNo) {

        let searchFor = `?sourceid=/dms/r/44d69246-11b3-40e1-810b-1e746d219515/source&";
        searchFor += "sourcecategories=[\"e19c9001-66cd-404e-b524-bb71ca19a4cd\"]";
        searchFor += "&sourceproperties={\"5ee78611-d4a1-458b-a872-8fef7dce9561\":[\"${date}\"]\,"52bc288b-e7da-4542-ba95-48988ccd78b2\":[\"${recieptType}\"]\,
                        "12e326a2-109a-43d0-900e-ddf7bafbf794\":[\"${RefNo}\"]}`;

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

                        let documentId = data.sourceProperties.filter(x => x.key === 'property_document_id')[0].value;
                        let fileName = data.sourceProperties.filter(x => x.key === 'f6d948fb-f757-4c88-83bd-6e1e7da9e2f0')[0].value;
                        let fileType = data.sourceProperties.filter(x => x.key === 'property_filetype')[0].value;

                        view += `<li class="list-group-item">Document ID: <span id="doc-id-${documentId}">${documentId}</span></li>
                                 <li class="list-group-item">File Name: <span id="file-name-${fileName}">${fileName}</span></li>
                                 <li class="list-group-item">File Type: <span id="file-name-${fileType}"> <span style="font-size: 15px" class="text-primary ${favicon[fileType.toLowerCase()]}"></span> _________ </span> 
                                      <a id="${data._links.self.href}" class="btn btn-sm btn-primary text-right preview-document-receipt">Preview</a> 
                                      <a id="${data._links.self.href}" class="btn btn-sm btn-success text-right download-document-receipt">Download</a></li>`;

                    });
                    $('#ul-receipt-files').html(view);
                    
                }
                else {
                    $('#ul-receipt-files').html(`<li class="list-group-item">No Data Available for This User</li>`);
                }

            } catch (error) {
                console.log(error);
            }

        });
    });

    $(document).on('click', '.preview-document-receipt', function () {

        makeAPIRequest('/api/dvelop/preview-document', 'POST', { query: this.id }, function (res) {
            try {
                console.log(res);
                initiatePreviewFile(res);
            } catch (error) {
                console.log(error);
            }

        });
        
    });

    $(document).on('click', '.download-document-receipt', function () {
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