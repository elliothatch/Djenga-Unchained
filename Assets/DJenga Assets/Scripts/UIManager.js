#pragma strict

public var gameManager:GameManager;
public var networkManager:NetworkManager;
public var dragRigidbodyNetwork:DragRigidbodyNetwork;

public var djengaPopup:Texture;

public var playerName:String = "CoolGuy69";
private var playerNumber:int = 1;

function Start () {

}

function Update () {

}

function OnGUI()
{
	playerName = GUI.TextField(Rect(60,60,300,30), playerName, 32);
	if(GUI.Button(Rect(Screen.width-60, 0, 60, 60), "NEW GAME"))
	{
		if(!Network.isClient && !Network.isServer)
			startNewGame(18);
		else
			networkView.RPC("startNewNetworkedGame", RPCMode.AllBuffered, 18);
	}
	gameManager.blockMaterial.dynamicFriction = GUI.HorizontalSlider(Rect(Screen.width - 120, 100, 100, 60), gameManager.blockMaterial.dynamicFriction, 0.0, 1.0);
	gameManager.blockMaterial.staticFriction = GUI.HorizontalSlider(Rect(Screen.width - 120, 200, 100, 60), gameManager.blockMaterial.staticFriction, 0.0, 1.0);

	if(gameManager.displayDjenga)
	{
		GUI.Label(Rect(Screen.width /2 - 424/2, Screen.height / 2 - 170/2, 424, 170), djengaPopup);
	}
}

function startNewGame(height:int)
{
	gameManager.newGame(height);
}

@RPC
function startNewNetworkedGame(height:int)
{
	gameManager.newNetworkedGame(height);
}

@RPC
function setPlayerNumber(number:int)
{
	playerNumber = number;
	dragRigidbodyNetwork.playerNumber = playerNumber;
	if(!dragRigidbodyNetwork.springJoint[playerNumber])
		dragRigidbodyNetwork.networkView.RPC("createSpringJoint", RPCMode.Server, playerNumber);
}