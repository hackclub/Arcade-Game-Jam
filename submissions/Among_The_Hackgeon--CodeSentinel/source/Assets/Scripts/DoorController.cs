using MyUtils.Enums;
using MyUtils.Interfaces;
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class DoorController : MonoBehaviour {
    public DoorOpenType _doorType;
    public RoomController _roomToShow;
    public RoomController _tunnelToShow;
    public DoorPosition _pos;
    public bool _openedByDefault;
    public bool _initialized;
    void Start() {
        // _roomToShow2 = transform.parent.GetComponent<RoomController>();
        // Initialize();
        GetComponent<AudioSource>().volume = GameManager._gSettings._soundsVolume;
    }
    void Close() {
        // GetComponent<SpriteRenderer>().
    }
    public void Initialize() {
        if (_initialized) return;
        _initialized = true;
        if (_doorType != DoorOpenType.BossRoom && _doorType != DoorOpenType.BossRoomDoors) _doorType = UnityEngine.Random.Range(0f, 1f) > 0.5f ? DoorOpenType.OpenOnShoot : DoorOpenType.AlwaysOpen;
        switch (_doorType) {
            case DoorOpenType.AlwaysOpen: {
                    var c = gameObject.AddComponent<AlwaysOpenDoor>();
                    c._pos = _pos;
                    c._opened = false;

                    if (_roomToShow._roomType == RoomType.EnemyRoom)
                        _roomToShow._onPlayerEnter += () => {
                            if (!_roomToShow._wasInvoked) c.CloseDoor();
                        };

                    break;
                }
            case DoorOpenType.OpenOnShoot: {
                    var c = gameObject.AddComponent<DoorOnShoot>();
                    c._pos = _pos;
                    c._opened = false;
                    if (_roomToShow._roomType == RoomType.EnemyRoom)
                        _roomToShow._onPlayerEnter += () => {
                            if (!_roomToShow._wasInvoked) c.CloseDoor();
                        };

                    break;
                }
            case DoorOpenType.BossRoom: {
                    var c = gameObject.AddComponent<BoosRoomDoor>();
                    c._pos = _pos;
                    c._opened = false;
                    // if (_roomToShow._roomType == RoomType.EnemyRoom)
                    // _roomToShow._onPlayerEnter += () => {
                    // if (!_roomToShow._wasInvoked) c.CloseDoor();
                    // };
                    // 
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
            case DoorOpenType.BossRoomDoors: {
                    var c = gameObject.AddComponent<BossDoorOnShoot>();
                    c._opened = false;
                    c._pos = _pos;
                    _roomToShow._onPlayerEnter += () => {
                        if (!_roomToShow._wasInvoked) c.CloseDoor();
                    };
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
            case DoorOpenType.OpenOnTime: {
                    //TODO this
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
            case DoorOpenType.OpenOnButtonClick: {
                    //TODO this
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
            case DoorOpenType.OpenOnPlayerStat: {
                    //TODO this
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
            case DoorOpenType.OpenOnDefeatEnemy: {
                    //TODO this
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
            case DoorOpenType.OpenOnCustomItemHold: {
                    //TODO this
                    //gameObject.AddComponent<DoorOnShoot>();
                    break;
                }
        }
    }
}
public class DoorBasic : MonoBehaviour {
    public DoorState state;

}
public enum DoorPosition {
    Left, Right, Up, Down
}
[RequireComponent(typeof(SpriteRenderer))]
public class DoorOnShoot : MonoBehaviour, IDoor, IDamageable {

    public Collider2D _col;
    public int _stage;
    private GameDataManager _gMD;
    private SpriteRenderer _renderer;
    public bool _opened;
    private bool _discovered = false;
    public DoorPosition _pos;
    private bool _hidden;
    void Start() {
        _gMD = GameDataManager._I;
        _stage = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._destroyableDoorSpritesHorizontal.Length - 1,
            _ when _pos == DoorPosition.Right => _gMD._destroyableDoorSpritesVerticalRight.Length - 1,
            _ when _pos == DoorPosition.Down => _gMD._destroyableDoorSpritesHorizontal.Length - 1,
            _ when _pos == DoorPosition.Left => _gMD._destroyableDoorSpritesVerticalLeft.Length - 1,
            _ => 0,
        };
        _col = GetComponent<Collider2D>();
        _renderer = GetComponent<SpriteRenderer>();
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Right => _gMD._destroyableDoorSpritesVerticalRight[_stage],
            _ when _pos == DoorPosition.Down => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Left => _gMD._destroyableDoorSpritesVerticalLeft[_stage],
            _ => _gMD._openedDoorSprite[0],
        };
        _col.isTrigger = false;
        _opened = false;
        _discovered = false;
        GetComponent<DoorController>()._roomToShow._onRoomClear += (x) => { if (x == GetComponent<DoorController>()._roomToShow) ShowDoor(); };
    }
    public void CloseDoor() {
        //TODO
        _hidden = true;
        if (_opened) {
            _col.isTrigger = false;
            // _renderer.enabled = true;
            _renderer.sprite = _pos switch {
                _ when _pos == DoorPosition.Up => _gMD._closedDoorSprite[0],
                _ when _pos == DoorPosition.Right => _gMD._closedDoorSprite[1],
                _ when _pos == DoorPosition.Down => _gMD._closedDoorSprite[2],
                _ when _pos == DoorPosition.Left => _gMD._closedDoorSprite[3],
                _ => _gMD._closedDoorSprite[0],
            };
        }
    }

    public void Damage(float v) {
        if (_opened || _hidden) return;
        if (_stage == 0) { OpenDoor(); var c = GetComponent<AudioSource>(); c.clip = GameDataManager._I._doorOpenSound; c.Play(); return; }
        _stage--;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Right => _gMD._destroyableDoorSpritesVerticalRight[_stage],
            _ when _pos == DoorPosition.Down => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Left => _gMD._destroyableDoorSpritesVerticalLeft[_stage],
            _ => _gMD._openedDoorSprite[0],
        };



    }

    public void HideDoor() {
        //TODO g
        throw new System.NotImplementedException();
    }

    public void OpenDoor() {
        _opened = true;
        _discovered = true; ;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };
        var d = GetComponent<DoorController>();
        if (d._tunnelToShow._maskTransform != null) d._tunnelToShow._maskTransform.gameObject.SetActive(false);
        d._tunnelToShow.ShowRoom();
        d._roomToShow.ShowRoom();

        //TODO
    }

    public void ShowDoor() {
        _hidden = false;
        if (!_discovered) return;
        _opened = true;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };
    }
}
public class AlwaysOpenDoor : MonoBehaviour, IDoor, IDamageable {

    public Collider2D _col;
    private GameDataManager _gMD;
    private SpriteRenderer _renderer;
    public bool _opened;
    private bool _discovered;
    public DoorPosition _pos;
    private bool _hidden;
    void Start() {
        _gMD = GameDataManager._I;
        _col = GetComponent<Collider2D>();
        _renderer = GetComponent<SpriteRenderer>();
        GetComponent<DoorController>()._roomToShow._onRoomClear += (RoomController x) => { if (x == GetComponent<DoorController>()._roomToShow) ShowDoor(); };
        _col.isTrigger = false;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._closedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._closedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._closedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._closedDoorSprite[3],
            _ => _gMD._closedDoorSprite[0],
        };
        _opened = false;
        _discovered = false;
    }
    public void CloseDoor() {
        //TODO
        _hidden = true;
        if (_opened) {
            _col.isTrigger = false;
            // _renderer.enabled = true;
            _renderer.sprite = _pos switch {
                _ when _pos == DoorPosition.Up => _gMD._closedDoorSprite[0],
                _ when _pos == DoorPosition.Right => _gMD._closedDoorSprite[1],
                _ when _pos == DoorPosition.Down => _gMD._closedDoorSprite[2],
                _ when _pos == DoorPosition.Left => _gMD._closedDoorSprite[3],
                _ => _gMD._closedDoorSprite[0],
            };
        }
    }


    public void HideDoor() {
        //TODO g
        throw new System.NotImplementedException();
    }

    public void OpenDoor() {
        _opened = true;
        _discovered = true; ;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };
        var d = GetComponent<DoorController>();
        if (d._tunnelToShow._maskTransform != null) d._tunnelToShow._maskTransform.gameObject.SetActive(false);
        d._tunnelToShow.ShowRoom();
        d._roomToShow.ShowRoom();
        //TODO
    }

    public void ShowDoor() {
        //TODO
        _hidden = false;
        if (!_discovered) return;
        _opened = true;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };

        // _renderer.enabled = false;
        // throw new System.NotImplementedException();
    }

    public void Damage(float v) {
        if (_opened || _hidden) return;
        OpenDoor(); var c = GetComponent<AudioSource>(); c.clip = GameDataManager._I._doorOpenSound; c.Play(); return;

    }
}
public class BoosRoomDoor : MonoBehaviour, IDoor, IDamageable {

    public Collider2D _col;
    private GameDataManager _gMD;
    private SpriteRenderer _renderer;
    public bool _opened;
    private bool _discovered;
    public DoorPosition _pos;
    private bool _hidden;
    void Start() {
        _gMD = GameDataManager._I;
        _col = GetComponent<Collider2D>();
        _renderer = GetComponent<SpriteRenderer>();
        // GetComponent<DoorController>()._roomToShow._onRoomClear += (x) => { if (x == GetComponent<DoorController>()._roomToShow) ShowDoor(); };
        _col.isTrigger = false;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._closedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._closedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._closedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._closedDoorSprite[3],
            _ => _gMD._closedDoorSprite[0],
        };
        _opened = false;
        _discovered = false;
    }
    public void CloseDoor() {
        //TODO
        _hidden = true;
        if (_opened) {
            _col.isTrigger = false;
            // _renderer.enabled = true;
            _renderer.sprite = _pos switch {
                _ when _pos == DoorPosition.Up => _gMD._closedDoorSprite[0],
                _ when _pos == DoorPosition.Right => _gMD._closedDoorSprite[1],
                _ when _pos == DoorPosition.Down => _gMD._closedDoorSprite[2],
                _ when _pos == DoorPosition.Left => _gMD._closedDoorSprite[3],
                _ => _gMD._closedDoorSprite[0],
            };
        }
    }


    public void HideDoor() {
        //TODO g
        throw new System.NotImplementedException();
    }

    public void OpenDoor() {
        _opened = true;
        _discovered = true; ;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };
        var d = GetComponent<DoorController>();
        if (d._tunnelToShow != null) {
            if (d._tunnelToShow._maskTransform != null) d._tunnelToShow._maskTransform.gameObject.SetActive(false);
            d._tunnelToShow.ShowRoom();
            d._roomToShow.ShowRoom();

        }
        //TODO
    }

    public void ShowDoor() {
        //TODO
        _hidden = false;
        if (!_discovered) return;
        _opened = true;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };

        // _renderer.enabled = false;
        // throw new System.NotImplementedException();
    }

    public void Damage(float v) {
        if (!PlayerController._hasKey) return;
        if (_opened || _hidden) return;
        OpenDoor(); var c = GetComponent<AudioSource>(); c.clip = GameDataManager._I._doorOpenSound; c.Play(); return;

    }
}
[RequireComponent(typeof(SpriteRenderer))]
public class BossDoorOnShoot : MonoBehaviour, IDoor, IDamageable {

    public Collider2D _col;
    public int _stage;
    private GameDataManager _gMD;
    private SpriteRenderer _renderer;
    public bool _opened;
    private bool _discovered = false;
    public DoorPosition _pos;
    private bool _hidden;
    void Start() {
        _gMD = GameDataManager._I;
        _stage = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._destroyableDoorSpritesHorizontal.Length - 1,
            _ when _pos == DoorPosition.Right => _gMD._destroyableDoorSpritesVerticalRight.Length - 1,
            _ when _pos == DoorPosition.Down => _gMD._destroyableDoorSpritesHorizontal.Length - 1,
            _ when _pos == DoorPosition.Left => _gMD._destroyableDoorSpritesVerticalLeft.Length - 1,
            _ => 0,
        };
        _col = GetComponent<Collider2D>();
        _renderer = GetComponent<SpriteRenderer>();
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Right => _gMD._destroyableDoorSpritesVerticalRight[_stage],
            _ when _pos == DoorPosition.Down => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Left => _gMD._destroyableDoorSpritesVerticalLeft[_stage],
            _ => _gMD._openedDoorSprite[0],
        };
        _col.isTrigger = false;
        _opened = false;
        _discovered = false;
        GetComponent<DoorController>()._roomToShow._onRoomClear += (x) => { if (x == GetComponent<DoorController>()._roomToShow) ShowDoor(); };
    }
    public void CloseDoor() {
        //TODO
        _hidden = true;
        if (_opened) {
            _col.isTrigger = false;
            // _renderer.enabled = true;
            _renderer.sprite = _pos switch {
                _ when _pos == DoorPosition.Up => _gMD._closedDoorSprite[0],
                _ when _pos == DoorPosition.Right => _gMD._closedDoorSprite[1],
                _ when _pos == DoorPosition.Down => _gMD._closedDoorSprite[2],
                _ when _pos == DoorPosition.Left => _gMD._closedDoorSprite[3],
                _ => _gMD._closedDoorSprite[0],
            };
        }
    }

    public void Damage(float v) {
        if (_opened || _hidden) return;
        if (_stage == 0) { OpenDoor(); var c = GetComponent<AudioSource>(); c.clip = GameDataManager._I._doorOpenSound; c.Play(); return; }
        _stage--;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Right => _gMD._destroyableDoorSpritesVerticalRight[_stage],
            _ when _pos == DoorPosition.Down => _gMD._destroyableDoorSpritesHorizontal[_stage],
            _ when _pos == DoorPosition.Left => _gMD._destroyableDoorSpritesVerticalLeft[_stage],
            _ => _gMD._openedDoorSprite[0],
        };



    }

    public void HideDoor() {
        //TODO g
        throw new System.NotImplementedException();
    }

    public void OpenDoor() {
        _opened = true;
        _discovered = true; ;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };
        var d = GetComponent<DoorController>();
        d._roomToShow.ShowRoom();

        //TODO
    }

    public void ShowDoor() {
        _hidden = false;
        if (!_discovered) return;
        _opened = true;
        _col.isTrigger = true;
        _renderer.sprite = _pos switch {
            _ when _pos == DoorPosition.Up => _gMD._openedDoorSprite[0],
            _ when _pos == DoorPosition.Right => _gMD._openedDoorSprite[1],
            _ when _pos == DoorPosition.Down => _gMD._openedDoorSprite[2],
            _ when _pos == DoorPosition.Left => _gMD._openedDoorSprite[3],
            _ => _gMD._openedDoorSprite[0],
        };
    }
}
