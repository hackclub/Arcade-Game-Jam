using System.Collections.Generic;
using MyUtils.Structs;
using UnityEngine;


[CreateAssetMenu(menuName = "Scriptable/Boss")]
public class BossSO : ScriptableObject {

    public float _playerDist;
    public MinMax _reloadSpeed;
    public MinMax _firstShootDelay;
    public List<MinMax> _shootDelays;
    public float _maxHealth;
    public MinMax _baseDamage;
    public MinMax _speed;
    public WeaponSO _defaultWeapon;
    public int _countOfEnemiesToSpawn;
    public Transform[] _enemyToSpawn;
}
