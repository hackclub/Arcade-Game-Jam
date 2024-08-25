using MyUtils.Functions;
using UnityEngine;

public class DungeonGeneration : MonoBehaviour {
    public Transform[] _startRoomPrefab;
    public Transform[] _horizontalTunnelPrefab;
    public Transform[] _verticalTunnelPrefab;
    public Transform[] _enemyRoomPrefab;
    public Transform[] _bossRoomPrefab;
    public Transform[] _specialRoomPrefab;
    public float _hRoomOffset;
    public float _vRoomOffset;
    public Vector3 _startPos;

    void Start() {
        Generate();
    }
    public void Generate() {
        Instantiate(MyRandom.GetFromArray<Transform>(_startRoomPrefab), Vector3.zero, Quaternion.identity);
        Instantiate(MyRandom.GetFromArray<Transform>(_verticalTunnelPrefab), GetOffset(0, 1), Quaternion.identity);
        Instantiate(MyRandom.GetFromArray<Transform>(_verticalTunnelPrefab), GetOffset(0, -1), Quaternion.identity);
        Instantiate(MyRandom.GetFromArray<Transform>(_horizontalTunnelPrefab), GetOffset(-1, 0), Quaternion.identity);
        Instantiate(MyRandom.GetFromArray<Transform>(_horizontalTunnelPrefab), GetOffset(1, 0), Quaternion.identity);
        // for(int x = 1; x < 5)
    }
    public Vector3 GetPos(int x, int y) {
        return _startPos + GetOffset(x, y);
    }
    public Vector3 GetOffset(int x, int y) {
        return new Vector3(_hRoomOffset * x, _vRoomOffset * y);
    }
}
public enum OffsetType {
    _hTunnel,
    _vTunnel,
    _hRoom,
    _vRoom,
}
