/*
	WebPlotDigitizer - http://arohatgi.info/WebPlotDigitizer

	Version 2.0

	Copyright 2010 Ankit Rohatgi <ankitrohatgi@hotmail.com>

	This file is part of WebPlotDigitizer.

    WebPlotDigitizer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebPlotDigitizer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebPlotDigitizer.  If not, see <http://www.gnu.org/licenses/>.


*/

/* This file contains autodetections functions */


/* Autodetection variables */
var fg_color = [0,0,0];
var bg_color = [255,255,255];
var colorPickerMode = 'fg';

var testImgCanvas;
var testImgContext;

var boxCoordinates = [0,0,1,1];
var drawingBox = false;
var drawingPen = false;
var drawingEraser = false;

var binaryData;


function colorPickerWindow(cmode)
{
    colorPickerMode = cmode;
    if(cmode == 'fg')
    {    
      showPopup('colorPickerFG');
    }
    else if(cmode == 'bg')
    {
       showPopup('colorPickerBG');
    }
}

function pickColor()
{
	//colorPickerMode = cmode;
	removeAllMouseEvents();
	addMouseEvent('click',colorPicker,true);
}

function colorPicker(ev)
{
	xi = ev.layerX;
	yi = ev.layerY;
	
	iData = ctx.getImageData(cx0,cy0,currentImageWidth,currentImageHeight);
	if ((xi < currentImageWidth+cx0) && (yi < currentImageHeight+cy0) && (xi > cx0) && (yi > cy0))
	{
		ii = xi - cx0;
		jj = yi - cy0;

		var index = jj*4*currentImageWidth + ii*4;
		var PickedColor = [iData.data[index], iData.data[index+1], iData.data[index+2]];
		redEl = document.getElementById('color_red');
		greenEl = document.getElementById('color_green');
		blueEl = document.getElementById('color_blue');
				
		canvas.removeEventListener('click',colorPicker,true);
		
		if(colorPickerMode == 'fg')
		{
			fg_color = PickedColor;
			var fgbtn = document.getElementById('autoFGBtn');
			fgbtn.style.borderColor = "rgb(" + fg_color[0] +"," + fg_color[1] +"," + fg_color[2] +")";
			redEl = document.getElementById('color_red_fg');
			greenEl = document.getElementById('color_green_fg');
			blueEl = document.getElementById('color_blue_fg');
			showPopup('colorPickerFG');
		}
		else if (colorPickerMode == 'bg')
		{
			bg_color = PickedColor;
			var bgbtn = document.getElementById('autoBGBtn');
			bgbtn.style.borderColor = "rgb(" + bg_color[0] +"," + bg_color[1] +"," + bg_color[2] +")";
			redEl = document.getElementById('color_red_bg');
			greenEl = document.getElementById('color_green_bg');
			blueEl = document.getElementById('color_blue_bg');
			showPopup('colorPickerBG');
		}
		
		redEl.value = PickedColor[0];
		greenEl.value = PickedColor[1];
		blueEl.value = PickedColor[2];
	}	
}

function boxPaint()
{
	removeAllMouseEvents();
	addMouseEvent('mousedown',boxPaintMousedown,true);
	addMouseEvent('mouseup',boxPaintMouseup,true);
	addMouseEvent('mousemove',boxPaintMousedrag,true);

}

function boxPaintMousedown(ev)
{
	boxCoordinates[0] = parseInt(ev.layerX);
	boxCoordinates[1] = parseInt(ev.layerY);
	drawingBox = true;
}

function boxPaintMouseup(ev)
{
	boxCoordinates[2] = parseInt(ev.layerX);
	boxCoordinates[3] = parseInt(ev.layerY);

	putCanvasData(markedScreen);

	ctx.fillStyle = "rgba(255,255,0,1)";
	ctx.fillRect(boxCoordinates[0], boxCoordinates[1], boxCoordinates[2]-boxCoordinates[0], boxCoordinates[3]-boxCoordinates[1]);
	markedScreen = getCanvasData();

	drawingBox = false;
}

function boxPaintMousedrag(ev)
{
	if(drawingBox == true)
	{
		xt = parseInt(ev.layerX);
		yt = parseInt(ev.layerY);
		
		putCanvasData(markedScreen);
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.strokeRect(boxCoordinates[0], boxCoordinates[1], xt-boxCoordinates[0], yt-boxCoordinates[1]);
	}
}

function penPaint()
{
	removeAllMouseEvents();
	showToolbar('paintToolbar');
	addMouseEvent('mousedown',penPaintMousedown,true);
	addMouseEvent('mouseup',penPaintMouseup,true);
	addMouseEvent('mousemove',penPaintMousedrag,true);

}

function penPaintMousedown(ev)
{
	if (drawingPen == false)
	{
	    xt = parseInt(ev.layerX);
	    yt = parseInt(ev.layerY);
	    drawingPen = true;
	    ctx.strokeStyle = "rgba(255,255,0,1)";
	    
	    thkRange = document.getElementById('paintThickness');
	    
	    ctx.lineWidth = parseInt(thkRange.value);
	    ctx.beginPath();
	    ctx.moveTo(xt,yt);
	}
}

function penPaintMouseup(ev)
{
    ctx.closePath();
    ctx.lineWidth = 1;
    drawingPen = false;
    markedScreen = getCanvasData();
}

function penPaintMousedrag(ev)
{
    if(drawingPen == true)
    {
	xt = parseInt(ev.layerX);
	yt = parseInt(ev.layerY);
	ctx.strokeStyle = "rgba(255,255,0,1)";
	ctx.lineTo(xt,yt);
	ctx.stroke();
    }
}


function eraser()
{
	removeAllMouseEvents();
	showToolbar('paintToolbar');
	addMouseEvent('mousedown',eraserMousedown,true);
	addMouseEvent('mouseup',eraserMouseup,true);
	addMouseEvent('mousemove',eraserMousedrag,true);
	instantScreen = markedScreen;
}

function eraserMousedown(ev)
{
    if(drawingEraser == false)
    {
	xt = parseInt(ev.layerX);
	yt = parseInt(ev.layerY);
	drawingEraser = true;
	ctx.strokeStyle = "rgba(255,0,255,1)";
	
	thkRange = document.getElementById('paintThickness');
	
	ctx.lineWidth = parseInt(thkRange.value);
	ctx.beginPath();
	ctx.moveTo(xt,yt);
    }
}

function eraserMouseup(ev)
{
    ctx.closePath();
    ctx.lineWidth = 1;
    drawingEraser = false;
    processingNote(true);
    
    instantScreen = getCanvasData();
    var diffM = findDifference(instantScreen, markedScreen);
    markedScreen = copyUsingDifference(markedScreen, currentScreen, diffM);
    putCanvasData(markedScreen);
    
    processingNote(false);
}

function eraserMousedrag(ev)
{
    if(drawingEraser == true)
    {
	xt = parseInt(ev.layerX);
	yt = parseInt(ev.layerY);
	ctx.strokeStyle = "rgba(255,0,255,1)";
	ctx.lineTo(xt,yt);
	ctx.stroke();
    }
}

function updateTestWindow()
{
  colorModeEl = document.getElementById('colorModeFG');
  colorDistanceEl = document.getElementById('colorDistance');
  if (colorModeEl.checked == true)
  {
    colmode = 'fg';
    chosenColor = fg_color;
  }
  else
  {
    colmode = 'bg';
    chosenColor = bg_color;
  }
  
  cdistance = parseInt(colorDistanceEl.value);
  
  differenceMatrix = findDifference(currentScreen, markedScreen);
  binaryData = colorSelectDiff(currentScreen, colmode, chosenColor, cdistance, differenceMatrix);
  
  tempImgCanvas = document.createElement('canvas');
  tempImgCanvas.width = canvasWidth;
  tempImgCanvas.height = canvasHeight;
  
  tempImgContext = tempImgCanvas.getContext('2d');
  
  timgData = tempImgContext.getImageData(0,0,canvasWidth,canvasHeight);
  
  //timgData = currentScreen;
  
  timgData = binaryToImageData(binaryData,timgData);
  
  
  tempImgContext.putImageData(timgData,0,0);
  
  testImage = tempImgCanvas.toDataURL();
  
  var displayImage = new Image();
  displayImage.onload = function() {testImgContext.drawImage(displayImage,0,0,canvasWidth/2,canvasHeight/2); processingNote(false);}
  displayImage.src = testImage;
  
}


function launchTestWindow()
{
  processingNote(true);
  setTimeout("updateTestWindow();showPopup('testImageWindow');",100);
}


function scanPlot()
{
  closePopup("testImageWindow");
  /* This is only a brute forced algorithm */
  var xPoints = new Array();
  var xPointsPicked = 0;
  xyData = [];
  pointsPicked = 0;
  
  redrawCanvas();
  markedScreen = currentScreen;
  
  var xStepEl = document.getElementById("xStep");
  var xStep = parseFloat(xStepEl.value);
  var yStepEl = document.getElementById("yStep");
  var yStep = parseFloat(yStepEl.value);
  
  var dw = canvasWidth;
  var dh = canvasHeight;
  
  var blobAvg = new Array();
  
  for(var coli = 0; coli < dw; coli++)
  {
    blobs = -1;
    firstbloby = -2.0*yStep;
    bi = 0;
       
    for(var rowi = 0; rowi < dh; rowi++)
    {
	if (binaryData[rowi][coli] == true)
	{
	  if (rowi > firstbloby + yStep)
	  {
	    blobs = blobs + 1;
	    bi = 1;
	    blobAvg[blobs] = rowi;
	    firstbloby = rowi;
	  }
	  else
	  {
	    bi = bi + 1;
	    blobAvg[blobs] = parseFloat((blobAvg[blobs]*(bi-1.0) + rowi)/parseFloat(bi));
	  }
	}
	
    }
    if (blobs >= 0)
    {
	xi = coli;
	for (var blbi = 0; blbi <= blobs; blbi++)
	{
	  yi = blobAvg[blbi];
	  
	  xPoints[xPointsPicked] = new Array();
	  xPoints[xPointsPicked][0] = parseFloat(xi);
	  xPoints[xPointsPicked][1] = parseFloat(yi);
	  xPoints[xPointsPicked][2] = 1; // 1 if not filtered, 0 if processed already
	  xPointsPicked = xPointsPicked + 1;
	}
    }
    
  }
  
  if (xPointsPicked == 0)
    return 0;
  
  for(var pi = 0; pi < xPointsPicked; pi++)
  {
    if(xPoints[pi][2] == 1) // if still available
    {
      var inRange = 1;
      var xxi = pi+1;
      
      var oldX = xPoints[pi][0];
      var oldY = xPoints[pi][1];
      
      var avgX = oldX;
      var avgY = oldY;
      
      var matches = 1;
      
      while((inRange == 1) && (xxi < xPointsPicked))
      {
	var newX = xPoints[xxi][0];
	var newY = xPoints[xxi][1];
	
	if( (Math.abs(newX-oldX) <= xStep/2.0) && (Math.abs(newY-oldY) <= yStep/2.0) && (xPoints[xxi][2] == 1))
	{
	  avgX = (avgX*matches + newX)/(matches+1.0);
	  avgY = (avgY*matches + newY)/(matches+1.0);
	  matches = matches + 1;
	  
	  xPoints[xxi][2] = 0;
	}
	if (newX > oldX + xStep/2.0)
	  inRange = 0;
	
	xxi = xxi + 1;
      }
      
      xPoints[pi][2] = 0; 
      
      xyData[pointsPicked] = new Array();
      xyData[pointsPicked][0] = parseFloat(avgX);
      xyData[pointsPicked][1] = parseFloat(avgY);
      pointsPicked = pointsPicked + 1;	
  
      ctx.beginPath();
      ctx.fillStyle = "rgb(200,0,200)";
      ctx.arc(parseInt(avgX),parseInt(avgY),3,0,2.0*Math.PI,true);
      ctx.fill();

      
    }
    
  }
  xPoints = [];	
  pointsStatus(pointsPicked);  
  return pointsPicked;
}

