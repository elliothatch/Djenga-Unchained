#pragma strict


public var screenRect:Rect = Rect(.2,.7,.6,1);

private var text:String = "";

private var screenRectPixels:Rect;

function Start () {
	screenRectPixels = ConchUtility.calcPixelPosition(screenRect);
}

function Update () {

}

function OnGUI () 
{

    GUI.skin.label.normal.textColor = Color(0,0,0,1);
	GUI.Label(screenRectPixels, text);
}

@RPC
function addMessage(str:String)
{
	text = text + str + "\n"[0];
	screenRectPixels.y -= 15;
}