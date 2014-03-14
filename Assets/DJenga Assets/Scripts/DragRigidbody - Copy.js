var spring = 50.0;
var damper = 5.0;
var drag = 10.0;
var angularDrag = 5.0;
var distance = 0.2;
var attachToCenterOfMass = false;

public var draggerPrefab:GameObject;

private var springJoint : SpringJoint;

function Update ()
{
	// Make sure the user pressed the mouse down
	if (!Input.GetMouseButtonDown (0))
	{
		return;
	}

	var mainCamera = FindCamera();
		
	// We need to actually hit an object
	var hit : RaycastHit;
	if (!Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hit, 100))
		return;
	// We need to hit a rigidbody that is not kinematic
	if (!hit.rigidbody || hit.rigidbody.isKinematic)
		return;
	
	if (!springJoint)
	{
		networkView.RPC("createSpringJoint", RPCMode.AllBuffered);
	}

	networkView.RPC("updateSpringJoint", RPCMode.AllBuffered, hit.rigidbody.networkView.viewID, hit.point);
	
	//StartCoroutine ("DragObject", hit.distance);
	//DragObject(hit.distance);
	networkView.RPC("setColor", RPCMode.AllBuffered, hit.rigidbody.networkView.viewID, 0);
	//networkView.RPC("onDragObject", RPCMode.AllBuffered, springJoint.connectedBody.networkView.viewID, hit.distance);
	//networkView.RPC("onDragObject", RPCMode.AllBuffered, hit.distance);
	DragObject(hit.distance);
}

@RPC 
function createSpringJoint()
{
	if(Network.isServer)
	{

		var obj:GameObject = Network.Instantiate(draggerPrefab, Vector3(0,0,0), Quaternion.identity, 0);
		springJoint = obj.GetComponent("SpringJoint");
		networkView.RPC("assignSpringJoint", RPCMode.AllBuffered, springJoint.networkView.viewID);
	}
}

@RPC 
function assignSpringJoint(draggerView:NetworkViewID)
{
	if(Network.isClient)
	{
		springJoint = NetworkView.Find(draggerView).GetComponent("SpringJoint");
	}
}

@RPC 
function updateSpringJoint(hitBodyView:NetworkViewID, hitPoint:Vector3)
{
	springJoint.transform.position = hitPoint;
	var hitBody = NetworkView.Find(hitBodyView).rigidbody;
	if (attachToCenterOfMass)
	{
		var anchor = transform.TransformDirection(hitBody.centerOfMass) + hitBody.transform.position;
		anchor = springJoint.transform.InverseTransformPoint(anchor);
		springJoint.anchor = anchor;
	}
	else
	{
		springJoint.anchor = Vector3.zero;
	}

	springJoint.spring = spring;
	springJoint.damper = damper;
	springJoint.maxDistance = distance;
	springJoint.connectedBody = hitBody;
}

@RPC
function setColor(viewID:NetworkViewID, playerID:int)
{
	NetworkView.Find(viewID).renderer.material.color = Color(1,0,0,1);
}
/*
@RPC
function onDragObject(distance : float)
{
	DragObject(distance);
}

function DragObject (distance : float)
{
	Debug.Log(springJoint.connectedBody.networkView.viewID);
	var oldDrag = springJoint.connectedBody.drag;
	var oldAngularDrag = springJoint.connectedBody.angularDrag;
	springJoint.connectedBody.drag = drag;
	springJoint.connectedBody.angularDrag = angularDrag;
	var mainCamera = FindCamera();
	while (Input.GetMouseButton (0))
	{
		var ray = mainCamera.ScreenPointToRay (Input.mousePosition);
		springJoint.transform.position = ray.GetPoint(distance);
		yield;
	}
	if (springJoint.connectedBody)
	{
		springJoint.connectedBody.drag = oldDrag;
		springJoint.connectedBody.angularDrag = oldAngularDrag;
		springJoint.connectedBody = null;
	}
}
*/

function DragObject (distance : float)
{
	var oldDrag = springJoint.connectedBody.drag;
	var oldAngularDrag = springJoint.connectedBody.angularDrag;
	springJoint.connectedBody.drag = drag;
	springJoint.connectedBody.angularDrag = angularDrag;
	var mainCamera = FindCamera();
	while (Input.GetMouseButton (0))
	{
		networkView.RPC("setJointPosition", RPCMode.AllBuffered, Input.mousePosition);
		var ray = mainCamera.ScreenPointToRay (Input.mousePosition);
		springJoint.transform.position = ray.GetPoint(distance);
		yield;
	}
	if (springJoint.connectedBody)
	{
		springJoint.connectedBody.drag = oldDrag;
		springJoint.connectedBody.angularDrag = oldAngularDrag;
		springJoint.connectedBody = null;
	}
}

@RPC
function setJointPosition(mousePosition:Vector3)
{

}

function FindCamera ()
{
	if (camera)
		return camera;
	else
		return Camera.main;
}