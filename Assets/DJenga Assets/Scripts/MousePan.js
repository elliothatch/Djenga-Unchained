#pragma strict

public var target:GameObject;
public var edgeSize:float;
public var panSpeed:float;

function Start () {

}

function Update () {

	if(!Input.GetMouseButton(1))
	{
		if(Input.mousePosition.y < edgeSize && target.transform.position.y >= 1.5)
		{
			transform.position.y -= panSpeed * Time.deltaTime;
		}

		if(Input.mousePosition.y > Screen.height - edgeSize)
		{
			transform.position.y += panSpeed * Time.deltaTime;
		}
	}
}