let urlParams = new URLSearchParams(window.location.search);
let previewFilePath = urlParams.get('PreviewFile');
console.log(previewFilePath);

let style = ''

document.querySelector('#render-file').innerHTML = `<object style="" data="${path_u_ + 'Data/D3_Previews/' + previewFilePath}" width="700" height="800"></object>`;