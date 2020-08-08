let urlParams = new URLSearchParams(window.location.search);
let previewFilePath = urlParams.get('PreviewFile');
console.log(previewFilePath);

document.querySelector('#render-file').innerHTML = `<object data="${path_u_ + 'Data/D3_Previews/' + previewFilePath}" width="700" height="800"></object>`;