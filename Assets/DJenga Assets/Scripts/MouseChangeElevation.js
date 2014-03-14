#pragma strict

public var target:GameObject;

function Start () {

}

function Update () {
	if(Input.GetKey(KeyCode.UpArrow))
	{
		Camera.main.transform.position.y += 10.0 * Time.deltaTime;
		target.transform.position.y += 10.0 * Time.deltaTime;
	}
	if(Input.GetKey(KeyCode.DownArrow) && target.transform.position.y >= 1.5)
	{
		Camera.main.transform.position.y -= 10.0 * Time.deltaTime;
		target.transform.position.y -= 10.0 * Time.deltaTime;
	}
}