#pragma strict

public var spotlightSizer:SpotlightSizer;

public var jengaObjTemplate:GameObject;
public var towerPosition:Vector3;
public var blockMaterial:PhysicMaterial;

public var woodSounds:AudioClip[];

public var floorObject:GameObject;

public var djengaPopupTimer:float;

static public var displayDjenga:boolean;
static public var networkedGame:boolean = false;

function Start () 
{
	blockMaterial.dynamicFriction = 0.17;
	blockMaterial.staticFriction = 0.01;
	//newGame(18);
}

function Update () {

	if(djengaPopupTimer >= 3.0)
		displayDjenga = false;

	if(displayDjenga)
	{
		djengaPopupTimer += Time.deltaTime;
	}
}

function newGame(height:int)
{
	Debug.Log("NEW LOCAL GAME");
	networkedGame = false;
	GetComponent(DragRigidbody).enabled = true;
	GetComponent(DragRigidbodyNetwork).enabled = false;
	
	var oldObjs:GameObject[] = GameObject.FindGameObjectsWithTag("Block");
	for(var obj:GameObject in oldObjs)
	{
		Destroy(obj);
	}

	createNewRow(Vector3(towerPosition.x, towerPosition.y, towerPosition.z), 0, 1);
	for(var i:int = 1; i<height; i++)
	{
		createNewRow(Vector3(towerPosition.x, towerPosition.y + i * (jengaObjTemplate.transform.localScale.y + 0.00) , towerPosition.z), i%2, 0);
	}
	spotlightSizer.onNewGame(Vector3(towerPosition.x, towerPosition.y + height * jengaObjTemplate.transform.localScale.y, towerPosition.z));
	displayDjenga = false;
	djengaPopupTimer = 0.0;
}

function newNetworkedGame(height:int)
{
	if(Network.isServer)
	{
		var oldObjs:GameObject[] = GameObject.FindGameObjectsWithTag("Block");
		for(var obj:GameObject in oldObjs)
		{
			Network.RemoveRPCs(obj.networkView.viewID);
			Network.Destroy(obj);
		}

		createNewRowNetworked(Vector3(towerPosition.x, towerPosition.y, towerPosition.z), 0, 1);
		for(var i:int = 1; i<height; i++)
		{
			createNewRowNetworked(Vector3(towerPosition.x, towerPosition.y + i * (jengaObjTemplate.transform.localScale.y + 0.00) , towerPosition.z), i%2, 0);
		}
	}

	Debug.Log("NEW NETWORKED GAME");
	networkedGame = true;
	GetComponent(DragRigidbody).enabled = false;
	GetComponent(DragRigidbodyNetwork).enabled = true;
	spotlightSizer.onNewGame(Vector3(towerPosition.x, towerPosition.y + height * jengaObjTemplate.transform.localScale.y, towerPosition.z));
	displayDjenga = false;
	djengaPopupTimer = 0.0;
}

function createNewRow(position:Vector3, orientation:int, type:int)
{
	for(var i:int = -1; i<2; i++)
	{
		var object:GameObject; 
		if(orientation == 0)
		{
						object =			Instantiate(jengaObjTemplate,
											Vector3(position.x + i * (jengaObjTemplate.transform.localScale.x + 0.00), position.y, position.z), 
											Quaternion.identity);
								}
		else
		{
			object = Instantiate(jengaObjTemplate,
											Vector3(position.x, position.y, position.z + i * (jengaObjTemplate.transform.localScale.x + 0.00)), 
											Quaternion.identity);
			object.transform.Rotate(Vector3(0,90,0));
		}

		var blockCollide:BlockCollide = object.GetComponent("BlockCollide");
		blockCollide.floorObject = floorObject;
		blockCollide.woodSounds = woodSounds;
		if(type == 0)
		{
			blockCollide.djengaTrigger = true;
		}
	}
}


function createNewRowNetworked(position:Vector3, orientation:int, type:int)
{
	for(var i:int = -1; i<2; i++)
	{
		var object:GameObject; 
		if(orientation == 0)
		{
						object =			Network.Instantiate(jengaObjTemplate,
											Vector3(position.x + i * (jengaObjTemplate.transform.localScale.x + 0.00), position.y, position.z), 
											Quaternion.identity, 0);
								}
		else
		{
			object = Network.Instantiate(jengaObjTemplate,
											Vector3(position.x, position.y, position.z + i * (jengaObjTemplate.transform.localScale.x + 0.00)), 
											Quaternion.identity, 0);
			object.transform.Rotate(Vector3(0,90,0));
		}

		var blockCollide:BlockCollide = object.GetComponent("BlockCollide");
		blockCollide.floorObject = floorObject;
		blockCollide.woodSounds = woodSounds;
		if(type == 0)
		{
			blockCollide.djengaTrigger = true;
		}
	}
}