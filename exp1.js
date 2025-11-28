$(function() {
  // Disable right click
  $(document).on('contextmenu', function(e) {
    e.preventDefault();
    // optional flash
    // alert('Right click disabled');
  });

  // Hover to change color of paragraph
  $('#p1').on('mouseenter', function() {
    $(this).css('color', 'red');
  }).on('mouseleave', function() {
    $(this).css('color', '');
  });

  // Toggle message on button click
  $('#toggleBtn').on('click', function() {
    $('#message').toggle();
    $(this).text($('#message').is(':visible') ? 'Hide Message' : 'Show Message');
  });

  // Click image to scroll to top
  $('#scrollTopImg').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });
});
