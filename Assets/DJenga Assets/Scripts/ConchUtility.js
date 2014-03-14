#pragma strict

function Start () {

}

function Update () {

}

static public function calcPixelPosition(rect:Rect)
{
	return new Rect(rect.x * Screen.width, rect.y * Screen.height, rect.width * Screen.width, rect.height * Screen.height);
}