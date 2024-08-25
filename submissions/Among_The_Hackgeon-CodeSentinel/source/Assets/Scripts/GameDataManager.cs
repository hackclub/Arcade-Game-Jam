using System;
using UnityEngine;

public enum WeaponType {
    Single,
    Sniper,
    Auto,
    MachineGun,
}
public class GameDataManager : MonoBehaviour {

    public static GameDataManager _I;
    public Transform _dungeonPrefab;
    public Transform _playerPrefab;
    public Transform _bossPrefab;
    [Header("Door sprites")]
    public Sprite[] _destroyableDoorSpritesHorizontal;
    public Sprite[] _destroyableDoorSpritesVerticalLeft;
    public Sprite[] _destroyableDoorSpritesVerticalRight;
    public Sprite[] _closedDoorSprite;
    public Sprite[] _openedDoorSprite; //0 - up; 1- right, 2 - down; 3 - left
    [Header("Enemy and other things")]
    public EnemyPrefabGetter _enemyPref;
    public Transform _spawnParticle;
    public Transform _collisionParticle;
    public Transform _loopResetParticle;
    public Sprite _bulletSprite;
    public Sprite _blankSprite;
    public Transform _damageParticle;
    public Canvas _endCanvas;
    [Header("Items")]
    public Transform[] _weaponsPrefab;
    public Transform[] _specialItemPrefab;
    public Transform[] _UtilityItemPrefab;
    public Transform _chestPrefab;
    public Transform _bossKeyPrefab;
    [Header("Audio")]

    public AudioClip[] _shootSounds;
    public AudioClip _doorOpenSound;
    public AudioClip _enemySpawnSound;
    public AudioClip _enemyDieSound;
    public AudioClip _enemyDamageSound;
    public AudioClip _playerDamageSound;
    public AudioClip _dashSound;
    public AudioClip _loopResetSound;
    public AudioClip _approachingLoopReset;
    public AudioClip _reloadStartSound;
    public AudioClip _reloadEndSound;
    public AudioClip _playerHealSound;
    public AudioClip _blankSound;
    public AudioClip _weaponChangeSound;
    public AudioClip _pickupSound;
    public AudioClip _loopBreak;
    public AudioClip _bossDie;
    public AudioClip GetWeaponSound(WeaponType type) {
        switch (type) {
            case WeaponType.Single: {
                    return _shootSounds[0];
                }
            case WeaponType.Sniper: {
                    return _shootSounds[1];
                }
            case WeaponType.Auto: {
                    return _shootSounds[2];
                }
            case WeaponType.MachineGun: {
                    return _shootSounds[3];
                }
            default: return null;
        }
    }
    GameObject _dungeon;
    GameObject _player;

    void Awake() {
        _dungeon = Instantiate(_dungeonPrefab, Vector3.zero, Quaternion.identity).gameObject;
        _player = Instantiate(_playerPrefab, Vector3.zero, Quaternion.identity).gameObject;
        _I = this;
        Timer._reload += () => { Destroy(_dungeon); Destroy(_player); _dungeon = Instantiate(_dungeonPrefab, Vector3.zero, Quaternion.identity).gameObject; _player = Instantiate(_playerPrefab, Vector3.zero, Quaternion.identity).gameObject; };
    }
    public static WeaponSO LoadWeaponByName(string name) => Resources.Load<WeaponSO>($"Weapons/{name}");
    public static SpecialItemSO LoadItemByName(string name) => Resources.Load<SpecialItemSO>($"Items/{name}");

}
[Serializable]
public struct EnemyPrefabGetter {
    public EnemySpawnChange[] _enemies;

    public Transform GetEnemy(int mult) {
        var r = UnityEngine.Random.Range(0, 100) * mult;
        Debug.Log(r);
        foreach (var e in _enemies) {
            if (e._spawnChange <= r) return e._enemyPref;
        }
        return _enemies[0]._enemyPref;
    }
}
[Serializable]
public struct EnemySpawnChange {
    public float _spawnChange;
    public Transform _enemyPref;
}
