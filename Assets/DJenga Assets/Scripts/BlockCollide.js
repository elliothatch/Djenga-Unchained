#pragma strict

public var floorObject:GameObject;
public var djengaTrigger:boolean;
public var woodSounds:AudioClip[];

function Awake () {
	djengaTrigger = false;
}

function Start () {

}

function Update () {

}

function OnCollisionEnter(collision:Collision)
{
	if(djengaTrigger && collision.gameObject == floorObject)
	{
		GameManager.displayDjenga = true;
	}
	if(collision.relativeVelocity.magnitude > 2)
	{
		audio.clip = woodSounds[Random.Range(0,woodSounds.length - 1)];
		audio.Play();
	}
}