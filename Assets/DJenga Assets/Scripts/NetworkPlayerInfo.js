
public class NetworkPlayerInfo
{
	public var m_networkPlayer:NetworkPlayer;
	public var m_playerName:String;
	public var m_playerSlot:int;

	public function NetworkPlayerInfo(networkPlayer:NetworkPlayer, name:String, playerSlot:int)
	{
		m_networkPlayer = networkPlayer;
		m_playerName = name;
		m_playerSlot = playerSlot;
	}
}