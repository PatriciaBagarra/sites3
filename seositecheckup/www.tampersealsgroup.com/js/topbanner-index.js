// Set slideShowSpeed (milliseconds)
var slideShowSpeed = 5000;

// Duration of crossfade (seconds)
var crossFadeDuration = 4;

// Specify the image files

var Pic = new Array(); // don't touch this
var PicUrl = new Array(); // don't touch this

var PicCaption = new Array(); // don't touch this

Pic[0] = 'images/newimg_1.jpg';
Pic[1] = 'images/newimg_2.jpg';
Pic[2] = 'images/newimg_3.jpg';
Pic[3] = 'images/newimg_4.jpg';
Pic[4] = 'images/newimg_5.jpg';
PicUrl[0] = '/Security-Bags-Envelopes/TamperSTOP-Safe.htm';
PicUrl[1] = '/Security-Bags-Envelopes/STEBs.htm';
PicUrl[2] = '/Tamper-Evident-Labels/High-Residue-Tamper-Evident-Labels.htm';
PicUrl[3] = '/Security-Tapes/Partial-Transfer-Security-Tapes.htm';
PicUrl[4] = '/Security-Seals/Cable-Security-Seals.htm';

var PageNav='#';

// =======================================
// do not edit anything below this line
// =======================================

var m_intTimeOut;
var k = 0;
var m_intArrayLen = Pic.length;

var preLoad = new Array();
for (i = 0; i < m_intArrayLen; i++)
{
   preLoad[i] = new Image();
   preLoad[i].src = Pic[i]
}

function runSlideShow(){
   if (document.all){
      document.images.SlideShow.style.filter="blendTrans(duration=2)";
      document.images.SlideShow.style.filter="blendTrans(duration=crossFadeDuration)";
      document.images.SlideShow.filters.blendTrans.Apply();      
   }
   document.images.SlideShow.src = preLoad[k].src;
   document.getElementById("SlideShowLink").href = PicUrl[k];
	PageNav=PicUrl[k];

   if (document.all){
      document.images.SlideShow.filters.blendTrans.Play();
   }
   k = k + 1;
   if (k > (m_intArrayLen-1)) k=0
   m_intTimeOut = setTimeout('runSlideShow()', slideShowSpeed);
}

function pg_nav()
{
	window.location.href=PageNav;
}
