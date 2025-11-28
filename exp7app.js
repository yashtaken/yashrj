document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('setCookie').addEventListener('click', async ()=>{
    const res = await fetch('/set-cookie');
    const txt = await res.text();
    document.getElementById('cookieResult').innerText = txt;
  });

  document.getElementById('getCookie').addEventListener('click', async ()=>{
    const res = await fetch('/get-cookie');
    const txt = await res.text();
    document.getElementById('cookieResult').innerText = txt;
  });

  document.getElementById('delCookie').addEventListener('click', async ()=>{
    const res = await fetch('/delete-cookie');
    const txt = await res.text();
    document.getElementById('cookieResult').innerText = txt;
  });

  document.getElementById('sess').addEventListener('click', async ()=>{
    const res = await fetch('/session');
    const txt = await res.text();
    document.getElementById('sessResult').innerText = txt;
  });

  document.getElementById('destroySess').addEventListener('click', async ()=>{
    const res = await fetch('/destroy-session');
    const txt = await res.text();
    document.getElementById('sessResult').innerText = txt;
  });
});
