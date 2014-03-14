#pragma strict

public var uiManager:UIManager;

public var chatLog:ChatLog;

public var isActive:boolean = false;
public var screenRect:Rect = Rect(.2,.7,.6,.1);
public var text:String = "";

private var screenRectPixels:Rect;

function Start () {
    screenRectPixels = ConchUtility.calcPixelPosition(screenRect);
}

function Update () {

    if(isActive)
    {
        for (var c : char in Input.inputString) {
            // Backspace - Remove the last character
            if (c == "\b"[0]) 
            {
                if (text.Length != 0)
                    text = text.Substring(0, text.Length - 1);
            }
            // End of entry
            /*
            else if (c == "\n"[0] || c == "\r"[0]) // "\n" for Mac, "\r" for windows.
            {
                
            }
            */
            // Normal text input - just append to the end
            else {
                text += c;
            }
        }
        if(Input.GetKeyDown(KeyCode.Return))
        {
            //remove leading spaces
            var bIndex:int = 0;
            while(bIndex < text.Length && text.Substring(bIndex, 1) == " ")
            {
                bIndex++;
            }
            var str:String = text.Substring(bIndex, text.Length - bIndex);
            if(str.Length > 0)
                networkView.RPC("addMessage", RPCMode.All, uiManager.playerName + ": " + str);
            text = "";
            isActive = false;
        }
    }
    else if(Input.GetKeyDown(KeyCode.Return))
    {
        isActive = true;
    }
}

function OnGUI () 
{
    if(isActive)
    {
        GUI.Box(screenRectPixels, text);
    }
}