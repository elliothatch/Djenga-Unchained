#pragma strict

public var targetTag:String;

private var blocks:GameObject[];

function Start () {

}

function Update () {
	if(blocks)
	{
		var maxDistance:float = 0;
		for(var obj:GameObject in blocks)
		{
			if(obj)
			{
			 var distance:float = (transform.position - Vector3(obj.transform.position.x, transform.position.y, obj.transform.position.z)).magnitude;
			 if(distance > maxDistance)
			 	maxDistance = distance;
			}
		}

		light.spotAngle = Mathf.Atan((maxDistance + 3.0) / transform.position.y) * 180 / Mathf.PI * 2;
	}
}

function onNewGame(position:Vector3)
{
	blocks = GameObject.FindGameObjectsWithTag(targetTag);
	transform.position = Vector3(position.x, position.y * 1.5 + 3, position.z);
}