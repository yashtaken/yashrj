document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('btn-replace').addEventListener('click', async function(){
    const str = document.getElementById('str').value;
    const res = await fetch('/replace?text=' + encodeURIComponent(str));
    const txt = await res.text();
    document.getElementById('replace-result').innerText = txt;
  });

  document.getElementById('btn-calc').addEventListener('click', async function(){
    const op = document.getElementById('op').value;
    const a = document.getElementById('a').value;
    const b = document.getElementById('b').value;
    const res = await fetch(`/calc?op=${encodeURIComponent(op)}&a=${a}&b=${b}`);
    const json = await res.json();
    document.getElementById('calc-result').innerText = JSON.stringify(json);
  });
});
