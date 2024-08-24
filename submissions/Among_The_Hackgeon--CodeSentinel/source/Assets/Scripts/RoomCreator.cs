using MyUtils.Classes;
using Unity.Mathematics;
using UnityEngine;

public class RoomCreator : MonoBehaviour {
    public int2 _gridSize;
    public int2 _gridStart;
    public MyGrid _grid;
    public Sprite _defSprite;
    void Awake() {
        _grid = new(_gridSize, _gridStart, _defSprite, transform);
    }
}
