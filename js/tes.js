const resultsBlock = document.getElementById('results');
const spinner = document.getElementById('spinning');
const btnTrib = document.getElementById('btn-send-trib');
let content = '';

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

function waitingResults() {
    spinner.style.display = "block";
    resultsBlock.innerHTML = '';
    btnTrib.value = 'aguarde...';
    btnTrib.disabled = true;
}

function showResults(results) {
    spinner.style.display = "none";
    resultsBlock.innerHTML = `<span>${results}</span>`;
    btnTrib.value = 'pesquisar';
    btnTrib.disabled = false;
}

document.getElementById('trib-form').addEventListener("submit", function(event) {
    event.preventDefault();
    let keyword = document.getElementById('keyword').value;
    let tribunal = document.querySelector('input[name="tribunal"]:checked').value;
    const querystring = encodeQueryData({ 'keyword': keyword, 'tribunal': tribunal });
    const tesUrl = `https://tesesesumulas.com.br/?${querystring}`;
    waitingResults();

    //request
    fetch(`https://tesesesumulas.com.br/api/${tribunal.toLowerCase()}.php`, {
        "method": "POST",
        "headers": {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        "body": `keyword=${keyword}&tribunal=${tribunal}`
    })
    .then((res) => res.text())
    .then(function(res) {
        const obj = JSON.parse(res);
        if(obj.hasOwnProperty('total_sum') && obj.hasOwnProperty('total_rep')) {
            content = `Súmulas (${tribunal}): <code>${obj.total_sum}</code><br>`;
            content += `Teses (${tribunal}): <code>${obj.total_rep}</code>`;
            if(obj.total_sum !== 0 || obj.total_rep !== 0) {
                content += `<span id="tes-link">Consulte os textos e baixe o PDF <a href="${tesUrl}" target="_blank">aqui</a></span>`;
            }
        } else {
            content = 'Algo deu errado...';
            if(obj.hasOwnProperty('error')) {
                content += `<br>${obj.error}`;
            }
        }
        showResults(content);
    })
    .catch(console.error.bind(console));

});
 
 