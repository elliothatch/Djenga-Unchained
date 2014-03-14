#pragma strict

public var gameManager:GameManager;
public var projectile:GameObject;
public var cannonEnabled:boolean = false;
private var refireTimer:float = 0;

function Start () {

}

function Update () {

	refireTimer += Time.deltaTime;
	if(cannonEnabled)
	{
		if(Input.GetMouseButton(0) && refireTimer > 0.1)
		{
			refireTimer = 0.0;
			var spawnPos:Vector3 = transform.rotation * (Vector3.forward * 4) + transform.position;
			var obj:GameObject = Instantiate(projectile, spawnPos, transform.rotation);
			obj.rigidbody.AddForce(obj.transform.forward * 1000);
			var blockCollide:BlockCollide = obj.GetComponent("BlockCollide");
			blockCollide.floorObject = gameManager.floorObject;
			blockCollide.woodSounds = gameManager.woodSounds;
		}
	}
}

function OnGUI() {
	var str:String = "ENABLE";
	if(cannonEnabled)
		str = "DISABLE";

	cannonEnabled = GUI.Toggle(Rect(Screen.width - 200, 400, 300,60), cannonEnabled, str + " BLOCK CANNON");

}