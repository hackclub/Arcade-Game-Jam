using MyUtils.Classes;
using UnityEngine;

public class DataManager : MonoBehaviour {
    public static DataManager _I;
    void Awake() {
        _I = this;
    }
    public int _saveIndex;
    public void Save(PlayerData _data, Vector3 _playerPos) {
        SaveSystem.Save<PlayerSaveData>(SaveSystem.PLAYER_DATA_DEFAULT_SAVE_PATH, $"Autosave {_saveIndex}", new PlayerSaveData() {
            _data = _data,
            _playerPos = _playerPos,
            _saveIndex = _saveIndex,
            _rooms = GetRooms(),

        });
        _saveIndex++;
    }
    public void Load() {
        var d = SaveSystem.Load<PlayerSaveData>(SaveSystem.PLAYER_DATA_DEFAULT_SAVE_PATH, $"Autosave {_saveIndex - 1}");
    }
    private RoomController[] GetRooms() {
        var g = GameObject.FindGameObjectsWithTag("Room");
        RoomController[] result = new RoomController[g.Length];
        for (int i = 0; i < g.Length; i++) result[i] = g[i].GetComponent<RoomController>();
        return result;
    }

}
