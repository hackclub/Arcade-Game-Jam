using MyUtils.Classes;
using UnityEngine;

public enum StatType {
    _movementSpeed,
    _dashPower,
    _dashDuration,
    _staminaRegenerationDelay,
    _stamRegPerSecMult,  // stamina regeneration per second multiplier (I am to lazy to time this every time)
    _maxStamina,
    _dashStaminaUsage,
    _invincibleAfterDash,
    //Defense
    _maxHealth,
    _damageIgnore,
    _damageReduction,
    //Offense
    _reloadSpeedMult,
    __bulletSpeedMult,
    _shootDelayMultiplier,

}
public class SpecialItemPickUp : MonoBehaviour {

    public string _name;
    public SpecialItemSO _defaultSetting;
    void Awake() {
        _defaultSetting = GameDataManager.LoadItemByName(_name);
        GetComponent<SpriteRenderer>().sprite = _defaultSetting._sprite;
    }
    public void Apply() {
        foreach (var s in _defaultSetting._statsToChange) {

            var f = PlayerController._I._data.GetType().GetField(s._name.ToString());
            var p = f.GetValue(PlayerController._I._data) as PlayerStat;
            var v = p.GetValue();
            if (s._modifier != 0) p.AddModifier(s._modifier);
            if (s._multiplier != 0) p.AddMultiplier(s._multiplier);
            Debug.Log($"value before change: {v}, new value{p.GetValue()}");
        }
    }
    public void Clear() {
        foreach (var s in _defaultSetting._statsToChange) {

            var f = PlayerController._I._data.GetType().GetField(s.ToString());
            var p = f.GetValue(PlayerController._I._data) as PlayerStat;
            var v = p.GetValue();
            if (s._modifier != 0) p.RemoveMultiplier(s._modifier);
            if (s._multiplier != 0) p.RemoveModifier(s._multiplier);
            Debug.Log($"value before change: {v}, new value{p.GetValue()}");
        }
    }

}


