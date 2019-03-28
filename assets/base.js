var cert = "";
window.onload = function () {
  autosize(document.querySelectorAll('textarea.resize'));
  document.getElementById("button_get_cert").addEventListener("click", getCert);
  document.getElementById("button_encrypt").addEventListener("click", encryptText);
  document.getElementById("button_print").addEventListener("click", printPage);
}

function getCert() {
  urlInput = document.getElementById('input_url');
  valid = urlInput.checkValidity();
  if (valid) {
    const urlObj = new URL(urlInput.value);
    const url = urlObj.hostname;
    var certReq = new XMLHttpRequest();
    certReq.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        window.cert = JSON.parse(this.responseText)
        showCertData(window.cert)
      } else if (this.readyState == 4 && this.status != 200) {
        alert("Fehler beim Abruf des Zertifikats. Bitte kontrollieren Sie die URL.");
      }
    }

    certReq.open("GET", "/cert/" + url);
    certReq.send();
  } else {
    alert('Diese URL ist nicht valide. Bitte geben Sie eine Adresse im Format "https://www.ct.de" an.')
  }
}

function showCertData() {
  fpElement = document.getElementById("fp_display");
  fpElement.value = window.cert.fingerprint;
  fpElement.classList.add('validfp');
  var textElement = document.getElementById("input_text");
  textElement.readOnly = false;
  textElement.placeholder = "Geben Sie hier Ihre Nachricht ein."
  var buttonEncrypt = document.getElementById("button_encrypt");
  buttonEncrypt.classList.add("visible");
}

function encryptText() {
  var text = document.getElementById("input_text").value;
  if (text.length == 0) {
    alert("Bitte geben Sie eine Nachricht ein!");
    return false;
  }
  rawcert = window.cert.pem.replace(/.?-+\w* \w*-+.?/g, "");
  var randomCipher = CryptoJS.lib.WordArray.random(16);
  delete randomCipher;
  var encrypted = CryptoJS.AES.encrypt(text, rawcert + randomCipher).toString();
  prepareOutput(encrypted);
}

function prepareOutput(encrypted) {
  var out_encrypted = document.getElementById("output_crypted");
  var fp = document.getElementById("fp_display").value;
  const url = new URL(document.getElementById('input_url').value).hostname;
  prefix = "Diese Nachricht wurde DSGVO-konform mithilfe des folgenden Zertifikats verschlüsselt:\n"
  prefix = prefix + "Domain: " + url;
  prefix = prefix + "\nFingerprint: " + fp;
  prefix = prefix + "\n\n===============MESSAGE BEGIN=================\n\n";
  suffix = "\n\n===============MESSAGE END===================\n\n"
  suffix = suffix + "c't-Krypto-Brief – ©2019 c't Magazin für computer technik"

  var crypt_text = prefix + encrypted + suffix;

  const baff = baffle('#output_crypted').start();
  out_encrypted.classList.add("visible");
  baff.text(text => crypt_text);
  baff.reveal(1000, 1000, resizeText);
}

function resizeText() {
  var buttonPrint = document.getElementById("button_print");
  buttonPrint.classList.add("visible");
}

function printPage() {
  window.print()
}