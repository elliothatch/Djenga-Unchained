#pragma strict

public var currentPlayer:int = 0;

function Start () {

}

function Update () {

}

function setPlayer(player:int):boolean
{
	if(player == 0 || (player != 0 && currentPlayer == 0))
	{
		currentPlayer = player;
		renderer.material.color = PlayerColors.s_colors[player];
		return true;
	}
	return false;
}