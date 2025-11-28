$(function(){
  $('#btn-add').on('click', function(){
    $('#box').toggleClass('highlight');
  });

  $('#btn-pos').on('click', function(){
    var pos = $('#pos-box').position();
    var off = $('#pos-box').offset();
    $('#pos-output').html(
      '<strong>position()</strong>: top=' + pos.top + ', left=' + pos.left
      + '<br/><strong>offset()</strong>: top=' + off.top + ', left=' + off.left
    );
  });

  $('#btn-animate').on('click', function(){
    $('#anim-box').animate({
      padding: '30px',
      width: '300px'
    }, 800).animate({
      padding: '10px',
      width: '150px'
    }, 600);
  });
});
