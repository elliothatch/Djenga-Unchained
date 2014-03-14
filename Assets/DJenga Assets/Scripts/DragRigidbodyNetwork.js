public var draggerPrefab:GameObject;

var spring = 50.0;
var damper = 5.0;
var drag = 10.0;
var angularDrag = 5.0;
var distance = 0.2;
var attachToCenterOfMass = false;

public var playerNumber:int = 1;

public var springJoint : SpringJoint[];
private var oldDrag;
private var oldAngularDrag;

function Start()
{
	springJoint = new SpringJoint[8];
}

function Update ()
{
	if(!springJoint[1] && Network.isServer)
	{
		createSpringJoint(1);
	}
	// Make sure the user pressed the mouse down
	if (!Input.GetMouseButtonDown (0))
		return;

	var mainCamera = FindCamera();
		
	// We need to actually hit an object
	var hit : RaycastHit;
	if (!Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hit, 100))
		return;
	// We need to hit a rigidbody that is not kinematic
	if (!hit.rigidbody || hit.rigidbody.isKinematic)
		return;
	/*
	if (!springJoint)
	{
		if(Network.isServer)
			createSpringJoint();
		else
			networkView.RPC("createSpringJoint", RPCMode.Server);
	}
	*/
	updateSpringJoint(hit.rigidbody.networkView.viewID, hit.point);
	networkView.RPC("updateSpringJoint", RPCMode.Server, hit.rigidbody.networkView.viewID, hit.point);

	//networkView.RPC("setColor", RPCMode.AllBuffered, hit.rigidbody.networkView.viewID, 0);
	DragObject(hit.distance);
}

@RPC 
function createSpringJoint(playerSlot:int)
{
	var obj:GameObject = Network.Instantiate(draggerPrefab, Vector3(0,0,0), Quaternion.identity, 0);
	springJoint[playerSlot] = obj.GetComponent("SpringJoint");
	networkView.RPC("assignSpringJoint", RPCMode.AllBuffered, springJoint[playerNumber].networkView.viewID, playerSlot);
}

@RPC 
function assignSpringJoint(draggerView:NetworkViewID, playerSlot:int)
{
	if(Network.isClient)
	{
		springJoint[playerSlot] = NetworkView.Find(draggerView).GetComponent("SpringJoint");
	}
}

@RPC 
function updateSpringJoint(hitBodyView:NetworkViewID, hitPoint:Vector3)
{
	springJoint[playerNumber].transform.position = hitPoint;
	var hitBody = NetworkView.Find(hitBodyView).rigidbody;
	springJoint[playerNumber].connectedBody = hitBody;
	if (attachToCenterOfMass)
	{
		var anchor = transform.TransformDirection(hitBody.centerOfMass) + hitBody.transform.position;
		anchor = springJoint[playerNumber].transform.InverseTransformPoint(anchor);
		springJoint[playerNumber].anchor = anchor;
	}
	else
	{
		springJoint[playerNumber].anchor = Vector3.zero;
	}

	springJoint[playerNumber].spring = spring;
	springJoint[playerNumber].damper = damper;
	springJoint[playerNumber].maxDistance = distance;
}


@RPC
function setPlayer(viewID:NetworkViewID, playerID:int)
{
	NetworkView.Find(viewID).GetComponent(PlayerControl).setPlayer(playerID);
}

function DragObject (distance : float)
{
	networkView.RPC("setPlayer", RPCMode.All, springJoint[playerNumber].connectedBody.rigidbody.networkView.viewID, playerNumber);
	if(springJoint[playerNumber].connectedBody.GetComponent(PlayerControl).currentPlayer != playerNumber)
	{
		return;
	}
	
	beginDrag();
	networkView.RPC("beginDrag", RPCMode.Server);
	var mainCamera = FindCamera();

	while (Input.GetMouseButton (0))
	{
		var ray = mainCamera.ScreenPointToRay (Input.mousePosition);
		var springPos = ray.GetPoint(distance);
		
		setSpringJointPosition(springPos);
		networkView.RPC("setSpringJointPosition", RPCMode.Server, springPos);
		//var ray = mainCamera.ScreenPointToRay (Input.mousePosition);
	//springJoint.transform.position = ray.GetPoint(distance);
		yield;
	}
	endDrag();
	networkView.RPC("endDrag", RPCMode.Server);
}

@RPC
function beginDrag()
{
	oldDrag = springJoint[playerNumber].connectedBody.drag;
	oldAngularDrag = springJoint[playerNumber].connectedBody.angularDrag;
	springJoint[playerNumber].connectedBody.drag = drag;
	springJoint[playerNumber].connectedBody.angularDrag = angularDrag;
}

@RPC
function setSpringJointPosition(pos:Vector3)
{
	springJoint[playerNumber].transform.position = pos;
}

@RPC
function endDrag()
{
	if (springJoint[playerNumber].connectedBody)
	{
		springJoint[playerNumber].connectedBody.drag = oldDrag;
		springJoint[playerNumber].connectedBody.angularDrag = oldAngularDrag;
		networkView.RPC("setPlayer", RPCMode.All, springJoint[playerNumber].connectedBody.rigidbody.networkView.viewID, 0);
		springJoint[playerNumber].connectedBody = null;
	}
}

function FindCamera ()
{
	if (camera)
		return camera;
	else
		return Camera.main;
}