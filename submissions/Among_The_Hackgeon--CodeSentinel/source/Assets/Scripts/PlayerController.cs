using Cinemachine;
using UnityEngine;
using MyUtils.Classes;
using System.Collections.Generic;



public class PlayerController : MonoBehaviour {

    public static bool _hasKey;
    public static PlayerController _I;
    public PlayerData _data;
    public Camera _cam;
    public CinemachineConfiner2D _confirmed;
    public RoomController _currentRoom;
    public ItemPickUp _currentItemInRange;
    public List<SpecialItemPickUp> _inventory;
    void Awake() {
        _I = this;

    }
    void Start() {
        _data._movementSpeed.InvokeOnChangeAction();
        _data._dashPower.InvokeOnChangeAction();
        _data._dashDuration.InvokeOnChangeAction();
        _data._staminaRegenerationDelay.InvokeOnChangeAction();
        _data._stamRegPerSecMult.InvokeOnChangeAction();
        _data._maxStamina.InvokeOnChangeAction();
        _data._dashStaminaUsage.InvokeOnChangeAction();
        _data._invincibleAfterDash.InvokeOnChangeAction();
        _data._maxHealth.InvokeOnChangeAction();
        _data._damageIgnore.InvokeOnChangeAction();
        _data._damageReduction.InvokeOnChangeAction();
        _data._reloadSpeedMult.InvokeOnChangeAction();
        _data.__bulletSpeedMult.InvokeOnChangeAction();
        _data._shootDelayMultiplier.InvokeOnChangeAction();
    }
    public void Update() {
        if (Input.GetKeyDown(KeyCode.E)) {
            if (_currentItemInRange != null) {
                GetComponent<AudioSource>().clip = GameDataManager._I._pickupSound;
                GetComponent<AudioSource>().Play();
                switch (_currentItemInRange._itemType) {
                    case ItemType.Ammo: {
                            GetComponent<PlayerCombat>().AddAmmo();
                            break;
                        }
                    case ItemType.Healing: {
                            GetComponent<PlayerCombat>().RestoreHealth();
                            break;
                        }
                    case ItemType.Weapon: {
                            GetComponent<PlayerCombat>().AddWeapon(GameDataManager.LoadWeaponByName(_currentItemInRange._name));
                            break;
                        }
                    case ItemType.Special: {
                            _currentItemInRange.GetComponent<SpecialItemPickUp>().Apply();
                            break;
                        }
                    case ItemType.Blank: {
                            GetComponent<PlayerCombat>().AddBlank();
                            break;
                        }
                    case ItemType.Key: {
                            _hasKey = true;
                            break;
                        }

                    default: break;
                }
                Destroy(_currentItemInRange.gameObject);
            }
        }
    }
}
