#pragma strict


public var uiManager:UIManager;
public var chatLog:ChatLog;

private var gameName:String = "ConchConnoisseurNetworkTest";
private var refreshing:boolean = false;
private var hostData:HostData[];

private var playerConnectedSlots:NetworkPlayerInfo[];


function Start () 
{
	playerConnectedSlots = new NetworkPlayerInfo[8];
	for(var i:int = 0; i<8; i++)
		playerConnectedSlots[i] = null;
}

function Update () 
{
	if(refreshing)
	{
		if(MasterServer.PollHostList().Length > 0)
		{
			refreshing = false;
			hostData = MasterServer.PollHostList();
		}
	}
}

function startServer()
{
	var useNat = !Network.HavePublicAddress();
	Network.InitializeServer(16, 25001, useNat);
	Debug.Log("UseNat:");
	Debug.Log(useNat);
	MasterServer.RegisterHost(gameName, "Network Test", "Network Testing");
}

function refreshHostList()
{
	MasterServer.RequestHostList(gameName);
	refreshing = true;
}

function onConnected()
{
	 networkView.RPC("setPlayerInfo", RPCMode.Server, uiManager.playerName);
}

function OnServerInitialized()
{
	Debug.Log("Server Initialized");
	uiManager.networkView.RPC("startNewNetworkedGame", RPCMode.AllBuffered, 18);
	playerConnectedSlots[0] = new NetworkPlayerInfo(Network.player, uiManager.playerName, 0);
}

function OnConnectedToServer() 
{
	Debug.Log("Connected To Server");
	onConnected();
}

function OnPlayerConnected(player:NetworkPlayer):void
{
	//chatLog.networkView.RPC("addMessage", RPCMode.All, player.ipAddress + " Connected");
	//uiManager.dragRigidbodyNetwork.createSpringJoint)
}

@RPC
function setPlayerInfo(playerName:String, messageInfo:NetworkMessageInfo)
{
	var i:int = 0;
	while(i<playerConnectedSlots.Length && playerConnectedSlots[i] != null)
	{
		i++;
	}
	playerConnectedSlots[i] = new NetworkPlayerInfo(messageInfo.sender, playerName, i);
	uiManager.networkView.RPC("setPlayerNumber", messageInfo.sender, i+1);
	chatLog.networkView.RPC("addMessage", RPCMode.All, "User " + playerName + " (" + messageInfo.sender.ipAddress + ") Connected as Player " + (i+1));
	/*
	playersConnected.Push(playerName);
	chatLog.networkView.RPC("addMessage", RPCMode.All, "User " + playerName + " (" + 
		Network.connections[Network.connections.Length - 1].ipAddress + ") Connected");
*/
}

function OnPlayerDisconnected(player:NetworkPlayer)
{
	for(var i:int = 0; i< playerConnectedSlots.Length; i++)
	{
		if(playerConnectedSlots[i] != null && playerConnectedSlots[i].m_networkPlayer == player)
		{
			chatLog.networkView.RPC("addMessage", RPCMode.All, "User " + playerConnectedSlots[i].m_playerName + 
				" (Player " + (i+1) + ": " + player.ipAddress + ") disconnected");
			playerConnectedSlots[i] = null;
		}
	}
	/*
	var i:int = 0;
	while(i < Network.connections.Length && Network.connections[i] != player)
	{
		i++;
	}
	chatLog.networkView.RPC("addMessage", RPCMode.All, "User " + (playersConnected[i] as String) + " (" + player.ipAddress + ") Disconnected");
	Network.RemoveRPCs(player);
	playersConnected.RemoveAt(i);
	*/

}

/*
function OnPlayerConnected(player:NetworkPlayer):void
{
	var i:int = 0;
	while(i < 8 && playerConnected[i] != null)
	{
		i++;
	}
	playerConnected[i] = player;
	chatLog.networkView.RPC("addMessage", RPCMode.All, player.ipAddress + "Connected");
	chatLog.networkView.RPC("addMessage", RPCMode.All, player.ipAddress + "is Player " + (i+1));
}

function OnPlayerDisconnected(player:NetworkPlayer):void
{
	var i:int = 0;
	while(i < 8 && playerConnected[i] != player)
	{
		i++;
	}
	playerConnected[i] = null;
	chatLog.networkView.RPC("addMessage", RPCMode.All, "Player " + (i+1) + " (" + player.ipAddress + ") disconnected");
}
*/
function OnMasterServerEvent(mse:MasterServerEvent)
{
	if(mse == MasterServerEvent.RegistrationSucceeded)
	{
		Debug.Log("Registration Succeeded");
	}
}

function OnGUI () 
{
	if(!Network.isClient && !Network.isServer)
	{
		if(GUI.Button(Rect(100,100,100,100), "Start Server"))
		{
			Debug.Log("Starting Server");
			startServer();
		}

		if(GUI.Button(Rect(100,220,100,100), "Refresh Host"))
		{
			Debug.Log("Refreshing Server");	
			refreshHostList();
		}
		if(hostData)
		{
			for(var i:int = 0; i<hostData.length; i++)
			{
				if(GUI.Button(Rect(220, 100 + i*55, 100, 50), hostData[i].gameName))
				{
					Network.Connect(hostData[i]);
				}
			}
		}
	}
}