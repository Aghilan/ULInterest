const API_ENDPOINT =  "https://test-prod-api.herokuapp.com/products";

var lastRenderedGrid = 0,
    allObjects;

$(document).ready(function () {
    $.getJSON(API_ENDPOINT, function (data) {
      allObjects = data.products;
      initialRender();
      
      var win = $(window);
      win.scroll(function () {
  		  var scrollHeight = $(document).height() - win.height();

        //PausePagination ensures synchronous update of grids
        if (!window.pausePagination && scrollHeight > (win.scrollTop() * 0.7)) {
    			window.pausePagination = true;
          lastRenderedGrid+= 9;
          renderCardSet(lastRenderedGrid);
        }
  	  });
    });
});

$(window).resize(function () {
    rearrangeGrids();
});

function rearrangeGrids () {
  var grids = [].slice.call($('.grid-card'));
  var collectionWidth = $('.grid-collection')[0].clientWidth;
  var gridWidth = grids[0].clientWidth;
  var numCols = Math.round(collectionWidth / gridWidth);
  var colHeights = new Array(numCols);
  for (var i = 0; i < grids.length; i++) {
      if (i < numCols) {
          colHeights[i] = 0;
      }
      var grid = grids[i];
      var shortestColumn = getShortestColumn(colHeights);
      grid.style.transform = `translateX(${shortestColumn * grid.clientWidth}px) translateY(${colHeights[shortestColumn]}px)`;
      colHeights[shortestColumn] += grid.scrollHeight;
      grid.style.visibility = 'visible';
  }
}

function initialRender () {
  $(".grid-collection").hide().fadeIn('slow');
  renderCardSet(lastRenderedGrid);
  lastRenderedGrid = 6;
}


function getShortestColumn(colHeights) {
    var shortestIndex = 0;
    var minHeight = colHeights[0];
    for (var i = 1; i < colHeights.length; i++) {
        if (colHeights[i] < colHeights[shortestIndex]) {
            shortestIndex = i;
            minHeight = colHeights[i];
        }
    }
    return shortestIndex;
}

function renderCardSet (setIndex) {
  var firstRow = renderContentRow(setIndex);
  var secondRow = renderContentRow(setIndex+3);
  var thirdRow = renderContentRow(setIndex+6);
  
  var allImages = [];
  allImages = allImages.concat($(firstRow).find('img').toArray(),$(secondRow).find('img').toArray(), $(thirdRow).find('img').toArray());

  $('.grid-collection').append(firstRow).append(secondRow).append(thirdRow);

  var imagesCount = 9,
      counter = 0;

  [].forEach.call( allImages, function( img ) {
      img.addEventListener( 'load', incrementCounter, false );
  } );

  function incrementCounter() {
      counter++;
      if ( counter === imagesCount ) {
          window.pausePagination = false;
          $('.spinner').hide();
          rearrangeGrids();
      }
  }
}

function renderContentRow (rowIndex) {
  var $left = $("<div>", {class: "grid-card"}).html(renderContentGrid(rowIndex)) ;
  var $center = $("<div>", {class: "grid-card"}).html(renderContentGrid(rowIndex+1));
  var $right = $("<div>", {class: "grid-card"}).html(renderContentGrid(rowIndex+2));
  return $left.add($center).add($right);
}

function capitalizeString( value ) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderContentGrid(index) {
  $('#temp img').attr('src', allObjects[index].img);
  $('#temp h4').html("Name : " + capitalizeString(allObjects[index].name));
  return $("#temp").html();
}
